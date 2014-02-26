'use strict';

var gulp = require('gulp'),
  tasks = require('gulp-load-tasks')(),
  pkg = require('./package.json');

// todo
gulp.task('beautify', function () {});

gulp.task('lint:js', function () {
  return gulp.src(['./Gulpfile.js', './src/js/**/*.js'])
    .pipe(tasks.jshint('.jshintrc'))
    .pipe(tasks.jshint.reporter('jshint-stylish'));
});

gulp.task('build:js', ['lint:js'], function () {
  return gulp.src(['./dist/js/*', '!./dist/dart/.gitignore'], {read: false})
    .pipe(tasks.clean())
    .on('end', function () {
      gulp.src('./src/js/*.js')
        .pipe(tasks.browserify())
        .pipe(tasks.rename(pkg.name + '.js'))
        //.pipe(tasks.jsdox({output : './doc/js'}))
        .pipe(gulp.dest('./dist/js'))
        .pipe(tasks.uglify())
        .pipe(tasks.rename(pkg.name + '.min.js'))
        .pipe(gulp.dest('dist/js'));
    });
});

gulp.task('watch:js', function () {
  return gulp.watch(['./Gulpfile.js', './src/js/**/*.js'], function () {
    gulp.run('build:js');
  });
});

gulp.task('default:js', ['build:js'], function () {
  gulp.run('watch:js');
});

// todo
gulp.task('lint:dart', function () {});

gulp.task('build:dart', ['lint:dart'], function () {
  return gulp.src(['./dist/dart/*', '!./dist/dart/.gitignore'], {read: false})
    .pipe(tasks.clean())
    .on('end', function () {
      // ./lib/dart-sdk/bin must be in PATH
      gulp.src('./src/dart/*.dart')
        .pipe(tasks.dart2js('./dist/dart/'));
    });
});

gulp.task('watch:dart', function () {
  return gulp.watch('./src/dart/**/*.dart', function () {
    gulp.run('build:dart');
  });
});

gulp.task('default:dart', ['build:dart'], function () {
  gulp.run('watch:dart');
});

['build', 'watch', 'lint'].forEach(function (name) {
  gulp.task(name, [name + ':js', name + ':dart']);
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
  if ('js' in gulp.env) gulp.run('default:js');
  else if ('dart' in gulp.env) gulp.run('default:dart');
  else gulp.run('default:js', 'default:dart');
});

//gulp.task('jsdox:js', function() {
//  gulp.src(['./src/js/**/*.js'])
//    .pipe(tasks.jsdox({output : './doc/js', root : 'js'}));
//});
