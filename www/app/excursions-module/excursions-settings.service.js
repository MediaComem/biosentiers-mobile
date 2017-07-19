/**
 * Created by Mathias Oberson on 19.07.2017.
 */
(function() {
  'use strict';
  angular
    .module('excursions-module')
    .factory('ExcursionsSettings', ExcursionsSettingsFn);

  function ExcursionsSettingsFn() {
    var settings = {
      withArchive: false
    };

    return settings;
  }
})();
