'use strict';

var nuclear, Module;

module.exports = nuclear = {};

Module = require('./module');

nuclear.events    = require('./nuclear.events');
nuclear.registry  = require('./nuclear.registry');
nuclear.component = require('./nuclear.component');
nuclear.entity    = require('./nuclear.entity');
nuclear.system    = require('./nuclear.system');

nuclear.module = function nuclearModule(name, deps) {
  var module;

  if (arguments.length === 1) {
    return this.registry.module(name);
  }

  module = new Module(name, deps);

  return module;
};

nuclear.import = function nuclearImport(modules) {
  var i, length;

  length = modules.length;

  for (i = 0; i < length; i += 1) {
    this.registry.import(modules[i]);
  }
};
