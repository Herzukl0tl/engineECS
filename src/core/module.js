'use strict';

var Component, Entity, System, resolver;

Component = require('./component');
Entity = require('./entity');
System = require('./system');
resolver = require('./resolver');

function Module(name, deps) {
  this.name = name.trim();
  this.requires = deps;

  this.components = Object.create(null);
  this.entities = Object.create(null);
  this.systems = Object.create(null);

  this._config = Object.create(null);
}

Module.prototype.config = function moduleConfig(config) {
  var key, descriptor;

  if (typeof config === 'string') {
    return this._config[key = config];
  }

  for (key in config) {
    descriptor = Object.getOwnPropertyDescriptor(config, key);
    if (descriptor) Object.defineProperty(this._config, key, descriptor);
  }

  return this;
};

Module.prototype.component = function moduleComponent(name, factory) {
  var component;

  if (arguments.length === 1) {
    component = this.components[name];

    if (component) return component;

    throw new Error();
  }

  if (name in this.components) {
    throw new Error();
  }

  this.components[name] = new Component(name, factory, this.name);

  return this;
};

Module.prototype.entity = function moduleEntity(name, factory) {
  var entity;

  if (arguments.length === 1) {
    entity = this.entities[name];

    if (entity) return entity;

    throw new Error();
  }

  if (name in this.entities) {
    throw new Error();
  }

  this.entities[name] = new Entity(name, factory, this.name);

  return this;
};

Module.prototype.system = function moduleSystem(name, components, definition, options) {
  var system, i, length, component;

  if (arguments.length === 1) {
    system = this.systems[name];

    if (system) return system;

    throw new Error();
  }

  if (name in this.systems) {
    throw new Error();
  }

  length = components.length;

  for(i = 0; i < length; i += 1) {
    component = components[i];

    if (resolver.module(component) === '') {
      components[i] = resolver.module(component, this.name);
    }

    console.log('component', components[i]);
  }

  this.systems[name] = new System(name, components, definition, this.name, options);

  return this;
};

module.exports = Module;
