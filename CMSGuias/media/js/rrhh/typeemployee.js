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
    vm.saveType = function() {};
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
