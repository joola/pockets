/**
 * Bitcoin services for pockets.
 */

var
  _bitcoin = require('bitcoinjs-lib'),
  base58 = require('bs58'),
  ecurve = require('ecurve'),
  BigInteger = require('bigi'),
  Buffer = require('buffer'),
  async = require('async'),
  _ = require('underscore'),
  request = process.browser ? require('browser-request') : require('request');

var bitcoin = module.exports;

/**
 * Validates a wallet address
 * @param {object} options contains the `address` attribute
 * @param {function} callback the callback function to run on done
 *  - `err` holds the error (if any occured)
 *  - `result` true/false indicating if the wallet is valid.
 */
bitcoin.validateWallet = function (options, callback) {
  function isAddress(string) {
    try {
      _bitcoin.Address.fromBase58Check(string);
    } catch (e) {
      return false;
    }
    return true;
  }

  if (isAddress(options.address))
    return callback(null);
  return callback(new Error('Invalid wallet address [' + options.address + '].'))
};

/**
 * Create a new wallet
 * @param {object} options contains the options for creating a wallet
 * @param {function} callback the callback function to run on done
 *  - `err` holds the error (if any occured)
 *  - `result` true/false indicating if the wallet is valid.
 */
bitcoin.createWallet = function (options, callback) {
  try {
    var key = _bitcoin.ECKey.makeRandom();
    var address = key.pub.getAddress(_bitcoin.networks.testnet).toString();
    return callback(null, {key: key.toWIF(_bitcoin.networks.testnet), address: address});
  }
  catch (ex) {
    return callback(ex);
  }
};

/**
 * Fetch a wallet balance
 * @param {object} options contains the options for fetching balances
 * - `wallet` holds the details of the wallet to check
 * @param {function} callback the callback function to run on done
 *  - `err` holds the error (if any occured)
 *  - `result` true/false indicating if the wallet is valid.
 */
bitcoin.balance = function (options, callback) {
  var balance = null;
  var uri = 'https://test-insight.bitpay.com/api/addr/';
  uri += options.wallet.address;
  request.get(uri, function (err, headers, body) {
    if (err)
      return callback(err);
    if (headers.statusCode !== 200)
      return callback(new Error('Failed to get address balance.'));
    try {
      var details = JSON.parse(body);
      balance = details.balance + details.unconfirmedBalance;
    }
    catch (ex) {
      return callback(ex);
    }

    return callback(null, balance);
  });
};

/**
 * Chooses the array of transactions to use as tx inputs
 * @param {array} txs array of transactions holding id, amount, vout
 * @param {number} totalamount the total amount to send
 * @returns {Array} Array of valid txs to use as inputs
 */
bitcoin.choose_vouts = function (txs, totalamount) {
  var inplay = [];
  var inplayAmount = 0;
  var change = [];

  var sorted = _.sortBy(txs, function (x) {
    return x.amount;
  });

  sorted.forEach(function (tx) {
    if (inplayAmount < totalamount) {
      inplay.push(tx);
      inplayAmount += tx.amount;
    }
  });
  return inplay;
};

/**
 * Build a new transaction
 * @param {object} options object containing a transaction
 * - `from` holds the source wallet
 * - `to` holds the destination wallet
 * - `amount` the amount to send
 * @param {function} callback function to receive results
 * - `err` the error (if any occured)
 * - `result` the function result
 */
bitcoin.buildTransaction = function (options, callback) {
  options.tx = new _bitcoin.TransactionBuilder();
  var key = _bitcoin.ECKey.fromWIF(options.from.wallet.key);
  var uri = 'https://test-insight.bitpay.com/api/addr/';
  uri += options.from.wallet.address + '/utxo';
  console.log('fetching utxo ', uri);
  request.get(uri, function (err, headers, body) {
    if (err)
      return callback(err);
    if (headers.statusCode !== 200)
      return callback(new Error('Failed to get address balance.'));
    var details = JSON.parse(body);
    options.vouts = bitcoin.choose_vouts(details, options.amount);
    options.vouts.forEach(function (vout, i) {
      console.log('adding vout for wallet [' + options.from.wallet.address + '], ', vout.txid, vout.vout);
      options.tx.addInput(vout.txid, vout.vout)
    });
    options.tx.addOutput(options.to.wallet.address, options.amount * 100000000);
    options.vouts.forEach(function (vout, i) {
      options.tx.sign(i, key);
    });
    options.toHex = options.tx.build().toHex();
    return callback(null, options.toHex);
  });
};

/**
 * Send money from a pocket to pocket
 * @param {object} options object containing a transaction
 * - `from` holds the source pocket
 * - `to` holds the destination pocket
 * - `amount` the amount to send
 * @param {function} callback function to receive results
 * - `err` the error (if any occured)
 * - `result` the function result
 */
bitcoin.handleTransaction = function (options, callback) {
  var transactions = options.transactions;
  //should be a complete transaction and handle it
  engine.pockets.snapshot({}, function (err, snapshot) {
    //console.log('before snapshot', snapshot);
    //mock up, update balances and trigger event.
    async.map(transactions, function (transaction, cb) {
      var amount = transaction.amount;
      engine.pockets.get({name: transaction.from.name, mock: true}, function (err, fromPocket) {
        engine.pockets.get({name: transaction.to.name, mock: true}, function (err, toPocket) {
          if (err)
            return cb(err);

          if (fromPocket)
            fromPocket.wallet.balance = fromPocket.wallet.balance - Math.abs(amount);
          toPocket.wallet.balance = toPocket.wallet.balance + Math.abs(amount);
          console.log('[' + transaction.from.name + '] --> [' + transaction.to.name + ']', Math.abs(amount));
          //console.log('Updating wallet [' + transaction.to.name + '] adding ' + amount);

          if (options.mock || engine.options.mock)
            return cb(null);

          bitcoin.buildTransaction(transaction, function (err, tx_hex) {
            if (err)
              return cb(err);

            var uri = 'https://test-insight.bitpay.com/api/tx/send';
            request.post(uri, {form: {rawtx: tx_hex}}, function (err, headers, body) {
              if (err)
                return cb(err);
              if (headers.statusCode !== 200)
                return cb(new Error('Failed to send transaction.'));
              return cb();
            });
          });
        });
      });
    }, function (err, results) {
      if (err)
        return callback(err);
      engine.pockets.snapshot({}, function (err, snapshot) {
        console.log('after snapshot', snapshot);
        engine.events.emit('wallet-update');
        return callback(null, options);
      });
    });
  });
};

/**
 * Send money from a pocket to a wallet
 * @param {object} options object containing a transaction
 * - `from` holds the source pocket
 * - `to` holds the destination wallet
 * - `amount` the amount to send
 * @param {function} callback function to receive results
 * - `err` the error (if any occured)
 * - `result` the function result
 */
bitcoin.sendMoney = function (options, callback) {
  //should be a complete transaction and handle it
  engine.pockets.snapshot({}, function (err, snapshot) {
    //console.log('before snapshot', snapshot);
    //mock up, update balances and trigger event.
    var amount = options.amount;
    engine.pockets.get({name: options.from.name, mock: true}, function (err, fromPocket) {
      if (fromPocket)
        fromPocket.wallet.balance = fromPocket.wallet.balance - Math.abs(amount);
      options.to.wallet.balance = options.to.wallet.balance + Math.abs(amount);
      console.log('[' + options.from.name + '] --> [' + options.to.name + ']', Math.abs(amount));
      //console.log('Updating wallet [' + transaction.to.name + '] adding ' + amount);

      if (options.mock || engine.options.mock) {
        return callback(null);
      }

      bitcoin.buildTransaction(options, function (err, tx_hex) {
        if (err)
          return callback(err);
        var uri = 'https://test-insight.bitpay.com/api/tx/send';
        request.post(uri, {form: {rawtx: tx_hex}}, function (err, headers, body) {
          if (err)
            return callback(err);
          if (headers.statusCode !== 200)
            return callback(new Error('Failed to send transaction.'));
          engine.pockets.snapshot({}, function (err, snapshot) {
            console.log('after snapshot', snapshot);
            engine.events.emit('wallet-update');
            return callback(null, options);
          });
        });
      });
    });
  });
};