'use strict';

var OperatorNode;

OperatorNode = require('./query-operator-node');

function OrOperator(sources) {
  OperatorNode.call(this, sources);
}

OrOperator.prototype = Object.create(OperatorNode.prototype);

OrOperator.prototype.state = function orOperatorState(entity) {
  return this._masks[entity] > 0;
};

OrOperator.prototype._onSourceStateChanged = function _orOperatorOnSourceStateChanged(entity, state) {
  if (!(entity in this._masks)) {
    this._masks[entity] = 0;
  }

  if (state) {
    if (!this.state(entity)) {
      this.emit(entity, true);
    }
    this._masks[entity] += 1;
  } else if (this.state(entity)) {
    this._masks[entity] -= 1;
    if (!this.state(entity)) {
      this.emit(entity, false);
    }
  }
};

module.exports = OrOperator;
