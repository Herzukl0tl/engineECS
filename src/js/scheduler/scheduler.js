'use strict';

function Scheduler(msPerUpdate, strict, extrapolation) {
  var self = this;
  self.msPerUpdate = msPerUpdate || 16;
  self.extrapolation = extrapolation || false;
  self.strict = strict;

  if (self.strict === undefined) self.strict = true;

  self.lag = 0;
  self.previous = 0;

  window.addEventListener('focus', function () {
    self.start();
  });
}


Scheduler.prototype.run = function schedulerRun(callback) {
  var time = new Date();
  var current = time.getTime();
  var elapsed = current - this.previous;
  this.previous = current;
  this.lag += elapsed;
  if (this.strict) {
    while (this.lag >= this.msPerUpdate) {
      callback(1);
      this.lag -= this.msPerUpdate;
    }
    if (this.extrapolation) {
      callback(this.lag / elapsed);
      this.lag = 0;
    }
  } else {
    callback(this.lag / elapsed);
  }
};

Scheduler.prototype.start = function schedulerInit() {
  this.previous = (new Date()).getTime();
};

Scheduler.prototype.stop = function schedulerInit() {
  this.previous = (new Date()).getTime();
};

module.exports = Scheduler;
