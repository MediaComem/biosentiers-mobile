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
        ActivityTracker.addLog(new BaseLog('test', uuid.gen()));
      };

      atc.newFile = ActivityTracker.moveToUpload;

      atc.debugLog = ActivityTracker.debug;

      atc.reset = ActivityTracker.reset;

      atc.upload = LogUploader.upload;

      atc.testConflict = function() {
        ActivityTracker.moveToUpload()
          .then(function() {console.log('AT controller move success')}).catch(function(error) {console.error('AT controller move failure', error);});
        ActivityTracker.addLog(new BaseLog('test', {number: 1}))
          .then(function() {console.log('AT controller log 1 success')}).catch(function(error) {console.error('AT controller log 1 failure', error);});
        ActivityTracker.addLog(new BaseLog('test', {number: 2}))
          .then(function() {console.log('AT controller log 2 success')}).catch(function(error) {console.error('AT controller log 2 failure', error);});
        ActivityTracker.addLog(new BaseLog('test', {number: 3}))
          .then(function() {console.log('AT controller log 3 success')}).catch(function(error) {console.error('AT controller log 3 failure', error);});
      }
    })
  }
})();
