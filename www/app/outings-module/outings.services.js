(function () {
  'use strict';
  angular
    .module('OutingsModule')
    .factory('Outings', Outings);

  function Outings() {
    var service = {
      getAll: getAll,
      getOne: getOne,
      getWaiting: getWaiting,
      getOngoing: getOngoing,
      getOver: getOver
    };

    // Some fake testing data
    var waiting = [{
      id: 3,
      name: 'Deuxième sortie de classe',
      statut: 'En attente',
      creator: 'Mme Adams',
      date: '12.05.2016'
    }];

    var ongoing = [{
      id: 1,
      name: 'Promenade de vacances',
      statut: 'En cours',
      creator: 'Ben',
      date: '12.03.2016'
    }, {
      id: 4,
      name: 'Dernière sortie de classe',
      statut: 'En cours',
      creator: 'Jens',
      date: '21.08.2016'
    }];

    var over = [{
      id: 2,
      name: 'Première sortie de classe',
      statut: 'Terminée',
      creator: 'Mr Harnold',
      date: '10.03.2016'
    }, {
      id: 5,
      name: 'Sortie personnelle',
      statut: 'Terminée',
      creator: 'Mathias',
      date: '22.10.2016'
    }];

    return service;

    ////////////////////

    function getAll() {
      var outings = waiting.concat(ongoing, over);
      return outings.sort(byId);
    }

    function getOne(outingId) {
      var outings = getAll();
      for (var i = 0; i < outings.length; i++) {
        if (outings[i].id === parseInt(outingId)) {
          return outings[i];
        }
      }
      return null;
    }

    function getWaiting() {
      return waiting.sort(byId);
    }

    function getOngoing() {
      return ongoing.sort(byId);
    }

    function getOver() {
      return over.sort(byId);
    }

    function byId(a, b) {
      return a.id - b.id;
    }
  }
})();
