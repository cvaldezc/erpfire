(function() {
  var app, cpFactory, ctrlList;
  ctrlList = function($scope, $log, $q, cpFactory) {
    var vm;
    vm = this;
    vm.order = 'fields.lastname';
    angular.element(document).ready(function() {
      $log.warn(new Date());
      console.log(vm);
      vm.listEmployee();
    });
    vm.orderlist = function(order) {
      switch (order) {
        case 'lastname':
          vm.order = vm.order === 'fields.lastname' ? '-fields.lastname' : 'fields.lastname';
          break;
        case 'id':
          vm.order = vm.order === 'pk' ? '-pk' : 'pk';
          break;
        case 'cargo':
          vm.order = vm.order === 'fields.charge.fields.cargos' ? '-fields.charge.fields.cargos' : 'fields.charge.fields.cargos';
      }
    };
    vm.listEmployee = function() {
      cpFactory.get({
        glist: true
      }).success(function(response) {
        if (response.status) {
          vm.list = response.employee;
        } else {
          Materialize.tosat("No hay datos para mostrar!", 3000);
        }
      });
    };
    vm.main = function() {
      $log.info('main ctrlList...');
      $log.info(new Date());
    };
  };
  cpFactory = function($http, $cookies) {
    return {
      get: function(options) {
        if (options == null) {
          options = {};
        }
        return $http.get("", {
          params: options
        });
      }
    };
  };
  'use strict';
  app = angular.module('appList', ['ngCookies']);
  app.config(function($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
  });
  app.factory('cpFactory', cpFactory);
  cpFactory.inject = ['$http', '$cookies'];
  app.controller('ctrlList', ctrlList);
  ctrlList.inject = ['$scope', '$log', '$q', 'cpFactory'];
})();
