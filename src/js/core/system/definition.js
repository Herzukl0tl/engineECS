'use strict';

var component = require('../component/index');

function SystemDefinition(name, definition, components, context) {
  this.name = name;
  this.definition = definition;
  this.components = components;
  this.context = context || this;

  this.entities = [];
  this.componentPacks = [];

  systemListenComponents(this, components);
}

SystemDefinition.prototype.add = function SystemDefinitionAdd(entity) {
  if (this.entities.indexOf(entity) > -1) return false;

  var componentPack = this.check(entity);
  if (!componentPack) return false;

  this.entities.push(entity);
  this.componentPacks.push(componentPack);

  return this;
};

SystemDefinition.prototype.remove = function SystemDefinitionRemove(entity) {
  var index = this.entities.indexOf(entity);

  if (index < 0) return false;

  this.entities.splice(index, 1);
  this.componentPack.splice(index, 1);

  return this;
};

SystemDefinition.prototype.check = function SystemDefinitionCheck(entity) {
  var componentPack = Object.create(null);
  for (var i = this.components.length - 1; i >= 0; i--) {
    var comp = component(this.components[i]).of(entity);
    if (comp === undefined) return false;
    componentPack[this.components[i]] = comp;
  }

  return componentPack;
};

SystemDefinition.prototype.run = function SystemDefinitionRun(entity, componentPack) {
  if (arguments.length === 2) {
    window.system.trigger('before:' + this.name, entity, componentPack);
    systemDefinitionRunEntity(this, entity, componentPack);
    window.system.trigger('after:' + this.name, entity, componentPack);
  } else {
    window.system.trigger('before:' + this.name, this.entities, this.componentPacks);
    var length = this.entities.length;
    for (var i = 0; i < length; i++) {
      systemDefinitionRunEntity(this, this.entities[i], this.componentPacks[i]);
    }
    window.system.trigger('after:' + this.name, this.entities, this.componentPacks);
  }
};

function systemDefinitionRunEntity(self, entity, componentPack) {
  var components = Object.create(null);

  for (var i = self.components.length - 1; i >= 0; i--) {
    components[self.components[i]] = componentPack[self.components[i]];
  }

  self.definition.call(components, entity);
}

function systemListenComponents(self, components) {
  for (var i = 0; i < components.length; i++) {
    component.on('create:' + components[i], self.add, self);
    component.on('remove:' + components[i], self.remove, self);
  }
}

module.exports = SystemDefinition;
