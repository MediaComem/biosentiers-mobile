/**
 * Created by Mathias on 25.08.2016.
 */
(function () {
  'use strict';

  angular
    .module('world')
    .factory('World', WorldService);

  function WorldService($ionicLoading, $log, POIData, $rootScope) {
    var service = {
      startup                : true,
      poiData                : null,
      loadPoiData            : loadPoiData,
      write                  : write,
      loadPoints             : POIData.setData,
      showLoading            : showLoading,
      hideLoading            : $ionicLoading.hide,
      updateDeviceOrientation: updateDeviceOrientation
    };

    return service;

    ////////////////////

    function updateDeviceOrientation(updates) {
      $rootScope.$emit('orientation:changed', updates);
    }

    function loadPoiData(data, properties) {
      console.log('setting the poi data');
      service.poiData = data;
      $rootScope.$emit('marker:loaded', properties);
    }

    function write(message) {
      $log.debug("World writes", message);
    }

    function showLoading(message) {
      return $ionicLoading.show({template: message});
    }

  }
})();
