/**
 * Created by Mathias on 04.05.2016.
 */
(function() {
  'use strict';

  angular
    .module('ar-view')
    .factory('ArIcons', ArIconsService);

  function ArIconsService($log) {

    var images    = [];

    var availableTypes = [
      'default',
      'bird',
      'butterfly',
      'flower',
      'watercourse',
      'territory',
      'greenroof',
      'ecoarea',
      'wetarea',
      'wildlifecorridor',
      'birdterritory',
      'biodivercity',
      'garden'
    ];

    var service = {
      get: getIcon,
      // getSeen: getSeenIcon
    };

    return service;

    ////////////////////

    function getIcon(type, opacity, hasBeenSeen) {
      type = hasBeenSeen ? type + 'Vu' : type;

      if (!images[type] || images[type].destroyed) {
        images[type] = new AR.ImageResource("assets/" + type + ".png", {
          onError: function() {
            throw new SyntaxError("Aucun marqueur existant pour le type '" + type + "'.");
          }
        });
      }

      //console.log("Type :", type);
      return new AR.ImageDrawable(images[type], 2, {
        zOrder : 0,
        opacity: opacity
      });
    }

    // function getSeenIcon(type) {
    //   if (!seenIcons[type] || seenIcons[type].destroyed) {
    //
    //     var img = new AR.ImageResource("assets/" + type + "Vu.png", {
    //       onError: function() {
    //         throw new SyntaxError("Aucun marqueur existant pour le type '" + type + "'.");
    //       }
    //     });
    //
    //     seenIcons[type] = new AR.ImageDrawable(img, 2, {
    //       zOrder : 0,
    //       opacity: 0.75
    //     });
    //   }
    //   return seenIcons[type];
    // }
  }
})();
