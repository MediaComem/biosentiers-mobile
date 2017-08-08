(function() {
  'use strict';

  angular
    .module('app')
    .controller('ActivityTrackerCtrl', atc);

  function atc(ActivityTracker, LogUploader, $ionicPlatform, uuid, BaseLog) {
    var atc = this;

    $ionicPlatform.ready(function() {
      atc.newLine = function() {
        console.log('AT new line');
        ActivityTracker.addLog(new BaseLog('test', {uuid: uuid.gen()}));
      };

      atc.newFile = ActivityTracker.moveLog;

      atc.reset = ActivityTracker.reset;

      atc.upload = function() {
        for (var i = 0; i < 1; i++) {
          LogUploader();
        }
      };

      atc.hundredLogs = function() {
        for (var i = 0; i < 110; i++) {
          ActivityTracker.addLog(new BaseLog('test', {number: i, uuid: uuid.gen()}));
        }
      };

      atc.testConflict = function() {
        ActivityTracker.moveLog()
          .then(function() {console.log('AT controller move success')}).catch(function(error) {console.error('AT controller move failure', error);});
        ActivityTracker.addLog(new BaseLog('test', {number: 1, uuid: uuid.gen()}))
          .then(function() {console.log('AT controller log 1 success')}).catch(function(error) {console.error('AT controller log 1 failure', error);});
        ActivityTracker.addLog(new BaseLog('test', {number: 2, uuid: uuid.gen()}))
          .then(function() {console.log('AT controller log 2 success')}).catch(function(error) {console.error('AT controller log 2 failure', error);});
        ActivityTracker.addLog(new BaseLog('test', {number: 3, uuid: uuid.gen()}))
          .then(function() {console.log('AT controller log 3 success')}).catch(function(error) {console.error('AT controller log 3 failure', error);});
      }
    })
  }
})();
