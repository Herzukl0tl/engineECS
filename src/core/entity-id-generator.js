'use strict';

function EntityIdGenerator(seed) {
  this._seed = seed || 0;
  this._value = this._seed;
}

EntityIdGenerator.prototype.next = function entityIdGeneratorNext() {
  return (this._value += 1);
};

EntityIdGenerator.prototype.reset = function entityIdGeneratorReset() {
  this._value = this._seed;
};


module.exports = EntityIdGenerator;
