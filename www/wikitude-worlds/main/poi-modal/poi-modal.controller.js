/**
 * Created by Mathias Oberson on 08.05.2017.
 */
(function() {
  'use strict';
  angular
    .module('poi-modal')
    .controller('PoiModalCtrl', PoiModalCtrlFn);

  function PoiModalCtrlFn(ArView, Excursion, $log, Modals, $ionicPopup) {
    var poiCtrl = this;

    poiCtrl.selectedLanguage = 'fr';
    poiCtrl.remove = Modals.removeCurrent;
    poiCtrl.flagUrl = getFlagIconUrl();
    poiCtrl.setPoiSeen = setPoiSeen;
    poiCtrl.openInBrowser = openInBrowser;
    poiCtrl.classFromTheme = classFromTheme;
    poiCtrl.updateCommomName = updateCommomName;
    poiCtrl.getFlagIconUrl = getFlagIconUrl;

    poiCtrl.getImageSource = getImageSource;

    Excursion.currentPoiChangeObs.subscribe(function(data) {
      $log.log('PoiModal:currentPoiChangeObs', data);
      poiCtrl.poi = data.poi;
      poiCtrl.commonNameLanguages = Object.keys(poiCtrl.poi.properties.common_name);
      $log.log('PoiModalCtrl:poiCtrl.commonNameLanguages', poiCtrl.commonNameLanguages);
      poiCtrl.content = data.details;
    });

    ////////////////////

    function getFlagIconUrl() {
      return "../../img/flags/" + poiCtrl.selectedLanguage + ".png";
    }

    function getImageSource(id) {
      return "./assets/img/" + id + "a.jpg";
    }

    function updateCommomName() {
      $log.log('PoiModalCtrl:updateCommonName', poiCtrl.selectedLanguage);
    }

    function setPoiSeen() {
      Modals.removeCurrent().then(function() {
        ArView.setPoiSeen(poiCtrl.poi);
      });
    }

    function openInBrowser() {
      AR.context.openInBrowser(poiCtrl.content.website, true);
    }

    function classFromTheme(theme) {
      var classes = {
        bird     : 'positive',
        flower   : 'energized',
        butterfly: 'balanced',
        tree     : 'assertive'
      };

      return classes[theme];
    }

  }
})();
