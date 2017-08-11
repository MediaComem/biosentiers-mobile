/**
 * Created by Mathias Oberson on 20.07.2017.
 */
(function() {
  'use strict';
  angular
    .module('excursion-context-menus')
    .factory('ExcursionListActionSheet', ExcursionListActionSheetFn);

  function ExcursionListActionSheetFn(ActivityTracker, EventLogFactory, DbExcursions, $ionicActionSheet, $log, $state) {

    var TAG = "[ExcursionListActionSheet] ",
        excursion;

    return showMenu;

    ////////////////////

    /**
     * Create and show the Action Sheet menu for the given excursion, based on its status.
     * All the excursions have an action to open their respective sheet.
     * Only active actions can be archived and set as new or not new.
     * Only archived actions can be removed or restore.
     * @param excursionArg An object representing the excursion for which the context menu should be shown
     */
    function showMenu(excursionArg) {
      if (!!excursionArg) {
        excursion = excursionArg;
        ActivityTracker(EventLogFactory.action.excursionsList.excursionActionSheet(excursion));

        var options = {
          actions      : [],
          buttons      : [],
          titleText    : excursion.name,
          cancelText   : 'Annuler',
          cancel       : cancelFn,
          buttonClicked: buttonClickedFn
        };

        // Whatever's the state of the excursion, its sheep can be consulted
        options.buttons.push({text: '<i class="icon ion-android-arrow-forward"></i>Accéder à la fiche'});
        options.actions.push(function(excursion) {
          $state.go('app.excursion', {qrId: excursion.qrId});
        });

        if (excursion.status === 'finished') {
          options.buttons.push({text: '<i class="icon ion-android-refresh"></i> Réinitialiser'});
          options.actions.push(DbExcursions.reinitializeOne);
        }

        // Debug : affiche les infos de la sortie dans la $log
        options.buttons.push({text: '<i class="icon ion-code-working"></i> [DEBUG] Terminer la sortie'});
        options.actions.push(function(excursion) {
          DbExcursions.setOngoingStatus(excursion).then(DbExcursions.setFinishedStatus);
        });
        // options.buttons.push({text: '<i class="icon ion-code-working"></i> [DEBUG] Logger la sortie'});
        // options.actions.push(function(excursion) {
        //   $log.log(TAG + "current excursion", excursion);
        // });

        // If the excursion is archived, it can only be restored
        if (isArchived()) {
          archivedOptions(options);
        } else {
          activeOptions(options);
        }

        $log.log(TAG + "context menu options", options);

        // Show the action sheet
        $ionicActionSheet.show(options);
      }

      ////////////////////

      function cancelFn() {
        $log.log(TAG + 'Canceled the Action Sheet');
      }

      function buttonClickedFn(index) {
        $log.log(TAG + 'button index', index);
        options.actions[index](excursion);
        return true;
      }
    }

    /**
     * Test wether the current excursion is archived or active
     * @return {boolean}
     */
    function isArchived() {
      return excursion.archivedAt !== null;
    }

    /**
     * Updates the given options object so that its contains actions for an archived excursion.
     * That is : restore the excursion.
     * @param {{destructiveText, destructiveButtonClicked, buttons, actions}} opt An object representing the options of the ActionSheet
     */
    function archivedOptions(opt) {
      opt.destructiveText = '<i class="icon ion-android-delete"></i> Supprimer';
      opt.destructiveButtonClicked = removeAction;

      opt.buttons.push({text: '<i class="icon ion-reply"></i> Restaurer'});
      opt.actions.push(function() {
        DbExcursions.restoreOne(excursion);
        return true;
      })
    }

    /**
     * Updates the given options object so that its contains actions for an active excursion.
     * That is : acrchive the excursion, or toggle it's new state.
     * @param {{destructiveText, destructiveButtonClicked, buttons, actions}} opt An object representing the options of the ActionSheet
     */
    function activeOptions(opt) {
      opt.destructiveText = '<i class="icon ion-android-archive"></i> Archiver';
      opt.destructiveButtonClicked = function() {
        $log.log(TAG + 'destructive button clicked');
        DbExcursions.archiveOne(excursion);
        return true;
      };

      if (excursion.status === 'pending') {
        var setNotNewText = '<i class="icon ion-android-checkmark-circle"></i> Marquer comme vue';
        var setNewText = '<i class="icon ion-android-radio-button-off"></i> Marquer comme nouvelle';
        opt.buttons.push({text: excursion.isNew ? setNotNewText : setNewText});
        if (excursion.isNew) {
          opt.actions.push(function(excursion) {
            ActivityTracker(EventLogFactory.action.excursion.unflagAsNew(excursion));
            DbExcursions.setNotNew(excursion);
          });
        } else {
          opt.actions.push(DbExcursions.setNew);
        }
      }
    }

    /**
     * Pops an alert to the user to tell him/her that he/she is about to remove an excursion from the database.
     * If the user refuses, nothing happen.
     * If it accepts, the excursion is effectively removed from the database.
     * TODO: remove all the seen pois of this excursion from the database
     * @return {boolean}
     */
    function removeAction() {
      DbExcursions.removeOne(excursion);
      return true;
    }
  }
})();
