/**
 * Created by Mathias on 02.05.2016.
 */
(function () {
  'use strict';

  angular
    .module('ar')
    .run(run);

  function run(AppActions, ArConfig, $window, World) {

    ArConfig.init();

    $window.World = World;

    AppActions.execute('open');
  }
})();
