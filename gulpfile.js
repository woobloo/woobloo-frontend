var gulp        = require('gulp');
var gutil       = require('gulp-util');
var source      = require('vinyl-source-stream');
var babelify    = require('babelify');
var watchify    = require('watchify');
var exorcist    = require('exorcist');
var browserify  = require('browserify');
var browserSync = require('browser-sync').create();
var esdoc = require("gulp-esdoc");

// Input file.
watchify.args.debug = true;
var bundler = watchify(browserify('./src/app.js', watchify.args));

// Babel transform
bundler.transform(babelify.configure({
    sourceMapRelative: 'src'
}));

// On updates recompile
bundler.on('update', bundle);

function bundle() {

    gutil.log('Compiling JS...');

    return bundler.bundle()
        .on('error', function (err) {
            gutil.log(err.message);
            browserSync.notify("Browserify Error!");
            this.emit("end");
        })
        .pipe(exorcist('dist/app.js.map'))
        .pipe(source('app.js'))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream({once: true}));
}

/**
 * Gulp task alias
 */
gulp.task('bundle', function () {
    return bundle();
});

/**
 * Copy public resources
 */
gulp.task('copy', function() {
  gulp.src('src/images/**')
    .pipe(gulp.dest('dist/images'));

  gulp.src('src/css/**')
    .pipe(gulp.dest('dist/css'));

  gulp.src('src/*.html')
    .pipe(gulp.dest('dist'));
});

/**
  * Generate Documentation
  */
gulp.task('docs', function(){
  gulp.src("./src")
    .pipe(esdoc({ destination: "./docs" }));
});

/**
 * First bundle, then serve from the ./app directory
 */
gulp.task('default', ['bundle', 'copy'], function () {
    browserSync.init({
        server: "./dist"
    });
});
