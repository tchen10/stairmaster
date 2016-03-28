'use strict';

var gulp = require('gulp');
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var del = require('del');
var cleanCSS = require('gulp-clean-css');
var angularProtractor = require('gulp-angular-protractor');
var gutil = require('gulp-util');
var karma = require('karma').server;
var runSequence = require('run-sequence');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var replace = require('gulp-replace');


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

gulp.task('firebase-dev', function() {
    gulp.src(['app/components/firebase/firebase.js'])
        .pipe(replace(/https(.*)com\//g, 'https://stairmaster-dev.firebaseio.com/'))
        .pipe(gulp.dest('app/components/firebase'));
    gulp.src(['tests-e2e/helpers/testHelper.js'])
        .pipe(replace(/https(.*)com\//g, 'https://stairmaster-dev.firebaseio.com/'))
        .pipe(gulp.dest('tests-e2e/helpers'));
});

gulp.task('firebase-ci', function() {
    gulp.src(['app/components/firebase/firebase.js'])
        .pipe(replace(/https(.*)com\//g, 'https://stairmaster-ci.firebaseio.com/'))
        .pipe(gulp.dest('app/components/firebase'));
    gulp.src(['tests-e2e/helpers/testHelper.js'])
        .pipe(replace(/https(.*)com\//g, 'https://stairmaster-ci.firebaseio.com/'))
        .pipe(gulp.dest('tests-e2e/helpers'));
});

gulp.task('firebase-qa', function() {
    gulp.src(['app/components/firebase/firebase.js'])
        .pipe(replace(/https(.*)com\//g, 'https://stairmaster-qa.firebaseio.com/'))
        .pipe(gulp.dest('app/components/firebase'));
    gulp.src(['firebase.json'])
        .pipe(replace(/\"stair(.*)\"/g, '"stairmaster-qa"'))
        .pipe(gulp.dest(''));
});

gulp.task('firebase-prod', function() {
    gulp.src(['app/components/firebase/firebase.js'])
        .pipe(replace(/https(.*)com\//g, 'https://stairmaster.firebaseio.com/'))
        .pipe(gulp.dest('app/components/firebase'));
    gulp.src(['firebase.json'])
        .pipe(replace(/\"stair(.*)\"/g, '"stairmaster"'))
        .pipe(gulp.dest(''));
});

gulp.task('lint', function() {
    gulp.src(['app/**/*.js', '!app/bower_components/**', '!app/bundle.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('minify-css-dist', function() {
    return gulp.src(['app/**/*.css', '!./app/bower_components/**'])
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('copy-bower-components', function() {
    gulp.src('app/bower_components/**')
        .pipe(gulp.dest('dist/bower_components'));
});

gulp.task('copy-html-files', ['clean'], function() {
    gulp.src('app/**/*.html')
        .pipe(gulp.dest('dist/'));
});

gulp.task('browserify', function() {
    var b = browserify({
        entries: 'app/app.js',
        debug: true
    });
    return b.bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('app/'));
});

gulp.task('browserify-dist', function() {
    var b = browserify({
        entries: 'app/app.js'
    });
    return b.bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(uglify({ mangle: false }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('watch', function() {
    gulp.watch(['app/**/*.js', '!app/bower_components/**'], ['browserify']);
});

gulp.task('dev', ['firebase-dev', 'lint', 'browserify', 'watch', 'connect']);

gulp.task('prod-local', ['firebase-dev', 'lint', 'minify-css-dist', 'browserify-dist', 'copy-html-files', 'copy-bower-components', 'connectDist']);

gulp.task('snap', ['firebase-ci', 'lint', 'minify-css-dist', 'browserify-dist', 'copy-html-files', 'copy-bower-components']);

gulp.task('qa', ['firebase-qa', 'minify-css-dist', 'browserify-dist', 'copy-html-files', 'copy-bower-components']);

gulp.task('prod', ['firebase-prod', 'minify-css-dist', 'browserify-dist', 'copy-html-files', 'copy-bower-components']);

// TESTING

// run unit tests once
gulp.task('unit', function(done) {
    karma.start({
        configFile: __dirname + '/tests/karma.conf.js',
        singleRun: true
    }, done);
});

// watch for file changes and re-run unit tests on each change
gulp.task('tdd', function(done) {
    karma.start({
        configFile: __dirname + '/tests/karma.conf.js'
    }, done);
});

// run protractor tests
gulp.task('protractor', function(callback) {
    gulp.src('tests-e2e/*.spec.js')
        .pipe(angularProtractor({
            'configFile': 'tests-e2e/protractor.conf.js',
            'debug': true,
            'autoStartStopServer': true
        }))
        .on('error', function(e) {
            gutil.log(e);
        })
        .on('end', callback);
});

gulp.task('protractor-snap', ['connectDist'], function() {
    gulp.src('tests-e2e/*.spec.js')
        .pipe(angularProtractor({
            'configFile': 'tests-e2e/protractor.ci.conf.js',
            'debug': true,
            'autoStartStopServer': true
        }))
        .on('error', function(e) {
            gutil.log(e);
            connect.serverClose();
        })
        .on('end', function() {
            connect.serverClose();
        });
});

// run all tests
gulp.task('test', function() {
    runSequence(
        ['unit'], ['protractor']
    );
});
