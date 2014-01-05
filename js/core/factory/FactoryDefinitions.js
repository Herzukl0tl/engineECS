function FactoryDefinition(name, definitionOrSource) {
  this.name = name;

  if (typeof definitionOrSource === 'function') {
    this.definition = definitionOrSource;
  } else {
    this.compile(definitionOrSource);
  }

  this._entities = [];
}

FactoryDefinition.prototype.create = function FactoryDefinitionCreate(options) {
  var entityId = entity._nextEntityId++;

  this.definition(entityId);

  for (var path in options) {
    set(entityId, path, options[path]);
  }

  this._entities.push(entityId);
  //entity.create(entityId);

  return entityId;
};

FactoryDefinition.prototype.compile = function FactoryDefinitionCompile(source) {
  var definition = 'return ' + this.name + 'Definition(entityId) {',
    i, path, key;

  if ('extends' in source) {
    for (i = source.extends.length; i >= 0; i -= 1) {
      definition += 'factory(' + source.extends[i] + ').definition(entityId)';
    }
  }

  if ('components' in source) {
    for (i = source.components.length; i >= 0; i -= 1) {
      definition += 'component(' + source.components[i] + ').add(entityId);';
    }
  }

  if ('defaults' in source) {
    for (path in source.defaults) {
      definition += 'set(entityId, "' + path + '", ' + source.defaults[path] + ');';
    }
  }

  definition += '}';

  this.definition = new Function('component, set', definition)(component, set);

  return this;
};

function set(entityId, path, value) {}
