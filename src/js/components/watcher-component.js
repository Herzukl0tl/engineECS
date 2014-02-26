'use strict';

var component = require('../core/component');


function WatcherComponent(id) {
  this.entity = id;
  this.records = Object.create(null);
}

WatcherComponent.prototype.watch = function WatcherComponentWatch(path, listener) {
  if (typeof path === 'string') {
    watch(this, path, listener);
  } else {
    var paths = path;

    for (path in paths) {
      watch(this, path, paths[path]);
    }
  }
};

function watch(self, path, listener) {
  if (path in self.records) {
    throw new Error();
  }

  var getter = compileGetter(path),
    setter = compileSetter(path),
    value = getter(self.entity),
    record = {
      path: path,
      listener: listener,
      getter: getter,
      setter: setter,
      old: value
    };

  self.records[path] = record;
}

function compileGetter(path) {
  var getter = compileGetter.cache[path];

  if (getter === undefined) {
    var fragments = path.split('.');

    compileGetter[path] = getter = new Function('c', 'return function compiledGetter(e) {' +
      'return c("' + fragments.shift() + '").of(e).' + fragments.join('.') +
      '}'
    )(component);
  }

  return getter;
}

compileGetter.cache = Object.create(null);

function compileSetter(path) {
  var setter = compileSetter.cache[path];

  if (setter === undefined) {
    var fragments = path.split('.');

    compileSetter.cache[path] = setter = new Function('c', 'return function compiledSetter(e,v) {' +
      'return c("' + fragments.shift() + '").of(e).' + fragments.join('.') + '=v' +
      '}'
    )(component);
  }

  return setter;
}

compileSetter.cache = Object.create(null);

WatcherComponent.prototype.unwatch = function WatcherComponentUnwatch(path) {
  if (arguments.length === 0) {
    this.records = {};
  } else if (typeof path === 'string') {
    unwatch(this, path);
  } else {
    var paths = path;

    for (path in paths) {
      unwatch(this, path);
    }
  }
};

function unwatch(self, path) {
  var record = self.records[path];

  if (record === undefined) {
    throw new Error();
  }

  delete self.records[path];
}

WatcherComponent.prototype.check = function WatcherComponentCheck() {
  for (var path in this.records) {
    var record = this.records[path],
      value = record.getter(this.entity);

    if (value !== record.old) {
      record.listener(value, record.old);
    }

    record.old = value;
  }
};

WatcherComponent.prototype.set = function WatcherComponentSet(path, value) {
  var record = this.records[path];

  if (record === undefined) {
    throw new Error();
  }

  record.setter(this.entity, value);

  this.check();
};

WatcherComponent.prototype.get = function WatcherComponentGet(path) {
  var record = this.records[path];

  if (record === undefined) {
    throw new Error();
  }

  return record.getter(this.entity);
};

WatcherComponent.prototype.apply = function WatcherComponentApply(fn) {
  fn();
  this.check();
};


component.define('watcher', function (id) {
  return new WatcherComponent(id);
});
