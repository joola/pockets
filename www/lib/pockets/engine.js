//the object
var engine = global.engine = {};

engine.VERSION = require('../../../package.json').version;

engine.init = function (options, callback) {
  callback = callback || emptyfunc;
  //common
  engine.common = require('./common/index');
  engine.config = require('./common/config');
  engine.logger = require('./common/logger');
  engine.db = require('./common/db');
  engine.events = require('./common/events');

  //services
  engine.bitcoin = require('./services/bitcoin');
  engine.pockets = require('./services/pockets');
  engine.listener = require('./services/listener');

  engine.options = engine.common.extend({
    //default options
    promisify: false
  }, options || {});
  if (engine.options.promisify)
    engine.promisify();
  engine.logger.info('Starting Pockets Library, version [' + engine.VERSION + '].');
  return callback(null);
};

engine.promisify = function () {
  var promisify = require('thenify-all');
  engine.bitcoin = promisify(engine.bitcoin);
  engine.pockets = promisify(engine.pockets);
  engine.listener = promisify(engine.listener);
};

//inject globals
require('./common/globals');

//fire the engine up if we're running in a browser
if (typeof global.localStorage !== 'undefined')
  engine.init({promisify: true});