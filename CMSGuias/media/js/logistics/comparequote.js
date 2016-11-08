var calcPriceEdit, calcamounts, changeMaterials, choicePrice, finishQuote, savePurchase, showStepOne, showStepTwo;

$(document).ready(function() {
  $(".step-two").hide();
  $("[name=transfer]").datepicker({
    "showAnim": "slide",
    changeMonth: true,
    changeYear: true,
    dateFormat: "yy-mm-dd",
    minDate: "0"
  });
  $(".btn-refresh-price").on("click", calcPriceEdit);
  $("input[name=select]").on("change", changeMaterials);
  $(".btn-purchase").on("click", choicePrice);
  $(".btn-origin, .btn-edit").on("click", showStepTwo);
  $(".btn-back").on("click", showStepOne);
  $(".btn-save-purchase").on("click", savePurchase);
  $(".btn-kill").on("click", finishQuote);
  $(".btn-show-deposit").click(function(event) {
    $("[name=deposit]").click();
  });
  calcamounts();
  if ($("table").width() >= 1100) {
    $(".table-responsive").css("overflow-x", "scroll");
  }
});

calcamounts = function(event) {
  $("input[name=suppliers]").each(function(index, supplier) {
    var amount, igv, total;
    amount = 0;
    $("input[name=edit" + supplier.value + "]").each(function(index, input) {
      amount += parseFloat(input.getAttribute("data-amount"));
    });
    $(".amount" + supplier.value).html(amount.toFixed(2));
    igv = amount * (parseFloat($("input[name=igv]").val()) / 100);
    $(".igv" + supplier.value).html(igv.toFixed(2));
    total = amount + igv;
    $(".total" + supplier.value).html(total.toFixed(2));
  });
};

calcPriceEdit = function(event) {
  var amount, igv, supplier, total;
  if (this.value !== "") {
    supplier = this.value;
    amount = 0;
    $("input[name=edit" + supplier + "]").each(function(index, input) {
      var pre;
      pre = 0;
      if ($("#dscto" + supplier).is(":checked")) {
        pre = (parseFloat(input.value) * parseFloat(input.getAttribute("data-discount"))) / 100;
        pre = parseFloat(input.value) - pre;
      } else {
        pre = parseFloat(input.value);
      }
      amount += parseFloat(input.getAttribute("data-quantity")) * pre;
    });
    $(".amountedit" + supplier).html(amount.toFixed(2));
    igv = amount * (parseFloat($("input[name=igv]").val()) / 100);
    $(".igvedit" + supplier).html(igv.toFixed(2));
    total = amount + igv;
    $(".totaledit" + supplier).html(total.toFixed(2));
    return;
  }
};

changeMaterials = function(event) {
  var val;
  if (this.checked) {
    val = Boolean(parseInt(this.value));
    $("input[name=mats]").each(function(index, element) {
      element.checked = val;
    });
  }
};

choicePrice = function() {
  var counter;
  counter = 0;
  $("input[name=mats]").each(function(index, element) {
    if (element.checked) {
      counter += 1;
    }
  });
  if (counter > 0) {
    $(".choice-price").modal("show");
    $(".btn-origin, .btn-edit").attr("data-s", this.value);
  } else {
    $().toastmessage("showWarningToast", "Debe de seleccionar por lo menos un material para poder generar la orden de compra.");
  }
};

showStepTwo = function(event) {
  $("input[name=prices]").val(this.value);
  $(".choice-price").modal("hide");
  $("[name=rucandreason]").html(this.getAttribute("data-s") + " - " + $(".get-reason-" + (this.getAttribute("data-s"))).text());
  $("[name=ruc]").val(this.getAttribute("data-s"));
  $("[name=reason]").val($(".get-reason-" + (this.getAttribute("data-s"))).text());
  $(".step-one").fadeOut(200);
  $(".step-two").fadeIn(800);
};

showStepOne = function(event) {
  $("input[name=prices]").val("");
  $(".step-two").fadeOut(200);
  $(".step-one").fadeIn(800);
};

savePurchase = function() {
  var $deposit, arr, data, form, k, pass, type, v;
  form = new FormData();
  data = new Object();
  data.proveedor = $("[name=ruc]").val();
  data.lugent = $("[name=delivery]").val();
  data.documento = $("[name=document]").val();
  data.pagos = $("[name=payment]").val();
  data.moneda = $("[name=currency]").val();
  data.traslado = $("[name=transfer]").val();
  data.contacto = $("[name=contact]").val();
  $deposit = $("[name=deposit]").get(0);
  pass = false;
  for (k in data) {
    v = data[k];
    if (v !== "") {
      form.append(k, v);
      pass = true;
    } else {
      pass = false;
      $().toastmessage("showWarningToast", "El campo " + k + " se encuentra vacio.");
      return pass;
    }
  }
  if (pass) {
    if ($deposit.files[0] !== null) {
      form.append("deposito", $deposit.files[0]);
    }
    arr = new Array();
    type = $("input[name=prices]").val();
    $("input[name=mats]").each(function(index, element) {
      var ruc;
      data = new Object();
      if (element.checked) {
        data["materials"] = element.value;
        ruc = $("[name=ruc]").val();
        $("input[name=edit" + ruc + "]").each(function(index, input) {
          var dis, pre;
          if (input.getAttribute("data-id") === element.value) {
            if (type === "origin") {
              data["price"] = parseFloat(input.getAttribute("data-price"));
              data["discount"] = parseFloat(input.getAttribute("data-discount"));
            } else if (type === "editable") {
              data["price"] = parseFloat(input.getAttribute("data-price"));
              pre = parseFloat(input.getAttribute("data-price"));
              if (parseFloat(input.value) < pre) {
                dis = pre - parseFloat(input.value);
                dis = (dis * 100) / pre;
                if ($("#dscto" + ruc).is(":checked")) {
                  data["discount"] = parseFloat(input.getAttribute("data-discount")) + dis;
                } else {
                  data["discount"] = dis;
                }
              } else {
                if ($("#dscto" + ruc).is(":checked")) {
                  if (parseFloat(input.getAttribute("data-discount")) > 0) {
                    data["discount"] = parseFloat(input.getAttribute("data-discount"));
                  } else {
                    data["discount"] = 0;
                  }
                } else {
                  if (parseFloat(input.value) < pre) {
                    dis = pre - parseFloat(input.value);
                    dis = (dis * 100) / pre;
                    data["discount"] = dis;
                  } else {
                    data["discount"] = 0;
                  }
                }
              }
            }
            data["brand"] = input.getAttribute("data-brand");
            data["model"] = input.getAttribute("data-model");
            return data["quantity"] = parseFloat(input.getAttribute("data-quantity"));
          }
        });
        arr.push(data);
      }
    });
    console.log(arr);
    form.append("details", JSON.stringify(arr));
    form.append("purchase", true);
    form.append("csrfmiddlewaretoken", $("input[name=csrfmiddlewaretoken]").val());
    $.ajax({
      url: "",
      type: "POST",
      data: form,
      dataType: "json",
      cache: false,
      processData: false,
      contentType: false,
      success: function(response) {
        if (response.status) {
          $().toastmessage("showNoticeToast", "Felicidades! se a generar la <q>Orden de Compra</q> Nro " + response.purchase);
          return setTimeout(function() {
            $("input[name=edit" + ($("[name=ruc]").val()) + "]").attr("disabled", "disabled");
            $(".btn-purchase").each(function(index, element) {
              if (element.value === $("[name=ruc]").val()) {
                element.setAttribute("disabled", "disabled");
              }
            });
            return showStepOne();
          }, 3000);
        } else {
          return $().toastmessage("showErrorToast", "No se a podido generar la Orden de compra. Vuelva a intentarlo.");
        }
      }
    });
  }
};

finishQuote = function(event) {
  $().toastmessage("showToast", {
    sticky: true,
    text: "Si terminas la cotización no podra comprar a los otros proveedor(es) que se envio esta cotización. Seguro que desea terminar la cotización?",
    type: "confirm",
    buttons: [
      {
        value: "Si"
      }, {
        value: "No"
      }
    ],
    success: function(result) {
      if (result === "Si") {
        $.post("", {
          "finish": true,
          "csrfmiddlewaretoken": $("input[name=csrfmiddlewaretoken]").val()
        }, function(response) {
          if (response.status) {
            location.href = "/logistics/quotation/list/";
          } else {
            $().toastmessage("showWarningToast", "No se puede terminar la cotización, Vuelva a intentarlo.");
          }
        }, "json");
      }
    }
  });
};
