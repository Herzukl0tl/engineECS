'use strict';

var pool, watchers;

pool = require('./pool');
watchers = require('./modules/core.watchers');

window.nuclear = require('./core/index');

window.nuclear.import([watchers]);

window.Pool = pool.Pool;
window.FixedPool = pool.FixedPool;
