(function() {
  'use strict';
  angular
    .module('app')
    .factory('TimerUploadObs', TimerUploadObsFn);

  function TimerUploadObsFn($interval, rx) {
    var uploadInterval = 1000 * 60 * 5; // 5 minutes

    return rx.Observable.create(function subscribe(observer) {
      $interval(function() {
        observer.next();
      }, uploadInterval)
    });
  }
})();
