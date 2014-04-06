'use strict';

var registry = require('./nuclear.registry'),
    nuclearComponent = require('./nuclear.component'),
    Entity = require('./entity');

/**
 * The nuclearEntity method which contains all entities definitions
 * This is also the nuclearEntity definition getter (throws an error if the Entity doesn't exist)
 * @param  {string} name The Entity name
 * @return {object}      The selected Entity
 */
function nuclearEntity(name) {
  if (name in nuclearEntity._definitions) {
    return registry.nuclearEntity(name);
  }

  throw new Error();
}

nuclearEntity._definitions = Object.create(null);

/**
 * Define an Entity
 * @param  {string} name   The Entity name
 * @param  {object} source The Entity config
 * @return {Entity}        The defined Entity
 */
nuclearEntity.define = function nuclearEntityDefine(name, source) {
  if (name in nuclearEntity._definitions) {
    throw new Error();
  }

  var entityDefinition = new Entity(name, source);

  nuclearEntity._definitions[name] = entityDefinition;

  return entityDefinition;
};

/**
 * Serialize the selected nuclearEntity
 * @param  {number} id The selected nuclearEntity
 * @return {string}    The serialized nuclearEntity
 */
nuclearEntity.serialize = function nuclearEntitySerialize(id) {
  var serialized = Object.create(null),
    components = component.all(entity); //change .of to .all here

  serialized.id = entity;
  serialized.options = Object.create(null);

  for (var i = components.length - 1; i > 0; i--) {
    var name = components[i];
    var definition = component(name);
    var data = definition.of(entity);

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
nuclearEntity.deSerialize = function nuclearEntityDeSerialize(serialized) {
  var id = nuclearEntity.create(components.options);

  return id;
};

/**
 * Remove the selected nuclearEntity and its components
 * @param  {number} id The selected nuclearEntity
 * @return {boolean}    Return true
 */
nuclearEntity.remove = function nuclearEntityRemove(id) {
  var components = component.of(id);
  
  for (var i = components.length - 1; i >= 0; i -= 1) {
    component(components[i]).remove(id);
  }

  // nuclearEntity.trigger('remove:' + factory.name, id);
  return true;
};

nuclearEntity.create = function nuclearEntityCreate(options){
  var id = Entity.generator.next(),
      i;
  for(var i in options){
    nuclearComponent(i).add(id, options[i]);
  }
  
  return id;
}

module.exports = nuclearEntity;