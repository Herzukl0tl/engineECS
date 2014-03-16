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


FixedPool.prototype.create = function FixedPoolCreate() {
  var instance;

  if (this._size > 0) {
    instance = this._pool[--this._size];

    this._pool[this._size] = null;

    return instance;
  }
};

FixedPool.prototype.defer = function FixedPoolDefer(callback) {
  var instance;

  if (this._size > 0) {
    instance = this._pool[--this._size];

    this._pool[this._size] = null;

    setTimeout(function () {
      callback(instance);
    }, 0);
  } else {
    this._defered.push(callback);
  }
};

FixedPool.prototype.release = function FixedPoolRelease(instance) {
  if (this._defered.length > 0) {
    this._defered.shift()(instance);
  } else {
    this._pool[this._size++] = instance;
  }
};

FixedPool.prototype.size = function FixedPoolSize() {
  return this._pool.length;
};

FixedPool.prototype.freeSize = function FixedPoolFreeSize() {
  return this._size;
};

FixedPool.prototype.allocatedSize = function FixedPoolAllocatedSize() {
  return this._pool.length - this._size;
};


FixedPool.defaults = {
  size: 100
};


module.exports = FixedPool;
