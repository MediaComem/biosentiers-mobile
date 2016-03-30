/**
 * Created by Mathias on 29.03.2016.
 */
app.controller('AuthCtrl', function ($scope, $state, AR, $cordovaBarcodeScanner, $ionicPlatform, $ionicPopup) {
  $ionicPlatform.ready(function () {

    $scope.doAccountLogin = function () {
      $state.go('app.outings');
    };

    $scope.doQRCodeLogin = function () {
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
          onTap: function (e) {
            console.log($scope.account);
            $state.go('app.outings');
            return true;
          }
        }]
      });
    };
  });

  var showQRValidation = function () {
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
          onTap: function (e) {
            $state.go('app.outings');
            return true;
          }
        }
      ]
    });
  };
});
