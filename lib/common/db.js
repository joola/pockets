/**
 * The common DB is responsible for providing LocalStorage access to the engine
 */
var db = module.exports;
if (typeof global.localStorage === 'undefined') {
  var LocalStorage = require('node-localstorage').LocalStorage;
  db._localStorage = new LocalStorage('./scratch');
}
else
  db._localStorage = global.localStorage;

/**
 * Retrieve a db value by key
 * @param {string} key the name of the db key to retrieve
 * @returns {*} the db value stored for the key
 */
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

/**
 * Store a database value by key
 * @param {string} key the name of the db key to store
 * @param {*} value the db value to store
 */
db.set = function (key, value) {
  if (typeof value === 'object')
    value = JSON.stringify(value);
  return db._localStorage.setItem(key, value);
};