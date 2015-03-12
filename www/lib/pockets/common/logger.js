var logger = module.exports;

['silly', 'trace', 'debug', 'info', 'warn', 'error'].forEach(function (level) {
  logger[level] = function (msg) {
    if (console[level])
      console[level](msg);
  }
});