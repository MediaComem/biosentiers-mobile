var _ = require('lodash'),
    bower = require('bower'),
    concat = require('gulp-concat'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    inject = require('gulp-inject'),
    minifyCss = require('gulp-minify-css'),
    path = require('path'),
    rename = require('gulp-rename'),
    request = require('request-promise'),
    sass = require('gulp-sass'),
    sh = require('shelljs'),
    sort = require('gulp-sort'),
    stable = require('stable'),
    util = require('gulp-util'),
    watch = require('gulp-watch');

var appDir = 'www/app',
    wikitudeDir = 'www/wikitude-worlds';

var paths = {
  sass           : [ './scss/**/*.scss' ],
  sassAr         : ['./scss-ar/**/*.scss'],
  appIndex       : 'www/index.html',
  appSources     : { files: [ '**/*.js', '**/*.css' ], cwd: appDir },
  wikitudeIndex  : path.join(wikitudeDir, 'main/index.html'),
  wikitudeSources: { files: [ '**/*.js', '**/*.css' ], cwd: wikitudeDir }
};

gulp.task('default', [ 'compile', 'inject', 'watch' ]);

gulp.task('compile', [ 'sass', 'sass-ar' ]);
gulp.task('inject', [ 'inject:app', 'inject:wikitude' ]);
gulp.task('watch', [ 'watch:app', 'watch:sass', 'watch:sass-ar', 'watch:wikitude' ]);

var injectAppSources = injectSourcesFactory('app', paths.appIndex, paths.appSources),
    injectWikitudeSources = injectSourcesFactory('wikitude', paths.wikitudeIndex, paths.wikitudeSources);

gulp.task('inject:app', injectAppSources);
gulp.task('inject:wikitude', injectWikitudeSources);
gulp.task('watch:app', watchSourcesFactory(injectAppSources, paths.appSources));
gulp.task('watch:wikitude', watchSourcesFactory(injectWikitudeSources, paths.wikitudeSources));

gulp.task('sass', function(done) {
  gulp.src('./scss/*')
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

gulp.task('sass-ar', function(done) {
  gulp.src('./scss-ar/ar-main.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/wikitude-worlds/main/'))
    .on('end', done);
});

gulp.task('watch:sass', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('watch:sass-ar', function() {
  gulp.watch(paths.sassAr, ['sass-ar']);
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

gulp.task('update-data', function(done) {
  const backendUrl = process.env.BACKEND_URL || 'https://biosentiers.heig-vd.ch';
  const trailId = process.env.TRAIL_ID || '8c8c2474-4375-4121-95d3-763f381717df';

  request({
    url: `${backendUrl}/api/trails/${trailId}/data-package`,
    json: true
  }).then(updateLocalData).then(done, done);
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
      .pipe(sort({
        customSortFn: function(files) {
          return stable(files, compareAngularFiles);
        }
      }));

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

  if (f1Dir.indexOf(f2Dir + path.sep) === 0) {
    // If f1 is in a subdirectory of f2's directory, place f1 last.
    return 1;
  } else if (f2Dir.indexOf(f1Dir + path.sep) === 0) {
    // If f2 is in a subdirectory of f1's directory, place f1 first.
    return -1;
  } else if (f1Dir != f2Dir || f1Module == f2Module) {
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
  return !!file.path.match(/\.js$/);
}

function isAngularModule(file) {
  return !!file.path.match(/\.module\.js$/);
}

/**
 * Updates the local BioSentiers data with fresh data from the server.
 */
function updateLocalData(serverData) {

  const trail = serverData.trail;

  // Trail path (GeoJsonFeature)
  const pathFeature = apiResourceToGeoJsonFeature(_.pick(trail, 'geometry'), _.pick(trail, 'length'));

  // Zones
  //
  // {
  //   type: 'FeatureCollection',
  //   features: [ GeoJsonFeature, GeoJsonFeature, ... ]
  // }
  const zoneFeatureCollection = {
    type: 'FeatureCollection',
    features: serverData.zones.map(zone => apiResourceToGeoJsonFeature(zone))
  };

  // Species map by theme
  //
  // {
  //   bird: [ speciesObject, speciesObject, speciesObject, ... ],
  //   butterfly: [ speciesObject, speciesObject, speciesObject, ... ],
  //   ...
  // }
  const speciesByTheme = _.reduce(serverData.species, (memo, species) => {
    memo[species.theme] = memo[species.theme] || [];
    memo[species.theme].push(species);
    return memo;
  }, {});

  // POIS map by theme
  //
  // {
  //   bird: {
  //     type: 'FeatureCollection',
  //     features: [ GeoJsonFeature, GeoJsonFeature, ... ]
  //   },
  //   butterfly: {
  //     type: 'FeatureCollection',
  //     features: [ GeoJsonFeature, GeoJsonFeature, ... ]
  //   },
  //   ...
  // }
  const poiFeatureCollectionsByTheme = _.reduce(serverData.pois, (memo, poi) => {
    memo[poi.theme] = memo[poi.theme] || { type: 'FeatureCollection', features: [] };

    const species = serverData.species.find(species => species.id == poi.speciesId);
    if (!species) {
      throw new Error(`Could not find species for POI ${poi.id} (species ID ${poi.speciesId})`);
    }

    const extraSpeciesProperties = _.pick(species, 'commonName', 'periodStart', 'periodEnd');
    memo[poi.theme].features.push(apiResourceToGeoJsonFeature(poi, extraSpeciesProperties));

    return memo;
  }, {});

  // TODO: do the magic...
}

function apiResourceToGeoJsonFeature(resource, extraProperties) {

  const geometry = resource.geometry;
  if (!geometry) {
    throw new Error(`Resource must have a geometry (properties: ${_.keys(resource).join(', ')})`);
  }

  return {
    type: 'Feature',
    geometry: geometry,
    properties: _.extend(_.omit(resource, 'geometry'), extraProperties)
  };
}
