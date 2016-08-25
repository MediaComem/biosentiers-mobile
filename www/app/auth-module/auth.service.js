/**
 * Created by Mathias on 31.03.2016.
 */
(function () {
  'use strict';

  angular
    .module('AuthModule')
    .factory('AuthService', AuthService);

  function AuthService($q) {

    var service = {};

    service.connectUser = connectUser;

    return service;

    ////////////////////

    /**
     * Returns a promise indicating if the user has been correctly connected or if the credentials he/she provided has been refused.
     * @param credentials An Object with a username and a password property
     * @returns {*}
       */
    function connectUser(credentials) {
      var q = $q.defer();
      //TODO : remplacer par la véritable logique de connection
      credentials.username && credentials.password && q.resolve() || q.reject();
      return q.promise;
    }
  }
})();
