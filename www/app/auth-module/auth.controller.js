/**
 * Created by Mathias on 29.03.2016.
 * This controller handled all action related to either QR Code connexion or Account Connexion.
 */

(function () {
  'use strict';

  angular
    .module('AuthModule')
    .controller('AuthCtrl', AuthCtrl);

  /*
   Controller function
   */
  function AuthCtrl($scope, $state, $cordovaBarcodeScanner, $ionicPlatform, $ionicPopup, AuthService) {
    var auth = this;

    $ionicPlatform.ready(function () {
      auth.doQRCodeLogin = doQRCodeLogin;
      auth.showAccountLoginForm = showAccountLoginForm;
    });

    ////////////////////

    /**
     * This function is used to handle QR Code based connection.
     * It opens a BarcodeScanner view that closes itself whenever a QR Code (or any other type of barcode) is scanned.
     * Then a popup is shown, containing the QR Code information and allowing the user to either accept or deny said info.
     */
    function doQRCodeLogin() {
      $cordovaBarcodeScanner
        .scan()
        .then(function (data) {
          auth.infos = angular.fromJson(data.text);
          showQRValidation();
        }, function (error) {
          console.log(error);
        })
    }

    /**
     * This function actually shows the popup used to resume the information contained in a scanned QR Code.
     */
    function showQRValidation() {
      $ionicPopup.show({
        title: "Validation",
        templateUrl: 'app/auth-module/qr-overview.html',
        scope: $scope,
        buttons: [{
          text: "Pas du tout",
          type: "button-assertive"
        }, {
          text: "C'est ça !",
          type: "button-balanced",
          /**
           * When this button is tapped, creates the scanned outing in the device memory and redirect to it.
           * @param e
           * @returns {boolean}
           */
          onTap: function (e) {
            $state.go('app.outings');
          }
        }]
      });
    }

    /**
     * Shows the account login form with an $ionicPopup to the user.
     * When the form is filled and submitted, check the given credentials and log the user.
     */
    function showAccountLoginForm() {
      auth.account = {};
      $ionicPopup.show({
        title: "Connexion",
        templateUrl: 'app/auth-module/account-popup.html',
        scope: $scope,
        buttons: [{
          text: "Annuler",
          type: "button-assertive",
          onTap: function () {
            auth.error = null;
          }
        }, {
          text: "Connexion",
          type: "button-balanced",
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
                .then(function () {
                  console.log('connection réussie !');
                  $state.go('app.outings');
                }, function () {
                  console.log('connection refusée');
                });
            }
          }
        }]
      });
    }
  }
})();
