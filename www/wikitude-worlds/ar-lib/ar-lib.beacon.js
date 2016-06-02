/**
 * Created by Mathias on 25.05.2016.
 */
(function () {
  'use strict';

  angular
    .module('ARLib')
    .factory('Beacon', fnBeacon);

  function fnBeacon(Do) {
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
    Beacon.loadStock = loadStock;
    Beacon.activateNearest = activateNearest;
    Beacon.nearest = null;
    Beacon.stock = [];

    // Methods
    Beacon.prototype.distanceToUser = distanceToUser;
    Beacon.prototype.activate = activate;
    Beacon.prototype.deactivate = deactivate;
    Beacon.prototype.canDetectUser = canDetectUser;

    return Beacon;

    ////////////////////

    function getNearest() {
      var nearest = null, distance;
      Beacon.stock.forEach(function (beacon) {
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

    function loadStock(beaconDataArray) {
      beaconDataArray.forEach(function(beaconData) {
        Beacon.stock.push(new Beacon(beaconData));
      });
    }

    function activateNearest() {
      Beacon.nearest = Beacon.getNearest();
      if (Beacon.nearest) {
        console.log(Beacon.nearest);
        Beacon.nearest.activate();
        console.log('Loading the beacon\'s points');
        Do.action('loadPois', {beacon: Beacon.nearest.id});
      }
    }

    function distanceToUser() {
      return this.location.distanceToUser();
    }

    function activate() {
      this.area = new AR.ActionRange(this.location, 150, {
        onEnter: onBeaconEnter(this),
        onExit : onBeaconExit(this)
      });
    }

    function deactivate() {
      this.area.destroy();
      this.area = null;
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

    function canDetectUser(position) {
      if (this.area) {
        return this.area.isInArea(new AR.GeoLocation(position.lat, position.lon, position.alt));
      }
      throw new ReferenceError("Nearest beacon has not been activated and, thus, do not have any ActionRange. Please call the activate() method of this beacon and try again.");
    }
  }
})();
