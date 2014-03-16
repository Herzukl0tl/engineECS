'use strict';

function EntityIdGenerator() {
  this._value = 0;
}

EntityIdGenerator.prototype.next = function EntityIdGeneratorNext() {
  return (this._value += 1);
};

EntityIdGenerator.prototype.reset = function EntityIdGeneratorReset() {
  EntityIdGenerator.call(this);
};


module.exports = EntityIdGenerator;
