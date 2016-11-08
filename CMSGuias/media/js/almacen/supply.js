var backlist, changeSelect, compressList, deleteTmp, generateSupply, showGen;

$(document).ready(function() {
  $(".content, .btn-back, .btn-compress").hide();
  $(document).on("change", "[name=sel]", changeSelect);
  $(".btn-delete-all").on("click", deleteTmp);
  $(".btn-gen").on("click", showGen);
  $(".btn-compress").on("click", compressList);
  $(".btn-back").on("click", backlist);
  $(".obser").focusin(function(event) {
    this.rows = 3;
  }).focusout(function(event) {
    this.rows = 1;
  });
  $("input[name=ingreso]").datepicker({
    minDate: "0",
    maxDate: "+6M",
    showAdnim: "blind",
    dateFormat: "yy-mm-dd"
  });
  $("button.btn-generate").on("click", generateSupply);
  $("input[value=true]").change().attr("disabled", true);
  $("input[name=chk]").attr("disabled", true);
  setTimeout(function() {
    $(".btn-compress").click();
  }, 600);
});

deleteTmp = function(event) {
  event.preventDefault();
  $().toastmessage("showToast", {
    text: "Realmente desea eliminar todo el temporal de suministro?",
    sticky: true,
    type: "confirm",
    buttons: [
      {
        value: "Si"
      }, {
        value: "No"
      }
    ],
    success: function(result) {
      var data;
      if (result === "Si") {
        data = {};
        data["csrfmiddlewaretoken"] = $("input[name=csrfmiddlewaretoken]").val();
        data["tipo"] = "deltmp";
        $.post("", data, function(response) {
          location.reload();
        });
      }
    }
  });
};

generateSupply = function(event) {
  var chk, data, pass;
  chk = void 0;
  pass = void 0;
  data = new Object();
  $("input[name=quote]").each(function() {
    if (this.checked) {
      pass = true;
    } else {
      pass = false;
    }
  });
  if (pass) {
    $("[name=almacen],[name=asunto],[name=ingreso]").each(function() {
      if ($(this).val() !== "") {
        data[this.name] = $(this).val();
      } else {
        pass = false;
      }
    });
  } else {
    $().toastmessage("showWarningToast", "No se han seleccionado materiales para suministrar.");
  }
  if (pass) {
    data["obser"] = $("[name=obser]").val();
    data["csrfmiddlewaretoken"] = $("input[name=csrfmiddlewaretoken]").val();
    data.generateSupply = true;
    $.post("", data, function(response) {
      if (response.status) {
        $().toastmessage("showNoticeToast", "Suministro Generado: <br /> Nro " + response["nro"]);
        return setTimeout((function() {
          location.reload();
        }), 2800);
      }
    }, "json");
  } else {
    $().toastmessage("showWarningToast", "Se a encontrado un campo vacio.");
  }
};

backlist = function(event) {
  event.preventDefault();
  $(".table-first").show("slide", 400);
  $(".data-condensed").hide("blind", 200);
  $(".btn-gen").click();
};

compressList = function(event) {
  var array, data;
  event.preventDefault();
  array = new Array();
  $("input[name=chk]").each(function() {
    if (this.checked) {
      array.push(this.value);
    }
  });
  if (array.length > 0) {
    data = new Object();
    data["mats"] = JSON.stringify(array);
    $.getJSON("", data, function(response) {
      var $tb, template, x;
      console.log(response);
      if (response.status) {
        $tb = $(".data-condensed > tbody");
        template = "<tr> <td>{{ item }}</td> <td><input type='checkbox' name='quote' value='{{ cantidad }}' title='{{ materiales_id }}' checked DISABLED /></td> <td>{{ materiales_id }}</td> <td>{{ matnom }}</td> <td>{{ matmed }}</td> <td>{{ unidad }}</td> <td>{{ brand }}</td> <td>{{ model }}</td> <td>{{ cantidad }}</td> <td>{{ stock }}</td> </tr>";
        $tb.empty();
        for (x in response.list) {
          response.list[x].item = parseInt(x) + 1;
          $tb.append(Mustache.render(template, response.list[x]));
        }
        $(".table-first").hide("slide", 200);
        $(".data-condensed").show("blind", 400);
      }
    });
  } else {
    $().toastmessage("showWarningToast", "No se han seleccionado materiales, para comprimir");
  }
};

showGen = function(event) {
  event.preventDefault();
  $(".content").toggle(function() {
    if (!$(this).is(":hidden")) {
      $(".btn-gen > span").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
    } else {
      $(".btn-gen > span").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
    }
  });
};

changeSelect = function(event) {
  var rdo;
  event.preventDefault();
  rdo = this;
  $("[name=chk]").each(function() {
    this.checked = Boolean(rdo.value);
  });
};
