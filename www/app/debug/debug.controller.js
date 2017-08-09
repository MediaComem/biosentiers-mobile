/**
 * Created by Mathias Oberson on 09.02.2017.
 */
(function() {
  'use strict';
  angular
    .module('app')
    .controller('DebugCtrl', DebugCtrl);

  function DebugCtrl(ActivityTracker, EventLog, $ionicPlatform, FsUtils, DbBio, DbExcursions, $cordovaToast, LogUploader, $q, uuid) {
    var debug = this;

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
        .then(DbExcursions.getAll())
        .then(function() {
          $cordovaToast.showShortTop('Base de données réinitialisée !');
        })
    }

    function newLine() {
      console.log('AT new line');
      ActivityTracker(new EventLog('test', {uuid: uuid.gen()}));
    }

    function hundredLines() {
      for (var i = 0; i < 110; i++) {
        ActivityTracker(new EventLog('test', {number: i, uuid: uuid.gen()}));
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
          console.log('Current log file content', content);
        })
    }
  }
})();
