/**
 * Created by Mathias Oberson on 17.05.2017.
 */
(function() {
  'use strict';
  angular
    .module('app')
    .controller('ExcursionSeenPoiCtrl', ExcursionSeenPoiCtrlFn);

  function ExcursionSeenPoiCtrlFn(PoiCardService, PoiContent, $log, $stateParams) {
    var poiCtrl = this;

    poiCtrl.getTitle = function() {
      $log.log('content', poiCtrl.content);
      return _.get(poiCtrl, 'content.commonName.fr');
    };

    PoiContent.getPoiData($stateParams.specieId, $stateParams.theme)
      .then(function(data) {
        PoiCardService.setup(poiCtrl, data);
        $log.log(poiCtrl);
      });
  }
})();
