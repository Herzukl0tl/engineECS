'use strict';

function watchSystem(e) {
  /*jshint validthis: true*/
  var records, path, record, value;

  records = this.watcher.records;

  for (path in records) {
    record = records[path];
    value = record.getter(e);

    if (value !== record.old) {
      record.listener(value, record.old);
    }

    record.old = value;
  }
}

module.exports = watchSystem;
