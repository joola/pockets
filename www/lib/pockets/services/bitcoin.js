/**
 * Bitcoin services for pockets.
 */
  
var
  _bitcoin = require('bitcoinjs-lib'),
  base58 = require('bs58'),
  ecurve = require('ecurve'),
  BigInteger = require('bigi'),
  Buffer = require('buffer');

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