'use strict';

var BaseNode, nuclearEvents;

BaseNode = require('./query-base-node');
nuclearEvents = require('./nuclear.events');

function ComponentSelector(component, meta) {
  BaseNode.call(this);

  this._onComponentAdded = this._onComponentAdded.bind(this);
  this._onComponentRemoved = this._onComponentRemoved.bind(this);

  nuclearEvents.on('component:add:' + component, this._onComponentAdded);
  nuclearEvents.on('component:remove:' + component, this._onComponentRemoved);

  if (meta && meta.enabled) {
    nuclearEvents.on('component:enable:' + component, this._onComponentAdded);
    nuclearEvents.on('component:disable:' + component, this._onComponentRemoved);
  }
}

ComponentSelector.prototype = Object.create(BaseNode.prototype);

ComponentSelector.prototype._onComponentAdded = function _componentSelectorOnComponentAdded(entity) {
  this.emit(entity, true);
};

ComponentSelector.prototype._onComponentRemoved = function _componentSelectorOnComponentRemoved(entity) {
  this.emit(entity, false);
};

module.exports = ComponentSelector;
