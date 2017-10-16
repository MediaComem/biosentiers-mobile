/**
 * Created by Mathias Oberson on 09.02.2017.
 */
(function() {
  'use strict';
  angular
    .module('app')
    .controller('DebugCtrl', DebugCtrl);

  function DebugCtrl(ActivityTracker, EventLog, $ionicPlatform, FsUtils, DbBio, DbExcursions, $cordovaToast, $log, LogUploader, $q, uuid) {
    var TAG   = "[DebugCtrl] ",
        debug = this;

    $ionicPlatform.ready(function() {
      debug.resetDb = resetDb;
      debug.resetLogFolder = FsUtils.deleteBaseDir;
      debug.newLine = newLine;
      debug.hundredLines = hundredLines;
      debug.upload = upload;
      debug.readCurrentLog = readCurrentLog;
    });

    ////////////////////

    function resetDb() {
      $q.when()
        .then(DbBio.reset)
        .then(DbExcursions.fetchAll)
        .then(function() {
          $cordovaToast.showShortTop('Base de données réinitialisée !');
        })
    }

    function newLine() {
      $log.log(TAG + 'new line');
      ActivityTracker(new EventLog('test', {uuid: uuid()}));
    }

    function hundredLines() {
      for (var i = 0; i < 110; i++) {
        ActivityTracker(new EventLog('test', {number: i, uuid: uuid()}));
      }
    }

    function upload() {
      for (var i = 0; i < 1; i++) {
        LogUploader();
      }
    }

    function readCurrentLog() {
      FsUtils.readFile(LogPaths.logfile.path)
        .then(function(content) {
          $log.log(TAG + 'Current log file content', content);
        })
    }
  }
})();
