'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: require('./package.json'),
    jsbeautifier: {
      modify: {
        src: ['Gruntfile.js', 'src/**/*.js'],
        options: {
          config: '.jsbeautifyrc'
        }
      },
      verify: {
        src: ['Gruntfile.js', 'src/**/*.js'],
        options: {
          mode: 'VERIFY_ONLY',
          config: '.jsbeautifyrc'
        }
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'src/**/*.js'],
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      }
    },
    clean: {
      js: ['dist/*', '!dist/.gitignore'],
      githooks: '.git/hooks/pre-commit'
    },
    browserify: {
      all: {
        src: 'src/**/*.js',
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      all: {
        src: '<%= browserify.all.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
      },
      options: {
        banner: '/* <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      }
    },
    watch: {
      js: {
        files: ['Gruntfile.js', 'src/**/*.js'],
        tasks: ['build:js']
      }
    },
    shell: {
      githooks: {
        command: 'ln -s ../../githooks/pre-commit .git/hooks/pre-commit'
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('beautify', ['newer:jsbeautifier:modify']);

  grunt.registerTask('lint:js', ['newer:jsbeautifier:verify', 'newer:jshint']);

  grunt.registerTask('build:js', ['newer:jshint', 'beautify', 'clean:js', 'browserify', 'uglify']);

  ['build', 'lint'].forEach(function (name) {
    grunt.registerTask(name, [name + ':js']);
  });

  grunt.registerTask('githooks', ['clean:githooks', 'shell:githooks']);

  grunt.registerTask('default', function () {
    grunt.task.run('build', 'watch');
  });
};
