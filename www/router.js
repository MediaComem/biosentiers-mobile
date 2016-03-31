/**
 * Created by Mathias on 29.03.2016.
 * This file regroups the routes used in the app.
 */
(function () {
  'use strict';

  angular
    .module('app.router', [])
    .config(router);

  function router($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'auth-module/login.html',
        controller: 'AuthCtrl',
        controllerAs: 'auth'
      })

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'menu/menu.html',
        controller: 'MenuCtrl'
      })

      .state('app.search', {
        url: '/search',
        views: {
          'menuContent': {
            templateUrl: 'templates/search.html'
          }
        }
      })

      .state('app.browse', {
        url: '/browse',
        views: {
          'menuContent': {
            templateUrl: 'templates/browse.html'
          }
        }
      })

      .state('app.outings', {
        url: '/sorties',
        views: {
          'menuContent': {
            templateUrl: 'outings/outings.html',
            controller: 'OutingsCtrl'
          }
        }
      })

      .state('app.outing', {
        url: '/outings/:outingId',
        views: {
          'menuContent': {
            templateUrl: 'outing/outing.html',
            controller: 'OutingCtrl'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
  }
})();
