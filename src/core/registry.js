'use strict';

var resolver;

resolver = require('./resolver');

function Registry() {
  this.modules = Object.create(null);
  this.components = Object.create(null);
  this.entities = Object.create(null);
  this.systems = Object.create(null);

  this._systemList = [];
  this._systemLength = 0;
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
      if(storage === 'systems'){
        this._systemList.push(key +' from '+module.name);
        ++this._systemLength;
      }
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
  var component, moduleName;

  component = this.components[name];

  if (component) return component;

  if ((moduleName = resolver.module(name))) {
    return this.module(moduleName).component(resolver.name(name));
  }

  throw new Error();
};

Registry.prototype.entity = function registryEntity(name) {
  var entity, moduleName;

  entity = this.entities[name];

  if (entity) return entity;

  if ((moduleName = resolver.module(name))) {
    return this.module(moduleName).entity(resolver.name(name));
  }

  throw new Error();
};

Registry.prototype.system = function registrySystem(name) {
  var system, moduleName;

  system = this.systems[name];

  if (system) return system;
  
  if ((moduleName = resolver.module(name))) {
    return this.module(moduleName).system(resolver.name(name));
  }

  throw new Error();
};

module.exports = Registry;
