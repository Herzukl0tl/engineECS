'use strict';

module.exports = {
  options: {
    banner: '/* ecs <%= grunt.template.today("dd-mm-yyyy") %> */\n'
  },

  dist: {
    src: '<%= browserify.dist.dest %>',
    dest: 'dist/js/<%= package.name %>.min.js'
  }
};
