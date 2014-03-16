'use strict';

var EventsEmitter, Component, Entity, System, rExplicitModule, systemsPriorityComparatorsDescriptor;

EventsEmitter = require('events');
Component = require('./component.js');
Entity = require('./entity.js');
System = require('./system.js');

rExplicitModule = /^([^\s]+)\s+from\s+(.+)$/;

systemsPriorityComparatorsDescriptor = {
  value: null,
  configurable: true,
  writable: true
};


function Module(name) {
  this.name = name.trim();

  this.events = new EventsEmitter();

  this._config = {
    verbose: true
  };

  this._dependencies = Object.create(null);

  this._components = Object.create(null);
  this._entities = Object.create(null);
  this._systems = Object.create(null);

  this._systemsByPriority = [];
}

Module.prototype.config = function config(options) {
  if (arguments.length === 0) {
    return this._config;
  }

  if ('verbose' in options) {
    this._config.verbose = Boolean(options.verbose);
  }

  return this;
};

Module.prototype.use = function ModuleUse(module) {
  var length, i;

  if (Array.isArray(module)) {
    length = module.length;
    for (i = 0; i < length; i += 1) {
      this._use(module[i]);
    }
  } else {
    this._use(module);
  }

  return this;
};

Module.prototype._use = function _ModuleUse(module) {
  if (module.name in this._dependencies) {
    throw new Error('A module named ' + module.name + ' is already defined');
  }

  this._dependencies[module.name] = module;
};

Module.prototype.component = function _ModuleComponent(name, factory) {
  var module, component;

  module = this;
  name = name.trim();

  if (rExplicitModule.test(name)) {
    name = RegExp.$1;

    if (RegExp.$2 !== this.name) {
      module = this._dependencies[RegExp.$2];

      if (!module) {
        throw new Error('Undefined ' + RegExp.$2 + ' module');
      }
    } else if (arguments.length === 2) {
      throw new Error('A component can\'t be defined on another module');
    }
  }

  if (arguments.length === 1) {
    component = module._getComponent(name);
    if (component) return component;
    throw new Error('Undefined ' + name + ' component');
  }

  module._setComponent(name, factory);

  return this;
};

Module.prototype._getComponent = function _ModuleGetComponent(name) {
  var component;

  component = this._components[name];

  if (component) {
    if (this._config.verbose && this._getComponentFromDependencies(name)) {
      console.warn('Ambiguous components\'s name ' + name + ' may refer to a component from another module');
    }
  } else {
    component = this._getComponentFromDependencies(name);
  }

  return component;
};

Module.prototype._setComponent = function _ModuleSetComponent(name, factory) {
  if (name in this._components) {
    throw new Error('A component named ' + name + ' is already defined');
  }

  if (this._config.verbose && this._getComponentFromDependencies(name)) {
    console.warn('A component named ' + name + ' is already defined in another module');
  }

  this._components[name] = new Component(name, this, factory);
};

Module.prototype._getComponentFromDependencies = function _ModuleGetComponentFromDependencies(name)  {
  var key, module, component;

  for (key in this._dependencies) {
    module = this._dependencies[key];
    component = module._getComponent(name);
    if (component) return component;
  }

  return null;
};

Module.prototype.entity = function _ModuleEntity(name, factory) {
  var module, entity;

  module = this;
  name = name.trim();

  if (rExplicitModule.test(name)) {
    name = RegExp.$1;

    if (RegExp.$2 !== this.name) {
      module = this._dependencies[RegExp.$2];

      if (!module) {
        throw new Error('Undefined ' + RegExp.$2 + ' module');
      }
    } else if (arguments.length === 2) {
      throw new Error('An entity can\'t be defined on another module');
    }
  }

  if (arguments.length === 1) {
    entity = module._getEntity(name);
    if (entity) return entity;
    throw new Error('Undefined ' + name + ' entity');
  }

  module._setEntity(name, factory);

  return this;
};

Module.prototype._getEntity = function _ModuleGetEntity(name) {
  var entity;

  entity = this._entities[name];

  if (entity) {
    if (this._config.verbose && this._getEntityFromDependencies(name)) {
      console.warn('Ambiguous entity\'s name ' + name + ' may refer to an entity from another module');
    }
  } else {
    entity = this._getEntityFromDependencies(name);
  }

  return entity;
};

Module.prototype._setEntity = function _ModuleSetEntity(name, factory) {
  if (name in this._entities) {
    throw new Error('An entity named ' + name + ' is already defined');
  }

  if (this._config.verbose && this._getEntityFromDependencies(name)) {
    console.warn('An entity named ' + name + ' is already defined in another module');
  }

  this._entities[name] = new Entity(name, this, factory);
};

Module.prototype._getEntityFromDependencies = function _ModuleGetEntityFromDependencies(name)  {
  var key, module, entity;

  for (key in this._dependencies) {
    module = this._dependencies[key];
    entity = module._getEntity(name);
    if (entity) return entity;
  }

  return null;
};

Module.prototype.system = function _ModuleSystem(name, components, callback) {
  var module, system;

  module = this;
  name = name.trim();

  if (rExplicitModule.test(name)) {
    name = RegExp.$1;

    if (RegExp.$2 !== this.name) {
      module = this._dependencies[RegExp.$2];

      if (!module) {
        throw new Error('Undefined ' + RegExp.$2 + ' module');
      }
    } else if (arguments.length === 2) {
      throw new Error('A system can\'t be defined on another module');
    }
  }

  if (arguments.length === 1) {
    system = module._getSystem(name);
    if (system) return system;
    throw new Error('Undefined ' + name + ' system');
  }

  module._setSystem(name, components, callback);

  return this;
};

Module.prototype._getSystem = function _ModuleGetSystem(name) {
  var system;

  system = this._systems[name];

  if (system) {
    if (this._config.verbose && this._getSystemFromDependencies(name)) {
      console.warn('Ambiguous system\'s name ' + name + ' may refer to a system from another module');
    }
  } else {
    system = this._getSystemFromDependencies(name);
  }

  return system;
};

Module.prototype._setSystem = function _ModuleSetSystem(name, components, callback) {
  if (name in this._systems) {
    throw new Error('A system named ' + name + ' is already defined');
  }

  if (this._config.verbose && this._getSystemFromDependencies(name)) {
    console.warn('A system named ' + name + ' is already defined in another module');
  }

  this._systems[name] = new System(name, this, components, callback);

  this._systemsByPriority.push(name);

  this.sortSystemsByPriority();
};

Module.prototype._getSystemFromDependencies = function _ModuleGetSystemFromDependencies(name)  {
  var key, module, system;

  for (key in this._dependencies) {
    module = this._dependencies[key];
    system = module._getSystem(name);
    if (system) return system;
  }

  return null;
};

Module.prototype.sortSystemsByPriority = function ModuleSortSystemsByPriority() {
  this._systemsByPriority.sort(this._systemsPriorityComparator);
};

Object.defineProperty(Module.prototype, '_systemsPriorityComparator', {
  get: function () {
    systemsPriorityComparatorsDescriptor.value = _systemsPriorityComparator.bind(this);
    Object.defineProperty(this, '_systemsPriorityComparator', systemsPriorityComparatorsDescriptor);
    return this._systemsPriorityComparator;
  },
  configurable: true
});

function _systemsPriorityComparator(a, b) {
  /*jshint validthis:true */
  return this.system(a)._priority - this.system(b)._priority;
}

Module.prototype.run = function ModuleRun() {
  var length, i;

  length = this._systemsByPriority.length;

  for (i = 0; i < length; i += 1) {
    this.system(this._systemsByPriority[i]).run();
  }
};


module.exports = Module;
