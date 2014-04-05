'use strict';

var Component, Entity, System, rExplicitModuleNotation;

Component = require('./component');
Entity = require('./entity');
System = require('./system');

rExplicitModuleNotation = /([^\s]+)\s+from\s+([^\s]+)/;

function Registry() {
  this._modules = Object.create(null);
  this._components = Object.create(null);
  this._entities = Object.create(null);
  this._systems = Object.create(null);
}

Registry.prototype.components = function registryComponents() {
  return Object.keys(this._components);
};

Registry.prototype.entities = function registryEntities() {
  return Object.keys(this._entities);
};

Registry.prototype.systems = function registrySystems() {
  return Object.keys(this._systems);
};

Registry.prototype.import = function registryImport(module) {
  var i, length, key, value;

  if (module.name in this._modules) return;

  length = module.requires.length;

  for (i = 0; i < length; i += 1) {
    if (!(module.requires[i] in this._modules)) {
      throw new Error();
    }
  }

  this._modules[module.name] = module;

  for (key in module.exports) {
    value = module.exports[key];

    if (value instanceof Component) {
      this._components[key] = value;
    } else if (value instanceof Entity) {
      this._entities[key] = value;
    } else if (value instanceof System) {
      this._systems[key] = value;
    }
  }
};

Registry.prototype.clear = function registryClear() {
  this._modules = Object.create(null);
  this._components = Object.create(null);
  this._entities = Object.create(null);
  this._systems = Object.create(null);
};

Registry.prototype.module = function registryModule(name) {
  var module;

  module = this._modules[name];

  if (module) return module;

  throw new Error();
};

Registry.prototype.component = function registryComponent(name) {
  var component;

  if (rExplicitModuleNotation.test(name)) {
    return this.module(RegExp.$2).component(RegExp.$1);
  }

  component = this._components[name];

  if (component) return component;

  throw new Error();
};

Registry.prototype.entity = function registryEntity(name) {
  var entity;

  if (rExplicitModuleNotation.test(name)) {
    return this.module(RegExp.$2).entity(RegExp.$1);
  }

  entity = this._entities[name];

  if (entity) return entity;

  throw new Error();
};

Registry.prototype.system = function registrySystem(name) {
  var system;

  if (rExplicitModuleNotation.test(name)) {
    return this.module(RegExp.$2).system(RegExp.$1);
  }

  system = this._systems[name];

  if (system) return system;

  throw new Error();
};

module.exports = Registry;
