/**
 * Created by Mathias Oberson on 09.02.2017.
 */
(function() {
  'use strict';
  angular
    .module('app')
    .controller('DebugCtrl', DebugCtrl);

  function DebugCtrl(DbBio, DbExcursions, $cordovaToast, $q) {
    var ctrl = this;

    ctrl.resetDb = resetDb;

    ////////////////////

    function resetDb() {
      $q.when()
        .then(DbBio.reset)
        .then(DbExcursions.getAll())
        .then(function() {
          $cordovaToast.showShortTop('Base de données réinitialisée !');
        })
    }
  }
})();
