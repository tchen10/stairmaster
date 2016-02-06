'use strict';

var gulp = require('gulp');
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var del = require('del');
var nano = require('gulp-cssnano');
var angularProtractor = require('gulp-angular-protractor');
var gutil = require('gulp-util');
var karma = require('karma').server;
var runSequence = require('run-sequence');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

gulp.task('connect', function() {
    connect.server({
    root: 'app/',
    port: 8888
    });
});

gulp.task('connectDist', function() {
    connect.server({
    root: 'dist/',
    port: 9999
    });
});

gulp.task('clean', function() {
    return del([
        'dist/*',
        'app/bundle.js'
    ]);
});

gulp.task('lint', function() {
    gulp.src(['app/**/*.js', '!app/bower_components/**', '!app/bundle.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('minify-css-dist', function() {
    return gulp.src(['app/**/*.css', '!./app/bower_components/**'])
        .pipe(nano())
        .pipe(gulp.dest('dist/'));
});

gulp.task('copy-bower-components', function () {
    gulp.src('app/bower_components/**')
        .pipe(gulp.dest('dist/bower_components'));
});

gulp.task('copy-html-files', ['clean'], function () {
    gulp.src('app/**/*.html')
        .pipe(gulp.dest('dist/'));
});

gulp.task('browserify', function() {
    return browserify('app/app.js')
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('app/'));
});

gulp.task('browserify-dist', function() {
    return browserify('app/app.js')
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('dist/'));
});

gulp.task('watch', function() {
    gulp.watch(['app/**/*.js', '!app/bower_components/**'], ['browserify']);
});

gulp.task('dev', ['lint', 'browserify', 'watch', 'connect']);

gulp.task('prod', ['lint', 'minify-css-dist', 'browserify-dist', 'copy-html-files', 'copy-bower-components', 'connectDist']);


// TESTING

// run unit tests once
gulp.task('unit', function (done) {
    karma.start({
        configFile: __dirname + '/tests/karma.conf.js',
        singleRun: true
    }, done);
});

// watch for file changes and re-run unit tests on each change
gulp.task('tdd', function (done) {
    karma.start({
    configFile: __dirname + '/tests/karma.conf.js'
    }, done);
});

// run protractor tests
gulp.task('protractor', function (callback) {
    gulp.src('tests-e2e/*.spec.js')
        .pipe(angularProtractor({
            'configFile': 'tests-e2e/protractor.conf.js',
            'debug': false,
            'autoStartStopServer': true
        }))
        .on('error', function(e) {
            gutil.log(e);
        })
        .on('end', callback);
});

// run all tests
gulp.task('test', function() {
    runSequence(
        ['unit'],
        ['protractor']
    );
});
