(function() {
  var app, cpFactory, ctrload;
  cpFactory = function($http, $cookies) {
    $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-urlencoded';
    return {
      get: function(options) {
        return $http.get("", {
          params: options
        });
      },
      post: function(options) {
        var frm;
        frm = function() {
          var form, k, v;
          form = new FormData();
          for (k in options) {
            v = options[k];
            form.append(k, v);
          }
          return form;
        };
        return $http.post("", frm(), {
          transformRequest: angular.identity,
          'headers': {
            'Content-Type': void 0
          }
        });
      }
    };
  };
  ctrload = function($scope, cpFactory) {
    var vm;
    vm = this;
    vm.files = [];
    vm.lock = false;
    vm.btnlock = false;
    vm.loadfiles = function() {
      swal({
        title: 'Realmente desea cargar el/los Tareo(s)?',
        text: '',
        showCancelButton: true,
        confirmButtonColor: "#f44336",
        cancelButtonColor: "#616161",
        confirmButtonText: "Si!",
        closeOnCancel: true,
        closeOnConfirm: true
      }, function(isConfirm) {
        var prm;
        if (isConfirm) {
          vm.lock = true;
          Materialize.toast("<i class='fa fa-circle-o-notch fa-2x fa-spin fa-fw'></i> Cargando archivos", "infinity", "toast-remove");
          prm = {
            'loadfiles': true,
            'files': angular.element("#tareo")[0].files[0]
          };
          cpFactory.post(prm).success(function(response) {
            vm.lock = false;
            angular.element(".toast-remove").remove();
            if (response.status) {
              Materialize.toast("<i class='fa fa-check fa-2x green-text'></i> Los Datos han sido cargados!", 6000);
              vm.log = response;
            } else {
              Materialize.toast("Error: " + response.raise, 4000);
            }
          });
        }
      });
    };
  };
  'use strict';
  app = angular.module('lapp', ['ngCookies']);
  app.config(function($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
  });
  app.directive('availablefile', function() {
    return {
      link: function(scope, element, attrs) {
        element.bind('change', function() {
          if (element.files.length) {
            element.attr('disabled', true);
          } else {
            element.removeAttr('disabled');
          }
        });
      }
    };
  });
  app.factory('cpFactory', cpFactory);
  cpFactory.inject = ['$http', '$cookies'];
  app.controller('ctrload', ctrload);
  ctrload.inject = ['$scope', 'cpFactory'];
})();
