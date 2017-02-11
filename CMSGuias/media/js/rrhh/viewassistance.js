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
    });
    vm.changerange = function() {
      var day, dt, month;
      dt = new Date(vm.search.fi);
      dt.setDate(dt.getDate() + 7);
      month = dt.getMonth() + 1;
      day = dt.getDate();
      vm.search.ff = (dt.getFullYear()) + "-" + (month < 10 ? '0' + month : month) + "-" + (day < 10 ? '0' + day : day);
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
    vm.openControls = function() {
      angular.element("#mcontrols").modal("open");
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
