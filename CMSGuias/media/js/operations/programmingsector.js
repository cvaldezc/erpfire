var app, byte2Hex, hextorbga, rgbtohex;

app = angular.module('programingApp', ['ngCookies']).config(function($httpProvider) {
  $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
});

app.controller('programingCtrl', function($scope, $http, $cookies, $timeout) {
  $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
  $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  $scope.group = {
    rgba: ""
  };
  $scope.perdni = "";
  $scope.area = "";
  $scope.charge = "";
  $scope.dsector = [];
  angular.element(document).ready(function() {
    $('.modal').modal();
    $(".datepicker").pickadate({
      container: 'body',
      format: 'yyyy-mm-dd',
      selectMonths: true,
      selectYears: true
    });
    $scope.lgroup();
    $scope.lareas = [];
    $scope.getDSectorList();
    $(".modal").css("max-height", "80%");
    $scope.perdni = angular.element("#perdni")[0].value;
    $scope.area = angular.element("#area")[0].value;
    $scope.charge = angular.element("#charge")[0].value;
    angular.element(".dropdown-button").dropdown();
    console.log($scope.perdni);
    console.log($scope.area);
    console.log($scope.charge);
  });
  $scope.$watch('group.colour', function(val, old) {
    $scope.group.rgba = hextorbga(val, 0.5);
  });
  $scope.lgroup = function() {
    var data;
    data = {
      'listg': true
    };
    $http.get('', {
      params: data
    }).success(function(response) {
      if (response.status) {
        $scope.sglist = response.sg;
      } else {
        swal("Error!", "No se han obtenido datos. " + response.raise, "error");
      }
    });
  };
  $scope.saveGroup = function() {
    var data;
    $("#mlgroup").modal('close');
    data = $scope.group;
    data.saveg = true;
    $http({
      url: '',
      method: 'post',
      data: $.param(data)
    }).success(function(response) {
      if (response.status) {
        Materialize.toast('Se guardado correctamente', 1800);
        $("#mgroup").modal('close');
        $scope.listGroup();
      } else {
        swal("Error", "no se a guardado los datos. " + response.raise, "error");
      }
    });
  };
  $scope.listGroup = function() {
    var data;
    data = {
      'listg': true
    };
    $http.get('', {
      params: data
    }).success(function(response) {
      if (response.status) {
        $scope.sglist = response.sg;
        if (!$("#mlgroup").is(":visible")) {
          $("#mlgroup").modal('open');
        }
        setTimeout(function() {
          $('.dropdown-button').dropdown();
        }, 600);
      } else {
        swal("Error!", "No se han obtenido datos. " + response.raise, "error");
      }
    });
  };
  $scope.showESG = function() {
    $scope.group = {
      sgroup_id: this.$parent.x.pk,
      name: this.$parent.x.fields.name,
      colour: rgbtohex(this.$parent.x.fields.colour),
      observation: this.$parent.x.fields.observation
    };
    $("#mgroup").modal('open');
  };
  $scope.saveArea = function() {
    var data, form, k, v;
    data = $scope.dsector;
    data.saveds = true;
    form = new FormData();
    for (k in data) {
      v = data[k];
      console.log(k + " " + v);
      form.append(k, v);
    }
    if ($("[name=plane]").get(0).files.length > 0) {
      form.append("plane", $("[name=plane]").get(0).files[0]);
    }
    if ($scope.dsector.pk !== '' && $scope.dsector.pk !== void 0) {
      form.append('dsector_id', $scope.dsector.pk);
    }
    form.append("csrfmiddlewaretoken", $("[name=csrfmiddlewaretoken]").val());
    $.ajax({
      url: '',
      data: form,
      type: 'post',
      dataType: 'json',
      contentType: false,
      cache: false,
      processData: false,
      success: function(response) {
        if (response.status) {
          if ($scope.slist) {
            $scope.getDSectorList();
          } else {
            $(".collection a").each(function(index, value) {
              var $element, pk;
              $element = $(value);
              if ($element.hasClass('active')) {
                console.log($element.attr("data-pk"));
                pk = String($element.attr("data-pk"));
                index = String($element.attr("data-index"));
                $scope.getAreasByGroup(pk, index);
              }
            });
          }
          $("#mdsector").modal('close');
        } else {
          swal("Error!", "No se guardo los datos. " + response.raise, "error");
        }
      }
    });
  };
  $scope.showArea = function() {
    var dsector;
    dsector = this.x;
    console.log(dsector);
    $scope.dsector.name = dsector.fields.name;
    $scope.dsector.datestart = dsector.fields.datestart;
    $scope.dsector.dateend = dsector.fields.dateend;
    $scope.dsector.sgroup = dsector.fields.sgroup.pk;
    $scope.dsector.description = dsector.fields.description;
    $scope.dsector.pk = dsector.pk;
    angular.element("#mdsector").modal('open');
  };
  $scope.datechk = function() {
    var end, start;
    start = $scope.dsector.datestart.split("-");
    end = $scope.dsector.dateend.split("-");
    start = new Date(start[0], start[1], start[2]);
    end = new Date(end[0], end[1], end[2]);
    if (end < start) {
      console.log("fecha de termino menor a la de inicio");
    }
  };
  $scope.getDSectorList = function() {
    var data;
    data = {
      'listds': true
    };
    $http.get('', {
      params: data
    }).success(function(response) {
      if (response.status) {
        $scope.dslist = response.ds;
      } else {
        swal("Error!", "No se han obtenidos datos. " + response.raise, "error");
      }
    });
  };
  $scope.getPrices = function() {
    return $http.get("", {
      params: {
        'valPrices': true
      }
    }).success(function(response) {
      if (response.status) {
        $scope.withoutPrices = response.list;
        console.log($scope.withoutPrices);
        console.log(response.list);
        $("#mwithoutprices").modal('open');
        console.log("Se encontraron materielas sin precio");
        swal({
          title: "Se han encontrado materiales sin precios",
          text: "",
          type: "warning",
          timer: 2600
        });
        return false;
      } else {
        swal({
          title: "Felicidades!",
          text: "No se han encontrado materiales sin precios.",
          type: "success"
        });
        return true;
      }
    });
  };
  $scope.savePricewithout = function($event) {
    var data;
    console.log($event);
    data = {
      savePricewithout: true,
      value: $event.target.value,
      materials: $event.target.dataset.materials,
      field: $event.target.dataset.field
    };
    $http({
      url: '',
      method: 'post',
      data: $.param(data)
    }).success(function(response) {
      if (!response.status) {
        swal("Error", "No se guardo el precio, Intentelo nuevamente.", "warning");
      }
    });
  };
  $scope.approvedAreas = function($event) {
    $scope.getPrices().success(function(response) {
      console.log(response);
      if (!response.status) {
        return swal({
          title: "Aprobar Áreas?",
          text: "desea aprobar realmente todas las áreas.",
          type: "warning",
          showCancelButton: true,
          confirmButtonText: "Si! aprobar",
          confirmButtonColor: "#dd6b55",
          closeOnConfirm: true,
          closeOnCancel: true
        }, function(isConfirm) {
          var data;
          if (isConfirm) {
            $event.currentTarget.disabled = true;
            $event.currentTarget.innerHTML = "<i class=\"fa fa-spinner fa-pulse\"></i> Procesando";
            data = {
              approvedAreas: true
            };
            $http({
              url: '',
              method: 'post',
              data: $.param(data)
            }).success(function(response) {
              if (response.status) {
                data = new Object;
                data.forsb = "logistica@icrperusa.com, contabilidad@icrperusa.com";
                data.issue = "Info. sectorización Aprodado " + (angular.element('#nproject').text());
                data.body = "<p>Se ha aprobado la sectorización del Proyecto <strong>\"" + (angular.element('#nproject').text()) + "\"</strong> para el sector <strong>\"" + (angular.element('#nsector').text()) + "\".</strong><br></p><p>Fecha Registrada: " + (new Date()) + "</p><p>Para:&nbsp;<strong>" + (angular.element('#enterprice').val()) + "</strong></p><p><br data-mce-bogus=\"1\"></p>";
                $.ajax({
                  url: "http://190.41.246.91:3000/mailer/",
                  type: "GET",
                  crossDomain: true,
                  data: $.param(data),
                  dataType: "jsonp",
                  success: function(response) {}
                });
                Materialize.toast("Áreas aprobadas!", 2600);
                console.log(response);
                $timeout(function() {
                  location.reload();
                }, 2600);
              } else {
                $event.currentTarget.innerHTML = "<i class=\"fa fa-times\"></i> Error";
                swal("Error!", "No se a aprobado las áreas.", "error");
              }
            });
          }
        });
      }
    });
  };
  $scope.DiscapprovedAreas = function($event) {
    swal({
      title: "Desaprobar Áreas?",
      text: "desea quitar la aprobación realmente todas las áreas.",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Si! Quitar",
      confirmButtonColor: "#dd6b55",
      closeOnConfirm: true,
      closeOnCancel: true
    }, function(isConfirm) {
      var data;
      if (isConfirm) {
        $event.currentTarget.disabled = true;
        $event.currentTarget.innerHTML = "<i class=\"fa fa-spinner fa-pulse\"></i> Procesando";
        data = {
          DiscapprovedAreas: true
        };
        $http({
          url: '',
          method: 'post',
          data: $.param(data)
        }).success(function(response) {
          if (response.status) {
            Materialize.toast("Áreas Sin aprobación!", 2600);
            console.log(response);
            location.reload();
          } else {
            $event.currentTarget.innerHTML = "<i class=\"fa fa-times\"></i> Error";
            swal("Error!", "No se a quitado la aprobación las áreas.", "error");
          }
        });
      }
    });
  };
  $scope.uploadFile = function($event) {
    swal({
      title: 'Desea procesar el archivo?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dd6b55',
      confirmButtonText: 'Si!',
      cancelButtonText: 'No!',
      closeOnCancel: true,
      closeOnConfirm: true
    }, function(isConfirm) {
      var data;
      if (isConfirm) {
        $event.currentTarget.disabled = true;
        $event.currentTarget.innerHTML = "<i class=\"fa fa-spinner fa-pulse\"></i> Cargando...";
        data = new FormData();
        data.append("uploadFile", true);
        data.append("upload", $("#fileUp")[0].files[0]);
        data.append("csrfmiddlewaretoken", $("[name=csrfmiddlewaretoken]").val());
        console.log(data);
        $.ajax({
          url: "",
          type: "post",
          data: data,
          dataType: "json",
          cache: false,
          contentType: false,
          processData: false,
          success: function(response) {
            console.log(response);
            if (response.status) {
              $event.currentTarget.innerHTML = "<i class=\"fa fa-cog fa-spin\"></i> Procesando";
              data = {
                processData: true,
                filename: response.name
              };
              $http({
                url: '',
                method: 'post',
                data: $.param(data)
              }).success(function(result) {
                if (result.status) {
                  Materialize.toast("Hoja Procesada!");
                  return $timeout((function() {
                    location.reload();
                  }), 1600);
                } else {
                  $event.currentTarget.disabled = false;
                  $event.currentTarget.innerHTML = "<i class=\"fa fa-upload\"></i> Cargar";
                  return Materialize.toast("Error al Procesar!", 2600);
                }
              });
            } else {
              $event.currentTarget.disabled = false;
              $event.currentTarget.innerHTML = "<i class=\"fa fa-upload\"></i> Cargar";
            }
          }
        });
      }
    });
  };
  $scope.delarea = function($event) {
    console.log($event);
    swal({
      title: "Desea eliminar el area?",
      text: "debe de tener en cuenta que se perderan todos los datos relacionados al área",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Si!, eliminar",
      confirmButtonColor: "#dd6b55",
      cancelButtonText: "No",
      closeOnConfirm: true,
      closeOnCancel: true
    }, function(isConfirm) {
      var data;
      if (isConfirm) {
        console.log("area del");
        data = {
          'delarea': true,
          'ds': $event.currentTarget.dataset.dsector
        };
        return $http({
          url: "",
          data: $.param(data),
          method: 'post'
        }).success(function(response) {
          if (response.status) {
            $scope.getDSectorList();
          } else {
            swal("Error!", "Se a producido un error. " + response.raise, "error");
          }
        });
      }
    });
  };
  $scope.delsgroup = function($event) {
    console.log($event);
    swal({
      title: "Desea eliminar el grupo?",
      text: "debe de tener en cuenta que se perderan todos los datos relacionados al grupo",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Si!, eliminar",
      confirmButtonColor: "#dd6b55",
      cancelButtonText: "No",
      closeOnConfirm: true,
      closeOnCancel: true
    }, function(isConfirm) {
      var data;
      if (isConfirm) {
        console.log("sgroup del");
        data = {
          'delsgroup': true,
          'sgroup': $event.currentTarget.dataset.sgroup
        };
        return $http({
          url: "",
          data: $.param(data),
          method: 'post'
        }).success(function(response) {
          if (response.status) {
            $scope.listGroup();
          } else {
            console.log(response.raise + " , query fail");
            swal("Error!", "Se a producido un error. " + response.raise, "error");
          }
        });
      }
    });
  };
  $scope.getAreasByGroup = function(sgroup, index) {
    var data;
    console.info(sgroup);
    data = {
      'getAreasByGroup': true,
      'sgroup': sgroup
    };
    console.error(data);
    $http.get("", {
      params: data
    }).success(function(response) {
      if (response.status) {
        $scope.selected = index;
        $scope.lareas = response.areas;
      } else {
        swal({
          title: "Error al traer los datos del group",
          text: "",
          type: "warning",
          timer: 2600
        });
      }
    });
  };
});

hextorbga = function(hex, alf) {
  var b, g, r;
  if (alf == null) {
    alf = 1;
  }
  if (typeof(hex) == "undefined"){
    hex = ""
  };
  if (hex.charAt(0) === "#") {
    hex = hex.substring(1, 7);
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
    return "rgba(" + r + "," + g + "," + b + "," + alf + ")";
  } else {
    return hex;
  }
};

rgbtohex = function(rgb) {
  var array, b, g, r;
  if (typeof rgb !== "undefined" && rgb.length > 9) {
    array = rgb.split(',');
    r = parseInt(array[0].split('(')[1]);
    g = parseInt(array[1]);
    b = parseInt(array[2]);
    return "#" + (byte2Hex(r)) + (byte2Hex(g)) + (byte2Hex(b));
  } else {
    console.log("nothing rgba");
  }
};

byte2Hex = function(n) {
  var nybHexString;
  nybHexString = "0123456789ABCDEF";
  return String(nybHexString.substr((n >> 4) & 0x0F, 1)) + nybHexString.substr(n & 0x0F, 1);
};
