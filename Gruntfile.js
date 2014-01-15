module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['gruntfile.js', 'src/js/**/*.js'],
      jshintrc: true
    },
    browserify: {
      all: {
        src: 'src/js/**/*.js',
        dest:'dist/<%= pkg.name %>.js'
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
        dest:'dist/<%= pkg.name %>.dart.js',
      },
    },
    watch: {
      js: {
        files: ['gruntfile.js', 'src/js/**/*.js'],
        tasks: ['jshint', 'build:js']
      },
      lint: {
        files: ['gruntfile.js', 'src/js/**/*.js'],
        tasks: ['jshint']
      },
      build: {
        files: ['src/js/**/*.js', 'src/dart/**/*.js'],
        tasks: ['build:js', 'build:dart']
      }
    }
  });

  [
    'grunt-contrib-jshint',
    'grunt-browserify',
    'grunt-contrib-uglify',
    'grunt-dart2js',
    'grunt-contrib-watch'
  ].forEach(grunt.loadNpmTasks);

  grunt.registerTask('build:js', ['browserify', 'uglify:js']);
  grunt.registerTask('build:dart', ['dart2js', 'uglify:dart']);

  grunt.registerTask('build', ['build:js', 'build:dart']);

  grunt.registerTask('default', ['jshint', 'build']);
};
