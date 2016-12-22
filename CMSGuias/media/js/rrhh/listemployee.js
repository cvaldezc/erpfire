(function() {
  var app, cpFactory, ctrlList;
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
  ctrlList = function($scope, $log, $q, cpFactory) {
    var vm;
    vm = this;
    vm.order = 'fields.lastname';
    vm.lprojects = [];
    vm.assistance = {
      project: '-',
      type: ''
    };
    angular.element(document).ready(function() {
      $log.warn(new Date());
      console.log(vm);
      vm.listtype();
      vm.listEmployee();
      vm.listProject();
      angular.element(".modal").modal({
        dismissible: false
      });
      angular.element(".datepicker").pickadate({
        container: 'body',
        format: "yyyy-mm-dd",
        max: new Date(),
        selectMonths: true,
        onStart: function() {
          var date;
          date = new Date();
          this.set('select', [date.getFullYear(), date.getMonth(), date.getDate()]);
        }
      });
    });
    vm.listtype = function() {
      cpFactory.get({
        gettypes: true
      }).success(function(response) {
        if (response.status) {
          vm.ltypes = response.types;
        }
      });
    };
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
    vm.listProject = function() {
      cpFactory.get({
        gproject: true
      }).success(function(response) {
        if (response.status) {
          vm.lprojects = response.projects;
          return setTimeout((function() {
            angular.element(".chosen-select").chosen({
              width: "100%"
            });
          }), 800);
        } else {
          Materialize.toast("No se cargados los datos " + response.raise, 2600);
        }
      });
    };
    vm.openAssistance = function() {
      angular.element("#modal1").modal('open');
    };
    $scope.$watch('vm.assistance.project', function(nw, old) {
      var tp;
      tp = angular.element("#types")[0];
      if (nw === '-' || nw === null) {
        tp.removeAttribute('disabled');
        vm.assistance.type = null;
      } else {
        vm.assistance.type = 'TY01';
        tp.setAttribute('disabled', 'disabled');
      }
    });
    $scope.$watch('vm.assistance.type', function(nw, old) {
      if (nw === 'TY01' && vm.assistance.project === null) {
        vm.assistance;
      }
    });
  };
  'use strict';
  app = angular.module('appList', ['ngCookies']);
  app.config(function($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
  });
  app.directive('formattime', valFormatTime);
  app.factory('cpFactory', cpFactory);
  cpFactory.inject = ['$http', '$cookies'];
  app.controller('ctrlList', ctrlList);
  ctrlList.inject = ['$scope', '$log', '$q', 'cpFactory'];
})();
