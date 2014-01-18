'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: require('./package.json'),
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
      dart: 'dist/dart/*',
      githooks: '.git/hooks/pre-commit'
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
    },
    shell: {
      githooks: {
        command: 'ln -s ../../hooks/pre-commit .git/hooks/pre-commit'
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('beautify', ['newer:jsbeautifier:modify']);

  grunt.registerTask('lint:js', ['newer:jsbeautifier:verify', 'newer:jshint']);
  // todo
  grunt.registerTask('lint:dart', []);

  grunt.registerTask('build:js', ['newer:jshint', 'beautify', 'clean:js', 'browserify', 'uglify']);
  grunt.registerTask('build:dart', ['clean:dart', 'dart2js']);

  ['build', 'lint'].forEach(function (name) {
    grunt.registerTask(name, [name + ':js', name + ':dart']);
  });

  grunt.registerTask('githooks', ['clean:githooks', 'shell:githooks']);

  grunt.registerTask('default', function () {
    if (grunt.option('js')) grunt.task.run('build:js', 'watch:js');
    else if (grunt.option('dart')) grunt.task.run('build:dart', 'watch:dart');
    else grunt.task.run('build', 'watch');

    grunt.task.run('githooks');
  });
};
