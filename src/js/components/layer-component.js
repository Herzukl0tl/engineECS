'use strict';

var component = require('../core/component');
var system = require('../core/system');

function LayerComponent(data) {
  this.layer = data.layer || 0;
  this.systems = data.systems || [];
  component.once('add:layer', function (id) {
    var layer = component('layer').of(id);

    for (var i = 0; i < layer.systems.length; i++) {
      var name = layer.systems[i];
      system(name).sort(sortByLayer);
    }
  });
}

function sortByLayer(a, b) {
  var aRender = component('layer').of(a);
  var bRender = component('layer').of(b);

  return aRender.layer - bRender.layer;
}
component.define('layer', function (id, data) {
  return new LayerComponent(data);
});
