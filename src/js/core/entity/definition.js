'use strict';

var component = require('../component'),
  entity;


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
  entity.trigger('create new entity', id, this.name);
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

  entity.trigger('remove:' + this.name, id);

  return this;
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

  return this;
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

EntityDefinition.prototype.serialize = function EntityDefinitionSerialize(entity) {
  if (this._entities.indexOf(entity) <= -1) return null;

  var waitedComponents = [];
  waitedComponents.push.apply(waitedComponents, this._components);

  var serialized = Object.create(null);

  serialized.factory = this.name;
  serialized.options = Object.create(null);
  serialized.addedComponents = Object.create(null);

  for (var i in component._definitions) {
    var definition = component._definitions[i];
    if (definition. in (entity)) {
      var data = definition.of(entity);
      if (typeof data.toJSON === 'function') data = data.toJSON();


      if (this._components.indexOf(i) === -1) {
        serialized.addedComponents[i] = data;
      } else {
        serialized.options[i] = data;

        var index = waitedComponents.indexOf(i);
        waitedComponents.splice(index, 1);
      }
    }
  }

  serialized.removedComponents = waitedComponents;
  return JSON.stringify(serialized);
};

EntityDefinition.prototype.unSerialize = function EntityDefinitionUnSerialize(components) {
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
