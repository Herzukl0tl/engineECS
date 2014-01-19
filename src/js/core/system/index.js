'use strict';

var EventEmitter = require('../../../../lib/js/events-emitter.min');
var SystemDefinition = require('./definition');

function system(name) {
  if (name in system._definitions) {
    return system._definitions[name];
  }

  throw new Error();
}

EventEmitter.mixins(system);

system._definitions = Object.create(null);

system._list = [];

system._listLength = 0;


system.define = function systemDefine(name, definition, components, context) {
  if (name in system._definitions) {
    throw new Error();
  }

  var systemDefinition = new SystemDefinition(name, definition, components, context);

  system._definitions[name] = systemDefinition;
  system._list.push(name);
  system._listLength++;

  return systemDefinition;
};

system.order = function systemOrder(newList) {
  if (Array.isArray(newList)) system._list = newList;

  system._listLength = system._list.length;

  return system._list;
};

system.run = function systemRun() {
  for (var x = 0; x < system._listLength; x++) {
    system(system._list[x]).run();
  }
};

module.exports = system;
