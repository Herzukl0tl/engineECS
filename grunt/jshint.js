'use strict';

module.exports = {
  options: {
    jshintrc: '.jshintrc',
    reporter: require('jshint-stylish')
  },

  dist: ['src/js/**/*.js'],
  config: ['Gruntfile.js', 'grunt/*.js']
};
