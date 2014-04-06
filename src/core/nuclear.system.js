'use strict';

var registry = require('./nuclear.registry'),
    nuclearEvents = require('./nuclear.events');

/**
 * The nuclearSystem method which contains all nuclearSystem definitions
 * This is also the nuclearSystem definition getter (throws an error if the System doesn't exist)
 * @param  {string} name The System name
 * @return {object}      The selected System
 */
function nuclearSystem(name) {
  return registry.entity(name);
}

/**
 * Define the run priority of the selected nuclearSystem
 * @param  {string} name The selected System name
 * @param  {number} prio The priority of the nuclearSystem
 */
nuclearSystem.priority = function nuclearSystemPriority(name, prio) {
  if (arguments.length === 1) {
    return nuclearSystem(name)._priority;
  }

  nuclearSystem(name)._priority = prio;
  registry.systems.sort(nuclearSystemsPriorityComparator);
};

function nuclearSystemsPriorityComparator(a, b) {
  return a._priority - b._priority;
}

/**
 * Run all the nuclearSystem list
 */
nuclearSystem.run = function nuclearSystemRun() {
  nuclearEvents.trigger('system:before_running', nuclearSystem._list);
  var x;
  
  for (x = 0; x < registry.systems.length; x++) {
    nuclearSystem(registry.systems[x]).run();
  }
  nuclearEvents.trigger('system:after_running', nuclearSystem._list);
};

/**
 * Disable a nuclearSystem in the nuclearSystem list
 * @param  {string} name The System name
 */
nuclearSystem.disable = function nuclearSystemDisable(name) {
  var index = registry.systems.indexOf(name);
  registry.systems.splice(index, 1);
};

module.exports = nuclearSystem;
