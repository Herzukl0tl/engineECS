function FixedPool(factory, options) {
  this._pool = [];

  this._defered = [];

  if (arguments.length === 2) {
    if ('size' in options) this._size = options.size;
    else this._size = FixedPool.defaults.size;
  } else {
    this._size = FixedPool.defaults.size;
  }

  for (var i = 0; i < this._size; i += 1) {
    this._pool.push(factory());
  }
}


FixedPool.prototype.create = function FixedPoolCreate() {
  if (this._size > 0) {
    var object = this._pool[--this._size];

    this._pool[this._size] = null;

    return object;
  }
};

FixedPool.prototype.defer = function FixedPoolDefer(callback) {
  if (this._size > 0) {
    var object = this._pool[--this._size];

    this._pool[this._size] = null;

    callback(object);
  } else {
    this._defered.push(callback);
  }
};

FixedPool.prototype.release = function FixedPoolRelease(object) {
  if (this._defered.length > 0) {
    this._defered.shift()(object);
  } else {
    this._pool[this._size++] = object;
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
