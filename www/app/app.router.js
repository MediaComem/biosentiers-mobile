/**
 * Created by Mathias on 29.03.2016.
 * This file regroups the routes used in the app.
 */
(function() {
  'use strict';

  angular
    .module('app')
    .config(router);

  function router($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        url         : '/login',
        templateUrl : 'app/auth-module/login.html',
        controller  : 'AuthCtrl',
        controllerAs: 'auth'
      })

      .state('app', {
        url         : '/app',
        abstract    : true,
        templateUrl : 'app/menu/menu.html',
        controller  : 'MenuCtrl',
        controllerAs: 'menu'
      })

      .state('app.account', {
        url  : '/account',
        views: {
          'menuContent': {
            templateUrl: 'app/account/account.html'
          }
        }
      })

      .state('app.excursions', {
        url  : '/excursions',
        cache: false, //fix issue with other tabs system - species - http://stackoverflow.com/questions/32430920/ionic-different-tab-content
        views: {
          'menuContent': {
            templateUrl: 'app/excursions/excursions.html'
          }
        }
      })

      .state('app.excursions.all', {
        url    : '/all',
        views  : {
          'excursions-all': {
            templateUrl: 'app/excursions/excursions-all.html',
            controller : 'ExcursionsCtrl as excursions'
          }
        },
        resolve: {
          excursionsData: function(Excursions) {
            return Excursions.getAll();
          }
        }
      })

      .state('app.excursions.pending', {
        url    : '/pending',
        views  : {
          'excursions-pending': {
            templateUrl: 'app/excursions/excursions-all.html',
            controller : 'ExcursionsCtrl as excursions'
          }
        },
        resolve: {
          excursionsData: function(Excursions) {
            return Excursions.getPending();
          }
        }
      })

      .state('app.excursions.ongoing', {
        url    : '/ongoing',
        views  : {
          'excursions-ongoing': {
            templateUrl: 'app/excursions/excursions-all.html',
            controller : 'ExcursionsCtrl as excursions'
          }
        },
        resolve: {
          excursionsData: function(Excursions) {
            return Excursions.getOngoing();
          }
        }
      })

      .state('app.excursions.over', {
        url    : '/over',
        views  : {
          'excursions-over': {
            templateUrl: 'app/excursions/excursions-all.html',
            controller : 'ExcursionsCtrl as excursions'
          }
        },
        resolve: {
          excursionsData: function(Excursions) {
            return Excursions.getFinished();
          }
        }
      })

      .state('app.species', {
        url  : '/species',
        cache: false, //fix issue with other tabs system - excursions
        views: {
          'menuContent': {
            templateUrl: 'app/species/species.html'
          }
        }
      })

      .state('app.species.flora', {
        url    : '/flora',
        views  : {
          'species-flora': {
            templateUrl: 'app/species/species-flora.html',
            controller : 'SpeciesCtrl as ctrl'
          }
        },
        resolve: {
          speciesData: function(Species) {
            return Species.getAll('Flore');
          }
        }
      })

      .state('app.species.birds', {
        url    : '/birds',
        views  : {
          'species-birds': {
            templateUrl: 'app/species/species-birds.html',
            controller : 'SpeciesCtrl as ctrl'
          }
        },
        resolve: {
          speciesData: function(Species) {
            return Species.getAll('Oiseaux');
          }
        }
      })

      .state('app.species.butterflies', {
        url    : '/butterflies',
        views  : {
          'species-butterflies': {
            templateUrl: 'app/species/species-butterflies.html',
            controller : 'SpeciesCtrl as ctrl'
          }
        },
        resolve: {
          speciesData: function(Species) {
            return Species.getAll('Papillons');
          }
        }
      })


      .state('app.settings', {
        url  : '/settings',
        views: {
          'menuContent': {
            templateUrl: 'app/settings/settings.html'
          }
        }
      })

      .state('app.excursion', {
        url    : '/excursions/:excursionId',
        views  : {
          'menuContent': {
            templateUrl : 'app/excursion/excursion.html',
            controller  : 'ExcursionCtrl',
            controllerAs: 'excursion'
          }
        },
        resolve: {
          excursionData: function(Excursions, $stateParams) {
            return Excursions.getOne($stateParams.excursionId);
          }
        }
      })

      .state('app.excursion.seenlist', {
        url    : '/seen',
        views  : {
          'menuContent@app': {
            templateUrl : 'app/excursion/excursion-seen.html',
            controller  : 'ExcursionSeenCtrl',
            controllerAs: 'excursionSeen'
          }
        },
        resolve: {
          seenPois: function(SeenPoisData, $stateParams) {
            return SeenPoisData.getAll($stateParams.excursionId);
          }
        }
      })

      .state('app.excursion.seenlist.poi', {
        url  : '/poi/:poiId',
        views: {
          'menuContent@app': {
            templateUrl: 'app/specie/specie.html'
          }
        }
      })

      .state('app.specie', {
        url    : '/species/:specieId',
        views  : {
          'menuContent': {
            templateUrl: 'app/specie/specie.html',
            controller : 'SpecieCtrl as specie'
          }
        },
        resolve: {
          specieData: function(Species, $stateParams) {
            return Species.getOne($stateParams.specieId);
          }
        }
      })
      .state('app.debug', {
        url  : '/debug',
        views: {
          'menuContent': {
            templateUrl : 'app/debug/debug.template.html',
            controller  : 'DebugCtrl',
            controllerAs: 'debug'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    //$urlRouterProvider.otherwise('/login');
    // Dev route to access directly the launchAR button
    $urlRouterProvider.otherwise('/app/excursions');
  }
})();
