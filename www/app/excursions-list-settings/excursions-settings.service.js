/**
 * Created by Mathias Oberson on 19.07.2017.
 */
(function() {
  'use strict';
  angular
    .module('excursions-list-settings', []);

  angular
    .module('excursions-list-settings')
    .factory('ExcursionsSettings', ExcursionsSettingsFn);

  function ExcursionsSettingsFn(rx) {
    var withArchive        = true,
        withArchiveSubject = new rx.BehaviorSubject(withArchive);

    var settings = {
      withArchiveChangeObs: withArchiveSubject.asObservable(),
      toggleWithArchive   : toggleWithArchive
    };

    return settings;

    ////////////////////

    function toggleWithArchive() {
      withArchive = !withArchive;
      withArchiveSubject.onNext(withArchive);
    }
  }
})();
