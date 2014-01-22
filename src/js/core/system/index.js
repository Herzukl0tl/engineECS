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

/**
 * Function which check if the entity parameter is valid for this system
 *
 * If No : return false
 *
 * If Yes : add the entity to the entities list of the system, and return true
 *
 * @param {number} entity The entity to add
 */
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

system.priority = function systemPriority(name, prio) {
  if (arguments.length === 1) {
    return system(name)._priority;
  }

  system(name)._priority = prio;
  system._list.sort(systemsPriorityComparator);
};

function systemsPriorityComparator(a, b) {
  return a._priority - b._priority;
}

system.run = function systemRun() {
  for (var x = 0; x < system._listLength; x++) {
    system(system._list[x]).run();
  }
};

module.exports = system;
