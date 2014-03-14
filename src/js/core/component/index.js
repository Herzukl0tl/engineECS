'use strict';

var EventEmitter = require('../../../../lib/js/events-emitter.min'),
  ComponentDefinition = require('./definition'),
  entityList = Object.create(null),
  eventsOptions = {};


function component(name) {
  if (name in component._definitions) {
    return component._definitions[name];
  }

  throw new Error();
}

EventEmitter.mixins(component);

component._definitions = Object.create(null);

component.define = function componentDefine(name, definition) {
  if (name in component._definitions) {
    throw new Error();
  }

  var componentDefinition = new ComponentDefinition(name, definition),
    options = eventsOptions;

  options.context = componentDefinition;
  component._definitions[name] = componentDefinition;

  component.on('add:' + name, linkComponent, options);

  component.on('remove:' + name, unLinkComponent, options);

  return componentDefinition;
};

component.of = function componentOf(id) {
  if (entityList[id]) return entityList[id];

  throw new Error();
};

function linkComponent(id, name) {
  var components = entityList[id] || [];
  components.push(name);
  entityList[id] = components;
}

function unLinkComponent(id, name) {
  var components = component.of(id);
  var index = components.indexOf(name);

  components.splice(index, 1);
}
module.exports = component;
