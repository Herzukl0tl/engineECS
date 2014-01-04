function ComponentDefinition(name, definition) {
  this.name = name;
  this.definition = definition;

  this._instances = Object.create(null);
}

ComponentDefinition.prototype.of = function ComponentDefinitionOf(entity, options) {
  var component = this._instances[entity];

  if (arguments.length === 2) {
    if (component === undefined) {
      if (options.required) throw new Error();
      else if (options.add) component = this.add(entity);
    }
  }

  return component || null;
};

ComponentDefinition.prototype.in = function ComponentDefinitionIn(entity) {
  return entity in this._instances;
};

ComponentDefinition.prototype.add = function ComponentDefinitionAdd(entity) {
  if (this.in(entity)) throw new Error();

  var component = this.definition.apply(this, arguments);

  this._instances[entity] = component;

  return component;
};

ComponentDefinition.prototype.remove = function ComponentDefinitionRemove(entity) {
  if (!this.in(entity)) return false;

  delete this._instances[entity];

  return true;
};

ComponentDefinition.prototype.share = function ComponentDefinitionShare(source, dest) {
  if (!this.in(source)) return null;

  var component = this.of(source);

  if (Array.isArray(dest)) {
    for (var i = dest.length - 1; i >= 0; i -= 1) {
      this._instances[dest[i]] = component;
    }
  } else {
    this._instances[dest] = component;
  }

  return component;
};
