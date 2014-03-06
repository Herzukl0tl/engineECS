'use strict';

var system = require('../core/system');


system.define('watch', ['watcher'], function (e) {
  var records = this.watcher.records;

  for (var path in records) {
    var record = records[path],
      value = record.getter(e);

    if (value !== record.old) {
      record.listener(value, record.old);
    }

    record.old = value;
  }
});
