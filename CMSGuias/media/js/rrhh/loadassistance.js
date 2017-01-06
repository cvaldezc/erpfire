(function() {
  var app, cpFactory, ctrload;
  cpFactory = function($http, $cookies, $log) {
    return {
      get: function(options) {
        return $http.get("", {
          params: options
        });
      }
    };
  };
  ctrload = function($scope, $log, cpFactory) {
    var vm;
    vm = this;
    vm.files = [];
    angular.element(document).ready(function() {
      vm.main();
    });
    vm.main = function() {
      $log.info('main ctrload...');
    };
  };
  'use strict';
  app = angular.module('lapp', ['ngCookies']);
  app.config(function($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
  });
  app.directive('loadFiles', loadFiles);
  app.factory('cpFactory', cpFactory);
  cpFactory.inject = ['$http', '$cookies', '$log'];
  app.controller('ctrload', ctrload);
  ctrload.inject = ['$scope', '$log', 'cpFactory'];
})();
