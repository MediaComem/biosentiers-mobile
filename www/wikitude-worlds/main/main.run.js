/**
 * Created by Mathias on 02.05.2016.
 */
(function () {
  'use strict';

  angular
    .module('ar')
    .run(run);

  function run(ArConfig, Do, POI, $rootScope, $window, World) {

    ArConfig.init();

    $window.World = World;

    $rootScope.$on('filters:changed', onFiltersChanged);

    Do.action('open');

    ////////////////////

    function onFiltersChanged() {
      POI.updateAr();
    }
  }
})();
