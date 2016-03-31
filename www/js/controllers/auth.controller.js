/**
 * Created by Mathias on 29.03.2016.
 * This controller handled all action related to either QR Code connexion or Account Connexion.
 */

(function () {
  'use strict';

  angular
    .module('app')
    .controller('AuthCtrl', AuthCtrl);

  function AuthCtrl($scope, $state, $cordovaBarcodeScanner, $ionicPlatform, $ionicPopup) {
    $ionicPlatform.ready(function () {

      /**
       * This function is used to handle QR Code based connextion.
       * It opens a BarcodeScanner view that closes itself whenever a QR Code (or any other type of barcode) is scanned.
       * Then a popup is shown, containing the QR Code information and allowing the user to either accept or deny said info.
       */
      $scope.doQRCodeLogin = function () {
        $scope.infos = {};
        $cordovaBarcodeScanner
          .scan()
          .then(function (data) {
            console.log(angular.fromJson(data.text));
            $scope.infos = angular.fromJson(data.text);
            showQRValidation();
          }, function (error) {
            console.log(error);
          })
      };

      /**
       * This function is used to handle Account based connection.
       * A popup is shown allowing the user to enter his/her credentials.
       * He/She can then try to connect or dismiss the popup.
       */
      $scope.doAccountLogin = function () {
        $scope.account = {};
        $ionicPopup.show({
          title: "Connexion",
          templateUrl: 'templates/popups/account-popup.html',
          scope: $scope,
          buttons: [{
            text: "Annuler",
            type: "button-assertive"
          }, {
            text: "Connexion",
            type: "button-balanced",
            /**
             * When this button is tapped, performs the actual login process.
             * @param e
             * @returns {boolean}
             */
            onTap: function (e) {
              console.log($scope.account);
              $state.go('app.outings');
              return true;
            }
          }]
        });
      };
    });

    /**
     * This function actually shows the popup used to resume the information contained in a scanned QR Code.
     */
    function showQRValidation() {
      $ionicPopup.show({
        title: "Validation",
        templateUrl: 'templates/popups/qr-overview.html',
        scope: $scope,
        buttons: [
          {
            text: "Pas du tout",
            type: "button-assertive"
          },
          {
            text: "C'est ça !",
            type: "button-balanced",
            /**
             * When this button is tapped, creates the scanned outing in the device memory and redirect to it.
             * @param e
             * @returns {boolean}
             */
            onTap: function (e) {
              $state.go('app.outings');
              return true;
            }
          }
        ]
      });
    }
  }
})();
