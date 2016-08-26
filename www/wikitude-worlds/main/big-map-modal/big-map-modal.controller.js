/**
 * Created by Mathias on 25.08.2016.
 */
(function () {
  'use strict';
  angular
    .module('big-map-modal')
    .controller('BigMapCtrl', BigMapCtrl);

  function BigMapCtrl(leafletData, Modals, POIData, turf, UserLocation) {
    var ctrl = this;

    // If the controller is active, that means that it's the BigMapModal that's loaded.
    // So, the Modals.closeCurrent closes the BigMap Modal.
    ctrl.close = Modals.closeCurrent;
    ctrl.spec = {
      center: {
        lat : UserLocation.current.lat(),
        lng : UserLocation.current.lon(),
        zoom: 17
      }
    };
    console.log(POIData.data);
    leafletData.getMap().then(function (map) {
      console.log(map);
      console.log(map.getBounds());
    })
  }
})();
