'use strict';

var registry;

registry = require('./nuclear.registry');

function nuclearSystem(name) {
  return registry.system(name);
}

module.exports = nuclearSystem;
