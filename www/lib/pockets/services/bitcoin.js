var
  _bitcoin = require('bitcoinjs-lib'),
  base58 = require('bs58'),
  ecurve = require('ecurve'),
  BigInteger = require('bigi'),
  Buffer = require('buffer');

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