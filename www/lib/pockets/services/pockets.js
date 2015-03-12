var traverse = require('traverse');

var pockets = module.exports;

pockets.ROOT = null;

pockets.list = function (options, callback) {
  callback = callback || emptyfunc;

  return callback(null, pockets.ROOT);
};

pockets.get = function (options, callback) {
  callback = callback || emptyfunc;

  var result = null;
  traverse.map(pockets.ROOT, function (x) {
    var point = this;
    if (x && typeof x === 'object' && x.name) { //we have a pocket
      if (x.name === options.name)
        result = point;
    }
  });
  if (!result)
    return callback(new Error('Pocket [' + options.name + '] cannot be found.'));
  result = traverse.get(pockets.ROOT, result.path);
  return callback(null, result);
};

pockets.create = function (options, callback) {
  callback = callback || emptyfunc;

  if (!options.parent) {
    pockets.ROOT = options;
    return pockets.save({}, callback);
  }
  else {
    pockets.get({name: options.parent}, function (err, pocket) {
      if (err)
        return callback(err);

      pocket.pockets = pocket.pockets || {};
      pocket.pockets[options.name] = options;
      return pockets.save({}, callback);
    });
  }
};

pockets.update = function (options, callback) {
  callback = callback || emptyfunc;

  pockets.get(options, function (err, _pocket) {
    _pocket = engine.common.extend(_pocket, options);
    return pockets.save({}, callback);
  });
};

pockets.delete = function (options, callback) {
  callback = callback || emptyfunc;

  traverse.forEach(pockets.ROOT, function (x) {
    var point = this;
    if (x && typeof x === 'object' && x.name) { //we have a pocket
      if (x.name === options.name) {
        delete point.parent.parent.node.pockets[options.name];
      }
    }
  });
  return pockets.save({}, callback);
};

pockets.save = function (options, callback) {
  engine.db.set('pockets.json', pockets.ROOT);
  return callback(null);
};

pockets.load = function (options, callback) {
  pockets.ROOT = engine.db.get('pockets.json');
  return callback(null);
};

pockets.snapshot = function (options, callback) {
  var result = [];
  traverse.map(pockets._, function (x) {
    if (x && typeof x === 'object' && x.wallet && x.wallet.balance) {
      result.push({name: x.name, balance: x.wallet.balance});
    }
  });
  return callback(null, result);
};


pockets.totalBalance = function (options, callback) {
  var balance = 0;
  return engine.pockets.get({name: 'root'}, function (err, rootPocket) {
    traverse.forEach(rootPocket, function (x) {
      if (x && typeof x === 'object' && x.wallet && x.wallet.balance)
        balance += x.wallet.balance;
    });
    return callback(null, balance);
  });
};

pockets.realign = function (options, callback) {
  callback = callback || function () {
  };

  var alignment = {
    mismatch: [], //holds all mismatches
    plus_transactions: [], //holds only transactions with positive value to be moved to root
    neg_transactions: [] //holds only transactions with negative value to be moved to root
  };
  pockets.totalBalance({}, function (err, balance) {
    return engine.pockets.get({name: 'root'}, function (err, rootPocket) {
      if (err)
        return callback(err);

      traverse.forEach(rootPocket, function (x) {
        var point = this;
        if (x && typeof x === 'object' && point.parent && x.name) {
          var level = point.level / 2;
          var path = traverse.clone(point.parent.path);
          path = path.splice(0, path.length - 1);
          var _path = traverse.clone(path);
          //_path.pop();
          //_path.pop(); //remove pockets

          var parentRatios = [];
          while (_path.length > 0) {
            var elem = traverse.get(rootPocket, _path);
            parentRatios.push(elem.level_ratio);
            _path.pop();
            _path.pop(); //remove pockets
          }
          parentRatios = parentRatios.reverse();
          var parent = traverse.get(rootPocket, path);
          if (parent.pockets) {
            var freePercentage = 1;
            var hardPockets = 0;
            Object.keys(parent.pockets).forEach(function (key) {
              var _p = parent.pockets[key];
              if (_p.hard_ratio) {
                freePercentage = freePercentage - ( _p.hard_ratio || 0);
                hardPockets++;
              }
            });
            var length = Object.keys(parent.pockets).length;
            var level_ratio = freePercentage / (length - hardPockets);
            var actual_ratio = 1;

            if (x.hard_ratio) {
              x.level_ratio = x.hard_ratio;
            }
            else
              x.level_ratio = level_ratio;

            parentRatios.forEach(function (x) {
              actual_ratio = actual_ratio * x;
            });
            actual_ratio = actual_ratio * x.level_ratio;
            x.leaf = !(x.hasOwnProperty('pockets') && (Object.keys(x.pockets).length > 0));
            //if (x.leaf) {
            x.actual_ratio = actual_ratio;
            // }
            x._path = point.path;
            x.path = point.path.join('.').replace(/pockets./ig, '');
            x.level = level;

            x.level_siblings = length;
            x.parent_ratios = parentRatios;
            x.parent = {
              name: point.parent.parent.node.name
            };
            if (!point.isRoot && !x.leaf && x.wallet.balance !== 0) {
              x.wallet.balance = x.wallet.balance || 0;
              x.wallet.balance_should_be = 0;
              x.wallet.balance_delta = x.wallet.balance - x.wallet.balance_should_be;
              console.log('found', x.name, x.wallet.balance_delta);
              alignment.neg_transactions.push({
                from: {
                  name: x.name,
                  wallet: x.wallet
                },
                to: {
                  name: 'root',
                  wallet: rootPocket.wallet
                },
                amount: x.wallet.balance
              });
            }
            if (x.leaf) {
              x.wallet.balance = x.wallet.balance || 0;
              x.wallet.balance_delta = 0;
              x.wallet.balance_should_be = balance * x.actual_ratio;
              x.limit = x.limit || 0;
              var limited = false;
              if (x.limit > 0 && x.wallet.balance_should_be > x.limit) {
                limited = true;
                x.wallet.balance_should_be = x.limit;
              }
              //if (!options.mock)
              //console.log(x.name, 'current', x.wallet.balance, 'should be', x.wallet.balance_should_be, 'ratio', x.actual_ratio, x.parent_ratios);
              if (!x.savings || x.wallet.balance - x.wallet.balance_should_be < 0)
                x.wallet.balance_delta = x.wallet.balance - x.wallet.balance_should_be;

              //console.log('delta', x.wallet.balance_delta);
              if (x.wallet.balance_delta < 0.0001 && x.wallet.balance_delta > 0)
                x.wallet.balance_delta = 0;
              if (x.wallet.balance_delta > -0.0001 && x.wallet.balance_delta < 0)
                x.wallet.balance_delta = 0;


              alignment.mismatch.push({
                from: {
                  name: x.name,
                  wallet: x.wallet
                },
                to: {
                  name: 'root',
                  wallet: rootPocket.wallet
                },
                amount: x.wallet.balance_delta
              });

              if (x.wallet.balance_delta > 0) {
                //balance = balance - x.wallet.balance_delta;
                alignment.plus_transactions.push({
                  from: {
                    name: x.name,
                    wallet: x.wallet
                  },
                  to: {
                    name: 'root',
                    wallet: rootPocket.wallet
                  },
                  amount: x.wallet.balance_delta
                });
              }
              else if (x.wallet.balance_delta < 0) {
                //balance = balance + x.wallet.balance_delta;
                alignment.neg_transactions.push({
                  from: {
                    name: 'root',
                    wallet: rootPocket.wallet
                  },
                  to: {
                    name: x.name,
                    wallet: x.wallet
                  },
                  amount: x.wallet.balance_delta
                });
              }
            }
            point.update(x);
          }
        }
      });


      if (options.mock)
        return callback(null, alignment.transactions);
      if (alignment.plus_transactions.length > 0) {
        return engine.bitcoin.handleTransaction({
          transactions: alignment.plus_transactions
        }, callback);
      }
      else if (alignment.neg_transactions.length > 0)
        return engine.bitcoin.handleTransaction({
          transactions: alignment.neg_transactions
        }, callback);
      else if (rootPocket.wallet.balance > 0.001) {
        var savingsPocket = pockets.getSavings();
        if (savingsPocket) {
          alignment.neg_transactions.push({
            from: {
              name: 'root',
              wallet: rootPocket.wallet
            },
            to: {
              name: savingsPocket.name,
              wallet: savingsPocket.wallet
            },
            amount: rootPocket.wallet.balance
          });
          return engine.bitcoin.handleTransaction({
            transactions: alignment.neg_transactions
          }, callback);
        }
        else {
          engine.emit('equilibrium');
          return callback(null, alignment.transactions);
        }
      }
      else {
        engine.emit('equilibrium');
        return callback(null, alignment.transactions);
      }
    });
  });
};

pockets.ensureLevelPercentages = function (options, callback) {
  var levels = 0;
  var levelPockets = {};
  var mismatch = false;
  traverse.forEach(pockets._, function (x, i) {
    var point = this;

    if (x && typeof x === 'object' && x.name) {
      var level = x.level;
      levels = levels < level ? level : levels;
      if (x.parent) {
        levelPockets[x.parent.name] = levelPockets[x.parent.name] || [];
        levelPockets[x.parent.name].push({
          path: point.path,
          percentage: x.level_ratio,
          hard: x.hard_ratio || 0,
          point: point
        });
      }
    }
  });
  //engine.common.inspect(levelPockets);
  Object.keys(levelPockets).forEach(function (key) {
    var level = levelPockets[key];
    var levelPercentage = 0;
    var hardPercentage = 0;
    var hardPockets = 0;
    var freePercentage = 1;
    var freeDist = 0;
    level.forEach(function (pocket) {
      levelPercentage += pocket.percentage;
      hardPercentage += pocket.hard;
      hardPockets += pocket.hard ? 1 : 0;
    });
    freePercentage = 1 - hardPercentage;
    freeDist = freePercentage / (level.length - hardPockets);
    if (levelPercentage !== 1) {
      mismatch = true;
      //console.log('found a mismatch, level', key, levelPercentage, hardPercentage, freePercentage, freeDist);
      level.forEach(function (pocket, i) {
        pocket.level_ratio = pocket.hard || freeDist;
        var actual_ratio = 1;
        pocket.point.node.parent_ratios.forEach(function (x) {
          actual_ratio = actual_ratio * x;
        });
        actual_ratio = actual_ratio * pocket.level_ratio;
        if (pocket.point.node.actual_ratio != actual_ratio) {
          //console.log(pocket.point.node.name, 'set actual ', pocket.point.node.actual_ratio, actual_ratio);
        }
        var node = pocket.point.node;
        node.actual_ratio = actual_ratio;
        node.level_ratio = pocket.level_ratio;
        pocket.point.update(node);
      });
    }
  });
  return callback(null, mismatch);
};

pockets.getSavings = function () {
  var found = null;
  traverse.forEach(pockets._, function (x) {
    if (x && typeof x === 'object' && x.leaf && x.savings)
      found = x;
  });
  if (found)
    return found;

  traverse.forEach(pockets._, function (x) {
    if (x && typeof x === 'object' && x.leaf && x.name === 'pension')
      found = x;
  });
  return found;
};