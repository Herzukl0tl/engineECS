'use strict';

module.exports = function (nuclear) {
  var watchers;

  watchers = nuclear.module('watchers');

  require('./watcher-component.js')(watchers);
  require('./watch-system.js')(watchers);

  return watchers;
};

var test = nuclear.module('test')
  .use()

