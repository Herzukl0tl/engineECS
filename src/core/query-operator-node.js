'use strict';

var BaseNode;

BaseNode = require('./query-base-node');

function OperatorNode(sources) {
  var i, source;

  BaseNode.call(this, sources);

  this._masks = Object.create(null);

  this._onSourceStateChanged = this._onSourceStateChanged.bind(this);

  for (i = 0; (source = sources[i]); i += 1) {
    source.listen(this._onSourceStateChanged);
  }
}

OperatorNode.prototype = Object.create(BaseNode.prototype);

OperatorNode.prototype._onSourceStateChanged = function _operatorNodeOnSourceStateChanged(/*entity, state*/) {};

OperatorNode.prototype.state = function operatorNodeState(/*entity*/) {
  return false;
};

module.exports = OperatorNode;
