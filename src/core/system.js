'use strict';

var nuclearComponent = require('./nuclear.component'),
    nuclearSystem = require('./nuclear.system'),
    nuclearEvents = require('./nuclear.events'),
    resolver = require('./resolver'),
    Scheduler = require('./scheduler'),
    eventsOptions = {};

/**
 * The System constructor
 * @param {string} name       The System name
 * @param {array} components The System required components
 * @param {function} definition The System definition
 * @param {object} options    The System options
 */
function System(name, components, definition, moduleName, options) {
  options = options || {};

  this.name = name;
  this.definition = definition;

  this.components = components.map(resolver.identity, resolver);
  this.aliases = components.map(function (path) {
    return resolver.alias(path) || resolver.name(path);
  });
  this.moduleName = moduleName;

  this._context = Object.create(options.context || null);

  this.entities = [];
  this._deferredEntities = [];
  this._sorterManager = Object.create({
    comparator: function () {},
    toDeferred: false
  });

  this._componentPacks = Object.create(null);
  this._removeEntities = Object.create(null);

  this._priority = 0;

  this._scheduler = new Scheduler(options.msPerUpdate, options.extrapolation);
  this._scheduler.start();
  this._schedulerCallback = systemSchedulerCallback.bind(this);

  systemListenComponents(this, this.components);

  if (options.disable !== undefined) {
    systemDisableSystems(this, options.disable);
  }

  this.listen();
}

/**
 * Check if the entity parameter is valid for this system
 * If No : return false
 * If Yes : add the entity to the entities list of the system, and return true
 * @param {number} entity The entity to add
 */
System.prototype.add = function SystemAdd(entity) {
  if (this.entities.indexOf(entity) > -1) return false;

  var componentPack = this.check(entity);
  if (componentPack === null) return false;

  this.entities.push(entity);
  this._componentPacks[entity] = componentPack;

  return true;
};

/**
 * Remove the selected entity frome the system garbage list
 * @param  {number} entity The selected entity
 * @return {boolean}        If the entity is in the system, it returns true, in other case, it returns false
 */
System.prototype.remove = function SystemRemove(entity) {
  var index = this.entities.indexOf(parseInt(entity));
  if (index < 0) return false;

  this.entities.splice(index, 1);
  delete this._componentPacks[entity];

  return true;
};

/**
 * Check if an entity is runnable by the system
 * @param  {number} entity The selected entity
 * @return {null/object}   Return null if the entity isn't runnable, return its components in other case
 */
System.prototype.check = function SystemCheck(entity) {
  var componentPack = Object.create(null),
      i, comp;

  for (i = this.components.length - 1; i >= 0; i--) {
    comp = nuclearComponent(this.components[i]).of(entity);

    if (comp === undefined) return null;

    componentPack[this.aliases[i]] = comp;
  }

  return componentPack;
};

/**
 * Run the system on all the entities
 * @return {System} Return the System itself
 */
System.prototype.run = function SystemRun() {
  var self = this;

  nuclearEvents.trigger('system:before:' + self.identity(), self.entities, self._componentPacks, self.name, self.moduleName);

  if (self._autosortComparator !== null) {
    self.entities.sort(self._autosortComparator);
  }

  self._scheduler.run(this._schedulerCallback);

  nuclearEvents.trigger('system:after:' + self.identity(), self.entities, self._componentPacks, self.name, self.moduleName);

  return self;
};

/**
 * Run the system on the selected entity
 * @param  {number} entity The selected entity
 * @return {System} Return the System itself
 */
System.prototype.once = function(entity){
  var self = this;

  if (this.entities.indexOf(entity) !== -1) {
    var componentPack = self._componentPacks[entity],
        toReturn;
    nuclearEvents.trigger('system:before:' + self.identity(), entity, componentPack, self.name, self.moduleName);
    toReturn = systemDefinitionRunEntity(self, entity, componentPack);
    nuclearEvents.trigger('system:after:' + self.identity(), entity, componentPack, self.name, self.moduleName);
    return toReturn;
  }
  return false;
};

/**
 * Sort the internal entity list of the system
 * @param  {function} comparator The sorting function
 * @return {System}    The System itself
 */
System.prototype.sort = function SystemSort(comparator) {
  this._sorterManager.comparator = comparator;
  this._sorterManager.toDeferred = true;

  return this;
};

/**
 * Define an autosort compartor which will sort the System
 * at each frame
 * @param  {function} comparator The sorting function
 * @return {System}    The System itself
 */
System.prototype.autosort = function SystemAutoSort(comparator) {
  if (arguments.length === 0) {
    return this._autosortComparator;
  }

  this._autosortComparator = comparator.bind(this._context);

  return this;
};

/**
 * Refresh the system entities list
 */
System.prototype.refresh = function SystemRefresh() {
  systemParseDeferred(this);
};

/**
 * Return the System's identity
 * It containes it's name and it's module's name
 * @return {String}    The System identity
 */
System.prototype.identity = function SystemIdentity(){
  return this.name+' from '+this.moduleName;
};

System.prototype.listen = function SystemListen(){
  var eventsOptions = {
    context: this
  };

  nuclearEvents.on('system:after_running', function () {
    if (this._sorterManager.toDeferred) {
      this.entities.sort(this._sorterManager.comparator);
      this._sorterManager.toDeferred = false;
    }
  }, eventsOptions);

  nuclearEvents.on('system:before_running', function () {
    systemParseDeferred(this);
  }, eventsOptions);
};

function systemSchedulerCallback(deltaTime){
  /*jshint validthis:true */
  var length = this.entities.length;
  for (var i = 0; i < length; i++) {
    systemDefinitionRunEntity(this, this.entities[i], this._componentPacks[this.entities[i]], deltaTime);
  }
}

function systemDefinitionRunEntity(self, entity, componentPack, deltaTime) {
  return self.definition(entity, componentPack, nuclearSystem.context(), deltaTime);
}

function systemParseDeferred(self) {
  var entity;
  for (var i = 0; i < self._deferredEntities.length; i++) {
    entity = self._deferredEntities[i];

    if (self._removeEntities[entity] !== undefined) {
      self.remove(entity);
      delete self._removeEntities[entity];
    } else {
      self.add(entity);
    }
  }

  self._deferredEntities.length = 0;
}

function systemAddToDeferred(entity) {
  this._deferredEntities.push(entity);// jshint ignore:line
}

function systemAddToDeferredAndRemove(entity, componentName) {
  this._deferredEntities.push(entity);// jshint ignore:line
  this._removeEntities[entity] = componentName;// jshint ignore:line
}

function systemListenComponents(self, components) {
  var options = eventsOptions,
      i;

  options.context = self;

  for (i = 0; i < components.length; i++) {
    nuclearEvents.on('component:add:' + components[i], systemAddToDeferred, options);
    nuclearEvents.on('component:enable:' + components[i], systemAddToDeferred, options);

    nuclearEvents.on('component:remove:' + components[i], systemAddToDeferredAndRemove, options);
    nuclearEvents.on('component:disable:' + components[i], systemAddToDeferredAndRemove, options);
  }
}

function systemDisableSystems(self, systems) {
  for (var i = 0; i < systems.length; i++) {
    nuclearSystem.disable(systems[i]);
  }
}

module.exports = System;
