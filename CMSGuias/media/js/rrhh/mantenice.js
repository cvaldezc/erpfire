(function() {
  var app, cpFactory, ctrl;
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
  ctrl = function($scope, cpFactory) {
    var vm;
    vm = this;
    vm.settings = {};
    angular.element(document).ready(function() {
      vm.getdata();
      console.info("Yes! load data.");
    });
    vm.getdata = function() {
      var prms;
      prms = {
        'getsettings': true
      };
      cpFactory.get(prms).success(function(response) {
        if (response.status) {
          vm.settings = response.settings[0].fields;
        } else {
          console.log("Error: " + response.raise);
        }
      });
    };
    vm.saveSettings = function() {
      var prms;
      prms = vm.settings;
      prms['savesettings'] = true;
      cpFactory.post(prms).success(function(response) {
        if (response.status) {
          location.reload();
        } else {
          Materialize.toast("Error: " + response.raise, 4000);
        }
      });
    };
  };
  'use strict';
  app = angular.module('manApp', ['ngCookies']);
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
