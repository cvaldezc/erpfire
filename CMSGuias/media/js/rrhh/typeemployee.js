(function() {
  var app, cpFactory, ctrlType;
  ctrlType = function($scope, cpFactory) {
    var vm;
    vm = this;
    vm.processsave = false;
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
          setTimeout((function() {
            var drop;
            drop = angular.element('.dropdown-activates');
            angular.forEach(drop, function(elem, index) {
              elem.setAttribute('data-activates', "dropdown" + index);
            });
            drop.dropdown({
              constrain_width: false
            });
          }), 800);
        } else {
          Materialize.toast("No se han encontrado datos " + response.raise, 2600);
        }
      });
    };
    vm.showNew = function() {
      vm.types = {
        desc: '',
        starthour: '',
        pk: ''
      };
      angular.element("#mtypes").modal('open');
    };
    vm.showModify = function(obj) {
      vm.types = {
        desc: obj.fields.description,
        pk: obj.pk,
        starthour: obj.fields.starthour
      };
      angular.element("#mtypes").modal('open');
    };
    vm.saveType = function() {
      var prms;
      prms = new Object();
      if (Object.keys(vm.types).indexOf('pk') !== -1) {
        if (vm.types.pk === "") {
          prms['new'] = true;
        }
      }
      if (vm.types.desc === "" || vm.types.desc === void 0) {
        Materialize.toast("<i class=\"\nfa fa-exclamation-circle fa-2x amber-text\"></i>\n\ La descripción no debe estar vacia!", 4000);
        return false;
      }
      prms['desc'] = vm.types.desc;
      prms['starthour'] = vm.types.starthour;
      if (!prms.hasOwnProperty('new')) {
        prms['modify'] = true;
        prms['pk'] = vm.types.pk;
      }
      vm.processsave = true;
      cpFactory.post(prms).success(function(response) {
        vm.processsave = false;
        if (response.status) {
          vm.getTypes();
          angular.element("#mtypes").modal('close');
        } else {
          Materialize.toast("Error: " + response.raise, 4000);
        }
      });
    };
    vm.deleteType = function(obj) {
      swal({
        title: "Realmente desea eliminar?",
        text: obj.pk + " " + obj.fields.description,
        showCancelButton: true,
        confirmButtonColor: "#dd6d55",
        confirmButtonText: "Si!, eliminar",
        cancelButtonText: "No",
        closeOnConfirm: true,
        closeOnCancel: true
      }, function(isConfirm) {
        var prms;
        if (isConfirm) {
          prms = obj;
          prms['delete'] = true;
          cpFactory.post(prms).success(function(response) {
            if (response.status) {
              vm.getTypes();
            } else {
              Materialize.toast("Error: " + response.raise, 4000);
            }
          });
        }
      });
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
