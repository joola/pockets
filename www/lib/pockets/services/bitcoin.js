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
