/**
 * Created by Mathias Oberson on 17.05.2017.
 */
(function() {
  'use strict';
  angular
    .module('app')
    .controller('ExcursionSeenPoiCtrl', ExcursionSeenPoiCtrlFn);

  function ExcursionSeenPoiCtrlFn(ActivityTracker, EventLogFactory, PoiCardService, PoiContent, $log, $scope, $stateParams) {
    var TAG     = "[ExcursionSeenPoiCtrl] ",
        poiCtrl = this;

    $scope.$on('$ionicView.enter', function() {
      ActivityTracker(EventLogFactory.navigation.excursion.seenPois.card($stateParams.specieId));
    });


    poiCtrl.getTitle = function() {
      $log.log(TAG + 'content', poiCtrl.content);
      return _.get(poiCtrl, 'content.commonName.fr');
    };

    PoiContent.getPoiData($stateParams.specieId, $stateParams.theme)
      .then(function(data) {
        PoiCardService.setup(poiCtrl, data);
        $log.log(TAG + "updated controller", poiCtrl);
        poiCtrl.includeSrc = './utils/poi-card/poi-card-' + $stateParams.theme + '.html';
      });
  }
})();
