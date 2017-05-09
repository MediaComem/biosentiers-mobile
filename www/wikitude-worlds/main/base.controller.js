(function() {
  angular
    .module('ar')
    .controller('BaseCtrl', BaseCtrl);

  function BaseCtrl(AppActions, ArView, Modals, $log, Excursion, $scope, UserLocation) {
    var base = this;

    base.hasReachedEnd = false;
    base.closeAR = closeAR;
    base.showDebugModal = showDebugModal;
    base.showFiltersModal = showFiltersModal;
    base.finishExcursion = finishExcursion;

    UserLocation.realObs.subscribe(function(position) {
      base.altitude = position.geometry.coordinates[2];
    });

    Excursion.currentPoiChangeObs.subscribe(showPoiModal);

    ArView.excursionEndReachedObs.subscribe(function() {
      base.hasReachedEnd = true;
    });

    ////////////////////

    function closeAR() {
      $log.debug('Closing the AR');
      AppActions.execute('close');
    }

    function finishExcursion() {
      AppActions.execute('finishExcursion', {excursionId: Excursion.id});
    }

    function showDebugModal() {
      Modals.showDebugPosition($scope);
    }

    function showFiltersModal() {
      Modals.showFilters($scope);
    }

    function showPoiModal() {
      Modals.showPoi($scope);
    }
  }
})();
