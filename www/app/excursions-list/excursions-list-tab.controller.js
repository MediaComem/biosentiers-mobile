/**
 * Created by Mathias on 29.03.2016.
 */
(function() {
  'use strict';

  angular
    .module('app')
    .controller('ExcursionsListTabCtrl', ExcursionsListTabCtrl);

  function ExcursionsListTabCtrl(DbExcursions, excursionFilter, ExcursionListContextMenu, ExcursionsSettings, $log) {
    var tab = this;

    tab.loading = true;
    tab.showExcursionActions = ExcursionListContextMenu.showMenu;

    ExcursionsSettings.withArchive.changeObs.subscribe(function() {
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
