/**
 * Created by Mathias on 29.03.2016.
 */
(function() {
  'use strict';

  angular
    .module('app')
    .controller('ExcursionsListTabCtrl', ExcursionsListTabCtrl);

  function ExcursionsListTabCtrl(DbExcursions, excursionFilter, ExcursionListContextMenu, ExcursionsSettings, $log, rx) {
    var tab = this;
    var RefreshObs = rx.Observable.merge(ExcursionsSettings.withArchive.changeObs, DbExcursions.archivedObs, DbExcursions.removedObs);

    tab.loading = true;
    tab.showExcursionActions = ExcursionListContextMenu.showMenu;

    RefreshObs.subscribe(function() {
      DbExcursions.getAll(excursionFilter).then(setData);
    });

    ////////////////////

    function setData(excursions) {
      $log.log('ExcursionListTabCtrl:excursions with status ' + excursionFilter.status, excursions);
      tab.data = excursions;
      tab.loading = false;
    }
  }
})();
