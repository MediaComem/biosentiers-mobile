/**
 * Created by Mathias Oberson on 08.05.2017.
 */
(function() {
  'use strict';
  angular
    .module('poi-modal')
    .controller('PoiModalCtrl', PoiModalCtrlFn);

  function PoiModalCtrlFn(ArView, Excursion, $log, Modals) {
    var poiCtrl = this;

    poiCtrl.remove = Modals.removeCurrent;
    poiCtrl.setPoiSeen = setPoiSeen;
    poiCtrl.openInBrowser = openInBrowser;
    poiCtrl.barClassForTheme = barClassForTheme;

    Excursion.currentPoiChangeObs.subscribe(function(data) {
      $log.log('PoiModal:currentPoiChangeObs', data);
      poiCtrl.poi = data.poi;
      poiCtrl.content = data.details;
    });

    ////////////////////

    function setPoiSeen() {
      Modals.removeCurrent().then(function() {
        ArView.setPoiSeen(poiCtrl.poi);
      });
    }

    function openInBrowser() {
      AR.context.openInBrowser(poiCtrl.content.website, true);
    }

    function barClassForTheme(theme) {
      var classes = {
        bird: 'bar-positive',
        flower: 'bar-energized',
        butterfly: 'bar-balanced',
        tree: 'bar-assertive'
      };

      return classes[theme];
    }

  }
})();
