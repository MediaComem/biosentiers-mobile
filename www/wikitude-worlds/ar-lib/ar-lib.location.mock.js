/**
 * Created by Mathias on 02.06.2016.
 */
(function () {
  'use strict';
  angular
    .module('ARLib')
    .service('LocationMock', LocationMock);

  function LocationMock() {
    this.stRoch = {lat: 46.781058, lon: 6.647179, alt: 431};
    this.plageYverdon = {lat: 46.784083, lon: 6.652281, alt: 431};
    this.cheseaux = {lat: 46.779043, lon: 6.659222, alt: 448};
    this.sentierFin = {lat: 46.783761164294603, lon: 6.665670909245111, alt: 436.74};
    this.sentierDebut = {lat: 46.781025850072695, lon: 6.641159078988079, alt: 430};
  }
})();
