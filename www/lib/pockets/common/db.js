var db = module.exports;
if (typeof global.localStorage === 'undefined') {
  var LocalStorage = require('node-localstorage').LocalStorage;
  db._localStorage = new LocalStorage('./scratch');
}
else
  db._localStorage = global.localStroage;

db.get = function (key) {
  return db._localStorage.getItem(key);
};

db.set = function (key, value) {
  return db._localStorage.setItem(key, value);
};