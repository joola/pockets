global.sinon = require('sinon');
global.should = require('should');
global.assert = require('assert');
global._ = require('underscore');

var chai = require('chai');
chai.use(require('sinon-chai'));
global.expect = chai.expect;

require('../www/lib/pockets/pockets');

engine.init();

global.common = exports;

