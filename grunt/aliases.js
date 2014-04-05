'use strict';

module.exports = function (grunt) {
  return {
    'lint:config': ['newer:jshint:config'],
    'lint:scripts': ['newer:jshint:dist'],

    'lint': ['concurrent:lint'],

    'test': ['jasmine_node'],

    'build': ['lint:scripts', 'test', 'clean:scripts', 'browserify', 'uglify'],

    'hooks': ['clean:hooks', 'shell:hooks'],

    'default': function () {
      grunt.task.run('build', 'watch');
    }
  };
};
