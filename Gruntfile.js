module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jsbeautifier: {
      modify: {
        src: ['Gruntfile.js', 'src/js/**/*.js'],
        options: {
          config: '.jsbeautifyrc'
        }
      },
      verify: {
        src: ['Gruntfile.js', 'src/js/**/*.js'],
        options: {
          mode: 'VERIFY_ONLY',
          config: '.jsbeautifyrc'
        }
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'src/js/**/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    browserify: {
      all: {
        src: 'src/js/**/*.js',
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      js: {
        src: '<%= browserify.all.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
      },
      dart: {
        src: '<%= dart2js.all.dest %>',
        dest: 'dist/<%= pkg.name %>.dart.min.js'
      },
      options: {
        banner: '/* <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      }
    },
    dart2js: {
      all: {
        src: 'src/dart/**/*.dart',
        dest: 'dist/<%= pkg.name %>.dart.js',
      },
      options : {
        dart2js_bin : "./lib/dart-sdk/bin/dart2js",
      }
    },
    watch: {
      js: {
        files: ['Gruntfile.js', 'src/js/**/*.js'],
        tasks: ['lint', 'build:js']
      },
      lint: {
        files: ['Gruntfile.js', 'src/js/**/*.js'],
        tasks: ['lint']
      },
      build: {
        files: ['src/js/**/*.js', 'src/dart/**/*.js'],
        tasks: ['build:js', 'build:dart']
      }
    }
  });

  [
    'grunt-jsbeautifier',
    'grunt-contrib-jshint',
    'grunt-browserify',
    'grunt-contrib-uglify',
    'grunt-dart2js',
    'grunt-contrib-watch'
  ].forEach(grunt.loadNpmTasks);

  grunt.registerTask('beautify', ['jsbeautifier:modify']);

  grunt.registerTask('lint', ['jsbeautifier:verify', 'jshint']);

  grunt.registerTask('build:js', ['beautify', 'browserify', 'uglify:js']);
  grunt.registerTask('build:dart', ['dart2js', 'uglify:dart']);

  grunt.registerTask('build', ['build:js', 'build:dart']);

  grunt.registerTask('default', ['lint', 'build']);
};
