/**
 * Created by Mathias Oberson on 20.07.2017.
 */
(function() {
  'use strict';
  angular
    .module('excursion-context-menus')
    .factory('ExcursionListContextMenu', ExcursionListContextMenuFn);

  function ExcursionListContextMenuFn(DbExcursions, $ionicActionSheet, $state) {

    var service = {
          showMenu: showMenu
        },
        excursion;

    return service;

    ////////////////////

    function showMenu(excursionArg) {
      if (!!excursionArg) {
        excursion = excursionArg;

        var options = {
          actions      : [],
          buttons      : [],
          titleText    : excursion.name,
          cancelText   : 'Annuler',
          cancel       : cancelFn,
          buttonClicked: buttonClickedFn
        };

        // Whatever's the state of the excursion, its sheep can be consulted
        options.buttons.push({text: '<i class="icon ion-forward"></i>Accéder à la fiche'});
        options.actions.push(function(excursion) {
          $state.go('app.excursion', {excursionId: excursion.id});
        });

        // Debug : affiche les infos de la sortie dans la console
        options.buttons.push({text: '<i class="icon ion-code-working"></i> Debug sortie'});
        options.actions.push(function(excursion) {
          console.log(excursion);
        });

        // If the excursion is archived, it can only be restored
        if (isArchived()) {
          archivedOptions(options);
        } else {
          activeOptions(options);
        }

        console.log(options);

        // Show the action sheet
        $ionicActionSheet.show(options);
      }

      ////////////////////

      function cancelFn() {
        console.log('Canceled the Action Sheet');
      }

      function buttonClickedFn(index) {
        console.log('button index', index);
        options.actions[index](excursion);
        return true;
      }
    }

    /**
     * Test wether the current excursion is archived or active
     * @return {boolean}
     */
    function isArchived() {
      return excursion.archived_at !== null;
    }

    /**
     * Updates the given options object so that its contains actions for an archived excursion.
     * That is : restore the excursion.
     * @param {{destructiveText, destructiveButtonClicked}} opt An object representing the options of the ActionSheet
     */
    function archivedOptions(opt) {
      opt.destructiveText = '<i class="icon ion-android-add-circle"></i> Restaurer';
      opt.destructiveButtonClicked = function() {
        console.log('destructive button clicked');
        DbExcursions.restoreOne(excursion);
        return true;
      };
    }

    /**
     * Updates the given options object so that its contains actions for an active excursion.
     * That is : acrchive the excursion, or toggle it's new state.
     * @param {{destructiveText, destructiveButtonClicked, buttons, actions}} opt An object representing the options of the ActionSheet
     */
    function activeOptions(opt) {
      opt.destructiveText = '<i class="icon ion-android-archive"></i> Archiver';
      opt.destructiveButtonClicked = function() {
        console.log('destructive button clicked');
        DbExcursions.archiveOne(excursion);
        return true;
      };

      if (excursion.status === 'pending') {
        var setNotNewText = '<i class="icon ion-android-checkmark-circle"></i> Marquer comme vu';
        var setNewText = '<i class="icon ion-android-radio-button-off"></i> Marquer comme nouveau';
        opt.buttons.push({text: excursion.is_new ? setNotNewText : setNewText});
        opt.actions.push(excursion.is_new ? DbExcursions.setNotNew : DbExcursions.setNew);
      }
    }
  }
})();
