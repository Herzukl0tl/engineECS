'use strict';
var entity = require('../entity'),
  privates = Object.create(null),
  currentIndex = 0,
  scene;

function SceneDefinition(name, definition) {
  this.name = name;
  this.definition = definition;
  this._context = Object.create(null);
  this._entities = Object.create(null);
  this._eventObject = Object.create(null);
  this.currentIndex = currentIndex;

  if (scene === undefined) scene = require('../scene');
}

SceneDefinition.prototype.instanciate = function SceneDefinitionInstantiate(context) {
  this._eventObject.context = this;
  var listener = entity.on('create_entity', privates.addEntity, this._eventObject);

  for (var i in context) {
    this._context[i] = context[i];
  }

  this.currentIndex = ++currentIndex;
  this.definition.apply(this._context);
  this.currentIndex = --currentIndex;

  entity.off(listener);
};

SceneDefinition.prototype.destroy = function SceneDefinitionDestroy() {
  for (var i in this._entities) {
    entity.remove(i);
    delete this._entities[i];
  }
};

privates.addEntity = function SceneDefinitionAddEntity(id) {
  if (this.currentIndex === currentIndex) {
    this._entities[id] = true;
    scene.trigger('add_entity', id, this.name);
  }
};

module.exports = SceneDefinition;
