'use strict';

var Module = require('./module.js'),
  modules = Object.create(null);

exports.module = function (name) {
  var module;

  module = modules[name];

  if (module === undefined) {
    modules[name] = module = new Module(name);
  }

  return module;
};
