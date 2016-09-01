(function () {
  'use strict';

  angular
    .module('mini-map')
    .directive('miniMap', MiniMapDirective)
    .controller('MiniMapCtrl', MiniMapCtrl);

  function MiniMapDirective() {
    return {
      restrict    : 'E',
      replace     : true,
      controller  : 'MiniMapCtrl',
      controllerAs: 'map',
      templateUrl : 'mini-map/mini-map.html'
    };
  }

  function MiniMapCtrl(Icons, $http, BigMapModal, $log, POI, $rootScope, $scope, UserLocation) {
    var ctrl = this,
        zoom = 16;

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
          icon: Icons.user()
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

    $scope.$on('leafletDirectiveMap.minimap.click', function () {
      BigMapModal.open($scope);
    });

    $http.get('../../data/path.json').then(function (success) {
      ctrl.spec.geojson.path = {
        data : success.data,
        style: {
          color : 'red',
          weigth: 6
        }
      };
      console.log(ctrl.spec);
    }, function (error) {
      $log.error(error);
    });

    $rootScope.$on('user:located', centerMiniMap);

    POI.changesObservable.subscribe(function(changes) {
      $log.log(changes);
      _.each(changes.removed, function (point) {
        delete ctrl.spec.markers[point.properties.id_poi];
      });
      _.each(changes.added, function (point) {
        ctrl.spec.markers[point.properties.id_poi] = {
          lat : point.geometry.coordinates[1],
          lng : point.geometry.coordinates[0],
          icon: Icons.get(point.properties.theme_name)
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
