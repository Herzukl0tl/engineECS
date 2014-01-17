'use strict';

module.exports = function (grunt) {
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
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      }
    },
    clean: {
      js: 'dist/js/*',
      dart: 'dist/dart/*'
    },
    browserify: {
      all: {
        src: 'src/js/**/*.js',
        dest: 'dist/js/<%= pkg.name %>.js'
      }
    },
    uglify: {
      all: {
        src: '<%= browserify.all.dest %>',
        dest: 'dist/js/<%= pkg.name %>.min.js'
      },
      options: {
        banner: '/* <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      }
    },
    dart2js: {
      all: {
        src: 'src/dart/*.dart',
        dest: 'dist/dart/<%= pkg.name %>.dart.js',
      },
      options: {
        dart2js_bin: 'lib/dart-sdk/bin/dart2js',
      }
    },
    watch: {
      js: {
        files: ['Gruntfile.js', 'src/js/**/*.js'],
        tasks: ['build:js']
      },
      dart: {
        files: ['src/dart/**/*.dart'],
        tasks: ['build:dart']
      }
    }
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask('beautify', ['jsbeautifier:modify']);
  grunt.registerTask('lint', ['jsbeautifier:verify', 'jshint']);
  grunt.registerTask('build:js', ['jshint', 'beautify', 'clean:js', 'browserify', 'uglify']);
  grunt.registerTask('build:dart', ['clean:dart', 'dart2js']);
  grunt.registerTask('build', ['build:js', 'build:dart']);

  grunt.registerTask('default', function () {
    if (grunt.option('js')) grunt.task.run('build:js', 'watch:js');
    else if (grunt.option('dart')) grunt.task.run('build:dart', 'watch:dart');
    else grunt.task.run('build', 'watch');
  });
};
