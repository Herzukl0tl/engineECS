(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* events-emitter 30-12-2013 */
!function(a,b){"function"==typeof define&&define.amd?define(function(){return b(a)}):"object"==typeof module&&module&&module.exports?module.exports=b(a):"object"==typeof exports&&exports?exports.EventsEmitter=b(a):a.EventsEmitter=b(a)}(this,function(a){"use strict";function b(){}function c(b,c,d,e,f){var i=h;h+=1,"_listeners"in b||(b._listeners={callbacks:Object.create(null),contexts:Object.create(null),times:Object.create(null)}),"_events"in b||(b._events=Object.create(null)),b._listeners.callbacks[i]=d,b._listeners.contexts[i]=e,5===arguments.length&&(b._listeners.times[i]=f),"_memories"in b&&Array.isArray(b._memories[c])&&(a.setImmediate||a.setTimeout)(function(){g(b,i,b._memories[c])},0);var j=b._events[c];return"number"==typeof j?b._events[c]=[j,i]:Array.isArray(j)?j.push(i):b._events[c]=i,i}function d(a,b,c){var d=(a._listeners.callbacks,a._events[b]);if("number"==typeof d)f(a,d);else if(Array.isArray(d))for(var e=d.length,g=0;e>g;g+=1){var h=d[g];f(a,h)}c||delete a._events[b]}function e(a,b,c){var d=a._listeners.callbacks,e=a._events[b];if("number"==typeof e)e in d||(f(a,e),delete a._events[b]);else if(Array.isArray(e)){for(var g=e.length,h=0;g>h;h+=1){var i=e[h];i in d||(f(a,i),e.splice(h,1),g-=1,h-=1)}0!==g||c||delete a._events[b]}}function f(a,b){delete a._listeners.callbacks[b],delete a._listeners.contexts[b],delete a._listeners.times[b]}function g(b,c,d){if(c in b._listeners.callbacks){var e=b._listeners.callbacks[c],g=b._listeners.contexts[c]||a;switch(c in b._listeners.times&&(b._listeners.times[c]-=1,b._listeners.times[c]<1&&f(b,c)),d.length){case 0:return e.call(g);case 1:return e.call(g,d[0]);case 2:return e.call(g,d[0],d[1]);case 3:return e.call(g,d[0],d[1],d[2]);default:return e.apply(g,d)}}}var h=1;return b.prototype.on=function(b,d,e){return 3===arguments.length?"times"in e?e.times<1?0:c(this,b,d,e.context||a,e.times):c(this,b,d,e.context||a):c(this,b,d,a)},b.prototype.once=function(b,d,e){return 3===arguments.length?c(this,b,d,e.context||a,1):c(this,b,d,a,1)},b.prototype.off=function(a){return"_listeners"in this&&a in this._listeners.callbacks?(delete this._listeners.callbacks[a],delete this._listeners.contexts[a],delete this._listeners.times[a],!0):!1},b.prototype.clear=function(a,b){if("_listeners"in this&&"_events"in this){var c,f;switch(arguments.length){case 0:for(a in this._events)d(this,a,!1);break;case 1:if("string"==typeof a)d(this,a,!1);else if(Array.isArray(a))for(f=a.length;f--;)d(this,a[f],!1);else{b=a,c=b.soft||!1;for(a in this._events)b.ghosts?e(this,a,c):d(this,a,c)}break;case 2:if(c=b.soft||!1,"string"==typeof a)b.ghosts?e(this,a,c):d(this,a,c);else if(Array.isArray(a))for(f=a.length;f--;)b.ghosts?e(this,a[f],c):d(this,a[f],c)}}},b.prototype.listeners=function(a){var b=[];if(!("_listeners"in this&&"_events"in this))return b;var c=this._listeners.callbacks,d=this._events[a];if("number"==typeof d)d in c?b.push(c[d]):f(this,d);else if(Array.isArray(d))for(var e=d.length,g=0;e>g;g+=1){var h=d[g];h in c?b.push(c[h]):f(this,h)}return b},b.prototype.remember=function(a){if("_memories"in this||(this._memories=Object.create(null)),Array.isArray(a))for(var b=a.length;b--;)this._memories[a[b]]=null;else this._memories[a]=null},b.prototype.forget=function(a){if("_memories"in this)if(Array.isArray(a))for(var b=a.length;b--;)delete this._memories[a[b]];else delete this._memories[a]},b.prototype.trigger=function(a){var b=Array.prototype.slice.call(arguments,1);if("_memories"in this&&a in this._memories&&(this._memories[a]=b),!("_listeners"in this&&"_events"in this))return!1;var c=this._events[a];if("number"==typeof c)g(this,c,b);else{if(!Array.isArray(c))return!1;for(var d=c.length,e=0;d>e;e+=1){var f=c[e];g(this,f,b)}}return!0},b.mixins=function(a){var c=b.prototype;for(var d in c)a[d]=c[d];return a},b.mixins(b),b});
},{}],2:[function(require,module,exports){
'use strict';

function Component() {}

module.exports = Component;

},{}],3:[function(require,module,exports){
'use strict';

function Entity() {}

module.exports = Entity;

},{}],4:[function(require,module,exports){
'use strict';

var nuclear, Module;

module.exports = nuclear = {};

Module = require('./module');

nuclear.events    = require('./nuclear.events');
nuclear.registry  = require('./nuclear.registry');
nuclear.component = require('./nuclear.component');
nuclear.entity    = require('./nuclear.entity');
nuclear.system    = require('./nuclear.system');

nuclear.module = function nuclearModule(name, deps) {
  var module;

  if (arguments.length === 1) {
    return this.registry.module(name);
  }

  module = new Module(name, deps);

  return module;
};

nuclear.import = function nuclearImport(modules) {
  var i, length;

  length = modules.length;

  for (i = 0; i < length; i += 1) {
    this.registry.import(modules[i]);
  }
};

},{"./module":5,"./nuclear.component":6,"./nuclear.entity":7,"./nuclear.events":8,"./nuclear.registry":9,"./nuclear.system":10}],5:[function(require,module,exports){
'use strict';

var Component, Entity, System;

Component = require('./component');
Entity = require('./entity');
System = require('./system');

function Module(name, deps) {
  this.name = name.trim();
  this.requires = deps;

  this.exports = Object.create(null);

  this._config = Object.create(null);

  this._components = Object.create(null);
  this._entities = Object.create(null);
  this._systems = Object.create(null);
}

Module.prototype.components = function moduleComponents() {
  return Object.keys(this._components);
};

Module.prototype.entities = function moduleEntities() {
  return Object.keys(this._entities);
};

Module.prototype.systems = function moduleSystems() {
  return Object.keys(this._systems);
};

Module.prototype.config = function moduleConfig(options) {
  var key;

  if (arguments.length === 0) {
    return this._config;
  }

  for (key in options) {
    this._config[key] = options[key];
  }

  return this;
};

Module.prototype.component = function moduleComponent(name, factory) {
  var component;

  if (arguments.length === 1) {
    component = this._components[name];

    if (component) return component;

    throw new Error();
  }

  if (name in this.exports) {
    throw new Error();
  }

  this.exports[name] = this._components[name] = new Component(name, factory);

  return this;
};

Module.prototype.entity = function moduleEntity(name, factory) {
  var entity;

  if (arguments.length === 1) {
    entity = this._entities[name];

    if (entity) return entity;

    throw new Error();
  }

  if (name in this.exports) {
    throw new Error();
  }

  this.exports[name] = this._entities[name] = new Entity(name, factory);

  return this;
};

Module.prototype.system = function moduleSystem(name, components) {
  var system;

  if (arguments.length === 1) {
    system = this._systems[name];

    if (system) return system;

    throw new Error();
  }

  if (name in this.exports) {
    throw new Error();
  }

  this.exports[name] = this._systems[name] = new System(name, components);

  return this;
};

module.exports = Module;

},{"./component":2,"./entity":3,"./system":12}],6:[function(require,module,exports){
'use strict';

var registry;

registry = require('./nuclear.registry');

function nuclearComponent(name) {
  return registry.component(name);
}

module.exports = nuclearComponent;

},{"./nuclear.registry":9}],7:[function(require,module,exports){
'use strict';

var registry;

registry = require('./nuclear.registry');

function nuclearEntity(name) {
  return registry.entity(name);
}

module.exports = nuclearEntity;

},{"./nuclear.registry":9}],8:[function(require,module,exports){
'use strict';

var EventsEmitter;

EventsEmitter = require('../../lib/events-emitter.min');

module.exports = new EventsEmitter();

},{"../../lib/events-emitter.min":1}],9:[function(require,module,exports){
'use strict';

var Registry;

Registry = require('./registry');

module.exports = new Registry();

},{"./registry":11}],10:[function(require,module,exports){
'use strict';

var registry;

registry = require('./nuclear.registry');

function nuclearSystem(name) {
  return registry.system(name);
}

module.exports = nuclearSystem;

},{"./nuclear.registry":9}],11:[function(require,module,exports){
'use strict';

var Component, Entity, System, rExplicitModuleNotation;

Component = require('./component');
Entity = require('./entity');
System = require('./system');

rExplicitModuleNotation = /([^\s]+)\s+from\s+([^\s]+)/;

function Registry() {
  this._modules = Object.create(null);
  this._components = Object.create(null);
  this._entities = Object.create(null);
  this._systems = Object.create(null);
}

Registry.prototype.components = function registryComponents() {
  return Object.keys(this._components);
};

Registry.prototype.entities = function registryEntities() {
  return Object.keys(this._entities);
};

Registry.prototype.systems = function registrySystems() {
  return Object.keys(this._systems);
};

Registry.prototype.import = function registryImport(module) {
  var i, length, key, value;

  if (module.name in this._modules) return;

  length = module.requires.length;

  for (i = 0; i < length; i += 1) {
    if (!(module.requires[i] in this._modules)) {
      throw new Error();
    }
  }

  this._modules[module.name] = module;

  for (key in module.exports) {
    value = module.exports[key];

    if (value instanceof Component) {
      this._components[key] = value;
    } else if (value instanceof Entity) {
      this._entities[key] = value;
    } else if (value instanceof System) {
      this._systems[key] = value;
    }
  }
};

Registry.prototype.clear = function registryClear() {
  this._modules = Object.create(null);
  this._components = Object.create(null);
  this._entities = Object.create(null);
  this._systems = Object.create(null);
};

Registry.prototype.module = function registryModule(name) {
  var module;

  module = this._modules[name];

  if (module) return module;

  throw new Error();
};

Registry.prototype.component = function registryComponent(name) {
  var component;

  if (rExplicitModuleNotation.test(name)) {
    return this.module(RegExp.$2).component(RegExp.$1);
  }

  component = this._components[name];

  if (component) return component;

  throw new Error();
};

Registry.prototype.entity = function registryEntity(name) {
  var entity;

  if (rExplicitModuleNotation.test(name)) {
    return this.module(RegExp.$2).entity(RegExp.$1);
  }

  entity = this._entities[name];

  if (entity) return entity;

  throw new Error();
};

Registry.prototype.system = function registrySystem(name) {
  var system;

  if (rExplicitModuleNotation.test(name)) {
    return this.module(RegExp.$2).system(RegExp.$1);
  }

  system = this._systems[name];

  if (system) return system;

  throw new Error();
};

module.exports = Registry;

},{"./component":2,"./entity":3,"./system":12}],12:[function(require,module,exports){
'use strict';

function System() {}

module.exports = System;

},{}],13:[function(require,module,exports){
'use strict';

var pool, watchers;

pool = require('./pool');
watchers = require('./modules/core.watchers');

window.nuclear = require('./core/index');

window.nuclear.import([watchers]);

window.Pool = pool.Pool;
window.FixedPool = pool.FixedPool;

},{"./core/index":4,"./modules/core.watchers":14,"./pool":19}],14:[function(require,module,exports){
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

},{"./../../core/index":4,"./watch-system":15,"./watcher-component":16}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{"./../../core/index":4}],17:[function(require,module,exports){
'use strict';

function FixedPool(factory, options) {
  var i;

  this._pool = [];

  this._defered = [];

  if (arguments.length === 2) {
    if ('size' in options) this._size = options.size;
    else this._size = FixedPool.defaults.size;
  } else {
    this._size = FixedPool.defaults.size;
  }

  for (i = 0; i < this._size; i += 1) {
    this._pool.push(factory());
  }
}


FixedPool.prototype.create = function fixedPoolCreate() {
  var instance;

  if (this._size > 0) {
    instance = this._pool[--this._size];

    this._pool[this._size] = null;

    return instance;
  }
};

FixedPool.prototype.defer = function fixedPoolDefer(callback) {
  var instance;

  if (this._size > 0) {
    instance = this._pool[--this._size];

    this._pool[this._size] = null;

    (setImmediate || setTimeout)(function () {
      callback(instance);
    }, 0);
  } else {
    this._defered.push(callback);
  }
};

FixedPool.prototype.release = function fixedPoolRelease(instance) {
  if (this._defered.length > 0) {
    this._defered.shift()(instance);
  } else {
    this._pool[this._size++] = instance;
  }
};

FixedPool.prototype.size = function fixedPoolSize() {
  return this._pool.length;
};

FixedPool.prototype.freeSize = function fixedPoolFreeSize() {
  return this._size;
};

FixedPool.prototype.allocatedSize = function fixedPoolAllocatedSize() {
  return this._pool.length - this._size;
};


FixedPool.defaults = {
  size: 100
};


module.exports = FixedPool;

},{}],18:[function(require,module,exports){
'use strict';

function Pool(factory, options) {
  this._factory = factory;

  this._pool = [];

  this._defered = [];

  if (arguments.length === 2) {
    if ('size' in options) this._size = options.size;
    else this._size = Pool.defaults.size;

    if ('growth' in options) this.growth = options.growth;
    else this.growth = Pool.defaults.growth;

    if ('threshold' in options) this.threshold = options.threshold;
    else this.threshold = Pool.defaults.threshold;
  } else {
    options = Pool.defaults;

    this._size = options.size;

    this.growth = options.growth;
    this.threshold = options.threshold;
  }

  this.allocate(this._size);
}


Pool.prototype.create = function poolCreate() {
  if (this._pool.length < this.threshold) {
    this.allocate(this.growth);
  }

  return this._pool.pop();
};

Pool.prototype.defer = function poolDefer(callback) {
  var instance;

  if (this._pool.length > 0) {
    instance = this._pool.pop();
    (setImmediate || setTimeout)(function () {
      callback(instance);
    }, 0);
  } else {
    this._defered.push(callback);
  }
};

Pool.prototype.allocate = function poolAllocate(count) {
  var i;

  for (i = 0; i < count; i += 1) {
    this._pool.push(this._factory());
  }

  this._size += count;
};

Pool.prototype.release = function poolRelease(instance) {
  if (this._defered.length > 0) {
    this._defered.shift()(instance);
  } else {
    this._pool.push(instance);
  }
};

Pool.prototype.size = function poolSize() {
  return this._size;
};

Pool.prototype.freeSize = function poolFreeSize() {
  return this._pool.length;
};

Pool.prototype.allocatedSize = function poolAllocatedSize() {
  return this._size - this._pool.length;
};


Pool.defaults = {
  size: 100,
  growth: 1,
  threshold: 1
};


module.exports = Pool;

},{}],19:[function(require,module,exports){
'use strict';

exports.Pool = require('./Pool');
exports.FixedPool = require('./FixedPool');

},{"./FixedPool":17,"./Pool":18}]},{},[13])