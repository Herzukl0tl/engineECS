'use strict';

var nuclearEvents = require('./nuclear.events');

/**
 * Component constructor
 * This is the components factory
 * @param {string} name       The component name
 * @param {function} definition The component function which has to return its instance
 */
function Component(name, definition, moduleName) {
  this.name = name;
  this.definition = definition;

  this._components = Object.create(null);
  this._disabledComponents = Object.create(null);

  this.moduleName = moduleName;
}

/**
 * Return the component of the wanted entity if it has a component of this factory
 * If the options key 'required' is true, the method throw an error if the entity hasn't the component
 * If the options key 'add' is true, the method add the component to the entity and return it
 * @param  {number} entity  The entity which has the component
 * @param  {object} options The method options
 * @return {object/undefined}         Return the component if the entity has it, if it hasn't,
 * return undefined if th required key is false
 */
Component.prototype.of = function ComponentOf(entity, options) {
  var component = this._components[entity] || this._disabledComponents[entity];

  if (arguments.length === 2) {
    if (!this.in(entity)) {
      if (options.required) throw new Error();
      else if (options.add) component = this.add(entity);
    }
  }

  return component;
};

/**
 * Test if an entity has the component of this factory
 * @param  {number} entity The entity to test
 * @return {boolean}        True if the entity has it, fals if it hasn't
 */
Component.prototype.in = function ComponentIn(entity) {
  return entity in this._components || entity in this._disabledComponents;
};

/**
 * The method to add a component to an existing entity
 * All the arguments after the entity one will be passed to the component definition call
 * The component creation triggers a 'add:'componentName event on the component part of core
 * @param {number} entity The entity which will get the new component
 * @return {object}       The created component
 */
Component.prototype.add = function ComponentAdd(entity) {
  if (this. in (entity)) throw new Error();

  var component = this.definition.apply(this, arguments);

  this._components[entity] = component;

  nuclearEvents.trigger('component:add:' + this.identity(), entity, this.name, this.moduleName);
  nuclearEvents.trigger('component:add', entity, this.identity(), this.name, this.moduleName);

  return component;
};

/**
 * Remove the component of this factory to the selected entity
 * The component destruction triggers a 'remove:'ComponentName event on the component part of core
 * @param  {number} entity The entity which will lost the component
 * @return {boolean}        Return false if the entity hasn't the component, true in other case
 */
Component.prototype.remove = function ComponentRemove(entity) {
  if (!this. in (entity)) return false;

  delete this._components[entity];
  delete this._disabledComponents[entity];

  nuclearEvents.trigger('component:remove:' + this.identity(), entity, this.name, this.moduleName);
  nuclearEvents.trigger('component:remove', entity, this.identity(), this.name, this.moduleName);
  return true;
};

/**
 * Share an attached component to one or several entity(ies)
 * @param  {number} source The source entity, owning the component to share
 * @param  {number/array} dest   The selected entity(ies)
 * @return {object/null}        If the source has the component, it returns it, in other case, it returns null
 */
Component.prototype.share = function ComponentShare(source, dest) {
  if (!this. in (source)) return null;

  var component = this.of(source);

  if (Array.isArray(dest)) {
    var i;
    for (i = dest.length - 1; i >= 0; i -= 1) {
      this._components[dest[i]] = component;
      nuclearEvents.trigger('component:add:' + this.identity(), dest[i], this.name, this.moduleName);
      nuclearEvents.trigger('component:add', dest[i], this.identity(), this.name, this.moduleName);
    }
  } else {
    this._components[dest] = component;
    nuclearEvents.trigger('component:add:' + this.identity(), dest, this.name, this.moduleName);
    nuclearEvents.trigger('component:add', dest, this.identity(), this.name, this.moduleName);
  }

  return component;
};

/**
 * Disable the component of the selected entity
 * @param  {number} id The selected entity
 * @return {boolean}    If the entity owns the component and it is enabled, it returns true, in other case, it returns false
 */
Component.prototype.disable = function ComponentDisable(id) {
  if (id in this._components) {
    this._disabledComponents[id] = this._components[id];
    delete this._components[id];

    nuclearEvents.trigger('component:disable:' + this.identity(), id, this.name, this.moduleName);
    nuclearEvents.trigger('component:disable', id, this.identity(), this.name, this.moduleName);

    return true;
  }
  return false;
};

/**
 * Enable the component of the selected entity
 * @param  {number} id The selected entity
 * @return {boolean}    If the entity owns the component and it is disabled, it returns true, in other case, it returns false
 */
Component.prototype.enable = function ComponentEnable(id) {
  if (id in this._disabledComponents) {
    this._components[id] = this._disabledComponents[id];
    delete this._disabledComponents[id];

    nuclearEvents.trigger('component:enable:' + this.identity(), id, this.name, this.moduleName);
    nuclearEvents.trigger('component:enable', id, this.identity(), this.name, this.moduleName);

    return true;
  }
  return false;
};

/**
 * Test if the component of the selected entity is enabled or not
 * @param  {number}  id The selected entity
 * @return {Boolean}    True if it's enabled, false in other case
 */
Component.prototype.isEnabled = function ComponentIsEnabled(id) {
  if (this. in (id)) {
    if (id in this._components) return true;
    return false;
  }

  throw new Error();
};

/**
 * Return the Component's identity
 * It containes it's name and it's module's name
 * @return {String}    The component identity
 */
Component.prototype.identity = function ComponentIdentity(){
  return this.name+' from '+this.moduleName;
};

module.exports = Component;
