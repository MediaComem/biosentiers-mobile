(function () {
  'use strict';

  angular
    .module('app')
    .run(run);

  function run($cordovaFile, $http, $ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

      $cordovaFile.getFreeDiskSpace().then(function(size) {
        console.log('@@@@@@@@@@ size = ' + size);
      }, function(error) {
        console.warn(error);
      });

      console.log(cordova.file.dataDirectory);
      $http.get('img/icons/Flore.png').then(function(res) {
        $cordovaFile.writeFile(cordova.file.dataDirectory, "test.png", res.data, true).then(function(success) {
          console.log('@@@@@@@@@@ successfully wrote file');
          console.debug(success);
        }, function(err) {
          console.warn('Could not write file: ' + err);
        });
      });
    });
  }
})();
