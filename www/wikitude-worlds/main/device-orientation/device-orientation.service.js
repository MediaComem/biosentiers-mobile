(function() {
  'use strict';

  angular
    .module('device-orientation')
    .factory('DeviceOrientation', DeviceOrientationService);

  function DeviceOrientationService(rx) {

    var orientationChangeSubject = new rx.ReplaySubject(1);

    var service = {
      orientation: null,
      updateOrientation: updateOrientation,
      orientationChangeObs: orientationChangeSubject.asObservable()
    };

    return service;

    ////////////////////

    function updateOrientation(data) {
      service.orientation = data;
      orientationChangeSubject.onNext(data);
    }
  }
})();
