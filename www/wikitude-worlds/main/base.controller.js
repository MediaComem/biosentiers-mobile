(function() {
  angular
    .module('ar')
    .controller('BaseCtrl', BaseCtrl);

  function BaseCtrl(AppActions, ArView, Modals, $log, Excursion, $scope, UserLocation) {
    var base = this;

    base.positionStatus = 'searching';
    base.poi = null;
    base.poiDetails = null;
    base.hasReachedEnd = false;
    base.removePoiModal = removePoiModal;
    base.setPoiSeen = setPoiSeen;
    base.closeAR = closeAR;
    base.showDebugModal = showDebugModal;
    base.showFiltersModal = showFiltersModal;
    base.finishExcursion = finishExcursion;

    UserLocation.realObs.subscribe(function(position) {
      base.altitude = position.geometry.coordinates[2];
    });

    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      base.poi = null;
      base.poiDetails = null;
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
      console.log('modal hidden');
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
      console.log('modal removed');
    });

    Excursion.currentPoiChangeObs.subscribe(function(data) {
      base.poi = data.poi;
      base.poiDetails = data.details;
      showPoiModal(data.poi.properties.theme_name);
    });

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

    function showPoiModal(type) {
      Modals.showPoi(type, $scope);
    }

    function removePoiModal() {
      return Modals.removeCurrent();
    }

    function setPoiSeen() {
      var poi = base.poi;
      removePoiModal().then(function() {
        ArView.setPoiSeen(poi);
      });
    }
  }
})();
