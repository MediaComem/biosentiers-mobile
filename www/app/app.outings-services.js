angular.module('starter.services', [])

.factory('Outings', function() {

  // Some fake testing data
  var outings = [{
    id: 0,
    name: 'Promenade de vacances',
    statut: 'En cours',
    creator: 'Ben',
    date: '12.03.2016'
  }, {
    id: 1,
    name: 'Première sortie de classe',
    statut: 'Terminée',
    creator: 'Mr Harnold',
    date: '10.03.2016'
  }, {
    id: 2,
    name: 'Deuxième sortie de classe',
    statut: 'En attente',
    creator: 'Mme Adams',
    date: '12.05.2016'
  }, {
    id: 3,
    name: 'Dernière sortie de classe',
    statut: 'En cours',
    creator: 'Jens',
    date: '21.08.2016'
  }, {
    id: 4,
    name: 'Sortie personnelle',
    statut: 'Terminée',
    creator: 'Mathias',
    date: '22.10.2016'
  }];

  return {
    all: function() {
      return outings;
    },
    get: function(outingId) {
      for (var i = 0; i < outings.length; i++) {
        if (outings[i].id === parseInt(outingId)) {
          return outings[i];
        }
      }
      return null;
    }
  };
});
