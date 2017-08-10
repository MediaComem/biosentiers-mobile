/**
 * Created by Mathias on 29.03.2016.
 */
(function() {
  'use strict';

  angular
    .module('app')
    .controller('ExcursionsListTabCtrl', ExcursionsListTabCtrl);

  function ExcursionsListTabCtrl(ActivityTracker, DbExcursions, EventLogFactory, excursionFilter, ExcursionListContextMenu, ExcursionsSettings, $log, rx, $scope, $state) {
    var TAG        = "[ExcursionListTabCtrl] ",
        tab        = this,
        RefreshObs = rx.Observable.merge(ExcursionsSettings.withArchive.changeObs, DbExcursions.archivedObs, DbExcursions.removedObs);

    // Track each time the user enters one of the lists tab.
    $scope.$on('$ionicView.enter', function(){
      ActivityTracker(EventLogFactory.navigation.excursionsList(excursionFilter.status || 'all'));
    });

    tab.loading = true;
    tab.showExcursionActions = ExcursionListContextMenu;

    RefreshObs.subscribe(function() {
      DbExcursions.getAll(excursionFilter).then(setData);
    });

    ////////////////////

    function setData(excursions) {
      $log.log(TAG + 'excursions with status ' + excursionFilter.status, excursions);
      tab.data = excursions;
      tab.loading = false;
    }
  }
})();
