'use strict';

function Scheduler(msPerUpdate, extrapolation) {
  var self = this;

  self.msPerUpdate = msPerUpdate || 0;
  self.extrapolation = extrapolation || false;

  self.lag = 0;
  self.previous = 0;

  self.listen();
}

Scheduler.prototype.run = function schedulerRun(callback) {
  var current = Date.now();
  var elapsed = current - this.previous;
  this.previous = current;
  this.lag += elapsed;
  if (this.msPerUpdate > 0) {
    while (this.lag >= this.msPerUpdate) {
      callback(1);
      this.lag -= this.msPerUpdate;
    }
    if (this.extrapolation) {
      callback(this.lag / elapsed);
      this.lag = 0;
    }
  } else {
    callback(1);
  }
};

Scheduler.prototype.start = function schedulerInit() {
  this.previous = Date.now();
};

Scheduler.prototype.listen = function schedulerListen(){
  var self = this;

  window.addEventListener('focus', function () {
    self.start();
  });
};

module.exports = Scheduler;
