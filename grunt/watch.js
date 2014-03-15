'use strict';

module.exports = {
  config: {
    files: ['Gruntfile.js', 'grunt/*.js'],
    tasks: ['lint:config']
  },
  js: {
    files: ['src/js/**/*.js'],
    tasks: ['build:js']
  },
  dart: {
    files: ['src/dart/**/*.dart'],
    tasks: ['build:dart']
  }
};
