/**
 * Created by Mathias Oberson on 18.05.2017.
 */
(function() {
  'use strict';

  angular
    .module('app')
    .controller('ExcursionsListCtrl', ExcursionsListCtrlFn);

  function ExcursionsListCtrlFn(DbExcursions, ExcursionsSettings, $log, $ionicPopover, $ionicSideMenuDelegate, $ionicTabsDelegate, rx) {
    var TAG             = "[ExcursionListCtrl] ",
        list            = this,
        RefreshStatsObs = rx.Observable.merge(ExcursionsSettings.withArchive.changeObs, DbExcursions.archivedObs, DbExcursions.removedObs);

    list.nextTab = nextTab;
    list.previousTab = previousTab;
    list.openExcursionsMenu = openExcursionsMenu;

    RefreshStatsObs.subscribe(function() {
      closeExcursionsMenu();
      DbExcursions.getStats().then(setStats);
    });

    $ionicPopover
      .fromTemplateUrl('app/excursions-list-menu/excursions-list-menu.html')
      .then(function(popover) {
        list.excursionMenu = popover;
      });

    ////////////////////

    /**
     * Opens the contextual menu for the excursion list page
     */
    function openExcursionsMenu($event) {
      list.excursionMenu.show($event);
    }

    /**
     * If it exists, close the contextual menu for the excursion list page
     */
    function closeExcursionsMenu() {
      !!list.excursionMenu && list.excursionMenu.hide();
    }

    /**
     * Sets the controller stats property with the received stats object
     * @param stats
     */
    function setStats(stats) {
      $log.log(TAG + 'stats', stats);
      list.stats = stats;
    }

    /**
     * Returns true if the Side Menu is not being open, and false otherwise.
     * @return {boolean}
     */
    function menuIsNotOpening() {
      return $ionicSideMenuDelegate.getOpenRatio() === 0;
    }

    /**
     * Manually navigate to the next tab in the page.
     */
    function nextTab() {
      if (menuIsNotOpening()) {
        var selected = $ionicTabsDelegate.selectedIndex();
        if (selected !== -1 && selected !== 0) {
          $ionicTabsDelegate.select(selected - 1);
        }
      }
    }

    /**
     * Manually navigate to the previous tab in the page.
     */
    function previousTab() {
      if (menuIsNotOpening()) {
        var selected = $ionicTabsDelegate.selectedIndex();
        if (selected !== -1) {
          $ionicTabsDelegate.select(selected + 1);
        }
      }
    }

  }
})();
