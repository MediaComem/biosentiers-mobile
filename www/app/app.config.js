(function () {
  'use strict';

  angular
    .module('app')
    .run(run)
    //Allow to use cdvfile protocol with images
    .config( ['$compileProvider',
      function( $compileProvider ){
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile):|data:image\//);
      }]);

  function run($ionicPlatform) {
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

      // ANDROID 6 - Grant Location permission at runtime
      cordova.plugins.diagnostic.requestRuntimePermissions(function(statuses){
        for (var permission in statuses){
            switch(statuses[permission]){
                case cordova.plugins.diagnostic.permissionStatus.GRANTED:
                    console.log("Permission granted to use "+permission);
                    break;
                case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
                    console.log("Permission to use "+permission+" has not been requested yet");
                    break;
                case cordova.plugins.diagnostic.permissionStatus.DENIED:
                    console.log("Permission denied to use "+permission+" - ask again?");
                    break;
                case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
                    console.log("Permission permanently denied to use "+permission+" - guess we won't be using it then!");
                    break;
            }
        }
      }, function(error){
          console.error("The following error occurred: "+error);
      },[
          cordova.plugins.diagnostic.runtimePermission.ACCESS_FINE_LOCATION,
          cordova.plugins.diagnostic.runtimePermission.ACCESS_COARSE_LOCATION
      ]);
    });
  }
})();
