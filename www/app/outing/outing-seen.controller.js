/**
 * Created by Mathias Oberson on 10.02.2017.
 */
(function() {
  'use strict';
  angular
    .module('app')
    .controller('OutingSeenCtrl', OutingSeenCtrl);

  function OutingSeenCtrl(outingData, seenPois) {
    var outingSeen = this;

    console.log(seenPois);

    outingSeen.outing = outingData;
    outingSeen.seenPois = seenPois;
  }
})();