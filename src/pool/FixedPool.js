'use strict';

function FixedPool(factory, options) {
  var i;

  this._pool = [];

  this._defered = [];

  if (arguments.length === 2) {
    if ('size' in options) this._size = options.size;
    else this._size = FixedPool.defaults.size;
  } else {
    this._size = FixedPool.defaults.size;
  }

  for (i = 0; i < this._size; i += 1) {
    this._pool.push(factory());
  }
}


FixedPool.prototype.create = function fixedPoolCreate() {
  var instance;

  if (this._size > 0) {
    instance = this._pool[--this._size];

    this._pool[this._size] = null;

    return instance;
  }
};

FixedPool.prototype.defer = function fixedPoolDefer(callback) {
  var instance;

  if (this._size > 0) {
    instance = this._pool[--this._size];

    this._pool[this._size] = null;

    (setImmediate || setTimeout)(function () {
      callback(instance);
    }, 0);
  } else {
    this._defered.push(callback);
  }
};

FixedPool.prototype.release = function fixedPoolRelease(instance) {
  if (this._defered.length > 0) {
    this._defered.shift()(instance);
  } else {
    this._pool[this._size++] = instance;
  }
};

FixedPool.prototype.size = function fixedPoolSize() {
  return this._pool.length;
};

FixedPool.prototype.freeSize = function fixedPoolFreeSize() {
  return this._size;
};

FixedPool.prototype.allocatedSize = function fixedPoolAllocatedSize() {
  return this._pool.length - this._size;
};


FixedPool.defaults = {
  size: 100
};


module.exports = FixedPool;
