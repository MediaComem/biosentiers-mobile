angular
  .module('ar')
  .controller('baseCtrl', baseCtrl)
  .controller('OptCtrl', OptCtrl)
  .controller('MapCtrl', MapCtrl)
  .controller('StatsCtrl', StatsCtrl)
  .controller('buttonCtrl', buttonCtrl);

function StatsCtrl($rootScope, $scope) {
  var ctrl = this;

  ctrl.plus = 0;
  ctrl.moins = 0;
  ctrl.total = 0;

  $rootScope.$on('stats:update', function (event, plus, moins, total) {
    console.log('updating stats', event, plus, moins, total);
    ctrl.plus = plus;
    ctrl.moins = moins;
    ctrl.total = total;
  });
}

function MapCtrl($scope, $http, $rootScope, $ionicModal, UserLocation) {
  var ctrl = this, zoom = 17;

  ctrl.mapOrientation = 'rotate(0deg)';

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
/*    maxZoom           : zoom,
      minZoom           : zoom, */
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
        icon: {
          iconUrl   : '../../img/icons/user.png',
          iconSize  : [14, 14], // size of the icon
          iconAnchor: [7, 7] // point of the icon which will correspond to marker's location
        }
      }
    },
    events : {
      map: {
        enable: ['click'],
        logic: 'emit'
      }
    }
  };

  // Modal - Big Map
  $ionicModal.fromTemplateUrl('modal.big.map.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    ctrl.modal = modal;
  });

  $scope.closeModal = function() {
    ctrl.modal.hide();
    console.log('modal hidden');
  };

  $scope.$on('leafletDirectiveMap.click', function(event){
    console.log('C\'est cliqué!');

    ctrl.modal.show();
    console.log('modal showed');
  });

  $http.get('../../data/path.json').then(function (success) {
      console.log(success.data);
      ctrl.spec.path = {
        data : success.data,
        style: {
          color : 'red',
          weigth: 6
        }
      }
    }, function (error) {
      console.log(error);
    }
  );

  $rootScope.$on('user:located', function () {
    console.log('updated map according to UserLocation');
    if (ctrl.spec.hasOwnProperty('center')) {
      console.log('updating the center');
      ctrl.spec.center.lat = UserLocation.current.lat();
      ctrl.spec.center.lng = UserLocation.current.lon();
    }
    if (ctrl.spec.markers.hasOwnProperty('user')) {
      console.log('updating the marker');
      ctrl.spec.markers.user.lat = UserLocation.current.lat();
      ctrl.spec.markers.user.lng = UserLocation.current.lon();
    }
  });
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
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      ctrl.modal = modal;
      ctrl.modal.show();
    });
  }

  function showPoiModal(type) {
    $ionicModal.fromTemplateUrl(type + '.poi.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      ctrl.modal = modal;
      ctrl.modal.show();
    });
  }

  function showFiltersModal() {
    Filters.showModal($scope).then(function(modal) {
      ctrl.modal = modal;
      ctrl.modal.show();
    });
  }
}

function buttonCtrl(Do, Beacon, POI, UserLocation) {
  var ctrl = this;

  ctrl.loadTestPois = function loadTestPois() {
    Do.action('loadTestPois');
  };

  ctrl.debug = function debug() {
    console.log(POI.stock.visibleIds);
    console.log(POI.stock.visible);
    console.log(POI.stock.visibleIds.length);
    console.log(UserLocation.debug());
    //for (var id in POI.stock.visible) {
    //  console.log(POI.stock.visible[id].distanceToUser());
    //}
  };

  ctrl.nearestBeacon = function nearestBeacon() {
    World.timer.start('nearest');
    var beacon = Beacon.getNearest();
    World.timer.nearest.stop('nearest Beacon');
    console.log(beacon, beacon.distanceToUser());
  };
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
