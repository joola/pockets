var config = module.exports;

config.get = function (
  key) {
  return pockets.db.get(key);
};

config.set = function (key, value) {
  return pockets.db.set(key, value);
};