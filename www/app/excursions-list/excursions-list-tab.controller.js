/**
 * Created by Mathias on 29.03.2016.
 */
(function() {
  'use strict';

  angular
    .module('app')
    .controller('ExcursionsListTabCtrl', ExcursionsListTabCtrl);

  function ExcursionsListTabCtrl(Excursions, excursionsData, $ionicActionSheet, $ionicPopover, $ionicSideMenuDelegate, $ionicTabsDelegate, $log) {
    var tab = this;
    // tab.loading = true;
    $log.log('excursionsData', excursionsData);
    tab.data = excursionsData;

    tab.nextTab = nextTab;
    tab.previousTab = previousTab;
    tab.openPopOver = openPopOver;

    $ionicPopover
      .fromTemplateUrl('app/excursions-list-menu/excursions-list-menu.html')
      .then(function(popover) {
        $log.log(popover);
        tab.popover = popover;
      });

    tab.showActions = function(excursion) {
      var buttons = [];
      var fns = [
        excursion.is_new ? Excursions.setNotNew : Excursions.setNew
      ];
      var newButton = { text: excursion.is_new ? 'Marquer comme vu' : 'Marquer comme nouveau'};
      if (excursion.status === 'pending') buttons.push(newButton);

      // Show the action sheet
      $ionicActionSheet.show({
        buttons                 : buttons,
        titleText               : excursion.name,
        destructiveText         : '<i class="icon ion-archive"></i> Archiver',
        cancelText              : 'Annuler',
        cancel                  : function() {
          console.log('Canceled the Action Sheet');
        },
        buttonClicked           : function(index) {
          console.log('button index', index);
          fns[index](excursion);
          return true;
        },
        destructiveButtonClicked: function() {
          console.log('destructive button clicked');
          return true;
        }
      });
    };

    ////////////////////

    function openPopOver() {
      $log.log('Opening Popover', tab.popover);
      tab.popover.show();
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
