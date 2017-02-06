(function () {
  'use strict';

  angular
    .module('mini-map')
    .directive('miniMap', MiniMapDirective)
    .controller('MiniMapCtrl', MiniMapCtrl);

  function MiniMapDirective() {
    return {
      restrict    : 'E',
      replace     : true,
      controller  : 'MiniMapCtrl',
      controllerAs: "minimap",
      templateUrl : 'mini-map/mini-map.html'
    };
  }

  function MiniMapCtrl(ArView, Modals, $log, MiniMap, Outing, $scope, UserLocation) {

    var minimap = this;

    $log.info('minimap should not be visible');
    // Hides the minimap while loading things
    minimap.isVisible = false;
    minimap.config = MiniMap.config;

    $scope.$on('leafletDirectiveMap.minimap.click', showBigMapModal);

    Outing.outingChangeObs.subscribe(MiniMap.addPath);

    UserLocation.realObs.subscribe(MiniMap.center);

    ArView.poisChangeObs.subscribe(MiniMap.updateMapMarkers);

    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
      // Execute action
      console.log('modal hidden');
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
      // Execute action
      minimap.isVisible = true;
      console.log('modal removed');
    });

    // Show the minimap when loading things is done
    minimap.isVisible = true;
    $log.info('minimap should now be visible');

    ////////////////////

    /**
     * Opens up the BigMap modal, passing as its scope the scope of the MiniMapCtrl.
     */
    function showBigMapModal() {
      minimap.isVisible= false;
      Modals.showBigMap($scope);
    }
  }
})();
