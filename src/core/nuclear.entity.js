'use strict';

var registry;

registry = require('./nuclear.registry');

function nuclearEntity(name) {
  return registry.entity(name);
}

module.exports = nuclearEntity;
