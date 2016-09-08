(function () {
  'use strict';

  angular
    .module('bio.files')
    .factory('files', FilesService);

  function FilesService($cordovaFile, $http, $ionicPlatform, $log, $q) {

    var rootDirectory,
        rootUrl = 'cdvfile://localhost/files-external';

    var service = {
      join: join,
      downloadFiles: downloadFiles
    };

    return service;

    function waitForDevice() {
      return $ionicPlatform.ready(setRootDirectory);
    }

    function downloadFile(url, relativePath) {
      if (relativePath.match(/^\//)) {
        throw new Error('Path must be relative (cannot start with "/")');
      }

      var fileSize,
          start = new Date().getTime();

      return waitForDevice().then(download).then(write).then(onResolved, onRejected);

      function download() {
        return $http.get(url, { responseType: 'arraybuffer' });
      }

      function write(res) {

        fileSize = res.data.length;

        var basename = getBasename(relativePath),
            dirname = getDirname(relativePath),
            targetDirectory = dirname == '.' ? rootDirectory : join(rootDirectory, dirname);

        return $cordovaFile.writeFile(targetDirectory, basename, res.data, true);
      }

      function onResolved() {
        var duration = (new Date.getTime() - start) / 1000;
        $log.debug('Downloaded ' url + ' to ' + relativePath + ' in ' + duration + 's (' + fileSize + ' bytes)')
        return join(rootUrl, relativePath);
      }

      function onRejected(err) {
        $log.warn('Could not download ' + url + ' to ' + relativePath, err);
        return $q.reject(err);
      }
    }

    function setRootDirectory() {
      rootDirectory = cordova.file.externalDataDirectory;
    }

    function join() {
      var args = Array.prototype.slice.call(arguments);
      return _.reduce(args, function(memo, arg) {
        if (memo.length === 0) {
          return ('' + arg).replace(/\/$/, '');
        } else {
          return memo + '/' + ('' + arg).replace(/^\//, '');
        }
      }, '');
    }

    function getDirname(path) {
      var match = /(.*\/)/.exec(path);
      return match ? match[1] : '.';
    }

    function getBasename(path) {
      return path.replace(/.*\//, '');
    }
  }
})();
