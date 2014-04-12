'use strict';

var nuclear, LayerComponent;

nuclear = require('../../core');

LayerComponent = require('./layer-component');

module.exports = nuclear.module('core.utils', [])
  .component('layer', function (e, data) {
    return new LayerComponent(data);
  });
