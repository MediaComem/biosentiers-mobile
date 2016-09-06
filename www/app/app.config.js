(function () {
  'use strict';

  angular
    .module('app')
    .config(function($compileProvider) {
      $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile):|data:image\//);
    })
    .run(run);

  function run($cordovaFile, $cordovaFileTransfer, $http, $ionicPlatform) {
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

      var imageUrl = 'https://static.pexels.com/photos/27714/pexels-photo-27714.jpg',
          imageDirname = cordova.file.externalDataDirectory,
          imageBasename = 'test2.png';

      console.log('@@@@@@@@ downloading file ' + imageUrl);

      $http.get(imageUrl, { responseType: 'arraybuffer' }).then(function(res) {
        console.log('@@@@@@@@ file downloaded (' + res.data.length + ' bytes), saving to ' + imageDirname + imageBasename);
        $cordovaFile.writeFile(imageDirname, imageBasename, res.data, true).then(function() {
          console.log('@@@@@@@@ file written');
        }, function(err) {
          console.warn('@@@@@@@@ file write error');
          console.error(err);
        });
      }, function(err) {
        console.warn('@@@@@@@@ file download error');
        console.error(err);
      });

      //var uri = 'img/icons/Flore.png';
      /*var uri = encodeURI('https://static.pexels.com/photos/27714/pexels-photo-27714.jpg');
      var target = cordova.file.externalDataDirectory + 'test.png';

      $cordovaFileTransfer.download(uri, target, {}, true).then(function(entry) {
        console.log('file downloaded to ' + entry.toURL());
      }, function(err) {
        console.warn(err);
      });*/
    });
  }
})();
