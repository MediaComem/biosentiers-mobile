(function() {
  'use strict';

  angular
    .module('app')
    .run(run);

  function run(EventLogFactory, $ionicPlatform, $log, InstallationSecret, InstallationId, ActivityTracker, $rootScope, $cordovaNetwork, LogUploader, $timeout) {
    var TAG          = '[App:Run] ',
        pauseTimeout = null;

    $ionicPlatform.ready(function() {
      // TODO: Remove in production
      // LogUploader.stop();

      ionicInitialize();
      if ($ionicPlatform.is('android')) grantAndroidPermissions();

      // This will create the Installation Id the first time the app is opened
      InstallationId.getValue();

      // This will check if the app has already been registered on the backend, by trying to fetch the secret value
      // If the file containing the secret value does not exists, that means the app has never been registered and an attempt to do so will be executed
      InstallationSecret.getValue();

      // Log the fact that the app is being started
      ActivityTracker(EventLogFactory.app.started());

      // Log an event about the current device's network connection state.
      $cordovaNetwork.isOnline() ? ActivityTracker(EventLogFactory.network.online($cordovaNetwork.getNetwork())) : ActivityTracker(EventLogFactory.network.offline());

      // Registering activity events that will trigger an event log.
      $ionicPlatform.on('pause', appOnPause);
      $ionicPlatform.on('resume', appOnResume);

      $rootScope.$on('$cordovaNetwork:online', function() {
        ActivityTracker(EventLogFactory.network.online($cordovaNetwork.getNetwork()));
      });
      $rootScope.$on('$cordovaNetwork:offline', function() {
        ActivityTracker(EventLogFactory.network.offline());
      });
    });

    ////////////////////

    function appOnPause() {
      ActivityTracker(EventLogFactory.app.paused());
      // Stops the ActivityTracker after 5 minutes of app being in background.
      pauseTimeout = $timeout(function() {
        ActivityTracker.stop();
      }, 3000); //1000 * 60 * 5);
    }

    function appOnResume() {
      // If a 'resume' happens less than 5 minutes after a 'pause', cancel stopping the ActivityTracker
      pauseTimeout && $timeout.cancel(pauseTimeout) && (pauseTimeout = null);
      ActivityTracker.start();
      ActivityTracker(EventLogFactory.app.resumed());
    }

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
              $log.log(TAG + "Permission granted to use " + permission);
              break;
            case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
              $log.log(TAG + "Permission to use " + permission + " has not been requested yet");
              break;
            case cordova.plugins.diagnostic.permissionStatus.DENIED:
              $log.log(TAG + "Permission denied to use " + permission + " - ask again?");
              break;
            case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
              $log.log(TAG + "Permission permanently denied to use " + permission + " - guess we won't be using it then!");
              break;
          }
        }
      }, function(error) {
        $log.error(TAG + "The following error occurred: " + error);
      }, [
        cordova.plugins.diagnostic.runtimePermission.ACCESS_FINE_LOCATION,
        cordova.plugins.diagnostic.runtimePermission.ACCESS_COARSE_LOCATION,
        cordova.plugins.diagnostic.runtimePermission.CAMERA
      ]);
    }
  }
})();
