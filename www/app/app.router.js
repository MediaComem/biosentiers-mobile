/**
 * Created by Mathias on 29.03.2016.
 * This file regroups the routes used in the app.
 */
(function () {
  'use strict';

  angular
    .module('app')
    .config(router);

  function router($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('idle', {
        url: '/idle',
        templateUrl: 'app/idle.tests/idle.html',
        controller: 'IdleController',
        controllserAs: 'idle'
      })

      .state('login', {
        url: '/login',
        templateUrl: 'app/auth-module/login.html',
        controller: 'AuthCtrl',
        controllerAs: 'auth'
      })

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'app/menu/menu.html',
        controller: 'MenuCtrl',
        controllerAs: 'menu'
      })

      .state('app.account', {
        url: '/account',
        views: {
          'menuContent': {
            templateUrl: 'app/account/account.html'
          }
        }
      })

      .state('app.outings', {
        url: '/outings',
        views: {
          'menuContent': {
            templateUrl: 'app/outings/outings.html'
          }
        }
      })

      .state('app.outings.all', {
        url: '/all',
        views: {
          'outings-all': {
            templateUrl: 'app/outings/outings-all.html',
            controller: 'OutingsCtrl as ctrl'
          }
        },
        resolve: {
          outingsData: function (Outings) {
            return Outings.getAll();
          }
        }
      })

      .state('app.outings.waiting', {
        url: '/waiting',
        views: {
          'outings-waiting': {
            templateUrl: 'app/outings/outings-all.html',
            controller: 'OutingsCtrl as ctrl'
          }
        },
        resolve: {
          outingsData: function(Outings) {
            return Outings.getWaiting();
          }
        }
      })

      .state('app.outings.ongoing', {
        url: '/ongoing',
        views: {
          'outings-ongoing': {
            templateUrl: 'app/outings/outings-all.html',
            controller: 'OutingsCtrl as ctrl'
          }
        },
        resolve: {
          outingsData: function(Outings) {
            return Outings.getOngoing();
          }
        }
      })

      .state('app.outings.over', {
        url: '/over',
        views: {
          'outings-over': {
            templateUrl: 'app/outings/outings-all.html',
            controller: 'OutingsCtrl as ctrl'
          }
        },
        resolve: {
          outingsData: function(Outings) {
            return Outings.getOver();
          }
        }
      })

      .state('app.settings', {
        url: '/settings',
        views: {
          'menuContent': {
            templateUrl: 'app/settings/settings.html'
          }
        }
      })

      .state('app.outing', {
        url: '/outings/:outingId',
        views: {
          'menuContent': {
            templateUrl: 'app/outing/outing.html',
            controller: 'OutingCtrl as outing'
          }
        },
        resolve: {
          outingData: function(Outings, $stateParams) {
            return Outings.getOne($stateParams.outingId);
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    //$urlRouterProvider.otherwise('/login');
    // Dev route to access directly the launchAR button
    $urlRouterProvider.otherwise('/app/outings/1');
  }
})();
