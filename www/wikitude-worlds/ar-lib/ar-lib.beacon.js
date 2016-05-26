/**
 * Created by Mathias on 25.05.2016.
 */
(function () {
  'use strict';

  angular
    .module('ARLib')
    .factory('Beacon', fnBeacon);

  function fnBeacon() {
	  /**
     * @param data
     * @constructor
     */
    function Beacon(data) {
      this.id = data.properties.id;
      this.location = new AR.GeoLocation(data.geometry.coordinates[1], data.geometry.coordinates[0], data.geometry.coordinates[2]);
      this.area = null;
    }

    // Static
    Beacon.getNearest = getNearest;

    // Methods
    Beacon.prototype.distanceToUser = distanceToUser;
    Beacon.prototype.activate = activate;

    return Beacon;

    ////////////////////

    function getNearest(beacons) {
      var nearest = null, distance;
      beacons.forEach(function (beacon) {
        if (!nearest) {
          nearest = beacon;
          distance = nearest.distanceToUser();
        } else {
          var tempDist = beacon.distanceToUser();
          if (tempDist < distance) {
            distance = tempDist;
            nearest = beacon;
          }
        }
      });
      return nearest;
    }

    function distanceToUser() {
      return this.location.distanceToUser();
    }

    function activate() {
      this.area = new AR.ActionRange(this.location, 150, {
        onEnter: onBeaconEnter(this),
        onExit: onBeaconExit(this)
      });
    }

    function onBeaconEnter(beacon) {
      return function onEnter() {
        console.log('entering beacon', beacon);
      }
    }

    function onBeaconExit(beacon) {
      return function onExit() {
        console.log('exiting beacon', beacon);
        // scan la plus proche des beacon
        // si this est la plus proche, rien
        // si une autre que this est la plus proche, alors on load les POIs de la beacon
      }
    }
  }
})();
