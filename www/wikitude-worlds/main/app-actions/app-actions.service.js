/**
 * Created by Mathias on 02.05.2016.
 */
(function () {
  'use strict';

  angular
    .module('app-actions')
    .factory('AppActions', AppActionsService);

  function AppActionsService($log, $q, $timeout) {

    var defaultTimeout = 5000,
        nextExecutionId = 0,
        pendingActions = {};

    var service = {
      execute: execute,
      returnResultFromApp: returnResultFromApp
    };

    return service;

    function execute(name, data, options) {
      options = _.extend({}, options);

      var deferred = $q.defer(),
          executionId = '' + (nextExecutionId++);

      var action = {
        deferred: deferred,
      };

      pendingActions[executionId] = action;

      var timeout = options.timeout || defaultTimeout;
      if (timeout && timeout >= 1) {
        action.timeout = $timeout(cancel, timeout);
      }

      $q.resolve().then(exec);

      deferred.promise.finally(cleanup);

      return deferred.promise;

      function exec() {

        var dataWithId = _.extend({}, data, {
          _executionId: executionId
        });

        $log.debug('Executing app action ' + name + ' with ' + angular.toJson(dataWithId));

        var dest = "architectsdk://" + name;
        document.location = dest + "?" + angular.toJson(dataWithId);
      }

      function cancel() {
        deferred.reject(new Error('App action ' + name + ' has timed out after ' + timeout + 'ms'));
      }

      function cleanup() {
        delete pendingActions[executionId];
      }
    }

    function returnResultFromApp(data) {

      var executionId = data.id,
          result = data.result,
          action = pendingActions[executionId];

      if (!action) {
        $log.warn('Received app result for unknown execution ID ' + executionId + ' (it may have timed out)');
        return;
      }

      if (action.timeout) {
        $timeout.cancel(action.timeout);
      }

      action.deferred.resolve(result);
    }
  }
})();
