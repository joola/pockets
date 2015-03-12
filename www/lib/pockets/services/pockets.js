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
    return callback(null);
  }
  else {
    pockets.get({name: options.parent}, function (err, pocket) {
      if (err)
        return callback(err);

      pocket.pockets = pocket.pockets || {};
      pocket.pockets[options.name] = options;
      return callback(null);
    });
  }
};

pockets.update = function (options, callback) {
  callback = callback || emptyfunc;

  pockets.get(options, function (err, _pocket) {
    _pocket = engine.common.extend(_pocket, options);
    return callback(null);
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

  return callback(null);
};