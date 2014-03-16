'use strict';

var EventEmitter = require('../../../../lib/js/events-emitter.min'),
  SceneDefinition = require('./definition'),
  entityList = Object.create(null);


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

scene.define = function sceneDefine(name, definition) {
  if (name in scene._definitions) {
    throw new Error();
  }

  var sceneDefinition = new SceneDefinition(name, definition);

  scene._definitions[name] = sceneDefinition;

  return sceneDefinition;
};

scene.of = function sceneOf(id) {
  if (entityList[id]) return entityList[id];

  throw new Error();
};

module.exports = scene;
