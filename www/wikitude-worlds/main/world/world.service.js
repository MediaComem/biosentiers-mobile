/**
 * Created by Mathias on 25.08.2016.
 */
(function () {
  'use strict';

  angular
    .module('world')
    .factory('World', WorldService);

  function WorldService(DeviceOrientation, $log, Outing, $rootScope) {

    var service = {
      startup                : true,
      poiData                : null,
      loadPoiData            : loadPoiData,
      loadPoints             : Outing.setData,
      updateDeviceOrientation: updateDeviceOrientation
    };

    return service;

    ////////////////////

    function updateDeviceOrientation(data) {
      DeviceOrientation.updateOrientation(data);
    }

    function loadPoiData(data, properties) {
      console.log('setting the poi data');
      service.poiData = data;
      $rootScope.$emit('marker:loaded', properties);
    }
  }
})();
