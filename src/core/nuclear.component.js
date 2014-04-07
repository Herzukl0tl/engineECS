'use strict';

var registry = require('./nuclear.registry'),
    nuclearEvents = require('./nuclear.events'),
    entityList = Object.create(null);

/**
 * The nuclearComponent method which contains all Component definition
 * This is also the nuclearComponents definition getter (throws an error if the Component doesn't exist)
 * @param  {string} name The Component name
 * @return {object}      The selected Component
 */
function nuclearComponent(name) {
  return registry.component(name);
}

/**
 * Get all the selected entity nuclearComponents
 * @param  {number} id The selected entity
 * @return {array}    A simple string array containing all the nuclearComponents names of the selected entity
 */
nuclearComponent.all = function nuclearComponentOf(id) {
  if (entityList[id]) return entityList[id];

  throw new Error();
};

function linkComponent(id, name) {
  var components = entityList[id] || [];
  components.push(name);
  entityList[id] = components;
}

function unLinkComponent(id, name) {
  var components = nuclearComponent.all(id);
  var index = components.indexOf(name);

  components.splice(index, 1);
}

nuclearEvents.on('component:add', linkComponent);
nuclearEvents.on('component:remove', unLinkComponent);

module.exports = nuclearComponent;