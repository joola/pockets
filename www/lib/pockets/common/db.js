var db = module.exports;
if (typeof global.localStorage === 'undefined') {
  var LocalStorage = require('node-localstorage').LocalStorage;
  db._localStorage = new LocalStorage('./scratch');
}
else
  db._localStorage = global.localStorage;

db.get = function (key) {
  var result;
  result = db._localStorage.getItem(key);
  try {
    result = JSON.parse(result);
  }
  catch (ex) {

  }
  return result;
};

db.set = function (key, value) {
  if (typeof value === 'object')
    value = JSON.stringify(value);
  return db._localStorage.setItem(key, value);
};