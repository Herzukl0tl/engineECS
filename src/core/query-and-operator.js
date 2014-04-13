'use strict';

var OperatorNode;

OperatorNode = require('./query-operator-node');

function AndOperator(sources) {
  OperatorNode.call(this, sources);
}

AndOperator.prototype = Object.create(OperatorNode.prototype);

AndOperator.prototype.state = function andOperatorState(entity) {
  return this._masks[entity] === this.children.length;
};

AndOperator.prototype._onSourceStateChanged = function _andOperatorOnSourceStateChanged(entity, state) {
  if (!(entity in this._masks)) {
    this._masks[entity] = 0;
  }

  if (state) {
    this._masks[entity] += 1;
    if (this.state(entity)) {
      this.emit(entity, true);
    }
  } else if (this._masks[entity] > 0) {
    if (this.state(entity)) {
      this.emit(entity, false);
    }
    this._masks[entity] -= 1;
  }
};

module.exports = AndOperator;
