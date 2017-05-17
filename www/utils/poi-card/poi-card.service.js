/**
 * Created by Mathias Oberson on 17.05.2017.
 */
(function() {
  'use strict';
  angular
    .module('poi-card-module')
    .factory('PoiCardService', PoiCardServiceFn);

  function PoiCardServiceFn($log) {
    return {
      setup: function(ctrl, content) {
        ctrl.content = content;
        ctrl.selectedLanguage = 'fr';
        ctrl.classFromTheme = classFromTheme;
        ctrl.flagUrl = getFlagIconUrl(ctrl);
        ctrl.updateCommomName = updateCommonNameFactory(ctrl);
        ctrl.openInBrowser = openInBrowserFactory(ctrl);
      }
    };

    ////////////////////

    function getFlagIconUrl(ctrl) {
      return "../../img/flags/" + ctrl.selectedLanguage + ".png";
    }

    function updateCommonNameFactory(ctrl) {
      return function updateCommomName() {
        $log.log('PoiModalCtrl:updateCommonName', ctrl.selectedLanguage);
      }
    }

    function openInBrowserFactory(ctrl) {
      if (typeof AR === 'undefined') {
        return function openInBrowser() {
          $log.log(window.open);
          window.open(ctrl.content.website, '_system');
          return false;
        };
      } else {
        return function openInBrowser() {
          AR.context.openInBrowser(ctrl.content.website, true);
        };
      }
    }

    function classFromTheme(theme) {
      var classes = {
        bird     : 'positive',
        flower   : 'energized',
        butterfly: 'balanced',
        tree     : 'assertive'
      };
      return classes[theme];
    }
  }
})();
