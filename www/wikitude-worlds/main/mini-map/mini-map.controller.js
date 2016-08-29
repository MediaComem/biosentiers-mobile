(function() {
  'use strict';
  
  angular
    .module('mini-map')
    .controller('MiniMapCtrl', MiniMapCtrl);
  
  function MiniMapCtrl($http, Modals, $log, $rootScope, $scope, UserLocation) {
    var ctrl = this,
        zoom = 17;

    var icons = {
      Oiseaux: {
        type      : 'div',
        iconSize  : [10, 10],
        className : 'blue',
        iconAnchor: [5, 5]
      },
      Flore  : {
        type      : 'div',
        iconSize  : [10, 10],
        className : 'red',
        iconAnchor: [5, 5]
      },
      user   : {
        iconUrl   : '../../img/icons/user.png',
        iconSize  : [14, 14], // size of the icon
        iconAnchor: [7, 7] // point of the icon which will correspond to marker's location
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
      $log.log(changes);
      _.each(changes.removed, function (point) {
        delete ctrl.spec.markers[point.properties.id_poi];
      });
      _.each(changes.added, function (point) {
        ctrl.spec.markers[point.properties.id_poi] = {
          lat : point.geometry.coordinates[1],
          lng : point.geometry.coordinates[0],
          icon: icons[point.properties.theme_name]
        }
      });
      $log.log(ctrl.spec);
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
})();