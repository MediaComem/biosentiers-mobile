(function() {
  'use strict';

  angular
    .module('app')
    .run(run);

  function run(AuthToken, $ionicPlatform, $log, InstallationSecret, InstallationId) {

    $ionicPlatform.ready(function() {
      ionicInitialize();
      if ($ionicPlatform.is('android')) grantAndroidPermissions();

      // This will create the Installation Id the first time the app is opened
      InstallationId.getValue();

      // This will check if the app has already been registered on the backend, by looking up for the file containing the secret
      // If the file does not exist, it will try to register the app on start-up.
      InstallationSecret.exists()
        .catch(function(error) {
          if (error.code === 1) {
            InstallationSecret.registerApp();
          } else {
            $log.error(error);
          }
        });

      AuthToken.get()
        .then(function(result) {
          console.log('AuthToken:get result', result);
        })
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
