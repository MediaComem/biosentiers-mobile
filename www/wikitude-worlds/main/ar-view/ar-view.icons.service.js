/**
 * Created by Mathias on 04.05.2016.
 */
(function () {
  'use strict';

  angular
    .module('ar-view')
    .factory('ArIcons', ArIconsService);

  function ArIconsService() {

    var markers = [];

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
      get: getIcon
    };

    return service;

    ////////////////////

    function getIcon(type, opacityWithinDistance) {
      var typeAndOpacity = type + '' + opacityWithinDistance*10;

      if (!markers[typeAndOpacity] || markers[typeAndOpacity].destroyed) {

        var img = new AR.ImageResource("assets/" + typeAndOpacity + ".png", {
          onError: function () {
            throw new SyntaxError("Aucun marqueur existant pour le type '" + type + "'.");
          }
        });

        markers[typeAndOpacity] = new AR.ImageDrawable(img, 2, {
          zOrder : 0,
          opacity: 1.0
        });
      }
      //console.log("Type :", type);
      return markers[typeAndOpacity];
    }
  }
})();
