'use strict';

var Component, Entity, System;

Component = require('./component');
Entity = require('./entity');
System = require('./system');

function Module(name, deps) {
  this.name = name.trim();
  this.requires = deps;

  this.exports = Object.create(null);

  this._config = Object.create(null);

  this._components = Object.create(null);
  this._entities = Object.create(null);
  this._systems = Object.create(null);
}

Module.prototype.components = function moduleComponents() {
  return Object.keys(this._components);
};

Module.prototype.entities = function moduleEntities() {
  return Object.keys(this._entities);
};

Module.prototype.systems = function moduleSystems() {
  return Object.keys(this._systems);
};

Module.prototype.config = function moduleConfig(options) {
  var key;

  if (arguments.length === 0) {
    return this._config;
  }

  for (key in options) {
    this._config[key] = options[key];
  }

  return this;
};

Module.prototype.component = function moduleComponent(name, factory) {
  var component;

  if (arguments.length === 1) {
    component = this._components[name];

    if (component) return component;

    throw new Error();
  }

  if (name in this.exports) {
    throw new Error();
  }

  this.exports[name] = this._components[name] = new Component(name, factory);

  return this;
};

Module.prototype.entity = function moduleEntity(name, factory) {
  var entity;

  if (arguments.length === 1) {
    entity = this._entities[name];

    if (entity) return entity;

    throw new Error();
  }

  if (name in this.exports) {
    throw new Error();
  }

  this.exports[name] = this._entities[name] = new Entity(name, factory);

  return this;
};

Module.prototype.system = function moduleSystem(name, components) {
  var system;

  if (arguments.length === 1) {
    system = this._systems[name];

    if (system) return system;

    throw new Error();
  }

  if (name in this.exports) {
    throw new Error();
  }

  this.exports[name] = this._systems[name] = new System(name, components);

  return this;
};

module.exports = Module;
