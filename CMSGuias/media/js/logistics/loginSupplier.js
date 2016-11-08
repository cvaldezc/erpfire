var getDataProveedor, openSupplier, save_or_update_username;

$(document).ready(function() {
  $("select[name=proveedor]").on("click", getDataProveedor);
  $(".btn-default").on("click", openSupplier);
  $(".btn-register-supplier").on("click", save_or_update_username);
});

getDataProveedor = function() {
  var data;
  if (this.value !== "") {
    data = new Object();
    data.ruc = this.value;
    data.exists = true;
    $.getJSON("", data, function(response) {
      console.log(response);
      if (response.exists.status) {
        $("input[name=username]").val(response.exists.username).attr("readonly", "readonly");
      }
      return $("input").attr("disabled", false);
    });
  }
};

openSupplier = function() {
  var interval, url, win;
  url = "/logistics/crud/create/supplier/";
  win = window.open(url, "Popup", "toolbar=no, scrollbars=yes, resizable=no, width=400, height=600");
  interval = window.setInterval(function() {
    if (win === null || win.closed) {
      window.clearInterval(interval);
      location.reload;
    }
  }, 1000);
  return win;
};

save_or_update_username = function() {
  var confirm, data;
  data = new Object();
  data.username = $("input[name=username]").val();
  data.supplier = $.trim($("select[name=proveedor]").val());
  data.password = $.trim($("input[name=passwd]").val());
  confirm = $.trim($("input[name=confirm]").val());
  if (data.supplier !== "") {
    if (data.username !== "") {
      if (data.password === confirm) {
        data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();

        /*hash = CryptoJS.HmacSHA256("", data.password)
        data.password = CryptoJS.enc.Hex.stringify(hash)
         */
        $.post("", data, function(response) {
          if (response.status) {
            $().toastmessage("showNoticeToast", "Se a registrado correctamente al proveedor.");
            setTimeout(function() {
              return location.reload();
            }, 2600);
          } else {
            return $().toastmessage("showWarningToast", "Transaction Error: " + response.raise);
          }
        });
      } else {
        $().toastmessage("showWarningToast", "la contraseña es inconrrecta.");
      }
    } else {
      $().toastmessage("showWarningToast", "Ingrese un usuario.");
    }
  } else {
    $().toastmessage("showWarningToast", "Seleccione un <q>Proveedor</q>.");
  }
};
