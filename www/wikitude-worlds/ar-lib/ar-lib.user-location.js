/**
 * Created by Mathias on 08.06.2016.
 */
(function () {
  'use strict';
  angular
    .module('ARLib')
    .factory('UserLocation', UserLocation);

  function UserLocation() {
    var service = {
      update : update,
      current: null,
      last   : null,
      lon    : current.geometry.coordinates[0],
      lat    : current.geometry.coordinates[1],
      alt    : current.geometry.coordinates[2]
    };

    return service;

    ////////////////////

    function update(lon, lat, alt) {
      service.last = service.current;
      service.current = new Location(lon, lat, alt);
    }

    function Location(lon, lat, alt) {
      this.type = "Feature";
      this.properties = {};
      this.geometry = {
        type       : "Point",
        coordinates: [lon, lat, alt]
      }
    }
  }
})();
