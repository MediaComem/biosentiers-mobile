/**
 * Created by Mathias Oberson on 12.05.2017.
 */
(function() {
  'use strict';

  angular
    .module('ar')
    .directive('scrottom', Scrottom);

  function Scrottom() {
    return {
      scope: {
        scrottom: "="
      },
      link : function(scope, element) {
        scope.$watchCollection('scrottom', function(newValue) {
          if (newValue) {
            $(element).scrollTop($(element)[0].scrollHeight);
          }
        });
      }
    }
  }
})();
