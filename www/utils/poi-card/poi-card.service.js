/**
 * Created by Mathias Oberson on 17.05.2017.
 */
(function() {
  'use strict';
  angular
    .module('poi-card-module')
    .provider('PoiCardService', PoiCardProviderFn);

  function PoiCardProviderFn() {

    var TAG = "[PoiCardService] ",
        imgBaseUrl;

    this.setImgBaseUrl = setImgBaseUrl;

    this.$get = function() {
      return {
        setup: function(ctrl, content) {
          ctrl.content = content;
          ctrl.selectedLanguage = 'fr';
          ctrl.classFromTheme = classFromTheme;
          ctrl.flagUrl = getFlagIconUrl(ctrl);
          ctrl.updateCommomName = updateCommonNameFactory(ctrl);
          ctrl.openInBrowser = openInBrowserFactory(ctrl);
          ctrl.getImageSource = getImageSourceFactory(ctrl);
        }
      };
    };

    ////////////////////

    function setImgBaseUrl(url) {
      if (typeof url !== 'string') throw new TypeError('The setImgBaseUrl method from the PoiCardServiceProvider needs a string value as its only parameter. ' + typeof url + ' given.');
      imgBaseUrl = url;
    }

    function getFlagIconUrl(ctrl) {
      return imgBaseUrl + "flags/" + ctrl.selectedLanguage + ".png";
    }

    function getImageSourceFactory(ctrl) {
      var funcs = {
        bird     : getImageSourceBird,
        butterfly: getImageSourceButterfly,
        flower   : getImageSourceFlora,
        tree     : getImageSourceFlora
      };

      return funcs[ctrl.content.theme];

      ////////////////////

      function getImageSourceFlora() {
        return imgBaseUrl + "photos/flora/" + ctrl.content.id + "a.jpg";
      }

      function getImageSourceBird() {
        return imgBaseUrl + "photos/bird/" + ctrl.content.id + "_700px.png";
      }

      function getImageSourceButterfly() {
        return imgBaseUrl + "photos/butterfly/" + ctrl.content.id + ".jpg";
      }
    }

    function updateCommonNameFactory(ctrl) {
      return function updateCommomName() {
        console.log('PoiModalCtrl:updateCommonName', ctrl.selectedLanguage);
      }
    }

    function openInBrowserFactory(ctrl) {
      var url = ctrl.content.website;
      if (typeof AR === 'undefined') {
        return function openInBrowser() {
          var pattern = /http(s)*:\/\/.*/;
          if (!pattern.test(url)) {
            url = 'http://' + url;
          }
          window.open(url, '_system');
          return false;
        };
      } else {
        return function openInBrowser() {
          AR.context.openInBrowser(url, true);
        };
      }
    }

    function classFromTheme(theme) {
      var classes = {
        bird     : 'positive',
        butterfly: 'energized',
        tree     : 'balanced',
        flower   : 'assertive'
      };
      return classes[theme];
    }
  }
})();
