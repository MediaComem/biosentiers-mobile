/**
 * Created by Mathias on 29.03.2016.
 * This file regroups the routes used in the app.
 */

app.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'AuthCtrl'
    })

    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
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
          templateUrl: 'templates/outings.html',
          controller: 'OutingsCtrl'
        }
      }
    })

    .state('app.outing', {
      url: '/outings/:outingId',
      views: {
        'menuContent': {
          templateUrl: 'templates/outing.html',
          controller: 'OutingCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
