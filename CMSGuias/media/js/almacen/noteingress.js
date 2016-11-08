var anullarIngress, backtofirst, changeSearch, editIngress, getEditDetails, search;

$(document).ready(function() {
  $("input[name=sdate], input[name=edate]").datepicker({
    "showAnim": "slide",
    "dateFormat": "dd-mm-yy"
  });
  $(".panel-second").hide();
  $("button.search").on("click", search);
  $(".editingress").on("click", editIngress);
  $("input[name=opsearch]").on("change", changeSearch);
  $("button.backtofirst").on("click", backtofirst);
  $(document).on("click", ".dropedit", getEditDetails);
  $(document).on("click", ".dropanular", anullarIngress);
});

changeSearch = function(event) {
  $(this).each(function() {
    if (this.checked) {
      if (this.value === "nro") {
        $("input[name=number]").attr("disabled", false);
        $("[name=status]").val('').attr("disabled", true);
        $("[name=sdate], [name=edate]").val('').attr("disabled", true);
      }
      if (this.value === "status") {
        $("[name=status]").attr("disabled", false);
        $("[name=number]").val('').attr("disabled", true);
        $("[name=sdate], [name=edate]").val('').attr("disabled", true);
      }
      if (this.value === "date") {
        $("[name=sdate], [name=edate]").attr("disabled", false);
        $("[name=number]").val('').attr("disabled", true);
        return $("[name=status]").val('').attr("disabled", true);
      }
    }
  });
};

search = function(event) {
  var $edate, $nro, $sdate, $status, context;
  $nro = $("input[name=number]");
  $status = $("select[name=status]");
  $sdate = $("input[name=sdate]");
  $edate = $("input[name=edate]");
  context = new Object;
  if ($nro.val().length === 10) {
    context.nro = $nro.val();
  }
  if ($status.val().length) {
    context.status = $status.val();
  }
  if ($sdate.val().length === 10) {
    context.sdate = $sdate.val();
  }
  if ($edate.val().length === 10) {
    context.edate = $edate.val();
  }
  if (Object.getOwnPropertyNames(context).length) {
    context.search = true;
    $.getJSON("", context, function(response) {
      var $table, temp, template, x;
      if (response.status) {
        template = "<td class=\"text-center\">{{ item }}</td> <td class=\"text-center\">{{ ingress }}</td> <td class=\"text-center\">{{ purchase }}</td> <td class=\"text-center\">{{ invoice }}</td> <td class=\"text-center\">{{ register }}</td> <td class=\"text-center\">{{ status }}</td> <td class=\"text-center\"> {{!replace}} </td>";
        $table = $("table.table-noteingress > tbody");
        $table.empty();
        for (x in response.list) {
          if (response.list[x].status !== "AN") {
            temp = template.replace("{{!replace}}", "<div class=\"btn-group\"> <button type=\"button\" class=\"btn btn-xs btn-success dropdown-toggle\" data-toggle=\"dropdown\" aria-expanded=\"false\"> <span class=\"fa fa-gears\"></span> </button> <ul class=\"dropdown-menu\" role=\"menu\"> <li><a class=\"text-left dropedit\" data-value=\"{{ ingress }}\"><small>Editar</small></a></li> <li><a class=\"text-left dropanular\" data-value=\"{{ ingress }}\"><small>Anular</small></a></li> </ul> </div>");
          } else {
            temp = template.replace("{{!replace}}", "");
          }
          response.list[x].item = parseInt(x) + 1;
          $table.append(Mustache.render(temp, response.list[x]));
        }
      } else {
        $().toastmessage("showErrorToast", "No se a podido obtener datos. " + response.raise);
      }
    });
  }
};

getEditDetails = function() {
  var context, value;
  value = this.getAttribute("data-value");
  if (value.length === 10) {
    context = new Object;
    context.ingress = value;
    context.details = true;
    $.getJSON("", context, function(response) {
      var $tb, template, x;
      if (response.status) {
        $("input[name=ingress]").val(response.ingress);
        $("input[name=storage]").val(response.storage);
        $("input[name=purchase]").val(response.purchase);
        $("input[name=guide]").val(response.guide);
        $("input[name=invoice]").val(response.invoice);
        $("input[name=motive]").val(response.motive);
        $("textarea[name=observation]").val(response.observation);
        $tb = $("table.table-details > tbody");
        $tb.empty();
        template = "<tr> <td>{{ item }}</td> <td>{{ name }} - {{ meter }}</td> <td>{{ brand }}</td> <td>{{ model }}</td> <td>{{ quantity }}</td> </tr>";
        for (x in response.details) {
          response.details[x].item = parseInt(x) + 1;
          $tb.append(Mustache.render(template, response.details[x]));
        }
        $(".panel-first").fadeOut(200);
        $(".panel-second").fadeIn(800);
      } else {
        $().toastmessage("showWarningToast", "No se pudo obtener el detalle de la Nota de Ingreso.");
      }
    });
    return;
  } else {
    $().toastmessage("showWarningToast", "El código de la nota de ingreso es incorrecto.");
  }
};

editIngress = function(event) {
  var context;
  context = new Object;
  if ($("input[name=invoice]").val()) {
    context.invoice = $("input[name=invoice]").val();
  }
  if ($("input[name=motive]").val()) {
    context.motive = $("input[name=motive]").val();
  }
  console.info(Object.getOwnPropertyNames(context).length);
  if (Object.getOwnPropertyNames(context).length === 2) {
    context.observation = $("textarea[name=observation]").val();
    context.guide = $("input[name=guide]").val();
    context.ingress = $("input[name=ingress]").val();
    context.editingress = true;
    context.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
    $.post("", context, function(response) {
      if (response.status) {
        location.reload();
      } else {
        $().toastmessage("showErrorToast", "No se a podido realizar los cambios.");
      }
    });
  } else {
    $().toastmessage("showWarningToast", "Existe un campo obligatorio.");
    return;
  }
};

backtofirst = function(event) {
  $(".panel-second").fadeOut(200);
  $(".panel-first").fadeIn(800);
};

anullarIngress = function(event) {
  var value;
  value = this.getAttribute("data-value");
  $().toastmessage("showToast", {
    text: "Realmente desea anular la Nota de Ingreso?",
    type: "confirm",
    sticky: true,
    buttons: [
      {
        value: "Si"
      }, {
        value: "No"
      }
    ],
    success: function(result) {
      var context;
      if (result === "Si") {
        context = new Object;
        context.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
        if (value.length === 10) {
          context.ingress = value;
          context.annularNI = true;
          $.post("", context, function(response) {
            if (response.status) {
              $().toastmessage("showSuccessToast", "Se anulado correctamente.");
              setTimeout(function() {
                return location.reload();
              }, 2600);
            } else {
              $().toastmessage("showErrorToast", "No se a podido Anular la Nota de Ingreso");
            }
          }, "json");
        } else {
          $().toastmessage("showErrorToast", "El código de la Nota de Ingreso no es correcto.");
        }
      }
    }
  });
};
