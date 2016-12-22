/**
 * Created by Mathias on 04.05.2016.
 */
(function() {
  'use strict';

  angular
    .module('ar-view')
    .factory('ArIcons', ArIconsService);

  function ArIconsService($log) {

    var markers     = [],
        seenMarkers = [];

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
      get    : getIcon,
      getSeen: getSeenIcon
    };

    return service;

    ////////////////////

    function getIcon(type, withOpacity, opacityWithinDistance) {
      var typeAndOpacity = withOpacity ? type + '' + opacityWithinDistance * 10 : type;

      if (!markers[typeAndOpacity] || markers[typeAndOpacity].destroyed) {

        var img = new AR.ImageResource("assets/" + typeAndOpacity + ".png", {
          onError: function() {
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

    function getSeenIcon(type) {
      if (!seenMarkers[type] || seenMarkers[type].destroyed) {

        var img = new AR.ImageResource("assets/" + type + "Vu.png", {
          onError: function() {
            throw new SyntaxError("Aucun marqueur existant pour le type '" + type + "'.");
          }
        });

        seenMarkers[type] = new AR.ImageDrawable(img, 2, {
          zOrder : 0,
          opacity: 1.0
        });
      }
      return seenMarkers[type];
    }
  }
})();
