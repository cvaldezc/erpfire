(function() {
  var app, ctrl, factory;
  app = angular.module('soApp', ['ngCookies']);
  app.config(function($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
  });
  factory = function($rootScope, $log, $http, $cookies) {
    var fd, obj;
    $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    obj = new Object();
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
    obj.get = function(options) {
      if (options == null) {
        options = {};
      }
      return $http.get("", {
        params: options
      });
    };
    obj.post = function(options) {
      if (options == null) {
        options = {};
      }
      return $http.post("", fd(options), {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': void 0
        }
      });
    };
    return obj;
  };
  app.factory('soFactory', factory);
  factory.$inject = ['$rootScope', '$log', '$http', '$cookies'];
  ctrl = function($rootScope, $scope, $log, soFactory) {
    $scope.status = [];
    $scope.sel = "PE";
    angular.element(document).ready(function() {
      $log.info('main app...');
      $scope.gstatus();
      $scope.listall();
      angular.element('select').material_select();
    });
    $scope.listall = function() {
      var params;
      params = {
        'getall': true,
        'sel': $scope.sel
      };
      soFactory.get(params).success(function(response) {
        if (response.status) {
          $scope.list = response.data;
        } else {
          Materialize.toast(response.raise + " ", 3000);
        }
      });
    };
    $scope.gstatus = function() {
      var params;
      params = {
        'gstatus': true
      };
      soFactory.get(params).success(function(response) {
        if (response.status) {
          $scope.status = response.sts;
          setTimeout((function() {
            angular.element('select').material_select('update');
          }), 600);
        } else {
          Materialize.toast(response.raise + " ", 3000);
        }
      });
    };
    $scope.listStatus = function() {
      var params;
      $scope.list = [];
      params = {
        'sel': $scope.sel,
        'bystatus': true
      };
      soFactory.get(params).success(function(response) {
        if (response.status) {
          return $scope.list = response.data;
        } else {
          Materialize.toast(response.raise + " ", 3000);
        }
      });
    };
    $scope.annularSo = function(os) {
      swal({
        title: "Realmente desea Anular la Orden de Servicio " + os,
        text: "",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: 'Si! anular.',
        confirmButtonColor: '#fb3c4a',
        closeOnConfirm: true,
        closeOnCancel: true
      }, function(isConfirm) {
        var params;
        if (isConfirm) {
          params = {
            'annular': true,
            'os': os
          };
          soFactory.post(params).success(function(response) {
            if (response.status) {
              location.reload();
            } else {
              Materialize.toast("" + response.raise, 3000);
            }
          });
          return console.log(isConfirm);
        }
      });
    };
  };
  app.controller('soCtrl', ctrl);
})();
