'use strict';

var registry;

registry = require('./nuclear.registry');

function nuclearComponent(name) {
  return registry.component(name);
}

module.exports = nuclearComponent;
