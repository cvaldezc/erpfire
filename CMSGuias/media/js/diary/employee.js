var app;

app = angular.module('EmpApp', ['ngCookies', 'ngSanitize']).config(function($httpProvider) {
  $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
});

app.controller("empCtrl", function($scope, $http, $cookies) {
  $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
  $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  angular.element(document).ready(function() {
    console.log("ready");
    $('.datepicker').pickadate({
      container: 'body',
      format: 'yyyy-mm-dd'
    });
    $('.modal').modal();
    $(".modal.bottom-sheet").css("max-height", "60%");
    $scope.listEmployee();
    $scope.listCharge();
  });
  $scope.data = {};
  $scope.predicate = 'fields.firstname';
  $scope.listEmployee = function() {
    $http.get('', {
      params: {
        'list': true
      }
    }).success(function(response) {
      console.log(response);
      if (response.status) {
        $scope.list = response.employee;
      } else {
        swal("Alerta!", "No se han encontrado datos.", "warning");
      }
    });
  };
  $scope.listCharge = function() {
    $http.get('/charge/', {
      params: {
        charge: true
      }
    }).success(function(response) {
      if (response.status) {
        $scope.charge = response.charge;
      } else {
        swal('Alerta!', 'No se han encontrado datos', 'warning');
      }
    });
  };
  $scope.saveEmployee = function() {
    var params;
    console.log($scope.employee);
    if (typeof $scope.employee.empdni_id === "undefined") {
      return false;
    }
    params = $scope.employee;
    params.charge = $("[name=charge]").val();
    params.save = true;
    $http({
      url: '',
      method: 'post',
      data: $.param(params)
    }).success(function(response) {
      if (response.status) {
        swal('Felicidades!', 'Se guardo correctamente los datos.', 'success');
        $scope.listEmployee();
        $("#madd").modal('close');
      } else {
        swal('Error', 'error al guardar los cambios.', 'error');
      }
    });
  };
  $scope.edit = function() {
    var em;
    em = this;
    $scope.employee = {
      empdni_id: em.x.pk,
      firstname: em.x.fields.firstname,
      lastname: em.x.fields.lastname,
      birth: em.x.fields.birth,
      email: em.x.fields.email,
      address: em.x.fields.address,
      phone: em.x.fields.phone,
      phonejob: em.x.fields.phonejob,
      fixed: em.x.fields.fixed,
      charge: em.x.fields.charge.pk
    };
    $("#madd").modal('open');
  };
  $scope.showDetails = function() {
    $scope.employee = {
      empdni_id: this.x.pk,
      firstname: this.x.fields.firstname,
      lastname: this.x.fields.lastname,
      birth: this.x.fields.birth,
      email: this.x.fields.email,
      charge: this.x.fields.charge.fields.cargos,
      address: this.x.fields.address,
      phone: this.x.fields.phone,
      phonejob: this.x.fields.phonejob,
      fixed: this.x.fields.fixed
    };
    return $("#mdetails").modal('open');
  };
  $scope.showDelete = function() {
    $scope.employee = {
      empdni_id: this.x.pk,
      firstname: this.x.fields.firstname,
      lastname: this.x.fields.lastname,
      email: this.x.fields.email
    };
    console.log($scope.employee, "here ");
    return $("#delemp").modal('open');
  };
  $scope.employeeDown = function() {
    var params;
    params = $scope.employee;
    params.delemp = true;
    console.log(params);
    $http({
      url: '',
      data: $.param(params),
      method: 'post'
    }).success(function(response) {
      if (response.status) {
        $scope.employee.observation = '';
        $scope.listEmployee();
        $("#delemp").modal('close');
      } else {
        swal('Error!', 'No se a podido realizar la transacción con existo!', 'error');
      }
    });
  };
});
