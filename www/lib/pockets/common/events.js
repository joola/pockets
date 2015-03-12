var
  EventEmitter2 = require('eventemitter2').EventEmitter2;

var _events = new EventEmitter2({wildcard: true, newListener: true});

module.exports = exports = _events;