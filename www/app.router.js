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
        controller: 'MenuCtrl',
        controllerAs: 'menu'
      })

      .state('app.outings', {
        url: '/outings',
        views: {
          'menuContent': {
            templateUrl: 'outings/outings.html',
            controller: 'OutingsCtrl',
            controllerAS: 'outings'
          }
        }
      })

      .state('app.outing', {
        url: '/outings/:outingId',
        views: {
          'menuContent': {
            templateUrl: 'outing/outing.html',
            controller: 'OutingCtrl',
            controllerAs: 'outing'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
  }
})();
