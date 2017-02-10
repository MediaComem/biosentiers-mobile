/**
 * Created by Mathias Oberson on 10.02.2017.
 */
(function() {
  'use strict';
  angular.module('app')
    .config(configApp);

  function configApp($compileProvider, MapIconsProvider) {
    //Allow to use cdvfile protocol with images
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile):|data:image\//);
    MapIconsProvider.setIconBaseUrl('img/icons');
  }
})();