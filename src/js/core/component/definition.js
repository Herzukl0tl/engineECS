'use strict';
var cmp;

function ComponentDefinition(name, definition) {
  this.name = name;
  this.definition = definition;

  this._components = Object.create(null);

  if (cmp === undefined) cmp = require('../component');
}


ComponentDefinition.prototype.of = function ComponentDefinitionOf(entity, options) {
  var component = this._components[entity];

  if (arguments.length === 2) {
    if (!this. in (entity)) {
      if (options.required) throw new Error();
      else if (options.add) component = this.add(entity);
    }
  }

  return component;
};

ComponentDefinition.prototype. in = function ComponentDefinitionIn(entity) {
  return entity in this._components;
};

ComponentDefinition.prototype.add = function ComponentDefinitionAdd(entity) {
  if (this. in (entity)) throw new Error();

  var component = this.definition.apply(this, arguments);

  this._components[entity] = component;

  cmp.trigger('create:' + this.name, entity);
  return component;
};

ComponentDefinition.prototype.remove = function ComponentDefinitionRemove(entity) {
  if (!this. in (entity)) return false;

  delete this._components[entity];

  cmp.trigger('remove:' + this.name, entity);
  return true;
};

ComponentDefinition.prototype.share = function ComponentDefinitionShare(source, dest) {
  if (!this. in (source)) return null;

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
