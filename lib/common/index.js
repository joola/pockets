/**
 * Holds general common functions to be used across the engine
 */
var util = require('util');

var common = module.exports;

common.extend = util._extend;

/**
 * Inspects an object passed
 * @param {options} obj object to be inspected
 */
common.inspect = function (obj) {
  console.log(util.inspect(obj, {depth: null, colors: true}));
};