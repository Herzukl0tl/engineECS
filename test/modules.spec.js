'use strict';

/* global beforeEach: false */
/* global describe: false */
/* global it:false */
/* global expect: false */
/* global jasmine: false */

var nuclear, Module, Component, Entity, System;

nuclear = require('../src/core');

Module = require('../src/core/module');
Component = require('../src/core/component');
Entity = require('../src/core/entity');
System = require('../src/core/system');

beforeEach(function () {
  nuclear.registry.clear();
});

describe('Modules spec', function () {
  it('it should define a module', function () {
    var myModule = nuclear.module('my-module', []);

    expect(myModule).toEqual(jasmine.any(Module));
    expect(myModule.name).toBe('my-module');
    expect(myModule.requires).toEqual([]);
  });

  it('should trim the module name', function () {
    var myModule = nuclear.module('    my-module       ', []);

    expect(myModule.name).toBe('my-module');
  });

  describe('Components, Entities and Systems definitions', function () {
    var myModule;

    beforeEach(function () {
      myModule = nuclear.module('my-module', []);
    });

    it('should define a component', function () {
      myModule.component('my-component', function () {});

      expect(myModule.component('my-component')).toEqual(jasmine.any(Component));
      expect(myModule.component('my-component')).toEqual(myModule.components['my-component']);
    });

    it('should define an entity', function () {
      myModule.entity('my-entity', function () {});

      expect(myModule.entity('my-entity')).toEqual(jasmine.any(Entity));
      expect(myModule.entity('my-entity')).toBe(myModule.entities['my-entity']);
    });

    it('should define a system', function () {
      myModule.system('my-system', [], function () {});

      expect(myModule.system('my-system')).toEqual(jasmine.any(System));
      expect(myModule.system('my-system')).toBe(myModule.systems['my-system']);
    });
  });

  describe('Modules import', function () {
    var myModule;

    beforeEach(function () {
      myModule = nuclear.module('my-module', [])
        .component('my-component', function () {})
        .entity('my-entity', function () {})
        .system('my-system', [], function () {});
    });

    it('should import a module', function () {
      nuclear.import([myModule]);
      expect(nuclear.module('my-module')).toEqual(jasmine.any(Module));
    });

    it('should import everything defined inside a module', function () {
      nuclear.import([myModule]);

      expect(nuclear.component('my-component')).toBe(myModule.component('my-component'));
      expect(nuclear.entity('my-entity')).toBe(myModule.entity('my-entity'));
      expect(nuclear.system('my-system')).toBe(myModule.system('my-system'));
    });

    it('should throw an error if a module is imported before his dependencies', function () {
      var myOtherModule = nuclear.module('my-other-module', ['my-module']),
        error = false;

      try {
        nuclear.import([myOtherModule]);
      } catch(oO) {
        error = true;
      }

      expect(error).toBe(true);
    });

    it('should throw an error if a non imported module is accessed', function () {
      var error = false;

      try {
        nuclear.module('my-other-module');
      } catch (oO) {
        error = true;
      }

      expect(error).toBe(true);
    });

    it('should get `my-component` from the last imported module who define it', function () {
      var myOtherModule = nuclear.module('my-other-module', [])
        .component('my-component', function () {});

      nuclear.import([myModule, myOtherModule]);

      expect(nuclear.component('my-component')).toBe(myOtherModule.component('my-component'));
    });

    it('should get `my-component` from the explicit module', function () {
      var myOtherModule = nuclear.module('my-other-module', [])
        .component('my-component', function () {});

      nuclear.import([myModule, myOtherModule]);

      expect(nuclear.component('my-component from my-module')).toBe(myModule.component('my-component'));
    });
  });
});
