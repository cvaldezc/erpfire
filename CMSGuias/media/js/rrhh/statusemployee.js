(function() {
  var app, cpFactory, ctrl;
  cpFactory = function($http, $cookies) {
    return {
      get: function(options) {
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
  ctrl = function($scope, cpFactory) {
    var vm;
    vm = this;
    angular.element(document).ready(function() {
      angular.element(".modal").modal();
      vm.loadList();
    });
    vm.addStatus = function() {
      vm.status = {
        'description': '',
        'pk': ''
      };
      angular.element("#mstatus").modal("open");
    };
    vm.loadList = function() {
      Materialize.toast("<i class='fa fa-circle-o-notch fa-spin fa-fw fa-2x'></i>", "infinity", "toast-remove transparent grey-text text-darken-3");
      cpFactory.get({
        'getstatus': true
      }).success(function(response) {
        angular.element(".toast-remove").remove();
        if (response.status) {
          vm.lstatus = response.lstatus;
        } else {
          Materialize.toast("Error: " + response.raise, 4000);
        }
      });
    };
    vm.loadmodify = function(obj) {
      vm.status = {
        'description': obj.fields.description,
        'pk': obj.pk
      };
      angular.element("#mstatus").modal("open");
    };
    vm.saveStatus = function() {
      var params;
      Materialize.toast("<i class='fa fa-cogs fa-fw fa-spin fa-2x'></i> Procesando...", "infinity", "toast-remove");
      params = {
        'description': vm.status.description
      };
      if (vm.status.pk !== '') {
        params['pk'] = vm.status.pk;
      }
      params['savestatus'] = true;
      cpFactory.post(params).success(function(response) {
        angular.element(".toast-remove").remove();
        if (response.status) {
          vm.loadList();
          angular.element("#mstatus").modal("close");
        } else {
          Materialize.toast("Error: " + response.raise, 4000);
        }
      });
    };
    vm.deleteStatus = function(pk) {
      swal({
        title: 'Realmente desea eliminar el Estado?',
        text: '',
        showCancelButton: true,
        confirmButtonColor: "#dd6b55",
        cancelButtonColor: "#616161",
        closeOnConfirm: true,
        closeOnCancel: true
      }, function(isConfirm) {
        var prm;
        if (isConfirm) {
          prm = {
            'pk': pk
          };
          cpFactory.post(prm).success(function(response) {
            if (response.status) {
              vm.loadList();
            } else {
              Materialize.toast("Error: al eliminar. " + response.raise, 4000);
            }
          });
        }
      });
    };
  };
  'use strict';
  app = angular.module('statusapp', ['ngCookies']);
  app.config(function($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
  });
  app.factory('cpFactory', cpFactory);
  cpFactory.inject = ['$http', '$cookies'];
  app.controller('ctrl', ctrl);
  ctrl.inject = ['$scope', 'cpFactory'];
})();
