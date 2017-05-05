// Generated by CoffeeScript 1.12.5
(function() {
  var app;

  app = angular.module('rioApp', ['ngCookies']);

  app.config(function($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
  });

  app.directive('minandmax', function($parse) {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: '@',
      link: function(scope, element, attrs, ctrl) {
        element.bind('change', function(event) {
          if (parseFloat(attrs.$$element[0].value) < parseFloat(attrs.min) || parseFloat(attrs.$$element[0].value) > parseFloat(attrs.max)) {
            Materialize.toast('El valor no es valido!', 4000);
            scope.valid = false;
            ctrl.$setViewValue(parseFloat(attrs.max));
            ctrl.$render();
            scope.$apply();
            console.log(scope);
          } else {
            scope.valid = true;
          }
        });
      }
    };
  });

  app.directive('status', function($parse) {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        scope.$watch(function() {
          return ngModel.$modelValue;
        }, function(newValue) {
          var el;
          el = document.getElementsByName("" + attrs.id);
          if (newValue === true) {
            angular.forEach(el, function(val) {
              return val.value = val.attributes.max.value;
            });
            console.log("change data");
          } else {
            angular.forEach(el, function(val) {
              val.value = 0;
            });
          }
          return console.log(newValue);
        });
      }
    };
  });

  app.directive('tmandm', function($parse) {
    return {
      link: function(scope, element, attrs, ngModel) {
        element.bind('change, click', function(event) {
          var max, min, val;
          console.log(element);
          val = parseFloat(element.context.value);
          max = parseFloat(attrs.max);
          min = parseFloat(attrs.min);
          if (val > max) {
            element.context.value = max;
            return;
          }
          if (val < min) {
            element.context.value = min;
          }
        });
      }
    };
  });

  app.factory('rioF', function($http, $cookies) {
    var convertForm, obj;
    obj = new Object;
    convertForm = function(options) {
      var form;
      if (options == null) {
        options = {};
      }
      form = new FormData;
      angular.forEach(options, function(val, key) {
        form.append(key, val);
      });
      return form;
    };
    obj.getDetails = function(options) {
      if (options == null) {
        options = {};
      }
      return $http.get("", {
        params: options
      });
    };
    obj.returnList = function(options) {
      if (options == null) {
        options = {};
      }
      return $http.post("", convertForm(options), {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': void 0
        }
      });
    };
    obj.getNiples = function(options) {
      if (options == null) {
        options = {};
      }
      return $http.get('', {
        params: options
      });
    };
    return obj;
  });

  app.controller('rioC', function($scope, $q, rioF) {
    $scope.materials = [];
    $scope.tniples = [];
    $scope.valid = true;
    $scope.showNipple = false;
    $scope.vnip = false;
    $scope.np = [];
    $scope.dnp = [];
    $scope.types = {};
    $scope.ismodify = false;
    angular.element(document).ready(function() {
      angular.element('.modal').modal({
        dismissible: false
      });
      $scope.getDetails();
    });
    $scope.checkall = function() {
      var k, ref, v;
      ref = $scope.materials;
      for (k in ref) {
        v = ref[k];
        v.status = $scope.selAll.chk;
      }
    };
    $scope.checkTNiple = function() {
      var i, len, ref, x;
      ref = $scope.tniples.niples;
      for (i = 0, len = ref.length; i < len; i++) {
        x = ref[i];
        x.status = $scope.stnip;
      }
    };
    $scope.showNiple = function($index) {
      if ($scope.materials[$index].nstatus) {
        $scope.tniples = $scope.materials[$index];
        angular.element("#mniple").modal("open");
      }
    };
    $scope.getDetails = function() {
      var prm;
      prm = {
        'getorder': true
      };
      rioF.getDetails(prm).success(function(response) {
        if (response.status) {
          $scope.details = response.details;
          $scope.types = response.nametypes;
          $scope.ismodify = Boolean(response.ismodify);
        } else {
          swal("Error", "" + response.raise, "error");
        }
      });
    };
    $scope.returnItems = function() {
      var validQ;
      validQ = function() {
        var counter, defer, k, ref, x, zeros;
        defer = $q.defer();
        counter = 0;
        zeros = 0;
        ref = $scope.materials;
        for (k in ref) {
          x = ref[k];
          if (x.status) {
            counter++;
            if (x.qreturn > 0) {
              zeros++;
            }
          }
        }
        defer.resolve(counter + "," + zeros);
        return defer.promise;
      };
      validQ().then(function(response) {
        var arrays;
        arrays = response.split(',');
        if (arrays[0] === arrays[1] && arrays[0] !== "0") {
          angular.element("#mview").modal('open');
        } else {
          Materialize.toast("Debe seleccionar y/o ingresar cantidades mayor a 0.", 2600);
        }
      });
    };
    $scope.getNipples = function() {
      var getamount;
      if (Object.keys($scope.tniples).length) {
        getamount = function() {
          var amount, defer, i, len, ntmp, ref, x;
          defer = $q.defer();
          amount = 0;
          ref = $scope.tniples.niples;
          for (i = 0, len = ref.length; i < len; i++) {
            x = ref[i];
            if (x.status) {
              ntmp = 0;
              ntmp = x.qorder * x.fields.metrado;
              amount += (Math.round((ntmp / 100) * 100)) / 100;
            }
          }
          defer.resolve(amount);
          return defer.promise;
        };
        getamount().then(function(response) {
          $scope.materials[$scope.tniples.index].qreturn = response;
          $scope.materials[$scope.tniples.index].niples = $scope.tniples.niples;
          $scope.tniples = {};
          $scope.stnip = false;
        });
      }
    };
    $scope.removeSelected = function($index) {
      var validselected;
      $scope.materials[$index].status = false;
      validselected = function() {
        var count, defer, k, ref, x;
        defer = $q.defer();
        count = 0;
        ref = $scope.materials;
        for (k in ref) {
          x = ref[k];
          if (x.status) {
            count++;
          }
        }
        defer.resolve(count);
        return defer.promise;
      };
      validselected().then(function(response) {
        if (response <= 0) {
          angular.element("#mview").modal('close');
        }
      });
    };
    $scope.sendReturnList = function() {
      swal({
        title: "Esta seguro de Regresar los materiales?",
        text: "Ingrese el movito por se que retorna los materiales.",
        type: "input",
        showCancelButton: true,
        cancelButtonText: 'No!',
        confirmButtonColor: '#e82a37',
        confirmButtonText: 'Si!, Retornar',
        showLoaderOnConfirm: true,
        closeOnConfirm: true,
        closeOnCancel: true,
        animation: "slide-from-top",
        inputPlaceholder: "Observación"
      }, function(inputValue) {
        var valid;
        if (inputValue === false) {
          return false;
        }
        if (inputValue === "") {
          swal.showInputError("Nesecitas ingresar una Observación.");
          return false;
        }
        if (inputValue !== "") {
          Materialize.toast("<i class='fa fa-cog fa-spin fa-2x'></i>&nbsp;Procesando, espere!", "undefine", "toast-remove");
          $scope.ismodify = true;
          valid = function() {
            var defer, k, params, ref, x;
            defer = $q.defer();
            params = [];
            ref = $scope.materials;
            for (k in ref) {
              x = ref[k];
              if (x.status && x.qreturn > 0) {
                params.push(x);
              }
            }
            defer.resolve(params);
            return defer.promise;
          };
          valid().then(function(params) {
            var prm;
            if (params.length) {
              prm = {
                'details': JSON.stringify(params),
                'saveReturn': true,
                'observation': inputValue
              };
              rioF.returnList(prm).success(function(response) {
                $scope.ismodify = false;
                if (response.status) {
                  angular.element(".toast-remove").remove();
                  Materialize.toast("<i class='fa fa-check fa-2x'></i>&nbsp;Materiales devueltos!.", 2800);
                  setTimeout(function() {
                    location.reload();
                  }, 2800);
                } else {
                  Materialize.toast("Se recomienda que actualizar la pagina ( F5 ).", 3600);
                  swal("Error!", "" + response.raise, "error");
                }
              });
            }
          });
        } else {
          swal.showInputError("Nesecitas ingresar una Observación.");
          $scope.sendReturnList();
          return false;
        }
      });
    };
  });

}).call(this);
