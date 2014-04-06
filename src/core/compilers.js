'use strict';

var nuclearRegistry;

nuclearRegistry = require('./nuclear.registry');

function $getter(path) {
  var getter, fragments;

  getter = $getter.cache[path];

  if (getter === undefined) {
    fragments = path.split('.');
    $getter.cache[path] = getter = new Function('r',
      'return function compiledGetter(e){' +
        'return r.component("' + fragments.shift() + '").of(e).' + fragments.join('.') +
      '}'
    )(nuclearRegistry);
  }

  return getter;
}

$getter.cache = Object.create(null);

function $setter(path) {
  var setter, fragments;

  setter = $setter.cache[path];

  if (setter === undefined) {
    fragments = path.split('.');
    $setter.cache[path] = setter = new Function('r',
      'return function compiledSetter(e,v){' +
        'r.component("' + fragments.shift() + '").of(e).' + fragments.join('.') + '=v' +
      '}'
    )(nuclearRegistry);
  }

  return setter;
}

$setter.cache = Object.create(null);

function $comparator(path, order) {
  var key, comparator, fragments, component, property, comparison;

  key = '{"path":"' + path + '","order":"' + order + '"}';
  comparator = $comparator.cache[key];

  if (comparator === undefined) {
    fragments = path.split('.');

    component = fragments.shift();
    property = fragments.join('.');

    if (arguments.length === 1) {
      comparison = $comparator.orders.asc;
    } else if (!(comparison = $comparator.orders[order])) {
      throw new Error();
    }

    $comparator.cache[key] = comparator = new Function('r',
      'var c=r.component("' + component + '")' +
      'return function compiledComparator(a,b){' +
        'var ca=c.of(a),cb=c.of(b);' +
        'if(ca&&cb)return ' + comparison
          .replace('$left', 'ca.' + property)
          .replace('$right', 'cb.' + property) +
        'return 0' +
      '}'
    )(nuclearRegistry);
  }

  return comparator;
}

$comparator.orders = {
  asc: '$left - $right',
  desc: '$right - $left'
};

$comparator.cache = Object.create(null);

exports.$getter = $getter;
exports.$setter = $setter;
exports.$comparator = $comparator;
