/**
 * Created by Mathias on 02.05.2016.
 */
(function () {
  'use strict';

  angular
    .module('ar')
    .run(run);

  function run(ArConfig, Do, $window, World) {

    ArConfig.init();

    $window.World = World;

    Do.action('open');
  }
})();
