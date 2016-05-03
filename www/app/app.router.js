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

      .state('test', {
        url: '/test',
        templateUrl: 'app/test.html'
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

      .state('app.outings', {
        url: '/outings',
        views: {
          'menuContent': {
            templateUrl: 'app/outings/outings.html',
            controller: 'OutingsCtrl',
            controllerAS: 'outings'
          }
        }
      })

      .state('app.outing', {
        url: '/outings/:outingId',
        views: {
          'menuContent': {
            templateUrl: 'app/outing/outing.html',
            controller: 'OutingCtrl',
            controllerAs: 'outing'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    //$urlRouterProvider.otherwise('/login');
    // Dev route to access directly the launchAR button
    $urlRouterProvider.otherwise('/app/outings/1');
  }
})();
