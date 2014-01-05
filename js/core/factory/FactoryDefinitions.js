var nextEntityId = 1;

function FactoryDefinition(name, definitionOrSource) {
  this.name = name;

  if (typeof definitionOrSource === 'function') {
    this.definition = definitionOrSource;
  } else {
    this.compile(definitionOrSource);
  }

  this._entities = [];
}

FactoryDefinition.prototype.create = function FactoryDefinitionCreate() {
  var entityId = nextEntityId++;

  this.definition.apply(this, arguments);
  this._entities.push(entityId);

  return entityId;
};

FactoryDefinition.prototype.compile = function FactoryDefinitionCompile(source) {
  var definition = 'return ' + this.name + 'Definition(entityId, options) {',
    i, path, key;

  if ('extends' in source) {
    for (i = source.extends.length; i >= 0; i -= 1) {
      definition += 'factory(' + source.extends[i] + ').definition(entityId, options)';
    }
  }

  if ('components' in source) {
    for (i = source.components.length; i >= 0; i -= 1) {
      definition += 'component(' + source.components[i] + ').add(entityId);';
    }
  }

  if ('values' in source) {
    for (path in source.values) {
      definition += 'set(entityId, "' + path + '", ' + source.values[path] + ');';
    }
  }

  if ('arguments' in source) {
    for (key in source.arguments) {
      definition += 'if ("' + key + '" in options) {';

      if (typeof source.arguments[key] === 'string') {
        definition += 'set(entityId, "' + source.arguments[key] + '", options[' + key + '])}';
      } else {
        definition += 'set(entityId, "' + source.arguments[key].path + '", options[' + key + ']);';

        if ('defaults' in source.arguments[key]) {
          definition += '} else {' +
            'set(entityId, "' + source.arguments[key].path + '", ' + source.arguments[key].defaults + ')' +
          '}';
        } else {
          definition += '}';
        }
      }
    }
  }

  definition += '}';

  this.definition = new Function('component, set', definition)(component, set);

  return this;
};

function set(entityId, path, value) {}
