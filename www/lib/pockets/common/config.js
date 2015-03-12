var config = module.exports;

config.get = function (key) {
  return localStorage.getItem(key);
};

config.set = function (key, value) {
  return localStorage.setItem(key, value);
};