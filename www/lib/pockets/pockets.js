//the object
var pockets = global.pockets = {};

pockets.VERSION = require('../../../package.json').version;

pockets.init = function (options, callback) {
  pockets.common = require('./common/index');
  pockets.config = require('./common/config');
  pockets.logger = require('./common/logger');

  pockets.options = pockets.common.extend(options, {
    //default options
  });

  pockets.logger.info('Starting Pockets Library, version [' + pockets.VERSION + '].');

  pockets.db = require('./common/db');
};

if (typeof global.localStorage !== 'undefined')
  pockets.init({});