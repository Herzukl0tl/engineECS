(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* events-emitter 30-12-2013 */
!function(a,b){"function"==typeof define&&define.amd?define(function(){return b(a)}):"object"==typeof module&&module&&module.exports?module.exports=b(a):"object"==typeof exports&&exports?exports.EventsEmitter=b(a):a.EventsEmitter=b(a)}(this,function(a){"use strict";function b(){}function c(b,c,d,e,f){var i=h;h+=1,"_listeners"in b||(b._listeners={callbacks:Object.create(null),contexts:Object.create(null),times:Object.create(null)}),"_events"in b||(b._events=Object.create(null)),b._listeners.callbacks[i]=d,b._listeners.contexts[i]=e,5===arguments.length&&(b._listeners.times[i]=f),"_memories"in b&&Array.isArray(b._memories[c])&&(a.setImmediate||a.setTimeout)(function(){g(b,i,b._memories[c])},0);var j=b._events[c];return"number"==typeof j?b._events[c]=[j,i]:Array.isArray(j)?j.push(i):b._events[c]=i,i}function d(a,b,c){var d=(a._listeners.callbacks,a._events[b]);if("number"==typeof d)f(a,d);else if(Array.isArray(d))for(var e=d.length,g=0;e>g;g+=1){var h=d[g];f(a,h)}c||delete a._events[b]}function e(a,b,c){var d=a._listeners.callbacks,e=a._events[b];if("number"==typeof e)e in d||(f(a,e),delete a._events[b]);else if(Array.isArray(e)){for(var g=e.length,h=0;g>h;h+=1){var i=e[h];i in d||(f(a,i),e.splice(h,1),g-=1,h-=1)}0!==g||c||delete a._events[b]}}function f(a,b){delete a._listeners.callbacks[b],delete a._listeners.contexts[b],delete a._listeners.times[b]}function g(b,c,d){if(c in b._listeners.callbacks){var e=b._listeners.callbacks[c],g=b._listeners.contexts[c]||a;switch(c in b._listeners.times&&(b._listeners.times[c]-=1,b._listeners.times[c]<1&&f(b,c)),d.length){case 0:return e.call(g);case 1:return e.call(g,d[0]);case 2:return e.call(g,d[0],d[1]);case 3:return e.call(g,d[0],d[1],d[2]);default:return e.apply(g,d)}}}var h=1;return b.prototype.on=function(b,d,e){return 3===arguments.length?"times"in e?e.times<1?0:c(this,b,d,e.context||a,e.times):c(this,b,d,e.context||a):c(this,b,d,a)},b.prototype.once=function(b,d,e){return 3===arguments.length?c(this,b,d,e.context||a,1):c(this,b,d,a,1)},b.prototype.off=function(a){return"_listeners"in this&&a in this._listeners.callbacks?(delete this._listeners.callbacks[a],delete this._listeners.contexts[a],delete this._listeners.times[a],!0):!1},b.prototype.clear=function(a,b){if("_listeners"in this&&"_events"in this){var c,f;switch(arguments.length){case 0:for(a in this._events)d(this,a,!1);break;case 1:if("string"==typeof a)d(this,a,!1);else if(Array.isArray(a))for(f=a.length;f--;)d(this,a[f],!1);else{b=a,c=b.soft||!1;for(a in this._events)b.ghosts?e(this,a,c):d(this,a,c)}break;case 2:if(c=b.soft||!1,"string"==typeof a)b.ghosts?e(this,a,c):d(this,a,c);else if(Array.isArray(a))for(f=a.length;f--;)b.ghosts?e(this,a[f],c):d(this,a[f],c)}}},b.prototype.listeners=function(a){var b=[];if(!("_listeners"in this&&"_events"in this))return b;var c=this._listeners.callbacks,d=this._events[a];if("number"==typeof d)d in c?b.push(c[d]):f(this,d);else if(Array.isArray(d))for(var e=d.length,g=0;e>g;g+=1){var h=d[g];h in c?b.push(c[h]):f(this,h)}return b},b.prototype.remember=function(a){if("_memories"in this||(this._memories=Object.create(null)),Array.isArray(a))for(var b=a.length;b--;)this._memories[a[b]]=null;else this._memories[a]=null},b.prototype.forget=function(a){if("_memories"in this)if(Array.isArray(a))for(var b=a.length;b--;)delete this._memories[a[b]];else delete this._memories[a]},b.prototype.trigger=function(a){var b=Array.prototype.slice.call(arguments,1);if("_memories"in this&&a in this._memories&&(this._memories[a]=b),!("_listeners"in this&&"_events"in this))return!1;var c=this._events[a];if("number"==typeof c)g(this,c,b);else{if(!Array.isArray(c))return!1;for(var d=c.length,e=0;d>e;e+=1){var f=c[e];g(this,f,b)}}return!0},b.mixins=function(a){var c=b.prototype;for(var d in c)a[d]=c[d];return a},b.mixins(b),b});
},{}],2:[function(require,module,exports){
'use strict';

var component = require('../core/component');
var system = require('../core/system');

function LayerComponent(data) {
  this.layer = data.layer || 0;
  this.systems = data.systems || [];
  component.once('add:layer', function (id) {
    var layer = component('layer').of(id);

    for (var i = 0; i < layer.systems.length; i++) {
      var name = layer.systems[i];
      system(name).sort(sortByLayer);
    }
  });
}

function sortByLayer(a, b) {
  var aRender = component('layer').of(a);
  var bRender = component('layer').of(b);

  return aRender.layer - bRender.layer;
}
component.define('layer', function (id, data) {
  return new LayerComponent(data);
});

},{"../core/component":5,"../core/system":12}],3:[function(require,module,exports){
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

component.define('watcher', function (id) {
  return new WatcherComponent(id);
});

},{"../core/component":5}],4:[function(require,module,exports){
'use strict';
var cmp;

/**
 * ComponentDefinition constructor
 * This is the components factory
 * @param {string} name       The component name
 * @param {function} definition The component function which has to return its instance
 */
function ComponentDefinition(name, definition) {
  this.name = name;
  this.definition = definition;

  this._components = Object.create(null);
  this._disabledComponents = Object.create(null);

  if (cmp === undefined) cmp = require('../component');
}

/**
 * Return the component of the wanted entity if it has a component of this factory
 * If the options key 'required' is true, the method throw an error if the entity hasn't the component
 * If the options key 'add' is true, the method add the component to the entity and return it
 * @param  {number} entity  The entity which has the component
 * @param  {object} options The method options
 * @return {object/undefined}         Return the component if the entity has it, if it hasn't,
 * return undefined if th required key is false
 */
ComponentDefinition.prototype.of = function ComponentDefinitionOf(entity, options) {
  var component = this._components[entity] || this._disabledComponents[entity];

  if (arguments.length === 2) {
    if (!this. in (entity)) {
      if (options.required) throw new Error();
      else if (options.add) component = this.add(entity);
    }
  }

  return component;
};

/**
 * Test if an entity has the component of this factory
 * @param  {number} entity The entity to test
 * @return {boolean}        True if the entity has it, fals if it hasn't
 */
ComponentDefinition.prototype. in = function ComponentDefinitionIn(entity) {
  return entity in this._components || entity in this._disabledComponents;
};

/**
 * The method to add a component to an existing entity
 * All the arguments after the entity one will be passed to the component definition call
 * The component creation triggers a 'add:'componentName event on the component part of core
 * @param {number} entity The entity which will get the new component
 * @return {object}       The created component
 */
ComponentDefinition.prototype.add = function ComponentDefinitionAdd(entity) {
  if (this. in (entity)) throw new Error();

  var component = this.definition.apply(this, arguments);

  this._components[entity] = component;

  cmp.trigger('add:' + this.name, entity, this.name);

  return component;
};

/**
 * Remove the component of this factory to the selected entity
 * The component destruction triggers a 'remove:'ComponentName event on the component part of core
 * @param  {number} entity The entity which will lost the component
 * @return {boolean}        Return false if the entity hasn't the component, true in other case
 */
ComponentDefinition.prototype.remove = function ComponentDefinitionRemove(entity) {
  if (!this. in (entity)) return false;

  delete this._components[entity];
  delete this._disabledComponents[entity];

  cmp.trigger('remove:' + this.name, entity, this.name);
  return true;
};

/**
 * Share an attached component to one or several entity(ies)
 * @param  {number} source The source entity, owning the component to share
 * @param  {number/array} dest   The selected entity(ies)
 * @return {object/null}        If the source has the component, it returns it, in other case, it returns null
 */
ComponentDefinition.prototype.share = function ComponentDefinitionShare(source, dest) {
  if (!this. in (source)) return null;

  var component = this.of(source);

  if (Array.isArray(dest)) {
    for (var i = dest.length - 1; i >= 0; i -= 1) {
      this._components[dest[i]] = component;
      cmp.trigger('add:' + this.name, dest[i], this.name);
    }
  } else {
    this._components[dest] = component;
    cmp.trigger('add:' + this.name, dest, this.name);
  }

  return component;
};

/**
 * Disable the component of the selected entity
 * @param  {number} id The selected entity
 * @return {boolean}    If the entity owns the component and it is enabled, it returns true, in other case, it returns false
 */
ComponentDefinition.prototype.disable = function ComponentDefinitionDisable(id) {
  if (id in this._components) {
    this._disabledComponents[id] = this._components[id];
    delete this._components[id];

    cmp.trigger('disable:' + this.name, id, this.name);
    return true;
  }
  return false;
};

/**
 * Enable the component of the selected entity
 * @param  {number} id The selected entity
 * @return {boolean}    If the entity owns the component and it is disabled, it returns true, in other case, it returns false
 */
ComponentDefinition.prototype.enable = function ComponentDefinitionEnable(id) {
  if (id in this._disabledComponents) {
    this._components[id] = this._disabledComponents[id];
    delete this._disabledComponents[id];

    cmp.trigger('enable:' + this.name, id, this.name);
    return true;
  }
  return false;
};

/**
 * Test if the component of the selected entity is enabled or not
 * @param  {number}  id The selected entity
 * @return {Boolean}    True if it's enabled, false in other case
 */
ComponentDefinition.prototype.isEnabled = function ComponentDefinitionIsEnabled(id) {
  if (this. in (id)) {
    if (id in this._components) return true;
    return false;
  }

  throw new Error();
};

module.exports = ComponentDefinition;

},{"../component":5}],5:[function(require,module,exports){
'use strict';

var EventEmitter = require('../../../lib/events-emitter.min'),
  ComponentDefinition = require('./definition'),
  entityList = Object.create(null),
  eventsOptions = {};

/**
 * The component method which contains all components definition
 * This is also the components definition getter (throws an error if the ComponentDefinition doesn't exist)
 * @param  {string} name The ComponentDefinition name
 * @return {object}      The selected ComponentDefinition
 */
function component(name) {
  if (name in component._definitions) {
    return component._definitions[name];
  }

  throw new Error();
}

EventEmitter.mixins(component);

component._definitions = Object.create(null);

/**
 * Define a ComponentDefinition (throws an error if the ComponentDefinition already exists)
 * @param  {string} name       The ComponentDefinition name
 * @param  {function} definition The ComponentDefinition definition
 * @return {[type]}            [description]
 */
component.define = function componentDefine(name, definition) {
  if (name in component._definitions) {
    throw new Error();
  }

  var componentDefinition = new ComponentDefinition(name, definition),
    options = eventsOptions;

  options.context = componentDefinition;
  component._definitions[name] = componentDefinition;

  component.on('add:' + name, linkComponent, options);

  component.on('remove:' + name, unLinkComponent, options);

  return componentDefinition;
};

/**
 * Get all the selected entity components
 * @param  {number} id The selected entity
 * @return {array}    A simple string array containing all the components names of the selected entity
 */
component.of = function componentOf(id) {
  if (entityList[id]) return entityList[id];

  throw new Error();
};

function linkComponent(id, name) {
  var components = entityList[id] || [];
  components.push(name);
  entityList[id] = components;
}

function unLinkComponent(id, name) {
  var components = component.of(id);
  var index = components.indexOf(name);

  components.splice(index, 1);
}
module.exports = component;

},{"../../../lib/events-emitter.min":1,"./definition":4}],6:[function(require,module,exports){
'use strict';

var component = require('../component'),
  entity;

/**
 * The EntityDefinition constructor
 * @param {string} name   The EntityDefinition name
 * @param {Object} source The EntityDefinition config
 */
function EntityDefinition(name, source) {
  this.name = name;
  this.definition = null;

  this._source = source;
  this._components = [];
  this._defaults = Object.create(null);

  this._sourceHasChanged = true;
  this._componentsHaveChanged = true;
  this._defaultsHaveChanged = true;

  this._entities = [];

  if (entity === undefined) entity = require('../entity');
}

/**
 * Create an entity depending on this EntityDefinition
 * @param  {object} options All the components data
 * @return {number}         The created entity
 */
EntityDefinition.prototype.create = function EntityDefinitionCreate(options) {
  var id = entity.next();

  if (this._sourceHasChanged) {
    this.compile();
  }

  this.definition(id, options);

  for (var key in options) {
    if (!(component(key). in (id))) {
      continue;
    }

    var root = component(key).of(id),
      paths = options[key];

    for (var path in paths) {
      var properties = path.split('.'),
        length = properties.length - 1,
        dest = root;

      for (var i = 0; i < length; i += 1) {
        dest = dest[properties[i]];
      }

      dest[properties[i]] = paths[path];
    }
  }

  this._entities.push(id);
  entity.trigger('create:' + this.name, id);
  entity.trigger('create_entity', id, this.name);
  return id;
};

/**
 * Change the current source
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
EntityDefinition.prototype.source = function EntityDefinitionSource(value) {
  if (arguments.length === 0) {
    return this._source;
  }

  if ('extends' in value) {
    this._source.extends = value.extends;
    this._componentsHaveChanged = true;
    this._defaultsHaveChanged = true;
    this._sourceHasChanged = true;
  }

  if ('components' in value) {
    this._source.components = value.components;
    this._componentsHaveChanged = true;
    this._sourceHasChanged = true;
  }

  if ('defaults' in value) {
    this._source.defaults = value.defaults;
    this._defaultsHaveChanged = true;
    this._sourceHasChanged = true;
  }

  return this;
};

/**
 * Compute and get the EntityDefinition components
 * @return {object} The EntityDefinition components
 */
EntityDefinition.prototype.components = function EntityDefinitionComponents() {
  if (this._componentsHaveChanged) {
    var scope = Object.create(null),
      keys = [],
      length;

    this._components.length = 0;
    this._components.push.apply(this._components, this._source.components);

    expandSourceProperty(this, 'components', scope, keys);

    length = keys.length;

    for (var i = 0; i < length; i += 1) {
      var components = scope[keys[i]];

      if (components === undefined) {
        continue;
      }

      outer: for (var j = components.length - 1; j >= 0; j -= 1) {
        var item = components[j];

        for (var k = this._components.length - 1; k >= 0; k -= 1) {
          if (item === this._components[k]) {
            continue outer;
          }
        }

        this._components.push(item);
      }
    }

    this._componentsHaveChanged = false;
  }

  return this._components;
};

EntityDefinition.prototype.defaults = function EntityDefinitionDefaults() {
  if (this._defaultsHaveChanged) {
    var scope = Object.create(null),
      keys = [];

    expandSourceProperty(this, 'defaults', scope, keys);

    for (var i = keys.length - 1; i >= 0; i -= 1) {
      var defaults = scope[keys[i]];

      if (defaults === undefined) {
        continue;
      }

      for (var property in defaults) {
        var paths = defaults[property],
          dest;

        if (!(property in this._defaults)) {
          this._defaults[property] = Object.create(null);
        }

        dest = this._defaults[property];

        for (var path in paths) {
          dest[path] = paths[path];
        }
      }
    }

    this._defaultsHaveChanged = false;
  }

  return this._defaults;
};

EntityDefinition.prototype.compile = function EntityDefinitionCompile() {
  var head = 'return function ' + this.name + 'Definition($id, $data) {\n',
    tail = '}',

    components = this.components(),
    defaults = this.defaults(),

    scope = Object.create(null),
    identifiers = [];

  for (var key in defaults) {
    var identifier = '$' + identifiers.length,
      paths = defaults[key];

    identifiers.push(identifier);

    scope[key] = identifier;

    for (var path in paths) {
      tail = '  ' + identifier + '.' + path + ' = ' + JSON.stringify(paths[path]) + ';\n' + tail;
    }
  }
  if (identifiers.length > 0) {
    head += '  var ' + identifiers.join(', ') + ';\n';
  }

  head += '\n';

  for (var i = components.length - 1; i >= 0; i -= 1) {
    head += '  ';

    if (components[i] in scope) {
      head += scope[components[i]] + ' = ';
    }

    head += 'component("' + components[i] + '").add($id, $data["' + components[i] + '"] || Object.create(null));\n';
  }

  head += '\n';
  this.definition = new Function('component', head + tail)(component);

  this._sourceHasChanged = false;
};

/**
 * Serialize the selected entity
 * @param  {number} entity The selected entity
 * @return {string}        The serialized entity
 */
EntityDefinition.prototype.serialize = function EntityDefinitionSerialize(entity) {
  if (this._entities.indexOf(entity) <= -1) return null;

  var waitedComponents = [];
  waitedComponents.push.apply(waitedComponents, this._components);

  var serialized = Object.create(null),
    components = component.of(entity);

  serialized.factory = this.name;
  serialized.options = Object.create(null);
  serialized.addedComponents = Object.create(null);

  for (var i = components.length - 1; i > 0; i--) {
    var name = components[i];
    var definition = component(name);
    var data = definition.of(entity);

    if (typeof data.toJSON === 'function') data = data.toJSON();
    if (this._components.indexOf(name) === -1) {
      serialized.addedComponents[name] = data;
    } else {
      serialized.options[name] = data;

      var index = waitedComponents.indexOf(name);
      waitedComponents.splice(index, 1);
    }
  }

  serialized.removedComponents = waitedComponents;
  return JSON.stringify(serialized);
};

/**
 * Deserialize a serialized entity
 * @param  {string} components The serialized entity
 * @return {number}            The created entity
 */
EntityDefinition.prototype.deSerialize = function EntityDefinitionDeSerialize(components) {
  var entity = this.create(components.options);
  for (var i in components.addedComponents) {
    component(i).add(entity, components.addedComponents[i]);
  }
  for (i = 0; i < components.removedComponents.length; i++) {
    var name = components.removedComponents[i];
    component(name).remove(entity);
  }

  return entity;
};

function expandSourceProperty(self, property, scope, keys) {
  scope[self.name] = self._source[property];
  keys.push(self.name);

  if (!('extends' in self._source)) {
    return;
  }

  var stack = self._source.extends.slice();

  while (stack.length > 0) {
    var current = stack.shift(),
      source = entity(current)._source;

    if (current in scope) {
      continue;
    }

    if ('extends' in source) {
      stack.unshift.apply(stack, source.extends);
    }

    scope[current] = source[property];
    keys.push(current);
  }
}


module.exports = EntityDefinition;

},{"../component":5,"../entity":7}],7:[function(require,module,exports){
'use strict';

var EventEmitter = require('../../../lib/events-emitter.min'),
  EntityDefinition = require('./definition'),
  component = require('../component'),
  nextEntityId = 0,
  entityList = Object.create(null);

/**
 * The entity method which contains all entities definitions
 * This is also the entity definition getter (throws an error if the EntityDefinition doesn't exist)
 * @param  {string} name The EntityDefinition name
 * @return {object}      The selected EntityDefinition
 */
function entity(name) {
  if (name in entity._definitions) {
    return entity._definitions[name];
  }

  throw new Error();
}

EventEmitter.mixins(entity);

entity.on('create_entity', function (id, factory) {
  entityList[id] = factory;
});

entity._definitions = Object.create(null);

/**
 * Get the nex entity id
 * @return {number} The next entity id
 */
entity.next = function entityNext() {
  return (nextEntityId += 1);
};

/**
 * Define an EntityDefinition
 * @param  {string} name   The EntityDefinition name
 * @param  {object} source The EntityDefinition config
 * @return {EntityDefinition}        The defined EntityDefinition
 */
entity.define = function entityDefine(name, source) {
  if (name in entity._definitions) {
    throw new Error();
  }

  var entityDefinition = new EntityDefinition(name, source);

  entity._definitions[name] = entityDefinition;

  return entityDefinition;
};

/**
 * Serialize the selected entity
 * @param  {number} id The selected entity
 * @return {string}    The serialized entity
 */
entity.serialize = function entitySerialize(id) {
  var factory = entity.factory(id);
  return entity(factory).serialize(id);
};

/**
 * Deserialize a serialized entity
 * @param  {string} serialized The serialized entity
 * @return {number}            The created entity id
 */
entity.deSerialize = function entityDeSerialize(serialized) {
  var data = JSON.parse(serialized);
  var factory = data.factory;

  return entity(factory).deSerialize(data);
};

/**
 * Get the selected entity EntityDefinition
 * @param  {number} id The selected entity
 * @return {EntityDefinition}    The selected entity EntityDefinition
 */
entity.factory = function entityGetFactory(id) {
  if (entityList[id]) return entityList[id];

  throw new Error();
};

/**
 * Remove the selected entity and its components
 * @param  {number} id The selected entity
 * @return {boolean}    Return true
 */
entity.remove = function entityRemove(id) {
  var components = component.of(id);
  var factory = entity(entity.factory(id));

  for (var i = components.length - 1; i >= 0; i -= 1) {
    component(components[i]).remove(id);
  }

  for (var j = factory._entities.length - 1; j >= 0; j -= 1) {
    if (id === factory._entities[j]) {
      factory._entities.splice(j, 1);
      break;
    }
  }

  entity.trigger('remove:' + factory.name, id);
  delete entityList[id];
  return true;
};

module.exports = entity;

},{"../../../lib/events-emitter.min":1,"../component":5,"./definition":6}],8:[function(require,module,exports){
// TODO
// write a better query.compile()
// define the * and components cmd

'use strict';

var rSpaces = /\s+/g,
  rTokens = /[^&|!()]+|[&|!()]/g,
  rEscapeRegExp = /([.*+?^=!:${}()|\[\]\/\\])/g;


function query(cmd, expression) {
  if (cmd in query._aliases) {
    var params = query._aliases[cmd];

    cmd = params.cmd;
    expression = params.expression;
  }

  if (cmd in query._definitions) {
    return invokeQuery(cmd, expression);
  }

  throw new Error();
}

function invokeQuery(cmd, expression) {
  return query._definitions[cmd](expression);
}

query._definitions = Object.create(null);
query._aliases = Object.create(null);
query._cache = Object.create(null);
query._tokens = Object.create(null);

query._tokens.and = ',';
query._tokens.or = 'OR';
query._tokens.not = '!';
query._tokens.open = '(';
query._tokens.close = ')';

query.tokens = function queryTokens(values) {
  if (arguments.length === 0) {
    return query._tokens;
  }

  var tokens = query._tokens,
    template = '';

  for (var property in tokens) {
    if (property in values) {
      tokens[property] = values[property];
    }

    template += tokens[property];
  }

  template = escapeRegExp(template);

  rTokens = new RegExp('[^' + template + ']+|[' + template + ']', 'g');
};

function escapeRegExp(string) {
  return string.replace(rEscapeRegExp, '\\$1');
}

query.define = function queryDefine(cmd, definition) {
  if (cmd in query._definitions) {
    throw new Error();
  }

  query._definitions[cmd] = definition;
};

query.alias = function queryAlias(alias, params) {
  if (alias in query._aliases) {
    throw new Error();
  }

  if (typeof params === 'object' && params !== null) {
    query._aliases[alias] = params;
  }

  throw new Error();
};

query.compile = function queryCompile(input) {
  var key = input.replace(rSpaces, ''),
    tokens, head, tail, expression, fragment;

  if (!(key in query._cache)) {
    tokens = query._tokens;

    head = 'return function queryExpression($predicate) {\n  return !!(';
    tail = ');\n}';

    expression = key.match(rTokens);

    for (var i = 0;
      (fragment = expression[i]); i += 1) {
      switch (fragment) {
      case tokens.and:
        expression[i] = '&&';
        break;

      case tokens.or:
        expression[i] = '||';
        break;

      case tokens.not:
        expression[i] = '!';
        break;

      case tokens.open:
        expression[i] = '(';
        break;

      case tokens.close:
        expression[i] = ')';
        break;

      default:
        expression[i] = '$predicate(' + JSON.stringify(fragment) + ')';
      }
    }

    try {
      expression = new Function(head + expression.join('') + tail)();
    } catch (oO) {
      throw new Error();
    }

    query._cache[key] = expression;
  }

  return query._cache[key];
};


module.exports = query;

},{}],9:[function(require,module,exports){
'use strict';
var entity = require('../entity'),
  privates = Object.create(null),
  currentIndex = 0,
  scene;

/**
 * The SceneDefinition constructor
 * @param {string} name       The SceneDefinition name
 * @param {function} definition The SceneDefinition definition
 */
function SceneDefinition(name, definition) {
  this.name = name;
  this.definition = definition;
  this._context = Object.create(null);
  this._entities = Object.create(null);
  this._eventObject = Object.create(null);
  this.currentIndex = currentIndex;

  if (scene === undefined) scene = require('../scene');
}

/**
 * Run the SceneDefinition definition with the given context
 * @param  {object} context The context to give to the scene
 */
SceneDefinition.prototype.instanciate = function SceneDefinitionInstantiate(context) {
  this._eventObject.context = this;
  var listener = entity.on('create_entity', privates.addEntity, this._eventObject);

  for (var i in context) {
    this._context[i] = context[i];
  }

  this.currentIndex = ++currentIndex;
  this.definition.apply(this._context);
  this.currentIndex = --currentIndex;

  entity.off(listener);
};

/**
 * Destroy all the entities binded to this SceneDefinition
 */
SceneDefinition.prototype.destroy = function SceneDefinitionDestroy() {
  for (var i in this._entities) {
    entity.remove(i);
    delete this._entities[i];
  }
};

privates.addEntity = function SceneDefinitionAddEntity(id) {
  if (this.currentIndex === currentIndex) {
    this._entities[id] = true;
    scene.trigger('add_entity', id, this.name);
  }
};

module.exports = SceneDefinition;

},{"../entity":7,"../scene":10}],10:[function(require,module,exports){
'use strict';

var EventEmitter = require('../../../lib/events-emitter.min'),
  SceneDefinition = require('./definition'),
  entityList = Object.create(null);

/**
 * The scene method which contains all scenes definitions
 * This is also the scene definition getter (throws an error if the SceneDefinition doesn't exist)
 * @param  {string} name The SceneDefinition name
 * @return {object}      The selected SceneDefinition
 */
function scene(name) {
  if (name in scene._definitions) {
    return scene._definitions[name];
  }

  throw new Error();
}

EventEmitter.mixins(scene);

scene.on('add_entity', function (id, name) {
  entityList[id] = name;
});

scene._definitions = Object.create(null);

/**
 * Define an SceneDefinition
 * @param  {string} name   The SceneDefinition name
 * @param  {object} source The SceneDefinition definition
 * @return {SceneDefinition}        The defined SceneDefinition
 */
scene.define = function sceneDefine(name, definition) {
  if (name in scene._definitions) {
    throw new Error();
  }

  var sceneDefinition = new SceneDefinition(name, definition);

  scene._definitions[name] = sceneDefinition;

  return sceneDefinition;
};

/**
 * Get the scene of the selected entity
 * @param  {number} id The selected entity
 * @return {SceneDefinition}    The SceneDefinition of the selected entity
 */
scene.of = function sceneOf(id) {
  if (entityList[id]) return entityList[id];

  throw new Error();
};

module.exports = scene;

},{"../../../lib/events-emitter.min":1,"./definition":9}],11:[function(require,module,exports){
'use strict';

var system;
var component = require('../component'),
  scene = require('../scene'),
  Scheduler = require('../../scheduler/scheduler'),
  privates = Object.create(null),
  eventsOptions = {};

/**
 * The SystemDefinition constructor
 * @param {string} name       The SystemDefinition name
 * @param {array} components The SystemDefinition required components
 * @param {function} definition The SystemDefinition definition
 * @param {object} options    The SystemDefinition options
 */
function SystemDefinition(name, components, definition, options) {
  if (Object.prototype.toString.call(options) !== '[object Object]') options = Object.create(null);

  this.name = name;
  this.definition = definition;
  this.components = components;

  this._context = Object.create(options.context || null);

  this.entities = [];
  this._deferredEntities = [];
  this._sorterManager = Object.create({
    comparator: function () {},
    toDeferred: false
  });

  this._componentPacks = Object.create(null);
  this._removeEntities = Object.create(null);

  this._priority = 0;

  this._scheduler = new Scheduler(options.msPerUpdate, options.strict, options.extrapolation);
  this._scheduler.start();

  systemListenComponents(this, components);

  if (options.disable !== undefined) {
    systemDisableSystems(this, options.disable);
  }
  if (system === undefined) system = require('../system');

  system.on('after running', function () {
    if (this._sorterManager.toDeferred) {
      this.entities.sort(this._sorterManager.comparator);
      this._sorterManager.toDeferred = false;
    }
  }, {
    context: this
  });
}

/**
 * Check if the entity parameter is valid for this system
 * If No : return false
 * If Yes : add the entity to the entities list of the system, and return true
 * @param {number} entity The entity to add
 */
SystemDefinition.prototype.add = function SystemDefinitionAdd(entity) {
  if (this.entities.indexOf(entity) > -1) return false;

  var componentPack = this.check(entity);
  if (componentPack === null) return false;

  this.entities.push(entity);
  this._componentPacks[entity] = componentPack;

  return true;
};

/**
 * Remove the selected entity frome the system garbage list
 * @param  {number} entity The selected entity
 * @return {boolean}        If the entity is in the system, it returns true, in other case, it returns false
 */
SystemDefinition.prototype.remove = function SystemDefinitionRemove(entity) {
  var index = this.entities.indexOf(parseInt(entity));
  if (index < 0) return false;

  this.entities.splice(index, 1);
  delete this._componentPacks[entity];

  return true;
};

/**
 * Check if an entity is runnable by the system
 * @param  {number} entity The selected entity
 * @return {null/object}   Return null if the entity isn't runnable, return its components in other case
 */
SystemDefinition.prototype.check = function SystemDefinitionCheck(entity) {
  var componentPack = Object.create(null);
  for (var i = this.components.length - 1; i >= 0; i--) {
    var comp = component(this.components[i]).of(entity);
    if (comp === undefined) return null;
    componentPack[this.components[i]] = comp;
  }

  return componentPack;
};

/**
 * Run the system on the selected entity, or on all the entities if no arguments
 * @param  {number} entity The selected entity
 * @return {SystemDefinition} Return the SystemDefinition itself
 */
SystemDefinition.prototype.run = function SystemDefinitionRun(entity) {
  var self = this;
  systemParseDeferred(self);

  if (arguments.length === 1) {
    if (this.entities.indexOf(entity) !== -1) {
      var componentPack = self._componentPacks[entity];
      system.trigger('before:' + self.name, entity, componentPack);
      systemDefinitionRunEntity(self, entity, componentPack);
      system.trigger('after:' + self.name, entity, componentPack);
      return true;
    }
    return false;
  } else {
    system.trigger('before:' + self.name, self.entities, self._componentPacks);

    if (self._autosortComparator !== null && typeof self._autosortComparator === 'function') {
      self.entities.sort(self._autosortComparator);
    }

    var length = self.entities.length;


    self._scheduler.run(function (deltaTime) {
      for (var i = 0; i < length; i++) {
        self._context._deltaTime = deltaTime;
        systemDefinitionRunEntity(self, self.entities[i], self._componentPacks[self.entities[i]]);
      }
    });

    system.trigger('after:' + self.name, self.entities, self._componentPacks);
  }

  return self;
};

/**
 * Sort the internal entity list of the system
 * @param  {function} comparator The sorting function
 * @return {SystemDefinition}    The SystemDefinition itself
 */
SystemDefinition.prototype.sort = function SystemDefinitionSort(comparator) {
  this._sorterManager.comparator = comparator;
  this._sorterManager.toDeferred = true;

  return this;
};

/**
 * Define an autosort compartor which will sort the SystemDefinition
 * at each frame
 * @param  {function} comparator The sorting function
 * @return {SystemDefinition}    The SystemDefinition itself
 */
SystemDefinition.prototype.autosort = function SystemDefinitionAutoSort(comparator) {
  if (arguments.length === 0) {
    return this._autosortComparator;
  }

  if (typeof comparator === 'function' || comparator === null) {
    this._autosortComparator = comparator.bind(this._context);

    return this;
  }

  throw new Error();
};

/**
 * Refresh the system entities list
 */
SystemDefinition.prototype.refresh = function SystemDefinitionRefresh() {
  systemParseDeferred(this);
};

function systemDefinitionRunEntity(self, entity, componentPack) {
  var context = self._context,
    components = self.components,
    sceneContext = scene(scene.of(entity))._context;

  for (var i = components.length - 1; i >= 0; i--) {
    context[components[i]] = componentPack[components[i]];
  }


  self.definition.call(context, entity, sceneContext);
}

function systemParseDeferred(self) {
  for (var i = 0; i < self._deferredEntities.length; i++) {
    var entity = self._deferredEntities[i];
    if (self._removeEntities[entity] !== undefined) {
      self.remove(entity);
      delete self._removeEntities[entity];
      continue;
    }

    self.add(entity);
  }

  self._deferredEntities.length = 0;
}

privates.addToDeferred = function systemAddToDeferred(entity) {
  this._deferredEntities.push(entity);
};

privates.addToDeferredAndRemove = function systemAddToDeferredAndRemove(entity, componentName) {
  this._deferredEntities.push(entity);
  this._removeEntities[entity] = componentName;
};

function systemListenComponents(self, components) {
  var options = eventsOptions;

  options.context = self;

  for (var i = 0; i < components.length; i++) {
    component.on('add:' + components[i], privates.addToDeferred, options);
    component.on('enable:' + components[i], privates.addToDeferred, options);

    component.on('remove:' + components[i], privates.addToDeferredAndRemove, options);
    component.on('disable:' + components[i], privates.addToDeferredAndRemove, options);
  }
}

function systemDisableSystems(self, systems) {
  for (var i = 0; i < systems.length; i++) {
    system.disable(systems[i]);
  }
}

module.exports = SystemDefinition;

},{"../../scheduler/scheduler":17,"../component":5,"../scene":10,"../system":12}],12:[function(require,module,exports){
'use strict';

var EventEmitter = require('../../../lib/events-emitter.min');
var SystemDefinition = require('./definition');

/**
 * The system method which contains all system definitions
 * This is also the system definition getter (throws an error if the SystemDefinition doesn't exist)
 * @param  {string} name The SystemDefinition name
 * @return {object}      The selected SystemDefinition
 */
function system(name) {
  if (name in system._definitions) {
    return system._definitions[name];
  }

  throw new Error();
}

EventEmitter.mixins(system);

system._definitions = Object.create(null);

system._list = [];

system._listLength = 0;

/**
 * Define a SystemDefinition
 * @param {string} name       The SystemDefinition name
 * @param {array} components The SystemDefinition required components
 * @param {function} definition The SystemDefinition definition
 * @param {object} options    The SystemDefinition options
 * @return {SystemDefinition}        The defined SystemDefinition
 */
system.define = function systemDefine(name, definition, components, options) {
  if (name in system._definitions) {
    throw new Error();
  }

  var systemDefinition = new SystemDefinition(name, definition, components, options);

  system._definitions[name] = systemDefinition;
  system._list.push(name);
  system._listLength++;

  return systemDefinition;
};

/**
 * Define the run priority of the selected system
 * @param  {string} name The selected SystemDefinition name
 * @param  {number} prio The priority of the system
 */
system.priority = function systemPriority(name, prio) {
  if (arguments.length === 1) {
    return system(name)._priority;
  }

  system(name)._priority = prio;
  system._list.sort(systemsPriorityComparator);
};

function systemsPriorityComparator(a, b) {
  return a._priority - b._priority;
}

/**
 * Run all the system list
 */
system.run = function systemRun() {
  system.trigger('before running', system._list);
  for (var x = 0; x < system._listLength; x++) {
    system(system._list[x]).run();
  }
  system.trigger('after running', system._list);
};

/**
 * Disable a system in the system list
 * @param  {string} name The SystemDefinition name
 */
system.disable = function systemDisable(name) {
  var index = system._list.indexOf(name);
  system._list.splice(index, 1);
  system._listLength--;
};

module.exports = system;

},{"../../../lib/events-emitter.min":1,"./definition":11}],13:[function(require,module,exports){
'use strict';

window.component = require('./core/component');
window.system = require('./core/system');
window.entity = require('./core/entity');
window.scene = require('./core/scene');

window.Pool = require('./pool').Pool;
window.FixedPool = require('./pool').FixedPool;

},{"./core/component":5,"./core/entity":7,"./core/scene":10,"./core/system":12,"./pool":16}],14:[function(require,module,exports){
'use strict';

function FixedPool(factory, options) {
  this._pool = [];

  this._defered = [];

  if (arguments.length === 2) {
    if ('size' in options) this._size = options.size;
    else this._size = FixedPool.defaults.size;
  } else {
    this._size = FixedPool.defaults.size;
  }

  for (var i = 0; i < this._size; i += 1) {
    this._pool.push(factory());
  }
}


FixedPool.prototype.create = function FixedPoolCreate() {
  if (this._size > 0) {
    var object = this._pool[--this._size];

    this._pool[this._size] = null;

    return object;
  }
};

FixedPool.prototype.defer = function FixedPoolDefer(callback) {
  if (this._size > 0) {
    var object = this._pool[--this._size];

    this._pool[this._size] = null;

    callback(object);
  } else {
    this._defered.push(callback);
  }
};

FixedPool.prototype.release = function FixedPoolRelease(object) {
  if (this._defered.length > 0) {
    this._defered.shift()(object);
  } else {
    this._pool[this._size++] = object;
  }
};

FixedPool.prototype.size = function FixedPoolSize() {
  return this._pool.length;
};

FixedPool.prototype.freeSize = function FixedPoolFreeSize() {
  return this._size;
};

FixedPool.prototype.allocatedSize = function FixedPoolAllocatedSize() {
  return this._pool.length - this._size;
};


FixedPool.defaults = {
  size: 100
};


module.exports = FixedPool;

},{}],15:[function(require,module,exports){
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


Pool.prototype.create = function PoolCreate() {
  if (this._pool.length < this.threshold) {
    this.allocate(this.growth);
  }

  return this._pool.pop();
};

Pool.prototype.defer = function PoolDefer(callback) {
  if (this._pool.length > 0) {
    callback(this._pool.pop());
  } else {
    this._defered.push(callback);
  }
};

Pool.prototype.allocate = function PoolAllocate(count) {
  for (var i = 0; i < count; i += 1) {
    this._pool.push(this._factory());
  }
};

Pool.prototype.release = function PoolRelease(object) {
  if (this._defered.length > 0) {
    this._defered.shift()(object);
  } else {
    this._pool.push(object);
  }
};

Pool.prototype.size = function PoolSize() {
  return this._size;
};

Pool.prototype.freeSize = function PoolFreeSize() {
  return this._pool.length;
};

Pool.prototype.allocatedSize = function PoolAllocatedSize() {
  return this._size - this._pool.length;
};


Pool.defaults = {
  size: 100,
  growth: 1,
  threshold: 1
};


module.exports = Pool;

},{}],16:[function(require,module,exports){
'use strict';

var Pool = require('./Pool'),
  FixedPool = require('./FixedPool');


exports.Pool = Pool;
exports.FixedPool = FixedPool;

},{"./FixedPool":14,"./Pool":15}],17:[function(require,module,exports){
'use strict';

function Scheduler(msPerUpdate, strict, extrapolation) {
  var self = this;
  self.msPerUpdate = msPerUpdate || 16;
  self.extrapolation = extrapolation || false;
  self.strict = strict;

  if (self.strict === undefined) self.strict = true;

  self.lag = 0;
  self.previous = 0;

  window.addEventListener('focus', function () {
    self.start();
  });
}


Scheduler.prototype.run = function schedulerRun(callback) {
  var current = Date.now();
  var elapsed = current - this.previous;
  this.previous = current;
  this.lag += elapsed;
  if (this.strict) {
    while (this.lag >= this.msPerUpdate) {
      callback(1);
      this.lag -= this.msPerUpdate;
    }
    if (this.extrapolation) {
      callback(this.lag / elapsed);
      this.lag = 0;
    }
  } else {
    callback(this.lag / elapsed);
  }
};

Scheduler.prototype.start = function schedulerInit() {
  this.previous = (new Date()).getTime();
};

Scheduler.prototype.stop = function schedulerInit() {
  this.previous = (new Date()).getTime();
};

module.exports = Scheduler;

},{}],18:[function(require,module,exports){
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

},{"../core/system":12}]},{},[2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18])