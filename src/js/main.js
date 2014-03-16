'use strict';

window.nuclear = require('nuclear');

require('./modules/watchers')(window.nuclear);

window.Pool = require('./pool').Pool;
window.FixedPool = require('./pool').FixedPool;
