'use strict';

module.exports = {
  options: {
    jshintrc: '.jshintrc',
    reporter: require('jshint-stylish')
  },

  dist: ['src/**/*.js'],
  config: ['Gruntfile.js', 'grunt/*.js']
};