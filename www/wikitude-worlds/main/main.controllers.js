angular
  .module('ar')
  .controller('baseCtrl', baseCtrl)
  .controller('OptCtrl', OptCtrl)
  .controller('buttonCtrl', buttonCtrl);

function baseCtrl(Do, $scope, $ionicModal, $rootScope) {
  console.log($scope);
  var ctrl = this;

  ctrl.modal = null;
  ctrl.closeAR = closeAR;
  ctrl.showOptModal = showOptModal;
  ctrl.log = customLog;

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

  $rootScope.$on('marker:loaded', function (event) {
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
    World.locations = [];
    Do.action('loadMarkers');
  };

  ctrl.debug = function debug() {
    var start = Date.now();
    console.log(World.locations);
    World.locations.forEach(function (location) {
      console.log(location.distanceToUser());
    });
    World.timer(start);
  };

  ctrl.show = function show() {
    var start = Date.now();
    World.locations.forEach(function (location) {
      location.show();
    });
    World.timer(start);
  };

  ctrl.remove = function remove() {
    var start = Date.now();
    World.locations.forEach(function (location) {
      location.remove();
    });
    World.timer(start);
  };
}

function OptCtrl(Do, $scope) {
  var ctrl = this;

  ctrl.heig = function heig() {
    Do.action('setPosition', {lat: 46.781058, lon: 6.647179, alt: 431});
    $scope.base.modal.hide();
  };

  ctrl.plage = function plage() {
    Do.action('setPosition', {lat: 46.784083, lon: 6.652281, alt: 431});
    $scope.base.modal.hide();
  };

  ctrl.cheseaux = function cheseaux() {
    Do.action('setPosition', {lat: 46.779043, lon: 6.659222, alt: 448});
    $scope.base.modal.hide();
  };

  ctrl.position = {};

  ctrl.custom = function custom() {
    console.log(ctrl.position);
    if (ctrl.position.hasOwnProperty('lat') && ctrl.position.hasOwnProperty('lon') && ctrl.position.hasOwnProperty('alt')) {
      Do.action('setPosition', {lat: ctrl.position.lat, lon: ctrl.position.lon, alt: ctrl.position.alt});
      $scope.base.modal.hide();
    } else {
      Do.action('toast', {message: "Des champs ne sont pas remplis"});
    }
  }
}
