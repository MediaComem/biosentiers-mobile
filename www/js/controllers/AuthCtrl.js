/**
 * Created by Mathias on 29.03.2016.
 */
app.controller('AuthCtrl', function ($scope, $state, AR, $cordovaBarcodeScanner, $ionicPlatform, $ionicModal) {
  $scope.infos = {};

  $scope.closeModal = function () {
    $scope.modal.hide();
  };

  $scope.validateQR = function () {
    console.log('validateQR');
    $state.go('app.outings');
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function () {
    $scope.modal.remove();
  });

  $ionicPlatform.ready(function () {

    $scope.doAccountLogin = function () {
      $state.go('app.outings');
    };

    $scope.doQRCodeLogin = function () {

      $ionicModal.fromTemplateUrl('templates/modals/qr-overview.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.modal = modal;
      });

      $cordovaBarcodeScanner
        .scan()
        .then(function (data) {
          console.log(angular.fromJson(data.text));
          $scope.infos = angular.fromJson(data.text);
          $scope.modal.show();
        }, function (error) {
          console.log(error);
        })
    };
  })
});
