/**
 * The main entry point for Pockets
 */

//Stores reference (including global) to the engine\
var engine = global.engine = {};

engine.VERSION = require('../../../package.json').version;

/**
 * Initialize the engine
 * @param {object} options holds the different options available for the engine
 * @param {function} callback the callback function to call when done.
 */
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
  engine.logger.debug('Options: ' + JSON.stringify(engine.options));
  engine.pockets.load({}, function (err) {
    if (err)
      return callback(err);

    var fn = function () {
      console.log('Wallets updated');
      engine.pockets.realign({});
    };
    engine.events.on('wallet-update', fn);
    engine.events.on('equilibrium', function () {
      console.log('Equilibrium reached!');
    });

    return callback(null);
  });
};

/**
 * Promisify the engine's services to be consumed by AngularJS and alike.
 */
engine.promisify = function () {
  var promisify = require('thenify-all');
  engine.bitcoin = promisify(engine.bitcoin);
  engine.pockets = promisify(engine.pockets);
  engine.listener = promisify(engine.listener);
};

/**
 * We globally inject global vars
 */
//inject globals
require('./common/globals');

/**
 * When a browser is detected the engine will init itself automatically.
 */
//fire the engine up if we're running in a browser
if (typeof global.localStorage !== 'undefined')
  engine.init({promisify: true});