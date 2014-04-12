'use strict';

/* global beforeEach: false */
/* global describe: false */
/* global it:false */
/* global expect: false */
/* global jasmine: false */

var resolver;

resolver = require('./../src/core/resolver');

describe('Resolver spec', function () {
  describe('resolver.name()', function () {
    it('should return `x` given `x`', function () {
      expect(resolver.name('x')).toBe('x');
    });

    it('should return `x` given `x from module`', function () {
      expect(resolver.name('x from module')).toBe('x');
    });

    it('should return `x` given `x as alias`', function () {
      expect(resolver.name('x as alias')).toBe('x');
    });

    it('should return `x` given `x from module as alias`', function () {
      expect(resolver.name('x from module as alias')).toBe('x');
    });

    it('should return `y` given `x` and `y`', function () {
      expect(resolver.name('x', 'y')).toBe('y');
    });

    it('should return `y from module` given `x from module` and `y`', function () {
      expect(resolver.name('x from module', 'y')).toBe('y from module');
    });

    it('should return `y as alias` given `x as alias` and `y`', function () {
      expect(resolver.name('x as alias', 'y')).toBe('y as alias');
    });

    it('should return `y from module as alias` given `x from module as alias` and `y`', function () {
      expect(resolver.name('x from module as alias', 'y')).toBe('y from module as alias');
    });
  });

  describe('resolver.alias()', function () {
    it('should return an empty string given `x`', function () {
      expect(resolver.alias('x')).toBe('');
    });

    it('should return an empty string given `x from module`', function () {
      expect(resolver.alias('x from module')).toBe('');
    });

    it('should return `alias` given `x as alias`', function () {
      expect(resolver.alias('x as alias')).toBe('alias');
    });

    it('should return `alias` given `x from module as alias`', function () {
      expect(resolver.alias('x from module as alias')).toBe('alias');
    });

    it('should return `x as y` given `x` and `y`', function () {
      expect(resolver.alias('x', 'y')).toBe('x as y');
    });

    it('should return `x from module as y` given `x from module` and `y`', function () {
      expect(resolver.alias('x from module', 'y')).toBe('x from module as y');
    });

    it('should return `x as y` given `x as alias` and `y`', function () {
      expect(resolver.alias('x as alias', 'y')).toBe('x as y');
    });

    it('should return `x from module as y` given `x from module as alias` and `y`', function () {
      expect(resolver.alias('x from module as alias', 'y')).toBe('x from module as y');
    });
  });

  describe('resolver.module()', function () {
    it('should return an empty string given `x`', function () {
      expect(resolver.module('x')).toBe('');
    });

    it('should return `module` given `x from module`', function () {
      expect(resolver.module('x from module')).toBe('module');
    });

    it('should return `module` given `x as alias`', function () {
      expect(resolver.module('x as alias')).toBe('');
    });

    it('should return `module` given `x from module as alias`', function () {
      expect(resolver.module('x from module as alias')).toBe('module');
    });

    it('should return `x from y` given `x` and `y`', function () {
      expect(resolver.module('x', 'y')).toBe('x from y');
    });

    it('should return `x from y` given `x from module` and `y`', function () {
      expect(resolver.module('x from module', 'y')).toBe('x from y');
    });

    it('should return `x from y as alias` given `x as alias` and `y`', function () {
      expect(resolver.module('x as alias', 'y')).toBe('x from y as alias');
    });

    it('should return `x from y as alias` given `x from module as alias` and `y`', function () {
      expect(resolver.module('x from module as alias', 'y')).toBe('x from y as alias');
    });
  });

  describe('resolver.identity()', function () {
    it('should return throw an error given `x`', function () {
      var error = false;

      try {
        resolver.identity('x');
      } catch (oO) {
        error = true;
      }

      expect(error).toBe(true);
    });

    it('should return `x from module` given `x from module`', function () {
      expect(resolver.identity('x from module')).toBe('x from module');
    });

    it('should throw an error given `x as alias`', function () {
      var error = false;

      try {
        resolver.identity('x as alias');
      } catch (oO) {
        error = true;
      }

      expect(error).toBe(true);
    });

    it('should return `x from module` given `x from module as alias`', function () {
      expect(resolver.identity('x from module as alias')).toBe('x from module');
    });
  });
});
