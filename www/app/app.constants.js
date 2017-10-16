(function() {
  'use strict';

  angular
    .module('app')
    .constant('API_URL', 'https://biosentiers.heig-vd.ch/api')
    .constant('REGISTER_API', '/installations')
    .constant('EVENTS_API', '/installations/:iid/events')
    .constant('JWT_API', '/auth');
})();
