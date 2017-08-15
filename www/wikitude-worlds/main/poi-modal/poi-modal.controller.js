/**
 * Created by Mathias Oberson on 08.05.2017.
 */
(function() {
  'use strict';
  angular
    .module('poi-modal')
    .controller('PoiModalCtrl', PoiModalCtrlFn);

  function PoiModalCtrlFn(AppActions, ArView, EventLogFactory, Excursion, $log, Modals, SeenTracker, PoiCardService) {
    var TAG     = "[PoiModalCtrl] ",
        poiCtrl = this;

    poiCtrl.remove = remove;
    poiCtrl.setPoiSeen = setPoiSeen;
    poiCtrl.checkBoxState = checkBoxState;
    poiCtrl.getImageSource = getImageSource;

    Excursion.currentPoiChangeObs.subscribe(function(data) {
      $log.log(TAG + 'currentPoiChangeObs', data);
      poiCtrl.poi = data.poi;
      poiCtrl.hasBeenSeen = SeenTracker.hasBeenSeen(poiCtrl.poi);
      poiCtrl.commonNameLanguages = Object.keys(poiCtrl.poi.properties.commonName);
      $log.log(TAG + 'poiCtrl.commonNameLanguages', poiCtrl.commonNameLanguages);
      PoiCardService.setup(poiCtrl, data.details);
    });

    ////////////////////

    function getImageSource(id) {
      return "./assets/img/" + id + "a.jpg";
    }

    function setPoiSeen() {
      AppActions.execute('trackActivity', {eventObject: EventLogFactory.action.ar.poi.checked(Excursion.serverId, poiCtrl.poi.id, poiCtrl.content.id)});
      Modals.removeCurrent().then(function() {
        ArView.setPoiSeen(poiCtrl.poi);
      });
    }

    function checkBoxState() {
      return poiCtrl.hasBeenSeen ? 'ion-android-checkbox-outline' : 'ion-android-checkbox-outline-blank';
    }

    function remove() {
      AppActions.execute('trackActivity', {eventObject: EventLogFactory.action.ar.poi.closed(Excursion.serverId, poiCtrl.poi.id, poiCtrl.content.id)});
      Modals.removeCurrent();
    }
  }
})();
