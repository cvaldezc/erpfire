$(document).ready(function() {
  $('select').material_select();
  $('.modal').modal();

$(document).on("click", ".btnactivemple", activeemple);
$("input[name=txtbuscar]").on("keyup", buscarempleado);
});


activeemple = function(){
  var btn;
  btn = this;
  swal({
    title: "Activar Empleado?",
    text: "Desea Activar al emleado?",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dd6b55",
    confirmButtonText: "Si, Cambiar!",
    cancelButtonText: "No, Cancelar",
    closeOnConfirm: true,
    closeOnCancel: true
  }, function(isConfirm) {
    var data;
    if (isConfirm) {
      data = new Object;
      data.activaremple = true;
      data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
      data.dni = btn.value;
      $.post("/rrhh/empleado/segsocial/", data, function(response) {
        if (response.status) {
          Materialize.toast('Activacion del Empleado Correcto', 2000, 'rounded');
          location.reload();
        } else {
          swal("Error", "Error de activacion", "warning");
        }
      });
    }
  });
}

buscarempleado = function(event) {
  var input,filter,table, tr, td, i;
  input = document.getElementById("txtbuscar");
  filter = input.value.toUpperCase();
  table = document.getElementById("templeados");
  tr = table.getElementsByTagName("tr");

  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    td2= tr[i].getElementsByTagName("td")[2];
    td3= tr[i].getElementsByTagName("td")[3];
    if (td || td2) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1 || 
          td2.innerHTML.toUpperCase().indexOf(filter) > -1 ||
          td3.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = ""; 
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}