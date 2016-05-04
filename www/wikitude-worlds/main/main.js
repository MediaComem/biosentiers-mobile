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

  ctrl.buttons = [
    {name: "Close"},
    {name: "Test"}
  ];
  ctrl.modal = null;
  ctrl.closeAR = closeAR;
  ctrl.showOpt = showOpt;

  $ionicModal.fromTemplateUrl('dev-opt.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    ctrl.modal = modal;
  });
  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function () {
    ctrl.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function () {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function () {
    // Execute action
  });

  function closeAR() {
    console.log('closing');
    Do.action('close');
  }

  function showOpt() {
    ctrl.modal.show();
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
