'use strict';

var EventEmitter = require('../../../../lib/js/events-emitter.min'),
  EntityDefinition = require('./definition'),
  nextEntityId = 0,
  entityList = Object.create(null);


function entity(name) {
  if (name in entity._definitions) {
    return entity._definitions[name];
  }

  throw new Error();
}

EventEmitter.mixins(entity);

entity.on('create new entity', function (id, factory) {
  entityList[id] = factory;
});

entity._definitions = Object.create(null);

entity.next = function entityNext() {
  return (nextEntityId += 1);
};

entity.define = function entityDefine(name, source) {
  if (name in entity._definitions) {
    throw new Error();
  }

  var entityDefinition = new EntityDefinition(name, source);

  entity._definitions[name] = entityDefinition;

  return entityDefinition;
};

entity.serialize = function entitySerialize(id) {
  var factory = entityList[id];
  return entity(factory).serialize(id);
};

entity.unSerialize = function entityUnSerialize(serialized) {
  var data = JSON.parse(serialized);
  var factory = data.factory;

  return entity(factory).unSerialize(data);
};

module.exports = entity;
