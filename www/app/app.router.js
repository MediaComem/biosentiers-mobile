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

      .state('app.outings', {
        url  : '/outings',
        cache: false, //fix issue with other tabs system - species - http://stackoverflow.com/questions/32430920/ionic-different-tab-content
        views: {
          'menuContent': {
            templateUrl: 'app/outings/outings.html'
          }
        }
      })

      .state('app.outings.all', {
        url    : '/all',
        views  : {
          'outings-all': {
            templateUrl: 'app/outings/outings-all.html',
            controller : 'OutingsCtrl as ctrl'
          }
        },
        resolve: {
          outingsData: function(Outings) {
            return Outings.getAll();
          }
        }
      })

      .state('app.outings.pending', {
        url    : '/pending',
        views  : {
          'outings-pending': {
            templateUrl: 'app/outings/outings-all.html',
            controller : 'OutingsCtrl as ctrl'
          }
        },
        resolve: {
          outingsData: function(Outings) {
            return Outings.getPending();
          }
        }
      })

      .state('app.outings.ongoing', {
        url    : '/ongoing',
        views  : {
          'outings-ongoing': {
            templateUrl: 'app/outings/outings-all.html',
            controller : 'OutingsCtrl as ctrl'
          }
        },
        resolve: {
          outingsData: function(Outings) {
            return Outings.getOngoing();
          }
        }
      })

      .state('app.outings.over', {
        url    : '/over',
        views  : {
          'outings-over': {
            templateUrl: 'app/outings/outings-all.html',
            controller : 'OutingsCtrl as ctrl'
          }
        },
        resolve: {
          outingsData: function(Outings) {
            return Outings.getFinished();
          }
        }
      })

      .state('app.species', {
        url  : '/species',
        cache: false, //fix issue with other tabs system - outings
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

      .state('app.outing', {
        url    : '/outings/:outingId',
        views  : {
          'menuContent': {
            templateUrl : 'app/outing/outing.html',
            controller  : 'OutingCtrl',
            controllerAs: 'outing'
          }
        },
        resolve: {
          outingData: function(Outings, $stateParams) {
            return Outings.getOne($stateParams.outingId);
          }
        }
      })

      .state('app.outing.seenlist', {
        url    : '/seen',
        views  : {
          'menuContent@app': {
            templateUrl : 'app/outing/outing-seen.html',
            controller  : 'OutingSeenCtrl',
            controllerAs: 'outingSeen'
          }
        },
        resolve: {
          seenPois: function(SeenPoisData, $stateParams) {
            return SeenPoisData.getAll($stateParams.outingId);
          }
        }
      })

      .state('app.outing.seenlist.poi', {
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
    $urlRouterProvider.otherwise('/app/outings');
  }
})();
