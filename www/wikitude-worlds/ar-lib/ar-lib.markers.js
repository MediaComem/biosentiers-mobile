/**
 * Created by Mathias on 04.05.2016.
 */
(function () {
  'use strict';
  angular
    .module('ARLib')
    .service('Markers', Markers);

  function Markers() {
    //this.idle = idle;
    //this.bird = bird;
    //this.butterfly = butterfly;
    //this.flower = flower;
    //this.watercourse = watercourse;
    //this.territory = territory;
    //this.greenRoof = greenRoof;
    //this.ecoArea = ecoArea;
    //this.wetArea = wetArea;
    //this.wildlifeCorridor = wildlifeCorridor;
    //this.birdTerritory = birdTerritory;
    //this.biodivercity = biodivercity;
    //this.garden = garden;

    this.get = getMarker;

    ////////////////////

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

    function getMarker(type) {
      if (!markers[type]) {
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
      console.log("Type :", type);
      //console.log("Marqueurs disponibles :", markers);
      return markers[type];
    }
  }
})();
