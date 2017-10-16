/**
 * Created by Mathias Oberson on 03.02.2017.
 */
(function() {
  'use strict';
  angular
    .module('ar-view')
    .service('ArExtremityMarker', ArExtremityMarkerClass);

  function ArExtremityMarkerClass(ArBaseMarker, ArIcons, $log) {
    var TAG = "[ArExtremityMarker] ";

    /**
     * This class represent a point at the extremity of a path (namely the start point and the end point).
     * If the onEnterActionRange argument is passed, the point will have an ActionRange that will trigger the function.
     * @param poi The GeoJSON poi object representing the ArExtremityMarker to create
     * @param onEnterActionRange (Optionnal) A function describing what happen when the user enters the ActionRange of the point
     * @constructor
     */
    function ArExtremityMarker(poi, onEnterActionRange) {
      ArBaseMarker.call(this, poi, true);
      var self = this;

      if (onEnterActionRange && typeof onEnterActionRange === 'function') {
        self.actionRange = new AR.ActionRange(self.location, AR.context.scene.minPoiActiveDistance, {
          onEnter: onEnterActionRange
        });
      }

      $log.debug(TAG + 'distanceToUser', self.distanceToUser());

      if (self.distanceToUser() > AR.context.scene.minPoiActiveDistance) {
        self.icon = ArIcons.getInactive(self.properties.type);
      } else {
        self.icon = ArIcons.getActive(self.properties.type);
      }

      // self.geoObject.onClick = onEnterActionRange || function() {return true;};
      self.geoObject.drawables.cam = [self.icon];
    }

    // Make the ArExtremityMarker class inherit from the ArBaseMarker class.
    ArExtremityMarker.prototype = Object.create(ArBaseMarker.prototype);
    ArExtremityMarker.prototype.constructor = ArExtremityMarker;

    // Methods

    /**
     * Removes the ArPoi from the ArView, along with all of its componants.
     */
    ArExtremityMarker.prototype.remove = function() {
      // Remove location and geoObject
      ArBaseMarker.prototype.remove.call(this);
      this.actionRange.destroy();
      this.actionRange.destroyed && (this.actionRange = null);
    };

    return ArExtremityMarker;
  }
})();
