(function() {
  'use strict';
  angular
    .module('activity-tracker-module')
    .service('LogPaths', LogPathsFn);

  function LogPathsFn() {
    var baseDir  = 'ActivityTracker',
        fileName = 'currentLog';

    this.baseDir = baseDir;
    this.uploadDir = this.baseDir + '/toUpload';
    this.logfile = {
      name: fileName,
      path: this.baseDir + '/' + fileName
    };
  }
})();
