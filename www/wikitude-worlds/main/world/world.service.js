/**
 * Created by Mathias on 25.08.2016.
 */
(function () {
  'use strict';

  angular
    .module('world')
    .factory('World', WorldService);

  function WorldService(AppActions, ArView, DeviceOrientation, Filters, $log, Outing, $rootScope, UserLocation) {

    var service = {
      startup                : true,
      poiData                : null,
      loadPoiData            : loadPoiData,
      loadOuting             : Outing.setOuting,
      updateDeviceOrientation: updateDeviceOrientation
    };

    Filters.filtersChangeObs.subscribe(onFiltersChanged);
    UserLocation.currentObs.subscribe(onLocationChanged);

    return service;

    ////////////////////

    function onFiltersChanged() {
      ArView.updateAr();
    }

    function onLocationChanged() {
      if (service.startup) {
        AppActions.execute('toast', { message: 'Localisé !' });
      }

      if (service.startup || UserLocation.movingDistance() > 20) {
        if (!service.startup) {
          $log.debug('User has moved ' + UserLocation.movingDistance() + 'm (more than 20m)');
        }
        UserLocation.backupCurrent();
        ArView.updateAr();
        service.startup = false;
      }
    }

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
