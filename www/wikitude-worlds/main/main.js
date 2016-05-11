'use strict';

angular.module('ar', [
    'ionic',
    'arDirectives',
    'ARLib',
    'World'
  ])
  .controller('baseCtrl', baseCtrl)
  .controller('buttonCtrl', buttonCtrl);

function baseCtrl(Do, $scope, $ionicModal) {
  var ctrl = this;

  ctrl.modals = {};
  ctrl.closeAR = closeAR;
  World.markerClick = showPoiData;

  $ionicModal.fromTemplateUrl('dev-opt.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    ctrl.modals.opt = modal;
  });
  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function () {
    ctrl.modals.opt.remove();
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

  function closeAR() {
    console.log('closing');
    Do.action('close');
  }

  function showPoiData(data) {
    $ionicModal.fromTemplateUrl('poi.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      ctrl.modals.poi = modal;
      ctrl.modals.poi.show();
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
