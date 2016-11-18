/**
 * Created by Mathias on 25.08.2016.
 */
(function () {
  'use strict';

  angular
    .module('world')
    .factory('World', WorldService);

  function WorldService(AppActions, ArView, DeviceOrientation, Filters, $log, Outing, UserLocation) {

    var service = {
      startup                : true,
      poiData                : null,
      loadOuting             : Outing.setOuting,
      updateDeviceOrientation: updateDeviceOrientation,
      returnResultFromApp    : AppActions.returnResultFromApp
    };

    // Update the AR when:
    // * The outing is loaded.
    // * The user location changes (spaced by interval).
    // * The user changes the filters.
    Outing.outingChangeObs.subscribe(ArView.updateAr);
    UserLocation.spacedObs.subscribe(ArView.updateAr);
    Filters.filtersChangeObs.subscribe(ArView.updateAr);

    // Display a message when the user location is first detected.
    UserLocation.realObs.first().subscribe(notifyUserLocated);

    return service;

    ////////////////////

    function notifyUserLocated() {
      AppActions.execute('toast', { message: 'Localisé !' });
    }

    function updateDeviceOrientation(data) {
      DeviceOrientation.updateOrientation(data);
    }
  }
})();
