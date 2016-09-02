(function () {
  angular
    .module('ar')
    .config(function($compileProvider) {
      $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile):|data:image\//);
    })
    .controller('BaseCtrl', BaseCtrl);

  function BaseCtrl(AppActions, DebugPositionModal, FiltersModal, $ionicModal, $log, Outing, $scope, World) {
    var base = this;

    base.modal = null;
    base.closeAR = closeAR;
    base.showDebugModal = showDebugModal;
    base.showFiltersModal = showFiltersModal;

    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
      if (base.modal) {
        base.modal.remove();
      }
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
      // Execute action
      console.log('modal hidden');
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
      // Execute action
      console.log('modal removed');
    });

    Outing.currentPoiChangeObs.subscribe(function(data) {
      base.poi = data.poi;
      base.poiDetails = data.details;
      base.testImgPath = 'file:///data/data/com.biosentiers.app/files/test.png';
      showPoiModal(data.poi.properties.theme_name);
    });

    ////////////////////

    function closeAR() {
      $log.debug('Closing the AR');
      AppActions.execute('close');
    }

    function showDebugModal() {
      DebugPositionModal.open($scope);
    }

    function showPoiModal(type) {
      $ionicModal.fromTemplateUrl(type + '.poi.html', {
        scope    : $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        base.modal = modal;
        base.modal.show();
      });
    }

    function showFiltersModal() {
      FiltersModal.showModal($scope).then(function (modal) {
        base.modal = modal;
        base.modal.show();
      });
    }
  }
})();
