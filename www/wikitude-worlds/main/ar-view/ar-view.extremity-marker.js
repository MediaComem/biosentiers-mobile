/**
 * Created by Mathias Oberson on 03.02.2017.
 */
(function() {
  'use strict';
  angular
    .module('ar-view')
    .service('ArExtremityMarker', ArExtremityMarkerClass);

  function ArExtremityMarkerClass(ArBaseMarker, ArIcons, $log) {
    /**
     *
     * @constructor
     */
    function ArExtremityMarker(poi, enabled) {
      ArBaseMarker.call(this, poi, enabled);
      var self = this;

      self.actionRange = new AR.ActionRange(self.location, AR.context.scene.minPoiActiveDistance, {
        onEnter: promptEndOfOuting
      });

      $log.debug("ar-view.extremity.class.js - ArExtremityMarker", self.distanceToUser());

      if (self.distanceToUser() > AR.context.scene.minPoiActiveDistance) {
        self.icon = ArIcons.getInactive(self.properties.type);
      } else {
        self.icon = ArIcons.getActive(self.properties.type);
      }

      self.geoObject.drawables.cam = [self.icon];
    }

    ArExtremityMarker.prototype = Object.create(ArBaseMarker.prototype);
    ArExtremityMarker.prototype.constructor = ArExtremityMarker;

    // Methods

    ArExtremityMarker.prototype.remove = function() {
      // Remove location and geoObject
      ArBaseMarker.prototype.remove.call(this);
      this.actionRange.destroy();
      this.actionRange.destroyed && (this.actionRange = null);
    };

    return ArExtremityMarker;

    ////////////////////

    function promptEndOfOuting() {

    }
  }
})();