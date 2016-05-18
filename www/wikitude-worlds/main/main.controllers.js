angular
  .module('ar')
  .controller('baseCtrl', baseCtrl)
  .controller('buttonCtrl', buttonCtrl);

function baseCtrl(Do, $scope, $ionicModal, $rootScope) {
  var ctrl = this;

  ctrl.modal = null;
  ctrl.closeAR = closeAR;
  ctrl.showOptModal = showOptModal;
  ctrl.log = customLog;
  World.markerClick = showPoiModal;

  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function () {
    ctrl.modal.remove();
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

  $rootScope.$on('marker:loaded', function(event) {
    console.log('marker:loaded event catched');
    console.log(event);
    console.log(World.poiData);
    ctrl.poi = World.poiData;
    showPoiModal();
  });

  ////////////////////

  function customLog(data) {
    console.log(data);
  }

  function closeAR() {
    console.log('closing');
    Do.action('close');
  }

  function showOptModal() {
    $ionicModal.fromTemplateUrl('modal.opt.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      ctrl.modal = modal;
      ctrl.modal.show();
    });
  }

  function showPoiModal() {
    $ionicModal.fromTemplateUrl('modal.poi.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      ctrl.modal = modal;
      ctrl.modal.show();
    });
  }
}

function buttonCtrl(Do) {
  var ctrl = this;

  ctrl.loadMarkers = function loadMarkers() {
    Do.action('loadMarkers');
  };

  ctrl.debug = function debug() {
    console.log(World.markerList);
  };
}
