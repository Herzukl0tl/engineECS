'use strict';

var EntityIdGenerator, entityIdGenerator, nuclearEvents;

EntityIdGenerator = require('./entity-id-generator');
entityIdGenerator = new EntityIdGenerator();
nuclearEvents = require('./nuclear.events');

/**
 * The Entity constructor
 * @param {string} name   The Entity name
 * @param {Object} source The Entity config
 */
function Entity(name, definition, moduleName) {
  this.name = name;
  this.definition = definition || function defaultDefinition(){};

  this.moduleName = moduleName;
}

Entity.next = function entityNext() {
  return entityIdGenerator.next();
};

/**
 * Create an entity depending on this Entity
 * @param  {object} options All the components data
 * @return {number}         The created entity
 */
Entity.prototype.create = function entityCreate(options) {
  var id = Entity.next();
  this.definition(id, options);

  nuclearEvents.trigger('entity:create:' + this.identity(), id, this.name, this.moduleName);
  nuclearEvents.trigger('entity:create_entity', id, this.identity(), this.name, this.moduleName);

  return id;
};

/**
 * Enhance an entity with this factory definition
 * @param  {number} entity The entity to enhance
 * @param  {object} data Data to configure components
 * @return {number}            The entity to enhance
 */
Entity.prototype.enhance = function entityEnhance(entity, data) {
  this.definition(entity, data);

  return entity;
};

/**
 * Return the Entity's identity
 * It containes it's name and it's module's name
 * @return {String}    The Entity identity
 */
Entity.prototype.identity = function entityIdentity(){
  return this.name+' from '+this.moduleName;
};

module.exports = Entity;
