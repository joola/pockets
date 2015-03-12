var config = module.exports;

config.get = function (
  key) {
  return engine.db.get(key);
};

config.set = function (key, value) {
  return engine.db.set(key, value);
};