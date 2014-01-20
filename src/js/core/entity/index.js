'use strict';

var EventEmitter = require('../../../../lib/js/events-emitter.min'),
  EntityDefinition = require('./definition'),
  nextEntityId = 0;


function entity(name) {
  if (name in entity._definitions) {
    return entity._definitions[name];
  }

  throw new Error();
}

EventEmitter.mixins(entity);

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


module.exports = entity;
