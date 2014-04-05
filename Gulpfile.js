'use strict';

var gulp = require('gulp'),
  tasks = require('gulp-load-tasks')(),
  pkg = require('./package.json');

// todo
gulp.task('beautify', function () {});

gulp.task('lint:js', function () {
  return gulp.src(['./Gulpfile.js', './src/**/*.js'])
    .pipe(tasks.jshint('.jshintrc'))
    .pipe(tasks.jshint.reporter('jshint-stylish'));
});

gulp.task('build:js', ['lint:js'], function () {
  return gulp.src(['./dist/*', '!./dist/dart/.gitignore'], {read: false})
    .pipe(tasks.clean())
    .on('end', function () {
      gulp.src('./src/*.js')
        .pipe(tasks.browserify())
        .pipe(tasks.rename(pkg.name + '.js'))
        //.pipe(tasks.jsdox({output : './doc'}))
        .pipe(gulp.dest('./dist'))
        .pipe(tasks.uglify())
        .pipe(tasks.rename(pkg.name + '.min.js'))
        .pipe(gulp.dest('dist'));
    });
});

gulp.task('watch:js', function () {
  return gulp.watch(['./Gulpfile.js', './src/**/*.js'], function () {
    gulp.run('build:js');
  });
});

gulp.task('default:js', ['build:js'], function () {
  gulp.run('watch:js');
});

['build', 'watch', 'lint'].forEach(function (name) {
  gulp.task(name, [name + ':js']);
});

gulp.task('githooks', function () {
  return gulp.src('./.git/hooks/pre-commit', {read: false})
    .pipe(tasks.clean())
    .on('end', function () {
      gulp.src('./')
        .pipe(tasks.exec('ln -s ../../githooks/pre-commit .git/hooks/pre-commit'));
    });
});

// todo: port the complete grunt-bump task to gulp
gulp.task('bump', function () {
  var options = {type: 'patch'};

  if ('major' in gulp.env) options.type = 'major';
  else if ('minor' in gulp.env) options.type = 'minor';

  return gulp.src('./package.json')
    .pipe(tasks.bump(options))
    .pipe(gulp.dest('./package.json'));
});

gulp.task('default', function () {
    gulp.run('default:js');
});
