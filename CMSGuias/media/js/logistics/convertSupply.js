var changeCheck, changeRadio, cleanControls, comeBack, createPurchase, getlistMateriales, newDocument, savedDocument, selectConvert, showConvert, terminateSupply;

$(document).ready(function() {
  $(".panel-quote,.panel-buy,.table-details").hide();
  $(".btn-proccess").on("click", showConvert);
  $("[name=transfer_buy],[name=traslado_quote]").datepicker({
    dateFormat: "yy-mm-dd",
    showAnim: "slide"
  });
  $("[name=obser_quote]").focusin(function() {
    this.setAttribute("rows", 3);
  }).focusout(function() {
    this.setAttribute("rows", 1);
  });
  $(".conquote,.conbuy").on("click", selectConvert);
  $("[name=select]").on("change", changeRadio);
  $(".btn-new").on("click", newDocument);
  $(".btn-clean").on("click", cleanControls);
  $(document).on("change", "input[name=chk]", changeCheck);
  $(".btn-save").on("click", savedDocument);
  $(".btn-finish").on("click", terminateSupply);
  $("button.btn-back").on("click", comeBack);
  $("button.btn-purchase").on("click", createPurchase);
  $("table.table-float").floatThead({
    useAbsolutePositioning: true,
    scrollingTop: 50
  });
  $(window).scroll(function() {
    return $("table.table-float").floatThead("reflow");
  });
});

terminateSupply = function(event) {
  $().toastmessage("showToast", {
    type: "confirm",
    sticky: true,
    text: "Parece que has terminada de cotizar o compar, Deseas terminar con la order de suministro?",
    buttons: [
      {
        value: "No"
      }, {
        value: "Si"
      }
    ],
    success: function(res) {
      var data;
      if (res === "Si") {
        data = new Object();
        data["csrfmiddlewaretoken"] = $("[name=csrfmiddlewaretoken]").val();
        data["supply"] = $("[name=supply]").val();
        data["type"] = "finish";
        $.post("", data, (function(response) {
          console.log(response);
          if (response.obj) {
            $().toastmessage("showNoticeToast", "Bien, se a completado el suministro <b>Nro " + data.supply + ".</b>");
            setTimeout((function() {
              location.href = "/logistics/supply/to/convert/";
            }), 3000);
          }
        }), "json");
      }
    }
  });
};

savedDocument = function(event) {
  var arr, btn, counter, data, pass;
  pass = false;
  counter = 0;
  btn = this;
  data = new Object();
  arr = new Array();
  $("input[name=chk]").each(function() {
    if (this.checked) {
      counter += 1;
      arr.push({
        mid: this.id,
        cant: this.value,
        brand: this.getAttribute("data-brand"),
        model: this.getAttribute("data-model")
      });
    }
  });
  if (counter > 0) {
    $(".panel-" + btn.value).find("select,input,textarea").each(function() {
      var name;
      if ($(this).is("textarea")) {
        data[this.name.replace("_".concat(btn.value), "")] = this.value;
        return true;
      }
      if ($.trim(this.value) !== "") {
        name = this.name.replace("_".concat(btn.value), "");
        if (name === "traslado") {
          if (!validateFormatDate(this.value)) {
            $().toastmessage("showWarningToast", "Campo \"Fecha\" no valido.");
            pass = false;
            return pass;
          }
        }
        data[name] = this.value;
        pass = true;
      } else {
        $().toastmessage("showWarningToast", "Existe un campo vacio o no se a seleccionado, revise los campos.");
        pass = false;
        return false;
      }
    });
    if (pass) {
      $().toastmessage("showToast", {
        type: "confirm",
        sticky: true,
        text: "Desea Generar la cotización para ".concat($("[name=supplier_" + btn.value + "]").find("option:selected").text()),
        buttons: [
          {
            value: "Si"
          }, {
            value: "No"
          }
        ],
        success: function(result) {
          if (result === "Si") {
            data["newid"] = ($.trim($("[name=nro-" + btn.value + "]").val()) !== "" ? "0" : "1");
            if (data.newid === "0") {
              data["id"] = $("[name=nro-" + btn.value + "]").val();
            }
            data["mats"] = JSON.stringify(arr);
            data["type"] = btn.value;
            data["supply"] = $("[name=supply]").val();
            data["csrfmiddlewaretoken"] = $("[name=csrfmiddlewaretoken]").val();
            console.log(data);
            $.post("", data, (function(response) {
              console.info(response);
              if (response.status) {
                $("[name=nro-" + btn.value + "]").val(response.id);
                $().toastmessage("showNoticeToast", "Se ha guardado Correctamente. <br > <strong> Nro " + response.id + ".</strong><br> para el proveedor <strong>" + $("[name=supplier_" + btn.value + "]").val() + "</strong>");
                $(".btn-new").click();
              } else {
                $().toastmessage("showErrorToast", "Error: Not proccess <q>Transaction</q>.");
              }
            }), "json");
          }
        }
      });
    }
  } else {
    $().toastmessage("showWarningToast", "Debe seleccionar por lo menos un material.");
  }
};

changeCheck = function(event) {
  var counter, recount;
  event.preventDefault();
  counter = 0;
  recount = 0;
  $("[name=chk]").each(function() {
    if (!this.checked) {
      $("input[name=select]").attr("checked", false);
      recount += 1;
    } else {
      counter += 1;
    }
  });
  if (recount === $("input[name=chk]").length) {
    $("input[name=select]").each(function() {
      if (this.value === 0) {
        this.checked = true;
      }
    });
  } else if (counter === $("input[name=chk]").length) {
    $("input[name=select]").each(function() {
      if (this.value === 1) {
        this.checked = true;
      }
    });
  }
};

cleanControls = function(event) {
  event.preventDefault();
  $(".panel-" + this.value).find("input,select,textarea").each(function() {
    if ($(this).is("select")) {
      this.selectedIndex = 0;
    } else {
      this.value = "";
    }
  });
};

newDocument = function(event) {
  var sts;
  sts = Boolean($(this).attr("status"));
  if (!sts) {
    $(this).text(" Cancelar").attr("status", "new");
    $("<span></span>").prependTo(this);
    $(".btn-new > span").removeClass("glyphicon-file").addClass("glyphicon-remove");
  } else {
    $(this).text(" Nuevo").removeAttr("status");
    $("<span></span>").prependTo(this);
    $(".btn-new > span").addClass("glyphicon-file").removeClass("glyphicon-remove");
  }
  $(".btn-new > span").addClass("glyphicon");
  $(".panel-" + this.value).find((!sts ? ":disabled" : "input,select,textarea,.btn-clean,.btn-save")).each(function() {
    $(this).attr("disabled", sts);
  });
};

changeRadio = function(event) {
  var value;
  if (this.checked) {
    value = parseInt(this.value);
    $("input[name=chk]").each(function() {
      this.checked = Boolean(value);
    });
  }
};

getlistMateriales = function(id_su) {
  var url;
  if (id_su !== "") {
    url = "/json/get/details/supply/" + id_su + "/";
    $.getJSON(url, function(response) {
      var $pro, $tb, template, tmp, x;
      if (response.status) {
        $tb = $(".table-details > tbody");
        $tb.empty();
        template = "<tr> <td>{{ counter }}</td> <td> <input type=\"checkbox\" name=\"chk\" id=\"{{ materiales_id }}\" value=\"{{ cantidad }}\" data-brand=\"{{ brand }}\" data-model=\"{{ model }}\"> </td> <td>{{ materiales_id }}</td> <td>{{ materiales__matnom }}</td> <td>{{ materiales__matmed }}</td> <td>{{ materiales__unit }}</td> <td>{{ brand }}</td> <td>{{ model }}</td> <td>{{ cantidad }}</td> {{!price}} </tr>";
        for (x in response.list) {
          tmp = template;
          if ($(".col-price").is(":visible")) {
            tmp = tmp.replace("{{!price}}", "<td><input type=\"text\" name=\"mats\" class=\"form-control input-sm price{{ materiales_id }}\" data-quantity=\"{{ cantidad }}\" data-material=\"{{ materiales_id }}\" data-brand=\"{{ brand_id }}\" data-model=\"{{ model_id }}\" value=\"0\"></td>");
          }
          response.list[x].counter = parseInt(x) + 1;
          $tb.append(Mustache.render(tmp, response.list[x]));
        }
        $pro = $("p.project");
        for (x in response.project) {
          $pro.text("" + response.project[x].nompro);
        }
        return $("table.table-float").floatThead("reflow");
      }
    });
  } else {
    $().toastmessage("showWaringToast", "Hay un error al traer la lista de materiales. Código incorrecto");
  }
};

showConvert = function(event) {
  $(".conquote,.conbuy").val(this.name).attr({
    placeholder: $(this).attr("placeholder"),
    data: $(this).attr("data")
  });
  $(".consu").html(this.name);
  $(".mquestion").modal("show");
  $("input[name=supply]").val(this.name);
};

selectConvert = function(event) {
  var value;
  value = this.value;
  $(".table-principal").hide("blind", 600);
  if (this.title === "quote") {
    $(".panel-quote").show("slide", 600);
    $("[name=traslado_quote]").val($(this).attr("placeholder"));
    $("[name=storage_quote]").val($(this).attr("data"));
    $(".col-price").addClass("hide");
  } else {
    $(".panel-buy").show("slide", 600);
    $("[name=transfer_buy]").val($(this).attr("placeholder"));
    $("[name=storage_buy]").val($(this).attr("data"));
    $(".col-price").removeClass("hide");
  }
  $(".table-details").show("slide", 600);
  $(".mquestion").modal("hide");
  setTimeout(function() {
    $("div.panel-details").show("slide", 600);
    getlistMateriales(value);
    $("table.table-float").floatThead("reflow");
  }, 150);
};

comeBack = function(event) {
  $(".table-principal").show("blind", 800);
  $(".panel-buy").hide("slide", 150);
  $(".panel-quote").hide("slide", 150);
  $("div.panel-details").hide("slide", 150);
};

createPurchase = function(event) {
  var mats;
  mats = new Array;
  $("input[name=chk]").each(function(index, element) {
    if (element.checked) {
      mats.push({
        "materials": element.id,
        "brand": $("input.price" + element.id).attr("data-brand"),
        "model": $("input.price" + element.id).attr("data-model"),
        "quantity": $("input.price" + element.id).attr("data-quantity"),
        "price": $("input.price" + element.id).val()
      });
    }
  });
  if (mats.length) {
    $().toastmessage("showToast", {
      text: "Realmente desea Generar la Orden de Compra?",
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
        var data;
        if (result === "Si") {
          data = new FormData();
          data.append("proveedor", $("select[name=supplier_buy]").val());
          data.append("documento", $("select[name=documents_buy]").val());
          data.append("pagos", $("select[name=payment_buy]").val());
          data.append("moneda", $("select[name=currency_buy]").val());
          if ($("input[name=transfer_buy]").val() === "" || $("input[name=transfer_buy]").val().length < 10) {
            $().toastmessage("showWaringToast", "Fecha de traslado vacio.");
            return false;
          }
          data.append("traslado", $("input[name=transfer_buy]").val());
          data.append("contacto", $("input[name=contact_buy]").val());
          data.append("lugent", $("input[name=delivery]").val());
          data.append("discount", $("input[name=discount]").val());
          data.append("csrfmiddlewaretoken", $("input[name=csrfmiddlewaretoken]").val());
          data.append("purchase", true);
          data.append("mats", JSON.stringify(mats));
          if ($("input[name=deposit]").get(0).files.length) {
            data.append("deposito", $("input[name=deposit]").get(0).files[0]);
          }
          console.log(data);
          $.ajax({
            url: "",
            type: "POST",
            data: data,
            dataType: "json",
            contentType: false,
            processData: false,
            cache: false,
            success: function(response) {
              if (response.status) {
                $().toastmessage("showNoticeToast", "Se a generado la orden de compra. " + response.purchase);
              } else {
                $().toastmessage("showErrorToast", "No se a generado la orden de compra. " + response.raise);
              }
            }
          });
        }
      }
    });
  } else {
    $().toastmessage("showWaringToast", "Debe de elegir por lo menos un material.");
  }
};
