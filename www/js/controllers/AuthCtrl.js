/**
 * Created by Mathias on 29.03.2016.
 */
app.controller('AuthCtrl', function ($scope, $state, AR, $cordovaBarcodeScanner, $ionicPlatform) {
  $ionicPlatform.ready(function () {
    console.log('plateforme prête');
    $scope.doAccountLogin = function () {
      console.log('Account Login');
      $state.go('app.playlists');
    };
    $scope.doQRCodeLogin = function () {
      console.log('QR Code Login');
      $cordovaBarcodeScanner
        .scan()
        .then(function (data) {
          console.log(data);
          $state.go('app.playlists');
        }, function (error) {
          console.log(error);
        })
    };
  })
});
