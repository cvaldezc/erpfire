(function() {
  var app;
  app = function($rootScope, $scope, $state, $log) {
    var vm;
    vm = this;
    vm.main = function() {
      $log.info('main app...');
    };
    vm.main();
  };
  'use strict';
  angular.module('').controller('app', app);
})();
