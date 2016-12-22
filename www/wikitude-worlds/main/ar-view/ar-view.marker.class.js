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

      self.location = new AR.GeoLocation(poi.geometry.coordinates[1], poi.geometry.coordinates[0], poi.geometry.coordinates[2]);

      self.title = new AR.Label(self.id, 1, {
        zOrder : 1,
        offsetY: 2,
        style  : {
          textColor: '#FFFFFF',
          fontStyle: AR.CONST.FONT_STYLE.BOLD
        }
      });


      self.geoObject = new AR.GeoObject(self.location, {
        enabled  : enabled,
        onClick  : onClick(self),
        drawables: {
          cam: [getIcon()]
        }
      });

      /**
       * Select the correct icon depending on wether the ArPoi have been seen or not.
       * @return {AR.ImageDrawable} The icon to add to the new ArMarker
       */
      function getIcon() {
        if (self.hasBeenSeen) {
          return ArIcons.getSeen(self.properties.theme_name);
        } else {
          return ArIcons.get(self.properties.theme_name, false, CalcOpacity(self.location));
        }
      }
    }

    /**
     * Calculates the opacity needed for the ArMarker, based on it's distance to
     * Opacity within distance
     * Everything within 0-20 meters has the same/full opacity), rounded to 1 decimal
     */
    function CalcOpacity(location) {
      var opacityCalc = location.distanceToUser() > 20 ? Math.round(((location.distanceToUser() - 20) * ((0.1 - 1.0) / (250 - 20)) + 1.0) * 10) : 10;
      return opacityCalc % 2 == 0 ? opacityCalc / 10 : (opacityCalc + 1) / 10;
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
      this.geoObject.drawables.cam = [ArIcons.getSeen(this.properties.theme_name)];
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
     * Updates the ArMarker by calculating it's new opacity.
     */
    ArMarker.prototype.updateOpacity = function() {
      this.geoObject.drawables.cam = [ArIcons.get(this.properties.theme_name, CalcOpacity(this.location))];
    };

    /**
     * Removes the ArPoi from the ArView, along with all of its componants.
     */
    ArMarker.prototype.remove = function() {
      this.title.destroy();
      this.title.destroyed && (this.title = null);
      this.location.destroy();
      this.location.destroyed && (this.location = null);
      this.geoObject.destroy();
      this.geoObject.destroyed && (this.geoObject = null);
    };

    return ArMarker;
  }
})();
