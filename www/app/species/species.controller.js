/**
 * Created by Mathias on 29.03.2016.
 */
(function () {
  'use strict';

  angular
    .module('app')
    .controller('SpeciesCtrl', SpeciesCtrl);

  function SpeciesCtrl(MapIcons, leafletData, $log, speciesData, $scope) {
    var species = this,
        UserPosition = {
          lat: 46.781001,
          lng: 6.647128
        },
        clusterLayerOptions = {
          disableClusteringAtZoom: 18
        };

        var markersArray = [];

    species.data = speciesData;

    species.map = {
      maxbounds: {
        northEast: {
          lat: 46.776593276526796,
          lng: 6.6319531547147532
        },
        southWest: {
          lat: 46.789845089288413,
          lng: 6.6803974239963217
        }
      },
      tiles    : {
        url    : 'tiles/{z}/{x}/{y}.png',
        options: {
          errorTileUrl: 'tiles/error.png'
        }
      },
      defaults : {
        scrollWheelZoom   : true,
        maxZoom           : 18,
        minZoom           : 11,
        attributionControl: false
      },
      center   : {
        lat : UserPosition.lat,
        lng : UserPosition.lng,
        zoom: 16
      },
      markers  : {
        user: {
          lat : UserPosition.lat,
          lng : UserPosition.lng,
          icon: MapIcons.user
        }
      },
      layers : {
        overlays: {
          markers  : {
            name        : "Marqueurs",
            type        : "markercluster",
            visible     : true,
            layerOptions: clusterLayerOptions
          },
          Oiseaux  : {
            name   : "Oiseaux",
            type   : "markercluster",
            visible: false
          },
          Flore    : {
            name   : "Flore",
            type   : "markercluster",
            visible: true
          },
          Papillons: {
            name   : "Papillons",
            type   : "markercluster",
            visible: true
          }
        }
      }
    };

    $scope.$on("$ionicView.enter", function() {
      leafletData.getMap('map').then(function(map) {
        //$log.debug(map);
        markersArray = addMapMarkers(speciesData);
        map.fitBounds(addMapMarkers(speciesData));
      }).catch(function(error) {
        $log.warn(error);
      });
    });


    /**
     * Adds new markers on the map, based on the informations in the poisToAdd argument.
     * @param poisToAdd An Array containing GeoJSON Point object.
     */
    function addMapMarkers(poisToAdd) {
      var markersArray = [];
      _.each(poisToAdd, function (poi) {
        species.map.markers[poi.properties.id] = {
          layer: 'markers',
          lat  : poi.geometry.coordinates[1],
          lng  : poi.geometry.coordinates[0],
          icon : MapIcons.get(poi.properties.theme)
        };
        markersArray.push([poi.geometry.coordinates[1], poi.geometry.coordinates[0]]);
      })
      return markersArray;
    }

    function handleError(error) {
      $log.error(error);
    }

  }
})();
