'use strict';

module.exports = function (grunt) {
  return {
    'lint:config': ['newer:jshint:config'],
    'lint:js': ['newer:jshint:dist'],
    'lint:dart': [],

    'lint': ['concurrent:lint'],

    'build:js': ['lint:js', 'clean:js', 'browserify', 'uglify'],
    'build:dart': ['lint:dart', 'clean:dart', 'dart2js'],

    'build': ['concurrent:build'],

    'githooks': ['clean:githooks', 'shell:githooks'],

    'default': function () {
      if (grunt.option('js')) grunt.task.run('build:js', 'watch:js', 'watch:config');
      else if (grunt.option('dart')) grunt.task.run('build:dart', 'watch:dart', 'watch:config');
      else grunt.task.run('build', 'watch');
    }
  };
};
