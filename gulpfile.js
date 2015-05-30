'use strict';
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var istanbul = require('gulp-istanbul');
var coveralls = require('gulp-coveralls');
var mocha = require('gulp-spawn-mocha');
var batch = require('gulp-batch');
var betterConsole = require('better-console');
var jsdoc = require('gulp-jsdoc');
var jsPaths = ['*.js', 'lib/**/*.js', 'test/**/*.js'];
var zip = require('gulp-zip');

var test = function(cb) {
  return gulp.src(['lib/**/*.js', 'index.js'])
    .pipe(istanbul())
    .on('finish', function() {
      gulp.src(['test/*.js'])
        .pipe(mocha({reporter: 'spec', istanbul: true}))
        .on('end', cb);
    });
};

var lint = function() {
  return gulp.src(jsPaths)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
};

var clear = function() {
  betterConsole.clear();
};

gulp.task('default', ['lint', 'test', 'jsdoc']);

gulp.task('ci', ['lint', 'test', 'coveralls']);

gulp.task('watch', function() {
  gulp.watch(jsPaths, batch(function(events, cb) {
    clear();
    lint();
    test(function() {
      cb();
    });
  }));
});

gulp.task('lint', function() {
  lint();
});

gulp.task('test', function(cb) {
  test(function() {
    cb();
  });
});

gulp.task('coveralls', ['test'], function() {
  return gulp.src('coverage/lcov.info').pipe(coveralls());
});

gulp.task('jsdoc', function() {
  return gulp.src(['lib/goldwasher-needle.js', 'README.md'])
    .pipe(jsdoc('./docs'));
});

gulp.task('zip', function() {
  return gulp.src([
      'index.js',
      'lib/**/*.*',
      'node_modules/goldwasher/**/*.*',
      'node_modules/goldwasher-needle/**/*.*',
      'package.json',
      'README.md'
    ], {base: './'})
    .pipe(zip('goldwasher-aws-lambda.zip'))
    .pipe(gulp.dest('dist'));
});