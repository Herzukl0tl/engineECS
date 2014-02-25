'use strict';

var system = require('../core/system');


system.define('watch', ['watcher'], function () {
  this.watcher.check();
});
