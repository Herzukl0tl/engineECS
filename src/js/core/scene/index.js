'use strict';

var EventEmitter = require('../../../../lib/js/events-emitter.min'),
  SceneDefinition = require('./definition'),
  entityList = Object.create(null);

/**
 * The scene method which contains all scenes definitions
 * This is also the scene definition getter (throws an error if the SceneDefinition doesn't exist)
 * @param  {string} name The SceneDefinition name
 * @return {object}      The selected SceneDefinition
 */
function scene(name) {
  if (name in scene._definitions) {
    return scene._definitions[name];
  }

  throw new Error();
}

EventEmitter.mixins(scene);

scene.on('add_entity', function (id, name) {
  entityList[id] = name;
});

scene._definitions = Object.create(null);

/**
 * Define an SceneDefinition
 * @param  {string} name   The SceneDefinition name
 * @param  {object} source The SceneDefinition definition
 * @return {SceneDefinition}        The defined SceneDefinition
 */
scene.define = function sceneDefine(name, definition) {
  if (name in scene._definitions) {
    throw new Error();
  }

  var sceneDefinition = new SceneDefinition(name, definition);

  scene._definitions[name] = sceneDefinition;

  return sceneDefinition;
};

/**
 * Get the scene of the selected entity
 * @param  {number} id The selected entity
 * @return {SceneDefinition}    The SceneDefinition of the selected entity
 */
scene.of = function sceneOf(id) {
  if (entityList[id]) return entityList[id];

  throw new Error();
};

module.exports = scene;
