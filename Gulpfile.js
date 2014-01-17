'use strict';

var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  exec = require('gulp-exec'),
  browserify = require('gulp-browserify'),
  uglify = require('gulp-uglify'),
  clean = require('gulp-clean'),
  dart2js = require('gulp-dart2js'),
  rename = require('gulp-rename'),
  pkg = require('./package.json');

['default', 'watch', 'build', 'lint'].forEach(function (name) {
  gulp.task(name, function () {
    if ('js' in gulp.env) gulp.run(name + ':js');
    else if ('dart' in gulp.env) gulp.run(name + ':dart');
    else gulp.run(name + ':js', name + ':dart');
  });
});

gulp.task('lint:js', function () {
  return gulp.src(['./Gulpfile.js', './src/js/**/*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('clean:js', function () {
  return gulp.src('./dist/js/*', {read: false})
    .pipe(clean());
});

gulp.task('browserify', ['clean:js'], function () {
  return gulp.src('./src/js/*.js')
    .pipe(browserify())
    .pipe(rename(pkg.name + '.js'))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('uglify', ['browserify'], function () {
  gulp.src('./dist/js/' + pkg.name + '.js')
    .pipe(uglify())
    .pipe(rename(pkg.name + '.min.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('build:js', ['lint:js', 'uglify']);

gulp.task('watch:js', function () {
  gulp.watch(['./Gulpfile.js', './src/js/**/*.js'], function () {
    gulp.run('build:js');
  });
});

gulp.task('default:js', ['build:js'], function () {
  gulp.run('watch:js');
});

gulp.task('lint:dart', function () {
  return gulp.src('./')
    .pipe(exec('dartanalyzer ./src/dart/**/*.dart'));
});

gulp.task('clean:dart', function () {
  return gulp.src('./dist/dart/*', {read: false})
    .pipe(clean());
});

gulp.task('dart2js', ['clean:dart'], function () {
  gulp.src('./src/dart/*.dart')
    .pipe(dart2js('./dist/dart/'));
});

gulp.task('build:dart', ['lint:dart', 'dart2js']);

gulp.task('watch:dart', function () {
  gulp.watch('./src/dart/**/*.dart', function () {
    gulp.run('build:dart');
  });
});

gulp.task('default:dart', ['build:dart'], function () {
  gulp.run('watch:dart');
});
