(function() {
  var app, ctrl, factory;
  app = angular.module('soApp', ['ngCookies']);
  app.config(function($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.xrsfCookieName = 'csrftoken';
    $httpProvider.defaults.xrsfHeaderName = 'X-CSRFToken';
  });
  factory = function($rootScope, $log, $http, $cookies) {
    var obj;
    obj = new Object;
    obj.get = function(options) {
      if (options == null) {
        options = {};
      }
      return $http.get("", {
        params: options
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
  };
  app.controller('soCtrl', ctrl);
})();
