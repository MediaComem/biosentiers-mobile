/**
 * Created by Mathias Oberson on 09.02.2017.
 */
(function() {
  'use strict';
  angular
    .module('app')
    .controller('DebugCtrl', DebugCtrl);

  function DebugCtrl(BioDb, Excursions, $cordovaToast, $q) {
    var ctrl = this;

    ctrl.resetDb = resetDb;

    ////////////////////

    function resetDb() {
      $q.when()
        .then(BioDb.reset)
        .then(Excursions.getAll)
        .then(function() {
          $cordovaToast.showShortTop('Base de données réinitialisée !');
        })
    }
  }
})();