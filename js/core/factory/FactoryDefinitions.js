var nextEntityId = 1;

function FactoryDefinition(name, source) {
  this.name = name;

  this._source = source;
  this._components = [];
  this._defaults = Object.create(null);

  this._sourceHasChanged = true;
  this._componentsHaveChanged = true;
  this._defaultsHaveChanged = true;

  this._entities = [];

  this.compile();
}

FactoryDefinition.prototype.create = function FactoryDefinitionCreate(options) {
  var entity = nextEntityId++;

  if (this._sourceHasChanged) {
    this.compile();
  }

  this.definition(entity);

  for (var key in options) {
    if (!(component(key).in(entity))) {
      continue;
    }

    var $0 = component(key).of(entity),
      paths = options[key];

    for (var path in paths) {
      var properties = path.split('.'),
        length = properties.length - 1,
        dest = $0;

      for (var i = 0; i < length; i += 1) {
        dest = dest[properties[i]];
      }

      dest[properties[i]] = paths[path];
    }
  }

  this._entities.push(entity);

  return entity;
};

FactoryDefinition.prototype.source = function FactoryDefinitionSource(value) {
  if (arguments.length === 0) {
    return this._source;
  }

  this._source = value;

  this._sourceHasChanged = true;
  this._componentsHaveChanged = true;
  this._defaultsHaveChanged = true;
};

FactoryDefinition.prototype.components = function FactoryDefinitionComponents() {
  if (this._componentsHaveChanged) {
    this._components.length = 0;

    if ('components' in this._source) {
      this._components.push.apply(this._components, this._source.components);
    }

    if ('extends' in this._source) {
      for (var i = this._source.extends.length - 1; i >= 0; i -= 1) {
        var components = factory(this._source.extends[i]).components();

        outer: for (var j = components.length - 1; j >= 0; j -= 1) {
          for (var k = this._components.length - 1; k >= 0; k -= 1) {
            if (components[j] === this._components[k]) {
              continue outer;
            }
          }

          this._components.push(components[j]);
        }
      }
    }

    this._componentsHaveChanged = false;
  }

  return this._components;
};

FactoryDefinition.prototype.defaults = function FactoryDefinitionDefaults() {
  if (this._defaultsHaveChanged) {
    for (var property in this._defaults) {
      delete this._defaults[key];
    }

    if ('defaults' in this._source) {
      for (var property in this._source.defaults) {
        var paths = defaults[property];

        this._defaults[property] = Object.create(null);

        for (var path in paths) {
          this._defaults[property][path] = paths[path];
        }
      }
    }

    if ('extends' in this._source) {
      for (var i = this._source.extends.length - 1; i >= 0; i -= 1) {
        var defaults = factory(this._source.extends[i]).defaults();

        for (var property in defaults) {
          var paths = defaults[property];

          if (!(property in this._defaults)) {
            this._defaults[property] = Object.create(null);
          }

          for (var path in paths) {
            this._defaults[property][path] = paths[path];
          }
        }
      }
    }

    this._defaultsHaveChanged = false;
  }

  return this._defaults;
};

FactoryDefinition.prototype.compile = function FactoryDefinitionCompile() {
  var head = 'return function ' + this.name + 'Definition($entity) {\n', tail = '}',

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
      tail = '  ' + identifier + '.' + path + ' = ' + paths[path] + ';\n' + tail;
    }
  }

  head += '  var ' + identifiers.join(', ') + ';\n';

  head += '\n';

  for (var i = components.length - 1; i >= 0; i-= 1) {
    head += '  ';

    if (components[i] in scope) {
      head += scope[components[i]] + ' = ';
    }

    head += 'component("' + components[i] + '").add($entity);\n';
  }

  head += '\n';

  this.definition = new Function('component', head + tail)(component);

  this._source = source;

  this._sourceHasChanged = false;
};
