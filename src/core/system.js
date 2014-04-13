'use strict';

var nuclearComponent = require('./nuclear.component'),
    nuclearSystem = require('./nuclear.system'),
    nuclearEvents = require('./nuclear.events'),
    nuclearQuery = require('./nuclear.query'),
    resolver = require('./resolver'),
    Scheduler = require('./scheduler'),
    registry = require('./nuclear.registry');

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

  this._sorterManager = Object.create({
    comparator: function () {},
    toDeferred: false
  });

  this._componentPacks = Object.create(null);

  this._priority = 0;

  this._scheduler = new Scheduler(options.msPerUpdate, options.extrapolation);
  this._scheduler.start();
  this._schedulerCallback = systemSchedulerCallback.bind(this);
  
  if (options.disable !== undefined) {
    systemDisableSystems(this, options.disable);
  }

  systemListen(this);
  systemGenerateQuery(this);
}

/**
 * Check if an entity is runnable by the system
 * @param  {number} entity The selected entity
 * @return {null/object}   Return null if the entity isn't runnable, return its components in other case
 */
System.prototype.check = function SystemDefinitionCheck(entity) {
  return (this._componentPacks[entity] !== undefined);
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
    toReturn = systemRunEntity(self, entity, componentPack);
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

  this._autosortComparator = comparator;

  return this;
};

/**
 * Return the System's identity
 * It containes it's name and it's module's name
 * @return {String}    The System identity
 */
System.prototype.identity = function SystemIdentity(){
  return this.name+' from '+this.moduleName;
};

/**
 * Aliases this System with the alias param
 * @return {System}    The System
 */
System.prototype.alias = function nuclearEntityAlias(alias){
  registry.components[alias] = this;
  return this;
};

function systemGenerateQuery(self){
  var query, i, component;

  query = '';
  for(i = 0; i < self.components.length; i++){
    component = self.components[i];
    query += component;

    if(i !== self.components.length-1){
      query += ' ';
    }
  }
  self.query = nuclearQuery.live(query);
  self.entities = self.query.entities;
  self.query.listen(systemQueryUpdate.bind(self));
}

function systemQueryUpdate(entity, state){
  /*jshint validthis:true */
  if(state){
    this.componentPacks[entity] = systemGeneratePack(this, entity);
  }
  else{
    delete this.componentPacks[entity];
  }
}

function systemGeneratePack(self, entity){
  var i, component, componentPack;

  for (i = self.components.length - 1; i >= 0; i--) {
    component = nuclearComponent(self.components[i]).of(entity);
    if (component === undefined) return null;
    componentPack[self.components[i]] = component;
  }

  return componentPack;
}

function systemListen(self){
  var eventsOptions = {
    context: self
  };

  nuclearEvents.on('system:after_running', function () {
    if (self._sorterManager.toDeferred) {
      self.entities.sort(self._sorterManager.comparator);
      self._sorterManager.toDeferred = false;
    }
  }, eventsOptions);
}

function systemSchedulerCallback(deltaTime){
  /*jshint validthis:true */
  var length = this.entities.length;
  for (var i = 0; i < length; i++) {
    systemRunEntity(this, this.entities[i], this._componentPacks[this.entities[i]], deltaTime);
  }
}

function systemRunEntity(self, entity, componentPack, deltaTime) {
  return self.definition(entity, componentPack, nuclearSystem.context(), deltaTime);
}

function systemDisableSystems(self, systems) {
  for (var i = 0; i < systems.length; i++) {
    nuclearSystem.disable(systems[i]);
  }
}

module.exports = System;