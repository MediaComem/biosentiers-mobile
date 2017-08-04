/**
 * Created by Mathias on 29.03.2016.
 * This controller handled all action related to either QR Code connexion or Account Connexion.
 */

(function() {
  'use strict';

  angular
    .module('auth-module')
    .controller('AuthCtrl', AuthCtrl);

  /*
   Controller function
   */
  function AuthCtrl($scope, $state, $cordovaBarcodeScanner, ExcursionClass, $ionicPlatform, $ionicPopup, AuthService, DbExcursions, $q, QR, $log) {
    var auth = this;

    $ionicPlatform.ready(function() {
      auth.doQRCodeLogin = doQRCodeLogin;
      auth.showAccountLoginForm = showAccountLoginForm;
    });

    ////////////////////

    /**
     * This function is used to trigger QR Code based connection.
     * It opens a BarcodeScanner view that closes itself whenever a QR Code (or any other type of barcode) is scanned.
     * Then a popup is shown, containing the QR Code information and allowing the user to either accept or deny said info.
     */
    function doQRCodeLogin() {
      var config = {
        prompt               : "Placez votre QR Code dans le viseur pour scanner la sortie.",
        resultDisplayDuration: 0,
        formats              : "QR_CODE"
      };
      $cordovaBarcodeScanner
        .scan(config)
        .then(handleData)
        .catch(handleError);
    }

    /**
     * Handles the data received after a QR Code scan has been done.
     * If no other existing excursions has the same server id as the scanned excursion, the new excursion can be created.
     * If at least on excurison exists witht the same server id but a different participant, asks the user if he really wants to create this excursion.
     * Finally, if one existing excursion with the same id has the same participant, the scanned excursion is rejected.
     * @param rawData
     * @return {boolean}
     */
    function handleData(rawData) {
      if (!rawData.cancelled && rawData.format === 'QR_CODE') {
        auth.excursion = ExcursionClass.fromQrCodeData(QR.getExcursionData(rawData));
        $log.info('AuthCtrl:handleData:decoded data', auth.excursion);
        // We fetch all excursions with their server id (and not their qr id), because we want to see if the scanned excursion already exist in the database
        DbExcursions.getAll({serverId: auth.excursion.serverId})
          .then(function(excursions) {
            $log.debug(excursions);
            if (excursions.length === 0) {
              $log.log('AuthCtrl:handleData:no excursion with id ' + auth.excursion.serverId);
              showExcursionValidation();
            } else if (hasSameParticipant(excursions, auth.excursion.participant.id)) {
              $log.log('AuthCtrl:handleData:existing excursion with same participant');
              showSameParticipantError();
            } else {
              $log.log('AuthCtrl:handleData:existing excursion with different participant');
              showDiffParticipanValidation(excursions);
            }
          });
      } else {
        return false;
      }
    }

    /**
     * Checks if the given participantId is already a participant in one of the given excirsions.
     * @param excursions
     * @param participantId
     */
    function hasSameParticipant(excursions, participantId) {
      return _.find(excursions, function(excursion) {
        return excursion.participant.id === participantId;
      })
    }

    /**
     * Handler for promise chain error.
     * Will log the error and return a rejected promise with the received error.
     * @param error
     */
    function handleError(error) {
      $log.error(error);
      return $q.reject(error);
    }

    /**
     * This function actually shows the popup used to resume the information contained in a scanned QR Code.
     */
    function showExcursionValidation() {
      $ionicPopup.show({
        title      : "Nouvelle sortie",
        templateUrl: 'app/auth-module/new-excursion.html',
        scope      : $scope,
        buttons    : [{
          text: "Pas du tout",
          type: "button-assertive button-outline"
        }, {
          text : "C'est ça !",
          type : "button-balanced",
          /**
           * When this button is tapped, creates the scanned excursion in the device memory and redirect to it.
           * @returns {boolean}
           */
          onTap: createScannedExcursion
        }]
      });
    }

    /**
     * Show the popup that should be visible when the user scans the same QR Code of an already existing excursion.
     */
    function showSameParticipantError() {
      $ionicPopup.alert({
        title   : "Erreur",
        subTitle: "Ce QR Code a déjà été scanné sur cet appareil",
        template: "<p>La sortie <strong>" + auth.excursion.name + "</strong> avec le participant <strong>" + auth.excursion.participant.name + "</strong> existe déjà sur cet appareil.</p><p><strong>Veuillez essayer un autre QR Code.</strong></p>",
        okText  : "Bien compris",
        okType  : "button-assertive button-outline"
      });
    }

    /**
     * Show the popup that should be visible when the user scanned a QR Code for an excursion that already exists in the database, but with another participant.
     * @param excursions
     */
    function showDiffParticipanValidation(excursions) {
      auth.existingExcursions = excursions;
      $ionicPopup.show({
        title   : "Sortie existante",
        subTitle: auth.excursion.name,
        templateUrl: "app/auth-module/diff-participant-validation.html",
        scope   : $scope,
        buttons : [{
          text: "Hum... non",
          type: "button-assertive button-outline"
        }, {
          text : "Tout à fait.",
          type : "button-balanced",
          /**
           * When this button is tapped, creates the scanned excursion in the device memory and redirect to it.
           * @returns {boolean}
           */
          onTap: createScannedExcursion
        }]
      });
    }

    /**
     * Actually creates the new excursion in the databse.
     */
    function createScannedExcursion() {
      DbExcursions.createOne(auth.excursion)
        .then(function() {
          $state.go('app.excursions-list');
        })
        .catch(handleError);
    }

    /**
     * Shows the account login form with an $ionicPopup to the user.
     * When the form is filled and submitted, check the given credentials and log the user.
     */
    function showAccountLoginForm() {
      auth.account = {};
      $ionicPopup.show({
        title      : "Connexion",
        templateUrl: 'app/auth-module/account-popup.html',
        scope      : $scope,
        buttons    : [{
          text : "Annuler",
          type : "button-assertive button-outline",
          onTap: function() {
            auth.error = null;
          }
        }, {
          text : "Connexion",
          type : "button-balanced",
          /**
           * When this button is tapped, performs the actual login process.
           * @param e
           * @returns {boolean}
           */
          onTap: function connectUser(e) {
            auth.error = null;
            if (!auth.account.username || !auth.account.password) {
              auth.error = 'Champs non remplis';
              e.preventDefault();
            } else {
              AuthService.connectUser(auth.account)
                .then(function() {
                  $log.log('connection réussie !');
                  $state.go('app.excursions-list');
                }, function() {
                  $log.log('connection refusée');
                });
            }
          }
        }]
      });
    }
  }
})();
