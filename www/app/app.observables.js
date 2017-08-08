(function() {
  'use strict';
  angular
    .module('app')
    .factory('TimerUploadObs', TimerUploadObsFn);

  function TimerUploadObsFn($interval, rx, UPLOAD_DELAY) {
    return rx.Observable.create(function subscribe(observer) {
      $interval(function() {
        observer.next();
      }, UPLOAD_DELAY)
    });
  }
})();
