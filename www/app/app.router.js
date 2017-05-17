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

      .state('app.excursions-list', {
        url  : '/excursions-list',
        cache: false, //fix issue with other tabs system - species - http://stackoverflow.com/questions/32430920/ionic-different-tab-content
        views: {
          'menuContent': {
            templateUrl: 'app/excursions-list/excursions-list.html'
          }
        }
      })

      .state('app.excursions-list.all', {
        url    : '/all',
        views  : {
          'excursions-all': {
            templateUrl: 'app/excursions-list/excursions-list-tab.html',
            controller : 'ExcursionsListCtrl as excursions'
          }
        },
        resolve: {
          excursionsData: function(Excursions) {
            return Excursions.getAll();
          }
        }
      })

      .state('app.excursions-list.pending', {
        url    : '/pending',
        views  : {
          'excursions-pending': {
            templateUrl: 'app/excursions-list/excursions-list-tab.html',
            controller : 'ExcursionsListCtrl as excursions'
          }
        },
        resolve: {
          excursionsData: function(Excursions) {
            return Excursions.getPending();
          }
        }
      })

      .state('app.excursions-list.ongoing', {
        url    : '/ongoing',
        views  : {
          'excursions-ongoing': {
            templateUrl: 'app/excursions-list/excursions-list-tab.html',
            controller : 'ExcursionsListCtrl as excursions'
          }
        },
        resolve: {
          excursionsData: function(Excursions) {
            return Excursions.getOngoing();
          }
        }
      })

      .state('app.excursions-list.finished', {
        url    : '/finished',
        views  : {
          'excursions-finished': {
            templateUrl: 'app/excursions-list/excursions-list-tab.html',
            controller : 'ExcursionsListCtrl as excursions'
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
        url    : '/excursions-list/:excursionId',
        views  : {
          'menuContent': {
            templateUrl : 'app/excursion/excursion.html',
            controller  : 'ExcursionCtrl as excursion'
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
            controller  : 'ExcursionSeenCtrl as excursionSeen'
          }
        }
      })

      .state('app.excursion.seenlist.poi', {
        url  : '/:theme/:specieId',
        views: {
          'menuContent@app': {
            templateUrl: 'app/excursion/excursion-seen-poi.html',
            controller: 'ExcursionSeenPoiCtrl as poiCtrl'
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
    $urlRouterProvider.otherwise('/app/excursions-list');
  }
})();
