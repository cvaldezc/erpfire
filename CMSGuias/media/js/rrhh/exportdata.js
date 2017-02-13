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
    angular.element(document).ready(function() {
      angular.element(".datepick").pickadate({
        selectMonths: true,
        selectYears: 5,
        container: 'body',
        format: 'yyyy-mm-dd'
      });
      vm.getTypes();
      vm.getPayment();
    });
    vm.getTypes = function() {
      cpFactory.get({
        gettypes: true
      }).success(function(response) {
        if (response.status) {
          vm.types = response.types;
          setTimeout((function() {
            angular.element(".make_select").material_select('destroy');
            angular.element(".make_select").material_select();
          }), 800);
        } else {
          Materialize.toast("Error: " + response.raise, 4000);
        }
      });
    };
    vm.getPayment = function() {
      cpFactory.get({
        getpayment: true
      }).success(function(response) {
        if (response.status) {
          vm.payment = response.payment;
        } else {
          Materialize.toast("Error: " + response.raise, 4000);
        }
      });
    };
    vm.changeSelected = function() {
      var day, dt, month;
      if (vm.assistance.payment === null) {
        Materialize.toast("Seleccione Tipo de Pago", 4000);
        return false;
      }
      dt = new Date(vm.assistance.din);
      dt.setDate(dt.getDate() + vm.assistance.payment);
      month = dt.getMonth() + 1;
      day = dt.getDate();
      vm.assistance.dout = (dt.getFullYear()) + "-" + (month < 10 ? '0' + month : month) + "-" + (day < 10 ? '0' + day : day);
    };
    vm.saveExportData = function(type) {
      var params;
      params = vm.assistance;
      params[type] = type;
      params['exportdata'] = true;
      window.open(location.href + "?" + (angular.element.param(params)), "_blank");
    };
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
