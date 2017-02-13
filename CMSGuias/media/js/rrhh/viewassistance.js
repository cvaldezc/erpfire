(function() {
  var app, cpFactory, ctrlType;
  cpFactory = function($http, $cookies) {
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
        $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        fd = function(options) {
          var form, k, v;
          if (options == null) {
            options = {};
          }
          form = new FormData();
          for (k in options) {
            v = options[k];
            form.append(k, v);
          }
          return form;
        };
        return $http.post("", fd(options), {
          transformRequest: angular.identity,
          headers: {
            'Content-Type': void 0
          }
        });
      }
    };
  };
  ctrlType = function($scope, cpFactory) {
    var vm;
    vm = this;
    vm.bdata = [];
    vm.settings = {};
    vm.order = 'name';
    vm.assistance = {
      'type': null,
      'project': null
    };
    angular.element(document).ready(function() {
      console.info("I am ready!");
      angular.element(".modal").modal({
        dismissible: false
      });
      angular.element(".datepick").pickadate({
        selectMonths: true,
        selectYears: 5,
        container: 'body',
        format: 'yyyy-mm-dd'
      });
      vm.gettypes();
      vm.getrltypes();
      vm.getProjects();
    });
    vm.changerange = function() {
      var day, dt, month;
      dt = new Date(vm.search.fi);
      dt.setDate(dt.getDate() + 7);
      month = dt.getMonth() + 1;
      day = dt.getDate();
      vm.search.ff = (dt.getFullYear()) + "-" + (month < 10 ? '0' + month : month) + "-" + (day < 10 ? '0' + day : day);
    };
    vm.getrltypes = function() {
      cpFactory.get({
        'lrtypes': true
      }).success(function(response) {
        if (response.status) {
          vm.rltypes = response.ltypes;
        } else {
          Materialize.toast("Error: " + response.raise, 4000);
        }
      });
    };
    vm.getProjects = function() {
      cpFactory.get({
        'projects': true
      }).success(function(response) {
        if (response.status) {
          vm.projects = response.projects;
        } else {
          Materialize.toast("Error: " + response.raise, 4000);
        }
      });
    };
    vm.gettypes = function() {
      cpFactory.get({
        'gtypes': true
      }).success(function(response) {
        if (response.status) {
          vm.ltypes = response.types;
          setTimeout((function() {
            angular.element(".make_select").material_select('update');
          }), 800);
        } else {
          Materialize.toast("Error: " + response.raise, 4000);
        }
      });
    };
    vm.getAssistance = function() {
      var params;
      params = {
        'filterAssistance': true,
        weekstart: vm.search.fi,
        weekend: vm.search.ff,
        type: vm.search.types
      };
      cpFactory.get(params).success(function(response) {
        if (response.status) {
          vm.bdata = response.week;
          vm.dnames = response.names;
          vm.settings.tth = response.thour;
        } else {
          Materialize.toast("Error: " + response.raise);
        }
      });
    };
    vm.getRegisterAssistance = function(dni, day) {
      var params;
      params = {
        'getday': true,
        'day': day,
        'dni': dni
      };
      cpFactory.get(params).success(function(response) {
        if (response.status) {
          vm.hoursload = response.hours;
        } else {
          Materialize.toast("Error: " + response.raise);
        }
      });
    };
    vm.showEdit = function(obj, nob) {
      var dt;
      vm.showlist = obj;
      vm.showlist['nameday'] = nob.nmo;
      dt = obj['days'][nob.nmo]['day'] !== null ? obj['days'][nob.nmo]['day'] : nob.date;
      vm.showlist['date'] = dt;
      vm.getRegisterAssistance(obj.dni, dt);
      angular.element("#medit").modal('open');
    };
    vm.deleteAssistance = function(obj) {
      swal({
        title: "Realmente desea quitar la asistencia?",
        text: "" + obj.fields.assistance,
        confirmButtonText: "Si!, eliminar",
        cancelButtonText: "No!",
        confirmButtonColor: "#dd5b66",
        closeOnConfirm: true,
        closeOnCancel: true
      }, function(isConfirm) {
        var params;
        if (isConfirm) {
          params = {
            deleteAssistance: true,
            pk: obj.pk,
            dni: obj.fields.employee,
            date: obj.fields.assistance
          };
          return cpFactory.post(params).success(function(response) {
            if (response.status) {
              vm.getRegisterAssistance(obj.fields.employee, obj.fields.assistance);
              vm.getAssistance();
            } else {
              Materialize.toast("Error: " + response.raise, 4000);
            }
          });
        }
      });
    };
    vm.openControls = function(obj) {
      if (obj == null) {
        obj = {};
      }
      vm.assistance.date = vm.showlist.date;
      vm.assistance.dni = vm.showlist.dni;
      if (vm.showlist.days[vm.showlist.nameday].day !== null && obj.hasOwnProperty('hin')) {
        console.info("Show object for modify");
        vm.assistance.hin = obj.fields.hourin;
        vm.assistance.hout = obj.fields.hourout;
        vm.assistance.hinb = obj.fields.hourinbreak;
        vm.assistance.houtb = obj.fields.houroutbreak;
        vm.assistance.viatical = parseFloat(obj.fields.viatical);
        vm.assistance.project = obj.fields.project !== null ? obj.fields.project.pk : null;
        vm.assistance.type = obj.fields.types.pk;
        vm.assistance.modifyassistance = true;
        vm.assistance.pkassistance = obj.pk;
      }
      angular.element("#mcontrols").modal("open");
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
      if (!vm.assistance.hasOwnProperty('discount')) {
        vm.assistance.discount = 0;
      }
      prms = vm.assistance;
      prms['saveAssistance'] = true;
      console.info(prms);
      cpFactory.post(prms).success(function(response) {
        if (response.status) {
          vm.getRegisterAssistance(vm.assistance.dni, vm.assistance.date);
          vm.getAssistance();
          Materialize.toast("<i class='fa fa-check fa-lg green-text'></i>&nbsp;Asistencia Registrada!", 2600);
          vm.assistance.dni = '';
          vm.assistance.name = '';
          vm.assistance.hin = '';
          vm.assistance.hout = '';
          angular.element("#mcontrols").modal('close');
        } else {
          Materialize.toast("<i class='fa fa-times fa-lg red-text'></i>&nbsp;Error: " + response.raise, 8000);
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
        vm.assistance.type = 'TY02';
        tp.setAttribute('disabled', 'disabled');
      }
    });
    $scope.$watch('vm.assistance.type', function(nw, old) {
      if (nw === 'TY02' && vm.assistance.project === null) {
        vm.assistance.type = null;
      }
    });
    return;
  };
  'use strict';
  app = angular.module('assApp', ['ngCookies']);
  app.config(function($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
  });
  app.factory('cpFactory', cpFactory);
  cpFactory.inject = ['$http', '$cookies'];
  app.controller('assCtrl', ctrlType);
  ctrlType.inject = ['$scope', 'cpFactory'];
})();
