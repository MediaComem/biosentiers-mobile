/**
 * Created by Mathias on 02.05.2016.
 */
(function () {
  'use strict';

  angular
    .module('ar')
    .config(config)
    .run(run);

  function config(MapIconsProvider, PoiCardServiceProvider) {
    MapIconsProvider.setIconBaseUrl('../../img/icons');
    PoiCardServiceProvider.setImgBaseUrl('../../img/');
  }

  function run(AppActions, ArView, $window, World) {

    ArView.init();

    $window.World = World;

    //AppActions.execute('open');
  }
})();
