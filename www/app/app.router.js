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
        cache: false, //fix issue with other tabs system - encyclopedia - http://stackoverflow.com/questions/32430920/ionic-different-tab-content
        views: {
          'menuContent': {
            templateUrl: 'app/excursions-list/excursions-list.html',
            controller: 'ExcursionsListCtrl as list'
          }
        }
      })

      .state('app.excursions-list.all', {
        url    : '/all',
        views  : {
          'excursions-all': {
            templateUrl: 'app/excursions-list/excursions-list-tab.html',
            controller : 'ExcursionsListTabCtrl as tab'
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
            controller : 'ExcursionsListTabCtrl as tab'
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
            controller : 'ExcursionsListTabCtrl as tab'
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
            controller : 'ExcursionsListTabCtrl as tab'
          }
        },
        resolve: {
          excursionsData: function(Excursions) {
            return Excursions.getFinished();
          }
        }
      })

      .state('app.encyclopedia', {
        url  : '/encyclopedia',
        cache: false, //fix issue with other tabs system - excursions
        views: {
          'menuContent': {
            templateUrl: 'app/encyclopedia/encyclopedia.html'
          }
        }
      })

      .state('app.encyclopedia.flora', {
        url    : '/flora',
        views  : {
          'encyclopedia-flora': {
            templateUrl: 'app/encyclopedia/encyclopedia-flora.html',
            controller : 'EncyclopediaCtrl as ctrl'
          }
        },
        resolve: {
          encyclopediaData: function(Species) {
            return Species.getAll('Flore');
          }
        }
      })

      .state('app.encyclopedia.birds', {
        url    : '/birds',
        views  : {
          'encyclopedia-birds': {
            templateUrl: 'app/encyclopedia/encyclopedia-birds.html',
            controller : 'EncyclopediaCtrl as ctrl'
          }
        },
        resolve: {
          encyclopediaData: function(Species) {
            return Species.getAll('Oiseaux');
          }
        }
      })

      .state('app.encyclopedia.butterflies', {
        url    : '/butterflies',
        views  : {
          'encyclopedia-butterflies': {
            templateUrl: 'app/encyclopedia/encyclopedia-butterflies.html',
            controller : 'EncyclopediaCtrl as ctrl'
          }
        },
        resolve: {
          encyclopediaData: function(Species) {
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
          excursionData: function(Excursions, $stateParams, $log) {
            $log.log('AppRouter:app.excursion state:', $stateParams);
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

      .state('app.encyclopedia.species', {
        url    : '/:specieId',
        views  : {
          'menuContent': {
            templateUrl: 'app/species/species.html',
            controller : 'SpeciesCtrl as species'
          }
        },
        resolve: {
          speciesData: function(Species, $stateParams) {
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
