(function() {
  angular
    .module('ar')
    .controller('BaseCtrl', BaseCtrl);

  function BaseCtrl(AppActions, ArView, Modals, $log, Outing, $scope) {
    var base = this;

    base.poi = null;
    base.poiDetails = null;
    base.removePoiModal = removePoiModal;
    base.closeAR = closeAR;
    base.showDebugModal = showDebugModal;
    base.showFiltersModal = showFiltersModal;

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

    Outing.currentPoiChangeObs.subscribe(function(data) {
      base.poi = data.poi;
      base.poiDetails = data.details;
      showPoiModal(data.poi.properties.theme_name);
    });

    ////////////////////

    function closeAR() {
      $log.debug('Closing the AR');
      AppActions.execute('close');
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
      $log.log('removePoiModal - base.poi', base.poi);
      ArView.setPoiSeen(base.poi);
      Modals.removeCurrent();
    }
  }
})();
