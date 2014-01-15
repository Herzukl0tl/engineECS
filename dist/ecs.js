(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function ComponentDefinition(name, definition) {
  this.name = name;
  this.definition = definition;

  this._components = Object.create(null);
}


ComponentDefinition.prototype.of = function ComponentDefinitionOf(entity, options) {
  var component = this._components[entity];

  if (arguments.length === 2) {
    if (!this.in(entity)) {
      if (options.required) throw new Error();
      else if (options.add) component = this.add(entity);
    }
  }

  return component;
};

ComponentDefinition.prototype.in = function ComponentDefinitionIn(entity) {
  return entity in this._components;
};

ComponentDefinition.prototype.add = function ComponentDefinitionAdd(entity) {
  if (this.in(entity)) throw new Error();

  var component = this.definition.apply(this, arguments);

  this._components[entity] = component;

  return component;
};

ComponentDefinition.prototype.remove = function ComponentDefinitionRemove(entity) {
  if (!this.in(entity)) return false;

  delete this._components[entity];

  return true;
};

ComponentDefinition.prototype.share = function ComponentDefinitionShare(source, dest) {
  if (!this.in(source)) return null;

  var component = this.of(source);

  if (Array.isArray(dest)) {
    for (var i = dest.length - 1; i >= 0; i -= 1) {
      this._components[dest[i]] = component;
    }
  } else {
    this._components[dest] = component;
  }

  return component;
};


module.exports = ComponentDefinition;

},{}],2:[function(require,module,exports){
var ComponentDefinition = require('./definition');


function component(name) {
  if (name in component._definitions) {
    return component._definitions[name];
  }

  throw new Error();
}


component._definitions = Object.create(null);

component.define = function componentDefine(name, definition) {
  if (name in factory._definitions) {
    throw new Error();
  }

  var componentDefinition = new ComponentDefinition(name, definition);

  component._definitions[name] = componentDefinition;

  return componentDefinition;
};


module.exports = component;

},{"./definition":1}],3:[function(require,module,exports){
var nextEntityId = 1;


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
}


EntityDefinition.prototype.create = function EntityDefinitionCreate(options) {
  var id = nextEntityId++;

  if (this._sourceHasChanged) {
    this.compile();
  }

  this.definition(id);

  for (var key in options) {
    if (!(component(key).in(id))) {
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

  return id;
};

EntityDefinition.prototype.destroy = function EntityDefinitionDestroy(id) {
  var components = this.components();

  for (var i = components.length - 1; i >= 0; i -= 1) {
    component(components[i]).remove(id);
  }

  for (var j = this._entities.length - 1; j >= 0; j -= 1) {
    if (id === this._entities[j]) {
      this._entities.splice(j, 1);
      break;
    }
  }
};

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
};

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
  var head = 'return function ' + this.name + 'Definition($id) {\n', tail = '}',

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

  head += '  var ' + identifiers.join(', ') + ';\n';

  head += '\n';

  for (var i = components.length - 1; i >= 0; i-= 1) {
    head += '  ';

    if (components[i] in scope) {
      head += scope[components[i]] + ' = ';
    }

    head += 'component("' + components[i] + '").add($id);\n';
  }

  head += '\n';

  this.definition = new Function('component', head + tail)(component);

  this._sourceHasChanged = false;
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

},{}],4:[function(require,module,exports){
var entityDefinition = require('./definition');


function entity(name) {
  if (name in entity._definitions) {
    return entity._definitions[name];
  }

  throw new Error();
}


entity._definitions = Object.create(null);

entity.define = function entityDefine(name, source) {
  if (name in entity._definitions) {
    throw new Error();
  }

  var entityDefinition = new FactoryDefinition(name, source);

  entity._definitions[name] = entityDefinition;

  return entityDefinition;
};


module.exports = entity;

},{"./definition":3}],5:[function(require,module,exports){
// TODO
// sanitize rTokens template
// write a better query.compile()
// implement query.filter()
// define standard queries
//   query('components', ...)
//   query('factories', ...)

var rSpaces = /\s+/g,
  rTokens = /[^&|!()]+|[&|!()]/g;


function query(name, expression) {
  if (name in query._definitions) {
    return query._definitions[name](expression);
  }

  throw new Error();
}


query._definitions = Object.create(null);

query._cache = Object.create(null);

query._tokens = Object.create(null);

query._tokens.and = '&';
query._tokens.or = '|';
query._tokens.not = '!';
query._tokens.open = '(';
query._tokens.close = ')';

query.tokens = function queryTokens(value) {
  if (arguments.length === 0) {
    return query._tokens;
  }

  var tokens = query._tokens,
    template = '';

  for (var property in tokens) {
    if (property in value) {
      tokens[property] = value[property];
    }

    template += tokens[property];
  }

  rTokens = new RegExp('[^' + template + ']+|[' + template + ']', 'g');
};

query.define = function queryDefine(name, definition) {
  if (name in query._definitions) {
    throw new Error();
  }

  query._definitions[name] = definition;
};

query.compile = function queryCompile(input) {
  var key = input.replace(rSpaces, ''),
    tokens, head, tail, expression, fragment;

  if (!(key in query._cache)) {
    tokens = query._tokens;

    head = 'return function queryExpression($predicate) {\n  return !!(';
    tail = ');\n}';

    expression = key.match(rTokens);

    for (var i = 0; fragment = expression[i]; i += 1) {
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

},{}],6:[function(require,module,exports){
var ARRAY = [];


function SystemDefinition(name, definition, components, context) {
    this.name = name;
    this.definition = definition;
    this.components = components;
    this.context = context || this;

    this.entities = [];
    this.componentPacks = [];
}


SystemDefinition.prototype.add = function SystemDefinitionAdd(entity, componentPack){
    if(typeof componentPack !== "object"){
        //then compute componentPack with entity
    }

    this.componentPacks.push(componentPack);
    this.entity.push(entity);

    return componentPack;
}

SystemDefinition.prototype.remove = function SystemDefinitionRemove(entity){
    var index = this.entities.indexOf(entity);

    if(index < 0) return false;

    this.entities.splice(index, 1);
    this.componentPack.splice(index, 1);

    return true;
}

SystemDefinition.prototype.check = function SystemDefinitionCheck(componentPack){
    if(typeof componentPack !== "object"){
        //then its an entity, have to compute its componentPack
    }

    for(var i = this.components.length - 1; i > 0; i--){
        if(componentPack[this.components[i]] === undefined) return false;
    }

    return true;
}

var run = function SystemDefinitionRunEntity(entity, componentPack){
    var components = ARRAY;

    for(var i = this.components.length - 1; i > 0; i--){
        components.push(componentPack[this.components[i]]);
    }

    components.push(entity);

    this.definition.apply(this.context, components);

    ARRAY.length = 0;
}

SystemDefinition.prototype.run = function SystemDefinitionRun(entity, componentPack){
    if(arguments.length === 2){
        run.call(this, entity, componentPack)
    } else {
        var length = this.entities.length;
        for(var i = 0; i < length; i++){
            run.call(this, this.entities[i], this.componentPacks[i]);
        }
    }
}


module.exports = SystemDefinition;

},{}],7:[function(require,module,exports){
var SystemDefinition = require('./definition');


function system(name) {
  if (name in system._definitions) {
    return system._definitions[name];
  }

  throw new Error();
}


system._definitions = Object.create(null);

system._list = [];

system._listLength = 0;


system.define = function systemDefine(name, definition, components, context) {
  if (name in system._definitions) {
    throw new Error();
  }

  var systemDefinition = new SystemDefinition(name, definition, components, context);

  system._definitions[name] = systemDefinition;
  system._list.push(name);
  system._listLength++;

  return systemDefinition;
};

system.order = function systemOrder(newList){
    if(Array.isArray(newList)) system._list = newList;

    system._listLength = system._list.length;

    return system._list;
};

system.run = function systemRun(){
    for (var x = 0; x < system._listLength; x++){
        system._list[x].run();
    }
};

system.refresh = function systemRefresh(entity){
    for (var x = 0; x < system._listLength; x++){
        var componentPack = entity.components();
        if(system._list[i].check(componentPack)) system._list[i].add(entity, componentPack);
        else system._list[i].remove(entity);
    }
};


module.exports = system;

},{"./definition":6}],8:[function(require,module,exports){
component = require('./core/component');
system = require('./core/system');
entity = require('./core/entity');

Pool = require('./pool').Pool;
FixedPool = require('./pool').FixedPool;

},{"./core/component":2,"./core/entity":4,"./core/system":7,"./pool":11}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
var Pool = require('./Pool'),
  FixedPool = require('./FixedPool');

exports.Pool = Pool;
exports.FixedPool = FixedPool;

},{"./FixedPool":9,"./Pool":10}]},{},[1,2,3,4,5,6,7,8,9,10,11])