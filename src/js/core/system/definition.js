'use strict';

var system;
var component = require('../component');
var privates = Object.create(null);

function SystemDefinition(name, components, definition) {
  this.name = name;
  this.definition = definition;
  this.components = components;

  this._context = Object.create(null);

  this.entities = [];
  this._deferredEntities = [];
  this._componentPacks = Object.create(null);
  this._removeEntities = Object.create(null);

  this._priority = 0;

  systemListenComponents(this, components);

  if (system === undefined) system = require('../system');
}

SystemDefinition.prototype.add = function SystemDefinitionAdd(entity) {
  if (this.entities.indexOf(entity) > -1) return false;

  var componentPack = this.check(entity);
  if (componentPack === null) return false;

  this.entities.push(entity);
  this._componentPacks[entity] = componentPack;

  return true;
};

SystemDefinition.prototype.remove = function SystemDefinitionRemove(entity) {
  var index = this.entities.indexOf(entity);

  if (index < 0) return false;

  this.entities.splice(index, 1);
  delete this._componentPacks[entity];

  return true;
};

SystemDefinition.prototype.check = function SystemDefinitionCheck(entity) {
  var componentPack = Object.create(null);
  for (var i = this.components.length - 1; i >= 0; i--) {
    var comp = component(this.components[i]).of(entity);
    if (comp === undefined) return null;
    componentPack[this.components[i]] = comp;
  }

  return componentPack;
};

SystemDefinition.prototype.run = function SystemDefinitionRun(entity, componentPack) {
  systemParseDeferred(this);

  if (arguments.length === 2) {
    system.trigger('before:' + this.name, entity, componentPack);

    systemDefinitionRunEntity(this, entity, componentPack);

    system.trigger('after:' + this.name, entity, componentPack);
  } else {
    system.trigger('before:' + this.name, this.entities, this._componentPacks);

    if (this._autosortComparator !== null) {
      this.entities.sort(this._autosortComparator);
    }

    var length = this.entities.length;

    for (var i = 0; i < length; i++) {
      systemDefinitionRunEntity(this, this.entities[i], this._componentPacks[this.entities[i]]);
    }

    system.trigger('after:' + this.name, this.entities, this._componentPacks);
  }

  return this;
};

SystemDefinition.prototype.sort = function SystemDefinitionSort(comparator) {
  this.entities.sort(comparator);

  return this;
};

SystemDefinition.prototype.autosort = function SystemDefinitionAutoSort(comparator) {
  if (arguments.length === 0) {
    return this._autosortComparator;
  }

  if (typeof comparator === 'function' || comparator === null) {
    this._autosortComparator = comparator;

    return this;
  }

  throw new Error();
}

SystemDefinition.prototype.refresh = function SystemDefinitionRefresh() {
  systemParseDeferred(this);
};

function systemDefinitionRunEntity(self, entity, componentPack) {
  var context = self._context,
    components = self.components;

  for (var i = components.length - 1; i >= 0; i--) {
    context[components[i]] = componentPack[components[i]];
  }

  self.definition.call(context, entity);
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

privates.addToDeferred = function systemAddToDeferred(entity, componentName) {
  this._deferredEntities.push(entity);
  if (componentName !== undefined) this._removeEntities[entity] = componentName;
};

function systemListenComponents(self, components) {
  for (var i = 0; i < components.length; i++) {
    component.on('add:' + components[i], privates.addToDeferred, self);
    component.on('remove:' + components[i], privates.addToDeferred, self);
  }
}

module.exports = SystemDefinition;
