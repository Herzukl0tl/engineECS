'use strict';

module.exports = {
  config: {
    files: ['Gruntfile.js', 'grunt/*.js'],
    tasks: ['lint:config']
  },
  scripts: {
    files: ['src/**/*.js'],
    tasks: ['build:scripts']
  },
  test: {
    files: ['test/**/*.spec.js'],
    tasks: ['test']
  }
};
