/**
 * The common Events library provide general events capabilities to the engine.
 * @type {exports.EventEmitter2}
 */
var
  EventEmitter2 = require('eventemitter2').EventEmitter2;

var _events = new EventEmitter2({wildcard: true, newListener: true});

module.exports = exports = _events;