var _ = require('lodash'),
    bower = require('bower'),
    concat = require('gulp-concat'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    inject = require('gulp-inject'),
    minifyCss = require('gulp-minify-css'),
    path = require('path'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    sh = require('shelljs'),
    sort = require('gulp-sort'),
    util = require('gulp-util'),
    watch = require('gulp-watch');

var appDir = 'www/app',
    wikitudeDir = 'www/wikitude-worlds';

var paths = {
  sass: [ './scss/**/*.scss' ],
  appIndex: 'www/index.html',
  appSources: { files: [ '**/*.js', '**/*.css' ], cwd: appDir },
  wikitudeIndex: path.join(wikitudeDir, 'main/index.html'),
  wikitudeSources: { files: [ '**/*.js', '**/*.css' ], cwd: wikitudeDir }
};

gulp.task('default', [ 'compile', 'inject', 'watch' ]);

gulp.task('compile', [ 'sass' ]);
gulp.task('inject', [ 'inject:app', 'inject:wikitude' ]);
gulp.task('watch', [ 'watch:app', 'watch:sass', 'watch:wikitude' ]);

var injectAppSources = injectSourcesFactory('app', paths.appIndex, paths.appSources),
    injectWikitudeSources = injectSourcesFactory('wikitude', paths.wikitudeIndex, paths.wikitudeSources);

gulp.task('inject:app', injectAppSources);
gulp.task('inject:wikitude', injectWikitudeSources);
gulp.task('watch:app', watchSourcesFactory(injectAppSources, paths.appSources));
gulp.task('watch:wikitude', watchSourcesFactory(injectWikitudeSources, paths.wikitudeSources));

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch:sass', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

function watchSourcesFactory(injectTask, sourcesPath) {
  return function() {

    var debouncedInject = _.debounce(injectTask, 500);

    return watchPath(sourcesPath, function(file) {
      if (file.event == 'add' || file.event == 'unlink') {
        debouncedInject();
      }
    });
  };
}

function injectSourcesFactory(name, indexPath, sourcesPath) {
  return function() {
    util.log('Injecting ' + util.colors.blue(name) + ' sources');

    var sources = pathToGulpSrc(sourcesPath, { read: false })
      .pipe(sort(compareAngularFiles));

    return pathToGulpSrc(indexPath)
      .pipe(inject(sources, { relative: true }))
      .pipe(gulp.dest(path.dirname(indexPath)));
  };
}

function pathToGulpSrc(path, options) {
  var args = gulpifyPath(path, options);
  return gulp.src.apply(gulp, args);
}

function watchPath(path, options, callback) {

  if (typeof(options) == 'function') {
    callback = options;
    options = {};
  }

  var args = gulpifyPath(path, options);
  args.push(callback);

  return watch.apply(undefined, args);
}

/**
 * Takes multiple path formats and transforms them into an argument array
 * that can be used with `gulp.src` or `watch`.
 *
 * * `gulpifyPath("/path/to/file")`                                          -> `[ "/path/to/file" ]`
 * * `gulpifyPath([ "/f1", "/f2" ])`                                         -> `[ [ "/f1", "/f2" ] `
 * * `gulpifyPath({ files: "/path/to/file", cwd: "/base" })`                 -> `[ "/path/to/file", { cwd: base } ]`
 * * `gulpifyPath({ files: [ "f1", "f2" ], cwd: "/base" })`                  -> `[ [ "f1", "f2" ], { cwd: base } ]`
 * * `gulpifyPath({ files: [ "f1", "f2" ], cwd: "/base" }, { read: false })` -> `[ [ "f1", "f2" ], { cwd: base, read: false } ]`
 */
function gulpifyPath(path, options) {
  if (_.isArray(path) || _.isString(path)) {
    return [ path, {} ];
  } else if (_.isArray(path.files) || _.isString(path.files)) {
    var pathOptions = _.omit(path, 'files');
    return [ path.files, _.extend({}, pathOptions, options) ];
  } else {
    throw new Error('Path must be a string or an array or have a "files" property that is a string or an array, got ' + JSON.stringify(path));
  }
}

/**
 * Compares JavaScript files so that `.module.js` files appear first in a directory.
 */
function compareAngularFiles(f1, f2) {

  // Perform a standard comparison if one or both files are not JavaScript.
  if (!isJs(f1) || !isJs(f2)) {
    return f1.path.localeCompare(f2.path);
  }

  var f1Dir = path.dirname(f1.path),
      f1Module = isAngularModule(f1),
      f2Dir = path.dirname(f2.path),
      f2Module = isAngularModule(f2);

  if (f1Dir != f2Dir || f1Module == f2Module) {
    // Perform a standard comparison if the files are not in the same directory,
    // if both are Angular modules, or if both are not Angular modules.
    return f1.path.localeCompare(f2.path);
  } else if (f1Module) {
    // If f1 is an Angular module and f2 is not, place f1 first.
    return -1;
  } else {
    // If f1 is not an Angular module and f2 is, place f1 last.
    return 1;
  }
}

function isJs(file) {
  return file.path.match(/\.js$/);
}

function isAngularModule(file) {
  return file.path.match(/\.module\.js$/);
}
