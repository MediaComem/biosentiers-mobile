/**
 * Created by Mathias on 02.05.2016.
 */
'use strict';

angular.module('arDirectives', []);

angular
  .module('arDirectives')
  .directive('arBackButton', arBackButton);

function arBackButton() {
  return {
    template: "<i class='ion-arrow-left-c'></i>"
  }
}
