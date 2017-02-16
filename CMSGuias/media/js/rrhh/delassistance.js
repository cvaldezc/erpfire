(function() {
  var app, cpFactory, delctrl;
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
  delctrl = function($scope, cpFactory) {
    var vm;
    vm = this;
    vm["delete"] = {};
    angular.element(document).ready(function() {
      angular.element(".datepicka").pickadate({
        selectMonths: true,
        selectYears: 15,
        container: 'body',
        format: 'yyyy-mm-dd'
      });
      angular.element(".make_select").material_select();
      vm.main();
    });
    vm.main = function() {
      console.info('main delctrl...');
    };
    vm.deleteAssistance = function() {
      swal({
        title: "Realamente Desea eliminar los datos registrados en el rango ingresado",
        text: '',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Si, eliminar!",
        cancelButtonText: "No",
        closeOnConfirm: true,
        closeOnCancel: true
      }, function(isConfirm) {
        var param;
        if (isConfirm) {
          Materialize.toast('<i class="fa fa-circle-o-notch fa-spin fa-fw fa-2x"></i>&nbsp;Procesando...', 'infinity', 'removetoast');
          param = vm["delete"];
          param['deleteAssistance'] = true;
          return cpFactory.post(param).success(function(response) {
            angular.element('.removetoast').remove();
            if (response.status) {
              Materialize.toast('<i class="fa fa-check fa-2x green-text"></i>&nbsp;Se elimino', 1200);
              return setTimeout((function() {
                location.reload();
              }), 1200);
            } else {
              Materialize.toast("Error: " + response.raise, 4000);
            }
          });
        }
      });
    };
  };
  'use strict';
  app = angular.module('delApp', ['ngCookies']);
  app.config(function($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
  });
  app.factory('cpFactory', cpFactory);
  cpFactory.inject = ['$http', '$cookies'];
  app.controller('delctrl', delctrl);
  delctrl.inject = ['$scope', 'cpFactory'];
})();
