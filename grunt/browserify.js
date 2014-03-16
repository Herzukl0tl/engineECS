'use strict';

module.exports = {
  options: {
    alias: [
      'lib/js/events-emitter.min.js:events',
      'src/js/core/index.js:nuclear'
    ]
  },

  dist: {
    src: 'src/js/main.js',
    dest: 'dist/js/<%= package.name %>.js'
  }
};
