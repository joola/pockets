/**
 * Common logger functionality
 */
var logger = module.exports;

/**
 * We stub console log based on pre-defined levels.
 * This is useful is we wish to attach additional logging outputs
 *  set logging levels or present output differently based on levels.
 */
['silly', 'trace', 'debug', 'info', 'warn', 'error'].forEach(function (level) {
  logger[level] = function (msg) {
    if (console[level])
      console[level](msg);
  }
});