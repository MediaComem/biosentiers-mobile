/**
 * Created by Mathias on 04.05.2016.
 */
(function () {
  'use strict';

  angular
    .module('ARLib')
    .service('Markers', Markers);

  function Markers() {
    var markers = [];

    this.get = getMarker;
    this.markers = markers;

    ////////////////////

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

    function getMarker(type) {
      if (!markers[type] || markers[type].destroyed) {
        var img = new AR.ImageResource("assets/" + type + ".png", {
          onError: function () {
            throw new SyntaxError("Aucun marqueur existant pour le type '" + type + "'.");
          }
        });
        markers[type] = new AR.ImageDrawable(img, 2, {
          zOrder: 0,
          opacity: 1.0
        });
      }
      //console.log("Type :", type);
      return markers[type];
    }
  }
})();
