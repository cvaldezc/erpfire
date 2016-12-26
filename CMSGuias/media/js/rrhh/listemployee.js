(function() {
  var app, cpFactory, ctrlList;
  cpFactory = function($http, $cookies) {
    $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-urlencoded';
    return {
      get: function(options) {
        if (options == null) {
          options = {};
        }
        return $http.get("", {
          params: options
        });
      },
      post: function(options) {
        var fd;
        if (options == null) {
          options = {};
        }
        fd = function() {
          var form, k, v;
          form = new FormData();
          for (k in options) {
            v = options[k];
            form.append(k, v);
          }
          return form;
        };
        return $http.post("", fd(), {
          transformRequest: angular.identity,
          headers: {
            'Content-Type': void 0
          }
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
      project: null,
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
    vm.openAssistance = function(obj) {
      vm.assistance.name = obj.fields.lastname + " " + obj.fields.firstname;
      vm.assistance.dni = obj.pk;
      angular.element("#modal1").modal('open');
    };
    vm.saveAssistance = function() {
      var prms;
      if (vm.assistance.type === null) {
        Materialize.toast("<i class='fa fa-exclamation-circle amber-text fa-lg'></i>&nbsp;Debe seleccionar un tipo de asistencia", 4000);
        return false;
      }
      if (vm.assistance.hasOwnProperty('hin')) {
        switch (vm.assistance.hin) {
          case '00:00':
          case null:
          case '':
            Materialize.toast("<i class='fa fa-exclamation-circle amber-text fa-lg'></i>&nbsp;Debe de Ingresar hora de entrada!", 4000);
            return false;
        }
      } else {
        Materialize.toast("<i class='fa fa-exclamation-circle amber-text fa-lg'></i>&nbsp;Debe de Ingresar hora de entrada!", 4000);
        return false;
      }
      if (vm.assistance.hasOwnProperty('hout')) {
        switch (vm.assistance.hout) {
          case '00:00':
          case null:
          case '':
            Materialize.toast("<i class='fa fa-exclamation-circle amber-text fa-lg'></i>&nbsp;Debe de Ingresar hora de Salida!", 4000);
            return false;
        }
      } else {
        Materialize.toast("<i class='fa fa-exclamation-circle amber-text fa-lg'></i>&nbsp;Debe de Ingresar hora de Salida!", 4000);
        return false;
      }
      if (!vm.assistance.hasOwnProperty('hinb')) {
        vm.assistance.hinb = '00:00';
      }
      if (!vm.assistance.hasOwnProperty('houtb')) {
        vm.assistance.houtb = '00:00';
      }
      if (!vm.assistance.hasOwnProperty('viatical')) {
        vm.assistance.viatical = 0;
      } else {
        switch (vm.assistance.viatical) {
          case '':
          case void 0:
          case null:
            vm.assistance.viatical = 0;
        }
      }
      prms = vm.assistance;
      switch (prms['project']) {
        case null:
        case void 0:
        case '':
          prms['project'] = '';
      }
      prms['saveAssistance'] = true;
      console.info(prms);
      cpFactory.post(prms).success(function(response) {
        if (response.status) {
          Materialize.toast("<i class='fa fa-check fa-lg green-text'></i>&nbsp;Asistencia Registrada!");
          vm.assistance = {
            'dni': '',
            'name': '',
            'hin': '',
            'hout': ''
          };
          angular.element("#modal1").modal('close');
        } else {
          Materialize.toast("<i class='fa fa-times fa-lg red-text'></i>&nbsp;Error: " + response.rasie, 4000);
        }
      });
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
        vm.assistance.type = null;
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
  app.directive('valminandmax', valMinandMax);
  app.factory('cpFactory', cpFactory);
  cpFactory.inject = ['$http', '$cookies'];
  app.controller('ctrlList', ctrlList);
  ctrlList.inject = ['$scope', '$log', '$q', 'cpFactory'];
})();
