var config = module.exports;

/**
 * Retrieve a configuration value by key
 * @param {string} key the name of the configuration key to retrieve
 * @returns {*} the configuration value stored for the key
 */
config.get = function (
  key) {
  return engine.db.get(key);
};

/**
 *
 * @param {string} key the name of the configuration key to store
 * @param {*} value the configuration value to store
 */
config.set = function (key, value) {
  return engine.db.set(key, value);
};