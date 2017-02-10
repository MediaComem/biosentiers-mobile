/**
 * Created by Mathias Oberson on 03.02.2017.
 */
(function() {
  'use strict';
  angular
    .module('ar-view')
    .service('ArExtremityMarker', ArExtremityMarkerClass);

  function ArExtremityMarkerClass(ArBaseMarker, ArIcons, $ionicPopup, $log) {
    /**
     * This class represent a point at the extremity of a path (namely the start point and the end point)
     * @param poi The GeoJSON poi object representing the ArExtremityMarker to create
     * @constructor
     */
    function ArExtremityMarker(poi) {
      ArBaseMarker.call(this, poi, true);
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

      // The onClick has a 'return true' behavior to stop the propagation of the click event
      // to eventual ArPoi placed behind the ArExtremityMarker in the ArView.
      // See : http://www.wikitude.com/external/doc/documentation/latest/Reference/JavaScript%20API/classes/GeoObject.html#event_onClick
      // self.geoObject.onClick = function() { return true; };
      self.geoObject.onClick = promptEndOfOuting;
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

    ////////////////////

    function promptEndOfOuting() {
      // TODO : ajouter un bouton au template html
      var yesButton = {
        text : 'Oui',
        type : 'button-positive',
        onTap: function() {
          return true;
        }
      };

      var noButton = {
        text : 'Non',
        type : 'button-assertive',
        onTap: function() {
          return false;
        }
      };

      var prompt = $ionicPopup.show({
        title      : 'Fin de sentier', // String. The title of the popup.
        template   : '<p>Vous avez atteint la fin de votre sentier.</p><p>Souhaitez-vous mettre fin à votre sortie ?</p>', // String (optional). The html template to place in the popup body.
        buttons    : [noButton, yesButton]
      });

      prompt.then(function(validated) {
        $log.log("promptEndOfOuting - prompt result", validated);
        if (validated) {
          $log.log('Fin de sentier');
        } else {
          $log.log('Pas de fin du sentier');
        }
      });
      // TODO : À supprimer lorsque cette fonction servira vraiment pour l'ActionRange
      return true;
    }
  }
})();