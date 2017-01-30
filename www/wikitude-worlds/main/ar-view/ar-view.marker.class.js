(function() {
  'use strict';

  angular
    .module('ar-view')
    .factory('ArMarker', ArMarkerClass);

  function ArMarkerClass(ArIcons, $log) {

    /**
     * This class represent a geolocalized marker in the ArView.
     * @param poi The GeoJSON poi object representing the ArMarker to create
     * @param enabled A Boolean indicating wether or not the ArMarker should be visible in the ArView
     * @param onClick A callback that will be executed whenever the ArMarker is clicked in the ArView
     * @param hasBeenSeen A Boolean indicating wether or not the ArMarker has already been seen by the user
     * @constructor
     */
    function ArMarker(poi, enabled, onClick, hasBeenSeen) {
      var self = this;

      self.poi = poi;
      self.id = poi.properties.id_poi;
      self.properties = poi.properties;
      self.hasBeenSeen = hasBeenSeen;

      self.location = new AR.GeoLocation(poi.geometry.coordinates[1], poi.geometry.coordinates[0], getCorrectedAltitude());

      self.actionRange = new AR.ActionRange(self.location, AR.context.scene.minOpacityDistance, {
        onEnter: setActive(self),
        onExit : setInactive(self)
      });

      if (self.distanceToUser() > 20) {
        self.icon = ArIcons.getInactive(self.properties.theme_name, self.hasBeenSeen);
      } else {
        self.icon = ArIcons.getActive(self.properties.theme_name, self.hasBeenSeen);
      }

      self.geoObject = new AR.GeoObject(self.location, {
        enabled  : enabled,
        onClick  : onClick(self),
        drawables: {
          cam: [self.icon]
        }
      });

      ////////////////////

      /**
       * Returns a corrected altitude depending on the plaform on which the app is running.
       * In fact, there is a bug on Android where the altitude returned is not the actual altitude
       * @return {*}
       */
      function getCorrectedAltitude() {
        if (ionic.Platform.isAndroid()) {
          return poi.geometry.coordinates[2] + 80;
        } else {
          return poi.geometry.coordinates[2];
        }
      }
    }

    // Methods

    /**
     * Return the straight distance between the ArPoi and the user, in meters
     */
    ArMarker.prototype.distanceToUser = function() {
      return this.location.distanceToUser();
    };

    /**
     * Indicates wether or not the ArPoi is currently visible in the ArView.
     */
    ArMarker.prototype.isVisible = function() {
      return this.geoObject.enabled;
    };

    /**
     * Update the ArPoi to reflect the fact that it had been seen by the user.
     * This means:
     *  * setting its flag to true
     *  * changing its icon
     */
    ArMarker.prototype.setSeen = function() {
      this.hasBeenSeen = true;
      this.geoObject.drawables.cam = [ArIcons.getActive(this.properties.theme_name, this.hasBeenSeen)];
    };

    /**
     * Change the visibility of the ArPoi based on the value of the visible argument.
     * To make an hidden ArPoi visible, call this function and pass it true as its argument's value.
     * To make a visible ArPoi hidden, call this function and pass it false as its argument's value.
     * @param visible A boolean indicating wether or not the ArPoi should be visible
     * @return {ArMarker} The ArPoi whos visibility has been changed.
     */
    ArMarker.prototype.setVisible = function(visible) {
      this.geoObject.enabled = visible;
      return this;
    };

    /**
     * Removes the ArPoi from the ArView, along with all of its componants.
     */
    ArMarker.prototype.remove = function() {
      this.location.destroy();
      this.location.destroyed && (this.location = null);
      this.geoObject.destroy();
      this.geoObject.destroyed && (this.geoObject = null);
    };

    return ArMarker;

    ////////////////////

    /**
     * Returns a Closure to use as callback for the onEnter event of an ArPoi's ActionRange.
     * @param ArPoi The ArPoi for which the closure will be created.
     * @return {Function} The Closure to use as callback.
     */
    function setActive(ArPoi) {
      /**
       * This function will be fired any time the user is within an ArPoi ActionRange.
       * It will change the ArPoi's Icon to a opaque one, indicating that the ArPoi can be clicked.
       */
      return function onEnterSetActive() {
        ArPoi.geoObject.drawables.cam = [ArIcons.getActive(ArPoi.properties.theme_name, ArPoi.hasBeenSeen)];
      }
    }

    /**
     * Returns a Closure to use as callback for the onExit event of an ArPoi's ActionRange.
     * @param ArPoi The ArPoi for which the closure will be created.
     * @return {Function} The Closure to use as callback.
     */
    function setInactive(ArPoi) {
      /**
       * This function will be fired any time the user moves out of an ArPoi's ActionRange.
       * It will change the ArPoi's Icon to a transparent one, indicating that the ArPoi can't be clicked.
       */
      return function onExitSetInactive() {
        ArPoi.geoObject.drawables.cam = [ArIcons.getInactive(ArPoi.properties.theme_name, ArPoi.hasBeenSeen)];
      }
    }
  }
})();
