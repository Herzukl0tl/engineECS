'use strict';

module.exports = {
  options: {
    dart2js_bin: 'lib/dart-sdk/bin/dart2js',
  },

  dist: {
    src: 'src/dart/*.dart',
    dest: 'dist/dart/<%= package.name %>.dart.js',
  }
};
