(function() {
  angular
    .module('ar')
    .controller('BaseCtrl', BaseCtrl);

  function BaseCtrl(Do, FiltersModal, $ionicModal, $log, $rootScope, $scope) {
    var ctrl = this;

    ctrl.modal = null;
    ctrl.closeAR = closeAR;
    ctrl.showDebugModal = showDebugModal;
    ctrl.showFiltersModal = showFiltersModal;

    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
      if (ctrl.modal) {
        ctrl.modal.remove();
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

    $rootScope.$on('marker:loaded', function (event, properties) {
      ctrl.poi = World.poiData;
      ctrl.properties = properties;
      showPoiModal(ctrl.properties.theme_name);
    });

    ////////////////////

    function closeAR() {
      $log.debug('Closing the AR');
      Do.action('close');
    }

    function showDebugModal() {
      $ionicModal.fromTemplateUrl('debug-position/debug-position.modal.html', {
        scope    : $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        ctrl.modal = modal;
        ctrl.modal.show();
      });
    }

    function showPoiModal(type) {
      $ionicModal.fromTemplateUrl(type + '.poi.html', {
        scope    : $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        ctrl.modal = modal;
        ctrl.modal.show();
      });
    }

    function showFiltersModal() {
      FiltersModal.showModal($scope).then(function (modal) {
        ctrl.modal = modal;
        ctrl.modal.show();
      });
    }
  }
})();
