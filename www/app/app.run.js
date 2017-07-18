(function() {
  'use strict';

  angular
    .module('app')
    .run(run);

  function run($ionicPlatform, $log, $rootScope, $state, Excursions) {
    // This event is used to prevent the excursion list of being showned when no excursion exists.
    // If the user tries to go to the excursion list and he has no excursion yet, he's redirected to the login page, in order to scan a QR Code.
    $rootScope.$on('$stateChangeStart', function(e, toState) {
      // This pattern should match any state name that starts with 'app.excursion-lists'
      var listPattern = new RegExp("^app[.]excursions-list([.].*)?$");
      if (listPattern.test(toState.name)) {
        Excursions.countAll().then(function(res) {
          console.log('Excursion count', res);
          // Go to the login if there's no Excursion in the DB
          res === 0 && $state.go('login');
        })
      }
    });

    $ionicPlatform.ready(function() {
      ionicInitialize();
      grantAndroidPermissions();
    });
    ////////////////////

    /**
     * Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
     * for form inputs)
     */
    function ionicInitialize() {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    }

    /**
     * ANDROID 6 - Ask for permissions at runtime.
     * The app asks for :
     * * Fine Location
     * * Coarse Location
     * * Camera
     */
    function grantAndroidPermissions() {
      cordova.plugins.diagnostic.requestRuntimePermissions(function(statuses) {
        for (var permission in statuses) {
          switch (statuses[permission]) {
            case cordova.plugins.diagnostic.permissionStatus.GRANTED:
              $log.log("Permission granted to use " + permission);
              break;
            case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
              $log.log("Permission to use " + permission + " has not been requested yet");
              break;
            case cordova.plugins.diagnostic.permissionStatus.DENIED:
              $log.log("Permission denied to use " + permission + " - ask again?");
              break;
            case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
              $log.log("Permission permanently denied to use " + permission + " - guess we won't be using it then!");
              break;
          }
        }
      }, function(error) {
        $log.error("The following error occurred: " + error);
      }, [
        cordova.plugins.diagnostic.runtimePermission.ACCESS_FINE_LOCATION,
        cordova.plugins.diagnostic.runtimePermission.ACCESS_COARSE_LOCATION,
        cordova.plugins.diagnostic.runtimePermission.CAMERA
      ]);
    }
  }
})();
