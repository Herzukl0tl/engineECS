'use strict';

/*global describe:false*/
/*global it:false*/
/*global expect:false*/
/*global jasmine:false*/

var QueryExpression, AndOperator, OrOperator, ComponentSelector;

QueryExpression = require('../src/core/query-expression');
AndOperator = require('../src/core/query-and-operator');
OrOperator = require('../src/core/query-or-operator');
ComponentSelector = require('../src/core/query-component-selector');

describe('Queries spec', function () {
  describe('QueryExpression.tokenize()', function () {
    var tokens;

    it('sould return an array of tokens', function () {
      tokens = QueryExpression.tokenize('position');

      expect(tokens).toEqual([
        ['COMPONENT_SELECTOR', 'position']
      ]);

      tokens = QueryExpression.tokenize('position scale');

      expect(QueryExpression.tokenize('position scale')).toEqual([
        ['COMPONENT_SELECTOR', 'position'],
        ['AND_OPERATOR', ' '],
        ['COMPONENT_SELECTOR', 'scale']
      ]);

      tokens = QueryExpression.tokenize('position, scale');

      expect(tokens).toEqual([
        ['COMPONENT_SELECTOR', 'position'],
        ['OR_OPERATOR', ', '],
        ['COMPONENT_SELECTOR', 'scale']
      ]);

      tokens = QueryExpression.tokenize('position rotation scale, transform');

      expect(tokens).toEqual([
        ['COMPONENT_SELECTOR', 'position'],
        ['AND_OPERATOR', ' '],
        ['COMPONENT_SELECTOR', 'rotation'],
        ['AND_OPERATOR', ' '],
        ['COMPONENT_SELECTOR', 'scale'],
        ['OR_OPERATOR', ', '],
        ['COMPONENT_SELECTOR', 'transform']
      ]);
    });
  });

  describe('QueryExpression.parse()', function () {
    var tokens;

    it('should reorganize the tokens', function () {
      tokens = parse('position scale');

      expect(tokens).toEqual([
        ['COMPONENT_SELECTOR', 'position'],
        ['COMPONENT_SELECTOR', 'scale'],
        ['AND_OPERATOR', ' ']
      ]);

      tokens = parse('position scale rotation');

      expect(tokens).toEqual([
        ['COMPONENT_SELECTOR', 'position'],
        ['COMPONENT_SELECTOR', 'scale'],
        ['COMPONENT_SELECTOR', 'rotation'],
        ['AND_OPERATOR', ' ']
      ]);

      tokens = parse('position, scale');

      expect(tokens).toEqual([
        ['COMPONENT_SELECTOR', 'position'],
        ['COMPONENT_SELECTOR', 'scale'],
        ['OR_OPERATOR', ', ']
      ]);

      tokens = parse('position rotation scale, transform');

      expect(tokens).toEqual([
        ['COMPONENT_SELECTOR', 'position'],
        ['COMPONENT_SELECTOR', 'rotation'],
        ['COMPONENT_SELECTOR', 'scale'],
        ['AND_OPERATOR', ' '],
        ['COMPONENT_SELECTOR', 'transform'],
        ['OR_OPERATOR', ', ']
      ]);
    });
  });

function parse(expression) {
  return QueryExpression.parse(QueryExpression.tokenize(expression));
}

  describe('QueryExpression.compile()', function () {
    var node;

    it('should create a tree', function () {
      node = compile('position scale');

      expect(node).toEqual(jasmine.any(AndOperator));
      expect(node.children.length).toBe(2);

      expect(node.children[0]).toEqual(jasmine.any(ComponentSelector));
      expect(node.children[1]).toEqual(jasmine.any(ComponentSelector));

      node = compile('position scale rotation');

      expect(node).toEqual(jasmine.any(AndOperator));
      expect(node.children.length).toBe(3);

      node = compile('position, scale');

      expect(node).toEqual(jasmine.any(OrOperator));
      expect(node.children.length).toBe(2);

      node = compile('position rotation scale, transform');

      expect(node).toEqual(jasmine.any(OrOperator));
      expect(node.children.length).toBe(2);

      expect(node.children[0]).toEqual(jasmine.any(ComponentSelector));
      expect(node.children[1]).toEqual(jasmine.any(AndOperator));
    });
  });

  function compile(expression) {
    return QueryExpression.compile(parse(expression));
  }
});
