var
  io = require('socket.io-client'),
  async = require('async'),
  request = process.browser ? require('browser-request') : require('request');

var listener = module.exports;

listener.interval = 1000 * 10;
listener.addresses = [];
listener.balances = {};

listener.add = function (address) {
  listener.addresses.push(address);
};

listener.remove = function (address) {
  return listener.addresses.splice(listener.addresses.indexOf(address), 1);
};
listener.doInterval = function () {
  var uri = 'https://test-insight.bitpay.com/api/addr/';
  async.map(listener.addresses, function (address, cb) {
    var _uri = uri + address;
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

setInterval(listener.doInterval, listener.interval);
listener.doInterval();
