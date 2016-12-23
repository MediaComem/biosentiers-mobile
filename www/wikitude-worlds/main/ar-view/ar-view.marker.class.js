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

      self.icon = ArIcons.get(self.properties.theme_name, calcOpacity(self.distanceToUser()), self.hasBeenSeen);
      // self.icon.opacity = ;
      // icon.opacity = calcOpacity(self.location.distanceToUser());
      // icon.opacity = 0.5;

      $log.log(self.icon);

      self.geoObject = new AR.GeoObject(self.location, {
        enabled  : enabled,
        onClick  : onClick(self),
        drawables: {
          cam: [self.icon]
        }
      });
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
      this.icon = [ArIcons.get(this.properties.theme_name, calcOpacity(this.distanceToUser()), this.hasBeenSeen)];
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
      this.icon = [ArIcons.get(this.properties.theme_name, calcOpacity(this.distanceToUser()))];
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

    ////////////////////

    /**
     * Calculates the opacity needed for the ArMarker, based on it's distance to the user.
     * The farthest it is, the more transparent it will be. All points less distant to the user
     * than the value of
     * @param distance The distance between the user and the ArPoi
     * @return {number} The value of the ArPoi's icon opacity.
     */
    function calcOpacity(distance) {
      var opacityFactor = 1 / (AR.context.scene.cullingDistance - AR.context.scene.minOpacityDistance);
      distance = distance - AR.context.scene.minOpacityDistance;
      var opacity = 1 - (distance * opacityFactor);
      return opacity > 1 ? 1 : opacity;
    }
  }
})();
