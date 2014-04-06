'use strict';

var gulp = require('gulp'),
  plugins = require('gulp-load-plugins')();

var map = require('map-stream'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  browserify = require('browserify');

var pkg = require('./package.json');

gulp.task('lint:config', lint(['./gulpfile.js']));
gulp.task('lint:test', lint(['./test/**/*.js']));
gulp.task('lint:scripts', lint(['./src/**/*.js']));

function lint(files) {
  return function () {
    var jshint = plugins.jshint;

    return gulp.src(files)
      .pipe(jshint('./.jshintrc'))
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(exitOnError());
      //.pipe(jshint.reporter('fail'));
  };
}

function exitOnError() {
  return map(function (file, callback) {
    if (!file.jshint.success) {
      process.exit(1);
    }

    callback(null, file);
  });
}

gulp.task('test', ['lint:test'], function () {
  return gulp.src(['./test/**/*.spec.js'])
    .pipe(plugins.jasmine());
});

gulp.task('clean', function () {
  return gulp.src(['./dist/**/*.js'], {read: false})
    .pipe(plugins.clean());
});

gulp.task('build', ['clean', 'lint:scripts', 'test'], function () {
  return browserify('./src/index.js').bundle()
    .pipe(source('index.js'))
    .pipe(buffer())
    .pipe(plugins.rename(pkg.name + '.js'))
    .pipe(gulp.dest('./dist/'))
    .pipe(plugins.uglify())
    .pipe(plugins.rename(pkg.name + '.min.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('watch:config', watch({files: ['./gulpfile.js'], tasks: ['lint:config']}));
gulp.task('watch:test', watch({files: ['./test/**/*.spec.js'], tasks: ['test']}));
gulp.task('watch:scripts', watch({files: ['./src/**/*.js'], tasks: ['build']}));

function watch(options) {
  return function () {
    return gulp.watch(options.files, options.tasks);
  };
}

gulp.task('hooks', function () {
  return gulp.src('./.pre-commit')
    .pipe(plugins.symlink('./.git/hooks', 'pre-commit'));
});

['lint', 'watch'].forEach(function (taskName) {
  gulp.task(taskName, [taskName + ':config', taskName + ':test', taskName + ':scripts']);
});

gulp.task('default', ['hooks', 'build', 'watch']);
