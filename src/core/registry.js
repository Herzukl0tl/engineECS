'use strict';

var rExplicitModuleNotation;

rExplicitModuleNotation = /([^\s]+)\s+from\s+([^\s]+)/;

function Registry() {
  this.modules = Object.create(null);
  this.components = Object.create(null);
  this.entities = Object.create(null);
  this.systems = Object.create(null);
}

Registry.prototype.import = function registryImport(module) {
  var length, i, storages, storage, source, dest, key;

  if (module.name in this.modules) return;

  length = module.requires.length;

  for (i = 0; i < length; i += 1) {
    if (!(module.requires[i] in this.modules)) {
      throw new Error();
    }
  }

  this.modules[module.name] = module;

  storages = ['components', 'entities', 'systems'];

  for (i = 0; (storage = storages[i]); i += 1) {
    source = module[storage];
    dest = this[storage];

    for (key in source) {
      dest[key] = source[key];
    }
  }
};

Registry.prototype.clear = function registryClear() {
  var storages, i, storage, source, key;

  storages = ['modules', 'components', 'entities', 'systems'];

  for (i = 0; (storage = storages[i]); i += 1) {
    source = this[storage];

    for (key in source) {
      delete source[key];
    }
  }
};

Registry.prototype.module = function registryModule(name) {
  var module;

  module = this.modules[name];

  if (module) return module;

  throw new Error();
};

Registry.prototype.component = function registryComponent(name) {
  var component;

  if (rExplicitModuleNotation.test(name)) {
    return this.module(RegExp.$2).component(RegExp.$1);
  }

  component = this.components[name];

  if (component) return component;

  throw new Error();
};

Registry.prototype.entity = function registryEntity(name) {
  var entity;

  if (rExplicitModuleNotation.test(name)) {
    return this.module(RegExp.$2).entity(RegExp.$1);
  }

  entity = this.entities[name];

  if (entity) return entity;

  throw new Error();
};

Registry.prototype.system = function registrySystem(name) {
  var system;

  if (rExplicitModuleNotation.test(name)) {
    return this.module(RegExp.$2).system(RegExp.$1);
  }

  system = this.systems[name];

  if (system) return system;

  throw new Error();
};

module.exports = Registry;
