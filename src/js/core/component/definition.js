'use strict';
var cmp;

function ComponentDefinition(name, definition) {
  this.name = name;
  this.definition = definition;

  this._components = Object.create(null);
  this._disabledComponents = Object.create(null);

  if (cmp === undefined) cmp = require('../component');
}


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

ComponentDefinition.prototype. in = function ComponentDefinitionIn(entity) {
  return entity in this._components || entity in this._disabledComponents;
};

ComponentDefinition.prototype.add = function ComponentDefinitionAdd(entity) {
  if (this. in (entity)) throw new Error();

  var component = this.definition.apply(this, arguments);

  this._components[entity] = component;

  cmp.trigger('add:' + this.name, entity, this.name);

  return component;
};

ComponentDefinition.prototype.remove = function ComponentDefinitionRemove(entity) {
  if (!this. in (entity)) return false;

  delete this._components[entity];
  delete this._disabledComponents[entity];

  cmp.trigger('remove:' + this.name, entity, this.name);
  return true;
};

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

ComponentDefinition.prototype.disable = function ComponentDefinitionDisable(id) {
  if (id in this._components) {
    this._disabledComponents[id] = this._components[id];
    delete this._components[id];

    cmp.trigger('disable:' + this.name, id, this.name);
    return true;
  }
  return false;
};

ComponentDefinition.prototype.enable = function ComponentDefinitionEnable(id) {
  if (id in this._disabledComponents) {
    this._components[id] = this._disabledComponents[id];
    delete this._disabledComponents[id];

    cmp.trigger('enable:' + this.name, id, this.name);
    return true;
  }
  return false;
};

ComponentDefinition.prototype.isEnabled = function ComponentDefinitionIsEnabled(id) {
  if (this. in (id)) {
    if (id in this._components) return true;
    return false;
  }

  throw new Error();
};

module.exports = ComponentDefinition;
