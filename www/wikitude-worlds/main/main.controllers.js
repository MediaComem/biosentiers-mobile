angular
  .module('ar')
  .controller('baseCtrl', baseCtrl)
  .controller('OptCtrl', OptCtrl)
  .controller('buttonCtrl', buttonCtrl);

function baseCtrl(Do, $scope, $ionicModal, $rootScope) {
  var ctrl = this;

  ctrl.modal = null;
  ctrl.closeAR = closeAR;
  ctrl.showOptModal = showOptModal;

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

  $rootScope.$on('marker:loaded', function (event, properties) {
    console.log('marker:loaded event catched');
    console.log(event);
    console.log(World.poiData);
    ctrl.poi = World.poiData;
    ctrl.properties = properties;
    showPoiModal(ctrl.properties.theme_name);
  });

  ////////////////////

  function closeAR() {
    console.log('closing');
    Do.action('close');
  }

  function showOptModal() {
    $ionicModal.fromTemplateUrl('modal.opt.html', {
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
}

function buttonCtrl(Do, Beacon, POI) {
  var ctrl = this;

  ctrl.loadTestPois = function loadTestPois() {
    Do.action('loadTestPois');
  };

  ctrl.debug = function debug() {
    World.timer.start('debug');
    console.log(POI.stock);
    for (var id in POI.stock) {
      console.log(POI.stock[id].distanceToUser());
    }
    console.log(POI.visible);
    console.log("Nb of POIs", Object.keys(POI.stock).length);
    console.log(Beacon.stock);
    console.log(Beacon.stock.length);
    World.timer.debug.stop("Debug process time", 'main.controller.js', 82);
  };

  ctrl.show = function show() {
    console.log('visible', World.visible);
    var start, getting, filter_new, filter_old, delete_old, show_new, near, fresh, old;
    near = fresh = old = [];

    World.timer.start('start');
    World.timer.start('getting');
    for (var id in World.pois) {
      World.pois[id].distanceToUser() <= AR.context.scene.cullingDistance
      && near.push(id);
    }
    World.timer.getting.stop("Getting the nearest POIs", 'main.controller.js', 96);
    console.log('near', near);

    World.timer.start('filter_new');
    fresh = near.filter(function isFresh(id) {
      return World.visible.indexOf(id) === -1;
    });
    World.timer.filter_new.stop('Filtering the new POIs', 'main.controller.js', 103);
    console.log('fresh', fresh);

    World.timer.start('filter_old');
    old = World.visible.filter(function isOld(id) {
      return near.indexOf(id) === -1;
    });
    World.timer.filter_old.stop('Filtering the old POIs', 'main.controller.js', 110);
    console.log('old', old);

    World.timer.start('delete_old');
    old.forEach(function (id) {
      //console.log(id);
      World.pois[id].remove();
      World.visible.splice(World.visible.indexOf(id), 1);
    });
    World.timer.delete_old.stop('Deleting the old POIs');

    World.timer.start('show_new');
    fresh.forEach(function (id) {
      //console.log(id);
      World.pois[id].show();
      World.visible.push(id);
    });
    World.timer.show_new.stop('Showing the new POIs');
    console.log('visible (bis)', World.visible);
    World.timer.start.stop('Total processing time');
  };

  ctrl.nearestBeacon = function nearestBeacon() {
    World.timer.start('nearest');
    var beacon = Beacon.getNearest();
    World.timer.nearest.stop('nearest Beacon', 'main.controller.js', 135);
    console.log(beacon, beacon.distanceToUser());
  };
}

function OptCtrl(Do, $scope, LocationMock) {
  var ctrl = this;

  ctrl.stRoch = function stRoch() {
    $scope.base.modal.hide();
    Do.action('setPosition', LocationMock.stRoch);
  };

  ctrl.plage = function plage() {
    $scope.base.modal.hide();
    Do.action('setPosition', LocationMock.plageYverdon);
  };

  ctrl.cheseaux = function cheseaux() {
    $scope.base.modal.hide();
    Do.action('setPosition', LocationMock.cheseaux);
  };

  ctrl.sentierFin = function sentierFin() {
    $scope.base.modal.hide();
    Do.action('setPosition', LocationMock.sentierFin);
  };

  ctrl.sentierDebut = function sentierDebut() {
    $scope.base.modal.hide();
    Do.action('setPosition', LocationMock.sentierDebut);
  };

  ctrl.position = {};

  ctrl.custom = function custom() {
    console.log(ctrl.position);
    if (ctrl.position.hasOwnProperty('lat') && ctrl.position.hasOwnProperty('lon') && ctrl.position.hasOwnProperty('alt')) {
      $scope.base.modal.hide();
      Do.action('setPosition', {lat: ctrl.position.lat, lon: ctrl.position.lon, alt: ctrl.position.alt});
    } else {
      Do.action('toast', {message: "Des champs ne sont pas remplis"});
    }
  }
}
