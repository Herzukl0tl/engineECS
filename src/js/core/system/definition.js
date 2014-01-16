'use strict';

var ARRAY = [];


function SystemDefinition(name, definition, components, context) {
  this.name = name;
  this.definition = definition;
  this.components = components;
  this.context = context || this;

  this.entities = [];
  this.componentPacks = [];
}


SystemDefinition.prototype.add = function SystemDefinitionAdd(entity, componentPack) {
  if (typeof componentPack !== 'object') {
    //then compute componentPack with entity
  }

  this.componentPacks.push(componentPack);
  this.entity.push(entity);

  return componentPack;
};

SystemDefinition.prototype.remove = function SystemDefinitionRemove(entity) {
  var index = this.entities.indexOf(entity);

  if (index < 0) return false;

  this.entities.splice(index, 1);
  this.componentPack.splice(index, 1);

  return true;
};

SystemDefinition.prototype.check = function SystemDefinitionCheck(componentPack) {
  if (typeof componentPack !== 'object') {
    //then its an entity, have to compute its componentPack
  }

  for (var i = this.components.length - 1; i > 0; i--) {
    if (componentPack[this.components[i]] === undefined) return false;
  }

  return true;
};

var run = function SystemDefinitionRunEntity(entity, componentPack) {
  var components = ARRAY;

  for (var i = this.components.length - 1; i > 0; i--) {
    components.push(componentPack[this.components[i]]);
  }

  components.push(entity);

  this.definition.apply(this.context, components);

  ARRAY.length = 0;
};

SystemDefinition.prototype.run = function SystemDefinitionRun(entity, componentPack) {
  if (arguments.length === 2) {
    run.call(this, entity, componentPack);
  } else {
    var length = this.entities.length;
    for (var i = 0; i < length; i++) {
      run.call(this, this.entities[i], this.componentPacks[i]);
    }
  }
};


module.exports = SystemDefinition;
