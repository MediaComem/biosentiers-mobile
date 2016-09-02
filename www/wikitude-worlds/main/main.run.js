/**
 * Created by Mathias on 02.05.2016.
 */
(function () {
  'use strict';

  angular
    .module('ar')
    .run(run);

  function run(AppActions, ArView, $timeout, $window, World) {

    ArView.init();

    $window.World = World;

    $timeout(function() {
      AppActions.execute('open');
    });
  }
})();
