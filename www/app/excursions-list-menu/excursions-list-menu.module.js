/**
 * Created by Mathias Oberson on 19.07.2017.
 */
(function() {
  'use strict';
  angular.module('excursions-list-menu', []);

  angular
    .module('excursions-list-menu')
    .controller('ExcursionsMenuCtrl', ExcursionsMenuCtrlFn);

  function ExcursionsMenuCtrlFn(ExcursionsSettings, $timeout) {
    var menu = this;

    ExcursionsSettings.withArchive.changeObs.first().subscribe(function(value) {
      $timeout(function() {
        menu.withArchive = value;
      });
    });

    menu.toggleWithArchive = ExcursionsSettings.withArchive.toggle;
  }
})();
