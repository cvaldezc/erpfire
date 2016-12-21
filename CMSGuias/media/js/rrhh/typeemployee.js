(function() {
  var app, cpFactory, ctrlType;
  ctrlType = function($scope, cpFactory) {
    var vm;
    vm = this;
    angular.element(document).ready(function() {
      angular.element('.modal').modal({
        dismissible: false
      });
      vm.getTypes();
    });
    vm.getTypes = function() {
      cpFactory.get({
        ltypes: true
      }).success(function(response) {
        if (response.status) {
          vm.ltypes = response.types;
        } else {
          Materialize.toast("No se han encontrado datos " + response.raise, 2600);
        }
      });
    };
    vm.showNew = function() {
      vm.types = {
        desc: '',
        pk: ''
      };
      angular.element("#mtypes").modal('open');
    };
    vm.saveType = function() {
      var prms;
      prms = new Object();
      if (Object.keys(vm.types).indexOf('pk') !== -1) {
        if (vm.types.pk !== void 0 && vm.types.pk !== "") {
          prms['new'] = true;
        }
      }
      if (vm.types.desc === "" || vm.types.desc === void 0) {
        Materialize.toast("<i class=\"fa fa-warning-circle\"></i>\nLa descripción no debe estar vacia!", 4000);
        return false;
      }
      prms['desc'] = vm.types.desc;
      if (!prms.hasOwnProperty('new')) {
        prms['modify'] = true;
      }
      cpFactory.post(prms);
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
  'use strict';
  app = angular.module('appType', ['ngCookies']);
  app.config(function($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
  });
  app.factory('cpFactory', cpFactory);
  cpFactory.inject = ['$http', '$cookies'];
  app.controller('ctrlType', ctrlType);
  ctrlType.inject = ['$scope', 'cpFactory'];
})();
