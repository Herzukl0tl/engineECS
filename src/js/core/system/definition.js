'use strict';

var system;
var component = require('../component'),
  scene = require('../scene'),
  Scheduler = require('../../scheduler/scheduler'),
  privates = Object.create(null),
  eventsOptions = {};

/**
 * The SystemDefinition constructor
 * @param {string} name       The SystemDefinition name
 * @param {array} components The SystemDefinition required components
 * @param {function} definition The SystemDefinition definition
 * @param {object} options    The SystemDefinition options
 */
function SystemDefinition(name, components, definition, options) {
  if (Object.prototype.toString.call(options) !== '[object Object]') options = Object.create(null);

  this.name = name;
  this.definition = definition;
  this.components = components;

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

  this._scheduler = new Scheduler(options.msPerUpdate, options.strict, options.extrapolation);
  this._scheduler.start();

  systemListenComponents(this, components);

  if (options.disable !== undefined) {
    systemDisableSystems(this, options.disable);
  }
  if (system === undefined) system = require('../system');

  system.on('after running', function () {
    if (this._sorterManager.toDeferred) {
      this.entities.sort(this._sorterManager.comparator);
      this._sorterManager.toDeferred = false;
    }
  }, {
    context: this
  });
}

/**
 * Check if the entity parameter is valid for this system
 * If No : return false
 * If Yes : add the entity to the entities list of the system, and return true
 * @param {number} entity The entity to add
 */
SystemDefinition.prototype.add = function SystemDefinitionAdd(entity) {
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
SystemDefinition.prototype.remove = function SystemDefinitionRemove(entity) {
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
SystemDefinition.prototype.check = function SystemDefinitionCheck(entity) {
  var componentPack = Object.create(null);
  for (var i = this.components.length - 1; i >= 0; i--) {
    var comp = component(this.components[i]).of(entity);
    if (comp === undefined) return null;
    componentPack[this.components[i]] = comp;
  }

  return componentPack;
};

/**
 * Run the system on the selected entity, or on all the entities if no arguments
 * @param  {number} entity The selected entity
 * @return {SystemDefinition} Return the SystemDefinition itself
 */
SystemDefinition.prototype.run = function SystemDefinitionRun(entity) {
  var self = this;
  systemParseDeferred(self);

  if (arguments.length === 1) {
    if (this.entities.indexOf(entity) !== -1) {
      var componentPack = self._componentPacks[entity];
      system.trigger('before:' + self.name, entity, componentPack);
      systemDefinitionRunEntity(self, entity, componentPack);
      system.trigger('after:' + self.name, entity, componentPack);
      return true;
    }
    return false;
  } else {
    system.trigger('before:' + self.name, self.entities, self._componentPacks);

    if (self._autosortComparator !== null && typeof self._autosortComparator === 'function') {
      self.entities.sort(self._autosortComparator);
    }

    var length = self.entities.length;


    self._scheduler.run(function (deltaTime) {
      for (var i = 0; i < length; i++) {
        self._context._deltaTime = deltaTime;
        systemDefinitionRunEntity(self, self.entities[i], self._componentPacks[self.entities[i]]);
      }
    });

    system.trigger('after:' + self.name, self.entities, self._componentPacks);
  }

  return self;
};

/**
 * Sort the internal entity list of the system
 * @param  {function} comparator The sorting function
 * @return {SystemDefinition}    The SystemDefinition itself
 */
SystemDefinition.prototype.sort = function SystemDefinitionSort(comparator) {
  this._sorterManager.comparator = comparator;
  this._sorterManager.toDeferred = true;

  return this;
};

/**
 * Define an autosort compartor which will sort the SystemDefinition
 * at each frame
 * @param  {function} comparator The sorting function
 * @return {SystemDefinition}    The SystemDefinition itself
 */
SystemDefinition.prototype.autosort = function SystemDefinitionAutoSort(comparator) {
  if (arguments.length === 0) {
    return this._autosortComparator;
  }

  if (typeof comparator === 'function' || comparator === null) {
    this._autosortComparator = comparator.bind(this._context);

    return this;
  }

  throw new Error();
};

/**
 * Refresh the system entities list
 */
SystemDefinition.prototype.refresh = function SystemDefinitionRefresh() {
  systemParseDeferred(this);
};

function systemDefinitionRunEntity(self, entity, componentPack) {
  var context = self._context,
    components = self.components,
    sceneContext = scene(scene.of(entity))._context;

  for (var i = components.length - 1; i >= 0; i--) {
    context[components[i]] = componentPack[components[i]];
  }


  self.definition.call(context, entity, sceneContext);
}

function systemParseDeferred(self) {
  for (var i = 0; i < self._deferredEntities.length; i++) {
    var entity = self._deferredEntities[i];
    if (self._removeEntities[entity] !== undefined) {
      self.remove(entity);
      delete self._removeEntities[entity];
      continue;
    }

    self.add(entity);
  }

  self._deferredEntities.length = 0;
}

privates.addToDeferred = function systemAddToDeferred(entity) {
  this._deferredEntities.push(entity);
};

privates.addToDeferredAndRemove = function systemAddToDeferredAndRemove(entity, componentName) {
  this._deferredEntities.push(entity);
  this._removeEntities[entity] = componentName;
};

function systemListenComponents(self, components) {
  var options = eventsOptions;

  options.context = self;

  for (var i = 0; i < components.length; i++) {
    component.on('add:' + components[i], privates.addToDeferred, options);
    component.on('enable:' + components[i], privates.addToDeferred, options);

    component.on('remove:' + components[i], privates.addToDeferredAndRemove, options);
    component.on('disable:' + components[i], privates.addToDeferredAndRemove, options);
  }
}

function systemDisableSystems(self, systems) {
  for (var i = 0; i < systems.length; i++) {
    system.disable(systems[i]);
  }
}

module.exports = SystemDefinition;
