'use strict';

var nuclear, WatcherComponent, watchSystem;

nuclear = require('./../../core/index');
WatcherComponent = require('./watcher-component');
watchSystem = require('./watch-system');

module.exports = nuclear.module('core.watchers', [])
  .component('watcher', function (e) {
    return new WatcherComponent(e);
  })
  .system('watch', ['watchers'], watchSystem);
