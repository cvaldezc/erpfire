var annularQuote, changeradio, init, searchquote, sendMessages, showMessage, viewReport;

$(document).ready(function() {
  $("[name=dates],[name=datee]").datepicker({
    "changeMonth": true,
    "changeYear": true,
    "showAnim": "slide",
    "dateFormat": "yy-mm-dd"
  });
  $("[name=search]").on("change", changeradio);
  $(".btn-search").on("click", searchquote);
  $(".btn-view").on("click", viewReport);
  $(".btn-show-send").on("click", showMessage);
  $(".btn-send").on("click", sendMessages);
  $(".btn-del").on("click", annularQuote);
  init();
});

init = function() {
  tinymce.init({
    selector: "textarea[name=text]",
    height: 200,
    theme: "modern",
    menubar: false,
    statusbar: false,
    plugins: "link contextmenu",
    font_size_style_values: "10px,12px,13px,14px,16px,18px,20px",
    toolbar: "undo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | fontsizeselect"
  });
};

changeradio = function(event) {
  event.preventDefault();
  $(this).each(function() {
    if (this.checked) {
      if (this.value === "code") {
        $("[name=code]").attr("disabled", false);
        $("[name=dates],[name=datee]").attr("disabled", true);
      } else if (this.value === "dates") {
        $("[name=dates],[name=datee]").attr("disabled", false);
        $("[name=code]").attr("disabled", true);
      }
    }
  });
};

searchquote = function(event) {
  var data, pass;
  event.preventDefault();
  data = {};
  pass = false;
  $("[name=search]").each(function() {
    if (this.checked) {
      if (this.value === "code") {
        if ($("[name=code]").val() === "") {
          $("[name=code]").focus();
          $().toastmessage("showWarningToast", "Campo vacio, este campo no puede estar vacio.");
        } else {
          pass = true;
          data = {
            "by": "code",
            "code": $("[name=code]").val()
          };
        }
      } else if (this.value === "dates") {
        $("[name=dates],[name=datee]").each(function() {
          if (this.name === "datee") {
            data.datee = this.value;
            return true;
          }
          if (this.value === "") {
            this.focus();
            $().toastmessage("showWarningToast", "Campo vacio, este campo no puede estar vacio.");
            return false;
          } else {
            pass = true;
            data = {
              "by": "dates",
              "dates": this.value
            };
          }
        });
      }
    }
  });
  if (pass) {
    $.getJSON('', data, function(response) {
      var $tb, k, template;
      if (response.status) {
        template = "<tr>\n<td>{{ item }}</td>\n<td>{{ cotizacion_id }}</td>\n<td>{{ proveedor_id }}</td>\n<td>{{ razonsocial }}</td>\n<td>{{ keygen }}</td>\n<td>{{ traslado }}</td>\n<td>\n    <button class=\"btn btn-xs btn-link text-blue\"><span class=\"glyphicon glyphicon-eye-open\"></span></button>\n</td>\n<td>\n    <button class=\"btn btn-xs btn-link text-green\"><span class=\"glyphicon glyphicon-envelope\"></span></button>\n</td>\n<td>\n    <button class=\"btn btn-xs btn-link text-red\"><span class=\"glyphicon glyphicon-fire\"></span></button>\n</td>\n</tr>";
        $tb = $("table > tbody");
        $tb.empty();
        for (k in response.list) {
          response.list[k].item = parseInt(k) + 1;
          $tb.append(Mustache.render(template, response.list[k]));
        }
      }
    });
  }
};

viewReport = function(event) {
  var pass, quote, supplier, url;
  quote = this.value;
  supplier = $(this).attr("data-sup");
  pass = false;
  if (quote === "") {
    $().toastmessage("showWarningToast", "no se puede mostrar el report: fatal id quote.");
    return false;
  } else {
    pass = true;
  }
  if (supplier === "") {
    $().toastmessage("showWarningToast", "no se puede mostrar el report: fatal id supplier.");
    return false;
  } else {
    true;
  }
  if (pass) {
    url = "/reports/quote/" + quote + "/" + supplier;
    window.open(url, "_blank");
  }
};

showMessage = function(event) {
  var key, mail, name, quote, text;
  event.preventDefault();
  quote = $(this).val();
  name = $(this).attr("data-name");
  key = $(this).attr("data-key");
  mail = $(this).attr("data-mail");
  if (quote !== "" && name !== "" && key !== "") {
    text = "<p>Estimados Sres. " + name + ":</p> <p>Le enviamos la url con el cual prodrán acceder a nuestra cotización.</p> <p>Tambien le proporcionamos una clave para poder mostrar la cotización, el número de <strong>cotización</strong> y la <strong>clave</strong> son:</p> <p><strong>Nro Cotización:</strong> " + quote + "</p> <p><strong>AutoKey : </strong> " + key + "</p> <p>Uds. puedén acceder directamente a nuestro sitio web desde estos enlaces:</p> <ul><li>Presione <a href=\"http://190.41.246.91/proveedor/\" data-mce-href=\"http://190.41.246.91/proveedor/\" target=\"_blank\" title=\"ICR PERU SA\">aquí</a> para ir al sitio web.<br></li><li><a title=\"ICR PERU SA\" href=\"http://190.41.246.91/proveedor/\" target=\"_blank\" data-mce-href=\"http://190.41.246.91/proveedor/\">http://190.41.246.91/proveedor/</a></li></ul> <p><br data-mce-bogus=\"1\"></p> <p>Saludos.</p> <p><br data-mce-bogus=\"1\"></p> <p><strong>Dpto. Logística ICR PERU S.A.</strong></p> <p><strong><br data-mce-bogus=\"1\"></strong></p> <p>---------------------------------<strong style=\"color: rgb(34, 34, 34); font-family: arial, sans-serif; font-size: 13px;\" data-mce-style=\"color: rgb(34, 34, 34); font-family: arial, sans-serif; font-size: 13px;\"><br></strong><strong style=\"color: rgb(34, 34, 34); font-family: arial, sans-serif; font-size: 13px;\" data-mce-style=\"color: rgb(34, 34, 34); font-family: arial, sans-serif; font-size: 13px;\">Patricia Barbaran ✔<br>Dpto. Logística.</strong><br style=\"color: rgb(34, 34, 34); font-family: arial, sans-serif; font-size: 13px;\" data-mce-style=\"color: rgb(34, 34, 34); font-family: arial, sans-serif; font-size: 13px;\"><span style=\"color: rgb(34, 34, 34); font-family: arial, sans-serif; font-size: 13px;\" data-mce-style=\"color: rgb(34, 34, 34); font-family: arial, sans-serif; font-size: 13px;\">Telef.: 371-0443</span><br style=\"color: rgb(34, 34, 34); font-family: arial, sans-serif; font-size: 13px;\" data-mce-style=\"color: rgb(34, 34, 34); font-family: arial, sans-serif; font-size: 13px;\"><span style=\"color: rgb(34, 34, 34); font-family: arial, sans-serif; font-size: 13px;\" data-mce-style=\"color: rgb(34, 34, 34); font-family: arial, sans-serif; font-size: 13px;\">Nextel: 121 * 7860</span><strong><br data-mce-bogus=\"1\"></strong></p>";
    $("#text_ifr").contents().find("body").html(text);
    $("input[name=for]").val(mail);
    $("input[name=issue]").val("COTIZACIÓN " + quote);
    $(".mmail").modal("show");
  } else {
    $().toastmessage("showWarningToast", "Fail: Not show message, field empty.");
  }
};

sendMessages = function() {
  var $for, data, parameter, url, windowmsg;
  $for = $("input[name=for]");
  if ($for.val() !== "") {
    data = {};
    data.texto = $("#text_ifr").contents().find("body").html();
    data.para = $("input[name=for]").val();
    data.asunto = $("input[name=issue]").val();
    parameter = $.param(data);
    url = "http://190.41.246.91:3000/?" + parameter;
    windowmsg = window.open(url, "Send Msg", "toolbar=no, scrollbars=no, resizable=no, width=100, height=100");
    $(".mmail").modal("hide");
    return setTimeout(function() {
      windowmsg.close();
    }, 8000);
  }
};

annularQuote = function(event) {
  var quote, supplier;
  quote = this.value;
  supplier = $(this).attr("data-sup");
  if (quote !== "") {
    $().toastmessage("showToast", {
      "sticky": true,
      "text": "Desea anular la solicitud de Cotización " + quote + " para el proveedor " + supplier + "?",
      "type": "confirm",
      "buttons": [
        {
          "value": "No"
        }, {
          "value": "Si"
        }
      ],
      "success": function(result) {
        if (result === "Si") {
          $.post("", {
            "quote": quote,
            "supplier": supplier,
            "csrfmiddlewaretoken": $("input[name=csrfmiddlewaretoken]").val()
          }, function(response) {
            if (response.status) {
              $("#" + quote + supplier).remove();
            }
          }, "json");
        }
      }
    });
  } else {
    $().toastmessage("showWarningToast", "No se a encontrado el nro de cotización.");
  }
};
