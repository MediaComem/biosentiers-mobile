/**
 * Created by Mathias on 04.05.2016.
 */
(function () {
  'use strict';
  angular
    .module('ARLib')
    .service('Markers', Markers);

  function Markers() {
    this.default = new AR.ImageResource("assets/location.png");
    this.bird = new AR.ImageResource('assets/birds.png');
    this.butterfly = new AR.ImageResource('assets/birds.png');
    this.flower = new AR.ImageResource('assets/flower.png');
    this.watercourse = new AR.ImageResource('assets/watercourse.png');
    this.territory = new AR.ImageResource('assets/territory.png');
    this.greenRoof = new AR.ImageResource('assets/green_roof.png');
    this.ecoArea = new AR.ImageResource('assets/eco_area.png');
    this.wetArea = new AR.ImageResource('assets/wet_area.png');
    this.wildlifeCorridor = new AR.ImageResource('assets/wildlife_corridor.png');
    this.birdTerritory = new AR.ImageResource('assets/bird_territory.png');
    this.biodivercity = new AR.ImageResource('assets/biodivercity.png');
    this.garden = new AR.ImageResource('assets/garden.png');
  }
})();
