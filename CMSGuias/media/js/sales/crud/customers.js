var getDataRUC;

$(document).ready(function() {
  $("input,select").attr("class", "form-control input-sm");
  $("select[name=pais]").on("change", getDepartamentOption);
  $("select[name=departamento]").on("change", getProvinceOption);
  $("select[name=provincia]").on("change", getDistrictOption);
  $("button.btn-search").on("click", getDataRUC);
  setTimeout(function() {
    return $("input[name=ruccliente_id]").on("keyup change", function(event) {
      if (this.value.length === 11) {
        getDataRUC();
      }
    });
  }, 1500);
  if ($(".alert-success").is(":visible")) {
    setTimeout(function() {
      window.close();
    }, 2600);
  }
});

getDataRUC = function() {
  var data, ruc;
  ruc = $("input[name=ruccliente_id]").val();
  if (ruc.length === 11) {
    data = new Object();
    data.ruc = ruc;
    data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
    $.post("/json/restful/data/ruc/", data, function(response) {
      console.log(response);
      if (response.status) {
        $("input[name=razonsocial]").val(response.reason);
        $("[name=direccion]").val(response.address);
        return $("input[name=telefono]").val(response.phone);
      } else {
        return $().toastmessage("showWarningToast", "No se a encontrado el Proveedor.");
      }
    }, "json");
    return;
  } else {
    $().toastmessage("showWarningToast", "El numero de ruc es invalido!");
  }
};
