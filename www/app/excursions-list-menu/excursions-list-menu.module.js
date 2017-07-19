/**
 * Created by Mathias Oberson on 19.07.2017.
 */
(function() {
  'use strict';
  angular.module('excursions-list-menu', []);

  angular
    .module('excursions-list-menu')
    .controller('ExcursionsMenuCtrl', ExcursionsMenuCtrlFn);

  function ExcursionsMenuCtrlFn(ExcursionsSettings) {
    var menu = this;

    menu.withArchive = ExcursionsSettings.withArchive;
  }
})();
