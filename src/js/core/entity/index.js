'use strict';

var EventEmitter = require('../../../../lib/js/events-emitter.min'),
  EntityDefinition = require('./definition'),
  component = require('../component'),
  nextEntityId = 0,
  entityList = Object.create(null);

/**
 * The entity method which contains all entities definitions
 * This is also the entity definition getter (throws an error if the EntityDefinition doesn't exist)
 * @param  {string} name The EntityDefinition name
 * @return {object}      The selected EntityDefinition
 */
function entity(name) {
  if (name in entity._definitions) {
    return entity._definitions[name];
  }

  throw new Error();
}

EventEmitter.mixins(entity);

entity.on('create_entity', function (id, factory) {
  entityList[id] = factory;
});

entity._definitions = Object.create(null);

/**
 * Get the nex entity id
 * @return {number} The next entity id
 */
entity.next = function entityNext() {
  return (nextEntityId += 1);
};

/**
 * Define an EntityDefinition
 * @param  {string} name   The EntityDefinition name
 * @param  {object} source The EntityDefinition config
 * @return {EntityDefinition}        The defined EntityDefinition
 */
entity.define = function entityDefine(name, source) {
  if (name in entity._definitions) {
    throw new Error();
  }

  var entityDefinition = new EntityDefinition(name, source);

  entity._definitions[name] = entityDefinition;

  return entityDefinition;
};

/**
 * Serialize the selected entity
 * @param  {number} id The selected entity
 * @return {string}    The serialized entity
 */
entity.serialize = function entitySerialize(id) {
  var factory = entity.factory(id);
  return entity(factory).serialize(id);
};

/**
 * Deserialize a serialized entity
 * @param  {string} serialized The serialized entity
 * @return {number}            The created entity id
 */
entity.deSerialize = function entityDeSerialize(serialized) {
  var data = JSON.parse(serialized);
  var factory = data.factory;

  return entity(factory).deSerialize(data);
};

/**
 * Get the selected entity EntityDefinition
 * @param  {number} id The selected entity
 * @return {EntityDefinition}    The selected entity EntityDefinition
 */
entity.factory = function entityGetFactory(id) {
  if (entityList[id]) return entityList[id];

  throw new Error();
};

/**
 * Remove the selected entity and its components
 * @param  {number} id The selected entity
 * @return {boolean}    Return true
 */
entity.remove = function entityRemove(id) {
  var components = component.of(id);
  var factory = entity(entity.factory(id));

  for (var i = components.length - 1; i >= 0; i -= 1) {
    component(components[i]).remove(id);
  }

  for (var j = factory._entities.length - 1; j >= 0; j -= 1) {
    if (id === factory._entities[j]) {
      factory._entities.splice(j, 1);
      break;
    }
  }

  entity.trigger('remove:' + factory.name, id);
  delete entityList[id];
  return true;
};

module.exports = entity;
