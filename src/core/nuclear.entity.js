'use strict';

var registry = require('./nuclear.registry'),
    nuclearComponent = require('./nuclear.component'),
    Entity = require('./entity'),
    emitter = require('./nuclear.events');

/**
 * The nuclearEntity method which contains all entities definitions
 * This is also the nuclearEntity definition getter (throws an error if the Entity doesn't exist)
 * @param  {string} name The Entity name
 * @return {object}      The selected Entity
 */
function nuclearEntity(name) {
  return registry.entity(name);
}

/**
 * Serialize the selected nuclearEntity
 * @param  {number} id The selected nuclearEntity
 * @return {string}    The serialized nuclearEntity
 */
nuclearEntity.serialize = function nuclearEntitySerialize(id) {
  var serialized = Object.create(null),
    components = nuclearComponent.all(id); //change .of to .all here

  serialized.id = id;
  serialized.options = Object.create(null);

  for (var i = components.length - 1; i > 0; i--) {
    var name = components[i];
    var definition = nuclearComponent(name);
    var data = definition.of(id);

    if (typeof data.toJSON === 'function') data = data.toJSON();
    serialized.options[name] = data;
  }

  return JSON.stringify(serialized);
};

/**
 * Deserialize a serialized nuclearEntity
 * @param  {string} serialized The serialized nuclearEntity
 * @return {number}            The created nuclearEntity id
 */
nuclearEntity.deserialize = function nuclearEntityDeserialize(serialized) {
  serialized = JSON.parse(serialized);
  var id = nuclearEntity.create(serialized.options);

  return id;
};

/**
 * Remove the selected nuclearEntity and its components
 * @param  {number} id The selected nuclearEntity
 * @return {boolean}    Return true
 */
nuclearEntity.remove = function nuclearEntityRemove(id) {
  var components = nuclearComponent.of(id);

  for (var i = components.length - 1; i >= 0; i -= 1) {
    nuclearComponent(components[i]).remove(id);
  }

  emitter.trigger('entity:remove:' + factory.name, id);
  return true;
};

nuclearEntity.create = function nuclearEntityCreate(options){
  var id = Entity.next(),
      i;
  for(i in options){
    nuclearComponent(i).add(id, options[i]);
  }

  return id;
};

module.exports = nuclearEntity;
