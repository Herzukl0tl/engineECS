'use strict';

var nuclear;

nuclear = require('./../../core/index');

function WatcherComponent(id) {
  this.entity = id;
  this.records = Object.create(null);
}

WatcherComponent.prototype.watch = function watcherComponentWatch(path, listener) {
  var paths;

  if (typeof path === 'string') {
    this._watch(path, listener);
  } else {
    paths = path;
    for (path in paths) {
      this._watch(path, paths[path]);
    }
  }
};

WatcherComponent.prototype._watch = function _watcherComponentWatch(path, listener) {
  var getter, setter, value, record;

  if (path in this.records) {
    throw new Error('A watcher is already defined for the ' + path + ' path');
  }

  getter = compileGetter(path);
  setter = compileSetter(path);

  value = getter(this.entity);

  record = {
    path: path,
    listener: listener,
    getter: getter,
    setter: setter,
    old: value
  };

  this.records[path] = record;
};

function compileGetter(path) {
  var getter, fragments;

  getter = compileGetter.cache[path];

  if (!getter) {
    fragments = path.split('.');

    compileGetter[path] = getter = new Function('n', 'return function compiledGetter(e) {' +
        'return n.component("' + fragments.shift() + '").of(e).' + fragments.join('.') +
      '}'
    )(nuclear);
  }

  return getter;
}

compileGetter.cache = Object.create(null);

function compileSetter(path) {
  var setter, fragments;

  setter = compileSetter.cache[path];

  if (!setter) {
    fragments = path.split('.');

    compileSetter.cache[path] = setter = new Function('n', 'return function compiledSetter(e,v) {' +
        'return n.component("' + fragments.shift() + '").of(e).' + fragments.join('.') + '=v' +
      '}'
    )(nuclear);
  }

  return setter;
}

compileSetter.cache = Object.create(null);

WatcherComponent.prototype.unwatch = function watcherComponentUnwatch(path) {
  var paths;

  if (arguments.length === 0) {
    this.records = {};
  } else if (typeof path === 'string') {
    this._unwatch(path);
  } else {
    paths = path;
    for (path in paths) {
      this._unwatch(path);
    }
  }
};

WatcherComponent.prototype._unwatch = function _watcherComponentUnwatch(path) {
  var record;

  record = this.records[path];

  if (record) {
    delete this.records[path];
  } else {
    throw new Error('There is no watcher defined for the ' + path + ' path');
  }
};

module.exports = WatcherComponent;
