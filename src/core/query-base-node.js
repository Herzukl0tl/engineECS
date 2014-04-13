'use strict';

function BaseNode(children) {
  this.children = children ? children.slice() : [];
  this._listeners = [];
}

BaseNode.prototype.emit = function baseNodeEmit(entity, state) {
  var i, listener;

  for (i = 0; (listener = this._listeners[i]); i += 1) {
    listener(entity, state);
  }
};

BaseNode.prototype.listen = function baseNodeListen(listener) {
  this._listeners.push(listener);
};

module.exports = BaseNode;
