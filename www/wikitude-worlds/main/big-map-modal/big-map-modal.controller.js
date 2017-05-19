/**
 * Created by Mathias on 25.08.2016.
 * This is the controller for the Big Map modal.
 * It handles showing the points, and further interaction with the bigmap.
 */
(function () {
  'use strict';
  angular
    .module('big-map-modal')
    .controller('BigMapCtrl', BigMapCtrl);

  function BigMapCtrl(leafletData, $log, BigMap, Modals, $scope, UserLocation, $timeout) {
    var bigmap = this;

    // If the controller is active, that means that it's the BigMapModal that's loaded.
    // So, the Modals.closeCurrent closes the BigMap Modal.
    bigmap.remove = Modals.removeCurrent;
    bigmap.config = BigMap.config;
    bigmap.positionState = 'searching';

    // var debouncedUpdatePoints = _.debounce(BigMap.updateMapMarkers, 500);

    leafletData.getMap('bigmap').then(function (result) {
      BigMap.setMap(result);
      BigMap.updateMapMarkers();
      $scope.$on('leafletDirectiveMap.bigmap.moveend', BigMap.updateMapMarkers);
      UserLocation.realObs.subscribe(function() {
        bigmap.positionState = 'success';
        $timeout(function() {
          bigmap.positionState = 'searching';
        }, 1000);
        BigMap.updateUserMarker();
      });
    }).catch(function (error) {
      $log.error(error);
    });
  }
})();
