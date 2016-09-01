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
      controllerAs: "minimap",
      templateUrl : 'mini-map/mini-map.html'
    };
  }

  function MiniMapCtrl(Icons, $http, BigMapModal, $log, POI, $scope, UserLocation) {
      var minimap = this,
        zoom = 16;

    minimap.config = {
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
      BigMapModal.show($scope);
    });

    $http.get('../../data/path.json').then(function (success) {
      minimap.config.geojson.path = {
        data : success.data,
        style: {
          color : 'red',
          weigth: 6
        }
      };
      console.log(minimap.config);
    }, function (error) {
      $log.error(error);
    });

    UserLocation.currentObs.subscribe(centerMiniMap);

    POI.poisChangeObs.subscribe(function(changes) {
      $log.log(changes);
      _.each(changes.removed, function (point) {
        delete minimap.config.markers[point.properties.id_poi];
      });
      _.each(changes.added, function (point) {
        minimap.config.markers[point.properties.id_poi] = {
          lat : point.geometry.coordinates[1],
          lng : point.geometry.coordinates[0],
          icon: Icons.get(point.properties.theme_name)
        }
      });
      $log.log(minimap.config);
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
      if (minimap.config.hasOwnProperty('center')) {
        $log.debug('Updating the minimap center');
        minimap.config.center.lat = UserLocation.current.lat();
        minimap.config.center.lng = UserLocation.current.lon();
      }
      if (minimap.config.markers.hasOwnProperty('user')) {
        $log.debug('Updating the minimap marker');
        minimap.config.markers.user.lat = UserLocation.current.lat();
        minimap.config.markers.user.lng = UserLocation.current.lon();
      }
      $scope.$apply();
    }
  }
})();
