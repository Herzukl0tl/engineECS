'use strict';

function Pool(factory, options) {
  this._factory = factory;

  this._pool = [];

  this._defered = [];

  if (arguments.length === 2) {
    if ('size' in options) this._size = options.size;
    else this._size = Pool.defaults.size;

    if ('growth' in options) this.growth = options.growth;
    else this.growth = Pool.defaults.growth;

    if ('threshold' in options) this.threshold = options.threshold;
    else this.threshold = Pool.defaults.threshold;
  } else {
    options = Pool.defaults;

    this._size = options.size;

    this.growth = options.growth;
    this.threshold = options.threshold;
  }

  this.allocate(this._size);
}


Pool.prototype.create = function PoolCreate() {
  if (this._pool.length < this.threshold) {
    this.allocate(this.growth);
  }

  return this._pool.pop();
};

Pool.prototype.defer = function PoolDefer(callback) {
  if (this._pool.length > 0) {
    callback(this._pool.pop());
  } else {
    this._defered.push(callback);
  }
};

Pool.prototype.allocate = function PoolAllocate(count) {
  for (var i = 0; i < count; i += 1) {
    this._pool.push(this._factory());
  }
};

Pool.prototype.release = function PoolRelease(object) {
  if (this._defered.length > 0) {
    this._defered.shift()(object);
  } else {
    this._pool.push(object);
  }
};

Pool.prototype.size = function PoolSize() {
  return this._size;
};

Pool.prototype.freeSize = function PoolFreeSize() {
  return this._pool.length;
};

Pool.prototype.allocatedSize = function PoolAllocatedSize() {
  return this._size - this._pool.length;
};


Pool.defaults = {
  size: 100,
  growth: 1,
  threshold: 1
};


module.exports = Pool;
