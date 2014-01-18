'use strict';

var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  browserify = require('gulp-browserify'),
  uglify = require('gulp-uglify'),
  clean = require('gulp-clean'),
  dart2js = require('gulp-dart2js'),
  rename = require('gulp-rename'),
  pkg = require('./package.json');

gulp.task('lint:js', function () {
  return gulp.src(['./Gulpfile.js', './src/js/**/*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('clean:js', function () {
  return gulp.src('./dist/js/*', {read: false})
    .pipe(clean());
});

gulp.task('build:js', ['lint:js', 'clean:js'], function () {
  return gulp.src('./src/js/*.js')
    .pipe(browserify())
    .pipe(rename(pkg.name + '.js'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(uglify())
    .pipe(rename(pkg.name + '.min.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('watch:js', function () {
  gulp.watch(['./Gulpfile.js', './src/js/**/*.js'], function () {
    gulp.run('build:js');
  });
});

gulp.task('default:js', ['build:js'], function () {
  gulp.run('watch:js');
});

gulp.task('clean:dart', function () {
  return gulp.src('./dist/dart/*', {read: false})
    .pipe(clean());
});

gulp.task('build:dart', ['clean:dart'], function () {
  return gulp.src('./src/dart/*.dart')
    .pipe(dart2js('./dist/dart/'));
});

gulp.task('watch:dart', function () {
  gulp.watch('./src/dart/**/*.dart', function () {
    gulp.run('build:dart');
  });
});

gulp.task('default:dart', ['build:dart'], function () {
  gulp.run('watch:dart');
});

['build', 'watch'].forEach(function (name) {
  gulp.task(name, [name + ':js', name + ':dart']);
});

gulp.task('default', function () {
  if ('js' in gulp.env) gulp.run('default:js');
  else if ('dart' in gulp.env) gulp.run('default:dart');
  else gulp.run('default:js', 'default:dart');
});
