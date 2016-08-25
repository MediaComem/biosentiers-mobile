angular
  .module('ar')
  .controller('baseCtrl', baseCtrl)
  .controller('OptCtrl', OptCtrl)
  .controller('MiniMapCtrl', MiniMapCtrl)
  .controller('BigMapCtrl', BigMapCtrl)
  .controller('StatsCtrl', StatsCtrl);

function StatsCtrl($log, $rootScope) {
  var ctrl = this;

  ctrl.plus = 0;
  ctrl.moins = 0;
  ctrl.total = 0;

  $rootScope.$on('pois:changed', function (event, changes) {
    $log.debug('Updating stats', changes.shown.length, changes.hidden.length, changes.visible.length);
    ctrl.plus = changes.shown.length;
    ctrl.moins = changes.hidden.length;
    ctrl.total = changes.visible.length;
  });
}

function MiniMapCtrl($http, Modals, $log, $rootScope, $scope, UserLocation) {
  var ctrl = this,
      zoom = 14;

  var icons = {
    Oiseaux: {
      iconUrl   : '../../img/icons/Oiseaux.png',
      iconSize  : [16, 16],
      iconAnchor: [8, 8]
    },
    Flore  : {
      iconUrl   : '../../img/icons/Flore.png',
      iconSize  : [16, 16],
      iconAnchor: [8, 8]
    },
    user   : {
      iconUrl   : '../../img/icons/user.png',
      iconSize  : [20, 20], // size of the icon
      iconAnchor: [10, 10] // point of the icon which will correspond to marker's location
    }
  };

  ctrl.spec = {
    tiles   : {
      url    : '../../data/Tiles/{z}/{x}/{y}.png',
      options: {
        errorTileUrl: '../../data/Tiles/error.png'
      }
    },
    defaults: {
      scrollWheelZoom   : false,
      touchZoom         : false,
      doubleClickZoom   : false,
      dragging          : false,
      attributionControl: false
    },
    center  : {
      lat : 46.781001,
      lng : 6.647128,
      zoom: zoom
    },
    markers : {
      user: {
        lat : 46.781001,
        lng : 6.647128,
        icon: icons.user
      }
    },
    events  : {
      map: {
        enable: ['click'],
        logic : 'emit'
      }
    },
    geojson : {}
  };

  $scope.$on('leafletDirectiveMap.click', function () {
    Modals.showBigMapModal($scope);
  });

  $http.get('../../data/path.json').then(function (success) {
    ctrl.spec.geojson.path = {
      data : success.data,
      style: {
        color : 'red',
        weigth: 6
      }
    }
  }, function (error) {
    $log.error(error);
  });

  $rootScope.$on('user:located', centerMiniMap);

  $rootScope.$on('pois:changed', function (event, changes) {
      _.each(changes.removed, function (point) {
        delete ctrl.spec.markers[point.properties.id_poi];
      });
      _.each(changes.added, function (point) {
        ctrl.spec.markers[point.properties.id_poi] = {
          lat : point.geometry.coordinates[1],
          lng : point.geometry.coordinates[0],
          icon: icons[point.properties.theme_name]
        };
      });
    }
  );

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

////////////////////

  function resetMiniMap() {
    centerMiniMap();
  }

  function centerMiniMap() {
    if (ctrl.spec.hasOwnProperty('center')) {
      $log.debug('Updating the minimap center');
      ctrl.spec.center.lat = UserLocation.current.lat();
      ctrl.spec.center.lng = UserLocation.current.lon();
    }
    if (ctrl.spec.markers.hasOwnProperty('user')) {
      $log.debug('Updating the minimap marker');
      ctrl.spec.markers.user.lat = UserLocation.current.lat();
      ctrl.spec.markers.user.lng = UserLocation.current.lon();
    }
    $scope.$apply();
  }
}

function BigMapCtrl(leafletData, Modals, POIData, turf, UserLocation) {
  var ctrl = this;

  // If the controller is active, that means that it's the BigMapModal that's loaded.
  // So, the Modals.closeCurrent closes the BigMap Modal.
  ctrl.close = Modals.closeCurrent;
  ctrl.spec = {
    center: {
      lat : UserLocation.current.lat(),
      lng : UserLocation.current.lon(),
      zoom: 17
    }
  };
  console.log(POIData.data);
  leafletData.getMap().then(function (map) {
    console.log(map);
    console.log(map.getBounds());
  })
}

function baseCtrl(Do, Filters, $ionicModal, $log, $rootScope, $scope) {
  var ctrl = this;

  ctrl.modal = null;
  ctrl.closeAR = closeAR;
  ctrl.showOptModal = showOptModal;
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

  function showFiltersModal() {
    Filters.showModal($scope).then(function (modal) {
      ctrl.modal = modal;
      ctrl.modal.show();
    });
  }
}

function OptCtrl(Do, $scope) {
  var ctrl = this;

  ctrl.balises = function balises(num) {
    switch (num) {
      case 1:
        Do.action('setPosition', {lat: 46.781025850072695, lon: 6.641159078988079, alt: 431});
        break;
      case 2:
        Do.action('setPosition', {lat: 46.780397285829991, lon: 6.643032521127623, alt: 431});
        break;
      default:
        throw new TypeError('Numéro inconnu');
    }
    $scope.base.modal.hide();
  };

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

  ctrl.champPittet = function champPittet() {
    Do.action('setPosition', {lat: 46.7837611642946, lon: 6.66567090924512, alt: 436.74});
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
