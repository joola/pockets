if (typeof global.localStorage === 'undefined')
  module.exports == new LocalStorage('./scratch');
else
  module.exports = require('node-localstorage').LocalStorage;
