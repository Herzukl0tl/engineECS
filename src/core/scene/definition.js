'use strict';
var entity = require('../entity'),
  privates = Object.create(null),
  currentIndex = 0,
  scene;

/**
 * The SceneDefinition constructor
 * @param {string} name       The SceneDefinition name
 * @param {function} definition The SceneDefinition definition
 */
function SceneDefinition(name, definition) {
  this.name = name;
  this.definition = definition;
  this._context = Object.create(null);
  this._entities = Object.create(null);
  this._eventObject = Object.create(null);
  this.currentIndex = currentIndex;

  if (scene === undefined) scene = require('../scene');
}

/**
 * Run the SceneDefinition definition with the given context
 * @param  {object} context The context to give to the scene
 */
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

/**
 * Destroy all the entities binded to this SceneDefinition
 */
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
