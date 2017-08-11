(function() {
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

  function MiniMapCtrl(AppActions, ArView, EventLogFactory, Modals, $log, MiniMap, Excursion, $scope, UserLocation, $timeout) {

    var TAG     = "[MiniMapCtrl] ",
        minimap = this;

    $log.info(TAG + 'minimap should not be visible');
    // Hides the minimap while loading things
    minimap.isVisible = false;
    minimap.config = MiniMap.config;

    minimap.positionState = 'searching';

    minimap.showBigMapModal = showBigMapModal;

    Excursion.excursionChangeObs.subscribe(MiniMap.addPath);

    UserLocation.realObs.subscribe(function(position) {
      minimap.positionState = "success";
      $log.log(TAG + 'UserLocation:realObs received', minimap.positionState);
      $timeout(function() {
        minimap.positionState = 'searching';
      }, 1000);
      MiniMap.centerOnUser(position);
    });

    ArView.poisChangeObs.subscribe(MiniMap.updateMapMarkers);

    // Show the minimap when loading things is done
    minimap.isVisible = true;
    $log.info(TAG + 'minimap should now be visible');

    ////////////////////

    /**
     * Opens up the BigMap modal, passing as its scope the scope of the MiniMapCtrl.
     */
    function showBigMapModal() {
      AppActions.execute('trackActivity', {eventObject: EventLogFactory.action.bigmap.opened(Excursion.serverId)});
      Modals.showBigMap($scope);
    }
  }
})();
