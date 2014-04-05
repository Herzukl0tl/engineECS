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


Pool.prototype.create = function poolCreate() {
  if (this._pool.length < this.threshold) {
    this.allocate(this.growth);
  }

  return this._pool.pop();
};

Pool.prototype.defer = function poolDefer(callback) {
  var instance;

  if (this._pool.length > 0) {
    instance = this._pool.pop();
    (setImmediate || setTimeout)(function () {
      callback(instance);
    }, 0);
  } else {
    this._defered.push(callback);
  }
};

Pool.prototype.allocate = function poolAllocate(count) {
  var i;

  for (i = 0; i < count; i += 1) {
    this._pool.push(this._factory());
  }

  this._size += count;
};

Pool.prototype.release = function poolRelease(instance) {
  if (this._defered.length > 0) {
    this._defered.shift()(instance);
  } else {
    this._pool.push(instance);
  }
};

Pool.prototype.size = function poolSize() {
  return this._size;
};

Pool.prototype.freeSize = function poolFreeSize() {
  return this._pool.length;
};

Pool.prototype.allocatedSize = function poolAllocatedSize() {
  return this._size - this._pool.length;
};


Pool.defaults = {
  size: 100,
  growth: 1,
  threshold: 1
};


module.exports = Pool;
