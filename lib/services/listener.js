/**
 * The listener module provides blockchain notifications when wallet balances are updates
 * @type {*|exports}
 */
var
  io = require('socket.io-client'),
  async = require('async'),
  request = process.browser ? require('browser-request') : require('request');

var listener = module.exports;

// The interval to check balances
listener.interval = 1000 * 10;
//Holds array of address to inspect
listener.addresses = [];
//Stores the last address balance state
listener.balances = {};

/**
 * Add a new address for monitoring
 * @param {string} address bitcoin address to watch
 */
listener.add = function (address) {
  if (address==='')
  {
    console.trace();
    throw 'fuck!'
  }
  if (listener.addresses.indexOf(address) === -1)
    listener.addresses.push(address);
};

/**
 * Removes an address from monitoring
 * @param {string} address bitcoin address to watch
 */
listener.remove = function (address) {
  return listener.addresses.splice(listener.addresses.indexOf(address), 1);
};

/**
 * This is the function that actually listens and monitors for wallet updates.
 */
listener.doInterval = function () {
  var uri = 'https://test-insight.bitpay.com/api/addr/';

  async.map(listener.addresses, function (address, cb) {
    var _uri = uri + address;
    console.log('interval', _uri);
    request.get(_uri, function (err, headers, body) {
      if (err)
        return cb(err);
      if (headers.statusCode !== 200)
        return cb(new Error('Failed to get address balance.'));
      var wallet = JSON.parse(body);
      var walletBalance = wallet.balance + wallet.unconfirmedBalance;
      if (!listener.balances[address])
        listener.balances[address] = walletBalance;
      if (listener.balances[address] !== walletBalance) {
        engine.events.emit('wallet-updated', wallet);
        listener.balances[address] = walletBalance;
      }
    });
  }, function (err, results) {
  });
};

//lift off
//setInterval(listener.doInterval, listener.interval);
//listener.doInterval();
