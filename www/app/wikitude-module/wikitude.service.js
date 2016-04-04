/**
 * Created by Mathias on 29.03.2016.
 */
(function () {
  'use strict';

  angular
    .module('WikitudeModule')
    .factory('Wikitude', ARFactory);

  //function ARService() {
  //  var plugin = cordova.require('com.wikitude.phonegap.WikitudePlugin.WikitudePlugin');
  //  this.result = function () {
  //    console.log(plugin);
  //  }
  //}
  //
  //function ARProvider() {
  //  var service = {
  //    plugin: null,
  //    result: result
  //  };
  //
  //  this.loadPlugin = loadPlugin;
  //  this.$get = $get;
  //
  //  ////////////////////
  //
  //  function result() {
  //    console.log(service.plugin);
  //  }
  //
  //  function $get() {
  //    return service;
  //  }
  //
  //  function loadPlugin() {
  //    service.plugin = cordova.require('com.wikitude.phonegap.WikitudePlugin.WikitudePlugin');
  //  }
  //}

  function ARFactory(WikitudeFunctions) {

    var plugin = null;
    var protocol = 'architectsdk://';

    var service = {
      config: {camera_position: 'back'},
      deviceSupportsFeatures: null,
      reqFeatures: ['geo', '2dtracking'],
      url: 'wikitude-app/index.html',
      init: init,
      executeARViewCall: executeARViewCall,
      getPlugin: getPlugin,
      launchAR: launchAR
    };

    return service;

    ////////////////////

    function launchAR() {
      console.log(plugin);
    }

    /**
     * This function should be used to retrieve the Wikitude plugin in order to access and/or execute any of it's built-in functions.
     * It follows the Singleton pattern in that it either load the plugin and returns it if it's the first time it's called,
     * or return the already loaded plugin for each subsequent call.
     * @returns {WikitudePlugin} The cordova Wikitude plugin
     */
    function getPlugin() {
      if (plugin === null) {
        plugin = cordova.require('com.wikitude.phonegap.WikitudePlugin.WikitudePlugin');
      }
      return plugin;
    }

    /**
     * Checks if the device supports the features needed by the ARchitect World.
     * These features are set with the reqFeatures property of the Wikitude service.
     * The result of this check is available through the deviceSupportsFeatures property of the Wikitude service
     * for it to be used later (alerting the user that he's/she's device is not compatible, for instance).
     * For conveniency, the result of the check is returned by the function.
     * @returns {Boolean} TRUE if the device supports every features, FALSE if at least one feature is not supported
     */
    function checkDevice() {
      getPlugin().isDeviceSupported(function () {
        service.deviceSupportsFeatures = true;
      }, function () {
        service.deviceSupportsFeatures = false;
      }, service.reqFeatures);
      return service.deviceSupportsFeatures;
    }

    /**
     * This function should be set, with the setOnUrlInvokeCallback method, as the callback function for the 'architectsdk://' call done by the Wikitude AR View.
     * The string passed as the 'call' argument must be formatted as follow :
     * 'architectsdk://name_of_the_function_to_execute[?json_object_containging_any_function_parameters]'
     * Example :
     * 'architectsdk://saveClient?{"firstName":"Foo","lastName":"Bar"}'
     * This call will execute the saveClient function, passing in an object, containing a firstName and a lastName property, as the parameter.
     * @param call A string starting with 'architectsdk://'.
     */
    function executeARViewCall(call) {
      if (call.substr(0, protocol.length) === protocol) {
        var action = call.substr(protocol.length);
        // When the called function has no parameter (there's no '?' in the call string)
        if (action.indexOf('?') === -1) {
          WikitudeFunctions[action]();
        } else {
          try {
            // When the called function has a parameter (there's a '?' in the call string)
            var fn = action.substr(0, i);
            var param = action.substr(i + 1);
            WikitudeFunctions[fn](angular.fromJson(param));
          } catch (e) {
            // Exception handling
            if (e instanceof SyntaxError) {
              throw new SyntaxError('executeARViewCall() expects the substring following the \'?\' in the parameter string to be a valid JSON object. \'' + param + '\' given.');
            } else if (e instanceof TypeError) {
              throw new TypeError('There is no function named \'' + fn + '\' defined in the WikitudeFunctions service.');
            } else {
              throw e;
            }
          }
        }
      } else {
        throw new SyntaxError('executeARViewCall() expects first parameter to be a string starting with \'architectsdk://\'.');
      }
    }

    function parseActionUrl(url) {
      var action = {};
      if (url.substr(0, protocol.length) === protocol) {
        var call = url.substr(protocol.length);
        if (call.indexOf('?') === -1) {
          action.fn = call;
        } else {
          action.function = action.substr(0, i);
          action.parameters = angular.fromJson(action.substr(i + 1));
        }
      } else {
        throw new SyntaxError('executeARViewCall() expects first parameter to be a string starting with \'architectsdk://\'.');
      }
    }

    /**
     * Initializes the plugin by calling checkDevice() first, to check if the device supports the requested features.
     * Then, it sets the executeARViewCall function as the callback to call every time the AR View uses a document.location = 'architectsdk://foo?bar' call.
     * This way, you don't have to set a process to catch and analyze those calls, as it is done for you with the executeARViewCall function.
     * Check it's documentation to see how it's done.
     */
    function init() {
      console.log('init started');
      checkDevice();
      console.log('device checked');
      getPlugin().setOnUrlInvokeCallback(executeARViewCall);
      console.log('callback set');
    }
  }
})();
