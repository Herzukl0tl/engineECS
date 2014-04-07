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
  return registry.system(name);
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
  registry._systemList.sort(nuclearSystemsPriorityComparator);
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
  for (x = 0; x < registry._systemLength; x++) {
    nuclearSystem(registry._systemList[x]).run();
  }
  nuclearEvents.trigger('system:after_running', registry._systemList);
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
