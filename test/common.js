global.sinon = require('sinon');
global.should = require('should');
global.assert = require('assert');
global._ = require('underscore');

var chai = require('chai');
chai.use(require('sinon-chai'));
global.expect = chai.expect;

require('../www/lib/pockets/engine');
process.env.MOCK = true;
engine.init();
engine.listener.interval = 1000;

global.common = exports;

