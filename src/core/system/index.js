'use strict';

var EventEmitter = require('../../../lib/events-emitter.min');
var SystemDefinition = require('./definition');

/**
 * The system method which contains all system definitions
 * This is also the system definition getter (throws an error if the SystemDefinition doesn't exist)
 * @param  {string} name The SystemDefinition name
 * @return {object}      The selected SystemDefinition
 */
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
 * Define a SystemDefinition
 * @param {string} name       The SystemDefinition name
 * @param {array} components The SystemDefinition required components
 * @param {function} definition The SystemDefinition definition
 * @param {object} options    The SystemDefinition options
 * @return {SystemDefinition}        The defined SystemDefinition
 */
system.define = function systemDefine(name, definition, components, options) {
  if (name in system._definitions) {
    throw new Error();
  }

  var systemDefinition = new SystemDefinition(name, definition, components, options);

  system._definitions[name] = systemDefinition;
  system._list.push(name);
  system._listLength++;

  return systemDefinition;
};

/**
 * Define the run priority of the selected system
 * @param  {string} name The selected SystemDefinition name
 * @param  {number} prio The priority of the system
 */
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

/**
 * Run all the system list
 */
system.run = function systemRun() {
  system.trigger('before running', system._list);
  for (var x = 0; x < system._listLength; x++) {
    system(system._list[x]).run();
  }
  system.trigger('after running', system._list);
};

/**
 * Disable a system in the system list
 * @param  {string} name The SystemDefinition name
 */
system.disable = function systemDisable(name) {
  var index = system._list.indexOf(name);
  system._list.splice(index, 1);
  system._listLength--;
};

module.exports = system;
