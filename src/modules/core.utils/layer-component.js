'use strict';

var nuclear;

nuclear = require('../../core');

function LayerComponent(data) {
  this.layer = data.layer || 0;
  this.systems = data.systems || [];

  nuclear.events.once('component:created:layer', function (id) {
    var layer, name, length, i;

    layer = nuclear.component('layer').of(id);
    length = layer.systems.length;

    for (i = 0; i < length; i++) {
      name = layer.systems[i];
      nuclear.system(name).sort(sortByLayer);
    }
  });
}

function sortByLayer(a, b) {
  var layerComponent, layerA, layerB;

  layerComponent = nuclear.component('layer');
  layerA = layerComponent.of(a);
  layerB = layerComponent.of(b);

  return layerA.layer - layerB.layer;
}

module.exports = LayerComponent;
