var util = require('util');

var common = module.exports;

common.extend = util._extend;

common.inspect = function (obj) {
  console.log(util.inspect(obj, {depth: null, colors: true}));
};