var showAuthenticateKeys, showQuotation;

$(document).ready(function() {
  $(".btn-show-key").on("click", showAuthenticateKeys);
  $(".btn-valid-key").on("click", showQuotation);
});

showAuthenticateKeys = function() {
  $("[name=ruc]").val(this.getAttribute("data-ruc"));
  $("[name=quote]").val(this.getAttribute("data-quote"));
  $(".mkey").modal("toggle");
};

showQuotation = function() {
  var data;
  data = new Object();
  data.ruc = $("[name=ruc]").val();
  data.quote = $("[name=quote]").val();
  data.key = $("[name=keys]").val();
  if (data.ruc !== "" && data.quote !== "" && data.key !== "") {
    if (data.key.length === 11) {
      data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
      $.post("", data, function(response) {
        console.log(response);
        if (response.status) {
          return location.href = "/proveedor/quote/details/" + response.quote + "/" + response.supplier + "/";
        } else {
          return $().toastmessage("showErrorToast", "El key ingresado es incorrecto.");
        }
      }, "json");
    } else {
      $().toastmessage("showWarningToast", "El key no tiene el formato correcto.");
    }
  } else {
    $().toastmessage("showWarningToast", "Existe un campo vacio.");
  }
};
