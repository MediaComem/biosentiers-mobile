/**
 * Created by Mathias on 29.03.2016.
 */
(function() {
  'use strict';

  angular
    .module('app')
    .controller('ExcursionsListTabCtrl', ExcursionsListTabCtrl);

  function ExcursionsListTabCtrl(Excursions, excursionsData, ExcursionListContextMenu, ExcursionsSettings, $ionicActionSheet, $ionicPopover, $ionicSideMenuDelegate, $ionicTabsDelegate, $log, $state, $timeout) {
    var tab = this;
    // tab.loading = true;
    $log.log('excursionsData', excursionsData);
    tab.data = excursionsData;

    ExcursionsSettings.withArchiveChangeObs.subscribe(function(value) {
      $timeout(function() { tab.withArchive = value; });
      !!tab.excursionMenu && closeExcursionsMenu();
    });

    tab.nextTab = nextTab;
    tab.previousTab = previousTab;
    tab.openExcursionsMenu = openExcursionsMenu;

    $ionicPopover
      .fromTemplateUrl('app/excursions-list-menu/excursions-list-menu.html')
      .then(function(popover) {
        tab.excursionMenu = popover;
      });

    tab.showExcursionActions = ExcursionListContextMenu.trigger;

    ////////////////////

    function openExcursionsMenu() {
      tab.excursionMenu.show();
    }

    function closeExcursionsMenu() {
      tab.excursionMenu.hide();
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

    function showExcursionActions(excursion) {
      var buttons = [];
      var fns = [];

      var options = {
        buttons      : buttons,
        titleText    : excursion.name,
        cancelText   : 'Annuler',
        cancel       : function() {
          console.log('Canceled the Action Sheet');
        },
        buttonClicked: function(index) {
          console.log('button index', index);
          fns[index](excursion);
          return true;
        }
      };

      if (excursion.archived_at === null) {
        options.destructiveText = '<i class="icon ion-android-archive"></i> Archiver';
        options.destructiveButtonClicked = function() {
          console.log('destructive button clicked');
          Excursions.archiveOne(excursion);
          return true;
        };
      } else {
        options.destructiveText = '<i class="icon ion-android-add-circle"></i> Restaurer';
        options.destructiveButtonClicked = function() {
          console.log('destructive button clicked');
          Excursions.restoreOne(excursion);
          return true;
        };
      }

      buttons.push({text: '<i class="icon ion-forward"></i>Accéder à la fiche'});
      fns.push(function(excursion) {
        $state.go('app.excursion', {excursionId: excursion.id});
      });

      if (excursion.status === 'pending') {
        var setNotNewText = '<i class="icon ion-android-checkmark-circle"></i> Marquer comme vu';
        var setNewText = '<i class="icon ion-android-radio-button-off"></i> Marquer comme nouveau';
        buttons.push({text: excursion.is_new ? setNotNewText : setNewText});
        fns.push(excursion.is_new ? Excursions.setNotNew : Excursions.setNew);
      }

      buttons.push({text: '<i class="icon ion-code-working"></i> Debug sortie'});
      fns.push(function(excursion) {
        console.log(excursion);
      });

      console.log(buttons, fns);

      // Show the action sheet
      $ionicActionSheet.show(options);
    }
  }
})
();
