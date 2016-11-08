var addTmpPurchase, blurRange, deleteAll, deleteMaterial, editMaterial, keyCode, keyDescription, listTmpBuy, saveOrderPurchase, searchMaterial, showBedside, showEdit, showMaterials, toggleDeposito, uploadReadFile;

$(document).ready(function() {
  $(".panel-add,input[name=read],.step-second").hide();
  $("input[name=description]").on("keyup", keyDescription);
  $("input[name=description]").on("keypress", keyUpDescription);
  $("select[name=meter]").on("click", getSummaryMaterials);
  $("input[name=code]").on("keypress", keyCode);
  $("input[name=traslado]").datepicker({
    minDate: "0",
    showAnim: "slide",
    dateFormat: "yy-mm-dd"
  });
  $(".btn-show-materials").on("click", showMaterials);
  $(".btn-search").on("click", searchMaterial);
  $(".btn-list").on("click", listTmpBuy);
  $(".btn-add").on("click", addTmpPurchase);
  $(document).on("click", "[name=btn-edit]", showEdit);
  $("button[name=esave]").on("click", editMaterial);
  $(document).on("click", "[name=btn-del]", deleteMaterial);
  $(".btn-trash").on("click", deleteAll);
  $(".btn-read").on("click", function() {
    return $(".mfile").modal("show");
  });
  $(".show-input-file-temp").click(function() {
    return $("input[name=read]").click();
  });
  $("[name=btn-upload]").on("click", uploadReadFile);
  $(".show-bedside").on("click", showBedside);
  $("input[name=discount],input[name=edist]").on("blur", blurRange);
  $(".btn-deposito").on("click", toggleDeposito);
  $(".btn-purchase").on("click", saveOrderPurchase);
  listTmpBuy();
});

showMaterials = function(event) {
  var item;
  item = this;
  $(".panel-add").toggle(function() {
    if ($(this).is(":hidden")) {
      return $(item).find("span").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
    } else {
      return $(item).find("span").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
    }
  });
};

keyDescription = function(event) {
  var key;
  key = window.Event ? event.keyCode : event.which;
  if (key !== 13 && key !== 40 && key !== 38 && key !== 39 && key !== 37) {
    getDescription(this.value.toLowerCase());
  }
  if (key === 40 || key === 38 || key === 39 || key === 37) {
    moveTopBottom(key);
  }
};

keyCode = function(event) {
  var key;
  key = window.Event ? event.keyCode : event.which;
  if (key === 13) {
    searchMaterialCode(this.value);
  }
};

searchMaterial = function(event) {
  var code, desc;
  desc = $("input[name=description]").val();
  code = $("input[name=code]").val();
  if (code.length === 15) {
    return searchMaterialCode(code);
  } else {
    return getDescription($.trim(desc).toLowerCase());
  }
};

addTmpPurchase = function(event) {
  var code, data, discount, price, quantity;
  data = new Object();
  code = $(".id-mat").html();
  quantity = $("input[name=cantidad]").val();
  price = $("input[name=precio]").val();
  discount = parseInt($("input[name=discount]").val());
  if (code !== "") {
    if (quantity !== "") {
      if (price !== "") {
        data.materiales = code;
        data.cantidad = quantity;
        data.precio = price;
        data.discount = discount;
        data.type = "add";
        data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
        $.post("", data, function(response) {
          if (response.status) {
            return listTmpBuy();
          } else {
            return $().toastmessage("showWarningToast", "El servidor no a podido agregar el material, " + response.raise + ".");
          }
        }, "json");
      } else {
        $().toastmessage("showWarningToast", "Agregar materiales Falló. Precio Null.");
      }
    } else {
      $().toastmessage("showWarningToast", "Agregar materiales Falló. Cantidad Null.");
    }
    return;
  } else {
    $().toastmessage("showWarningToast", "Agregar materiales Falló. Código Null.");
  }
};

listTmpBuy = function(event) {
  $.getJSON("", {
    "type": "list"
  }, function(response) {
    var $tb, template, x;
    if (response.status) {
      template = "<tr name=\"{{ id }}\"><td>{{ item }}</td><td>{{ materials_id }}</td><td>{{ matname }}</td><td>{{ matmeasure }}</td><td>{{ unit }}</td><td>{{ quantity }}</td><td>{{ price }}</td><td>{{ discount }}%</td><td>{{ amount }}</td><td><button class=\"btn btn-xs btn-link\" name=\"btn-edit\" value=\"{{ quantity }}\" data-price=\"{{ price }}\" data-id=\"{{ id }}\" data-mat=\"{{ materials_id }}\" data-discount=\"{{ discount }}\"><span class=\"glyphicon glyphicon-pencil\"></span></button></td><td><button class=\"btn btn-xs btn-link text-red\" name=\"btn-del\" value=\"{{ id }}\" data-mat=\"{{ materials_id }}\"><span class=\"glyphicon glyphicon-trash\"></span></button></td></tr>";
      $tb = $("table.table-list > tbody");
      $tb.empty();
      for (x in response.list) {
        response.list[x].item = parseInt(x) + 1;
        $tb.append(Mustache.render(template, response.list[x]));
      }
      $(".discount").html(response.discount.toFixed(2));
      $(".sub").html(response.subtotal.toFixed(2));
      $(".igv").html(response.igv.toFixed(2));
      $(".total").html(response.total.toFixed(2));
    } else {
      return $().toastmessage("showWarningToast", "No se a encontrado resultados. " + response.raise);
    }
  });
};

showEdit = function(event) {
  event.preventDefault();
  $("input[name=ematid]").val($(this).attr("data-mat"));
  $("input[name=eidtmp]").val($(this).attr("data-id"));
  $("input[name=equantity]").val(this.value);
  $("input[name=eprice]").val($(this).attr("data-price"));
  $("input[name=edist]").val($(this).attr("data-discount"));
  $(".medit").modal("show");
};

editMaterial = function(event) {
  var $discount, $id, $mat, $price, $quantity, data;
  event.preventDefault();
  $id = $("input[name=eidtmp]");
  $mat = $("input[name=ematid]");
  $quantity = $("input[name=equantity]");
  $price = $("input[name=eprice]");
  $discount = $("input[name=edist]").val();
  if ($quantity.val() !== 0 && $quantity.val() > 0 && $price.val() !== 0 && $price.val() > 0) {
    data = new Object();
    data.id = $id.val();
    data.materials_id = $mat.val();
    data.quantity = parseFloat($quantity.val());
    data.price = parseFloat($price.val());
    data.type = "edit";
    data.discount = parseFloat($discount);
    data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
    $.post("", data, function(response) {
      if (response.status) {

        /*$edit = $("table.table-list > tbody > tr[name=#{$id.val()}] > td")
        $edit.eq(5).html $quantity.val()
        $edit.eq(6).html $price.val()
        $edit.eq(7).html "#{$discount}%"
        $edit.eq(8).html (((data.price * data.discount) / 100) * data.quantity)
        $edit.eq(9).find("button").val $quantity.val()
        $edit.eq(9).find("button").attr "data-price", $price.val()
        $("input[name=ematid],input[name=eidtmp],input[name=equantity],input[name=eprice]").val ""
         */
        $(".medit").modal("hide");
        listTmpBuy();
      } else {
        return $().toastmessage("showWarningToast", "No se a podido editar el material " + response.raise);
      }
    });
    return;
  } else {
    $().toastmessage("showWarningToast", "Error campo vacio: cantidad, precio.  ");
  }
};

deleteMaterial = function(event) {
  var item;
  event.preventDefault();
  item = this;
  return $().toastmessage("showToast", {
    sticky: true,
    text: "Desea eliminar el material " + ($(this).attr("data-mat")),
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
        data = new Object();
        data.id = item.value;
        data.materials_id = $(item).attr("data-mat");
        data.type = "del";
        data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
        $.post("", data, function(response) {
          if (response.status) {
            return $("table.table-list > tbody > tr[name=" + item.value + "]").remove();
          } else {
            return $().toastmessage("showWarningToast", "Error al eliminar material " + response.raise);
          }
        }, "json");
      }
    }
  });
};

deleteAll = function(event) {
  event.preventDefault();
  $().toastmessage("showToast", {
    sticky: true,
    text: "Desea eliminar todo el temporal?",
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
          type: "delall",
          "csrfmiddlewaretoken": $("input[name=csrfmiddlewaretoken]").val()
        }, function(response) {
          if (response.status) {
            $().toastmessage("showNoticeToast", "Correcto se a eliminado todo el temporal.");
            return setTimeout(function() {
              return location.reload();
            }, 2600);
          } else {
            return $().toastmessage("showWarningToast", "No se a podido eliminar todo el temporal. " + response.raise);
          }
        }, "json");
      }
    }
  });
};

uploadReadFile = function(event) {
  var btn, data, file, inputfile;
  event.preventDefault();
  btn = this;
  inputfile = document.getElementsByName("read");
  file = inputfile[0].files[0];
  if (file != null) {
    data = new FormData();
    data.append("type", "read");
    data.append("archivo", file);
    data.append("csrfmiddlewaretoken", $("[name=csrfmiddlewaretoken]").val());
    $.ajax({
      url: "",
      type: "POST",
      data: data,
      contentType: false,
      processData: false,
      cache: false,
      beforeSend: function() {
        return $(btn).button("loading");
      },
      success: function(response) {
        var $tb, template, x;
        if (response.status) {
          listTmpBuy();
          $(btn).button("reset");
          if (response.list.length > 0) {
            template = "<tr><td>{{ item }}</td><td>{{ name }}</td><td>{{ measure }}</td><td>{{ unit }}</td><td>{{ quantity }}</td><td>{{ price }}</td></tr>";
            $tb = $("table.table-nothing > tbody");
            $tb.empty();
            for (x in response.list) {
              response.list[x].item = parseInt(x) + 1;
              $tb.append(Mustache.render(template, response.list[x]));
            }
            $(".mlist").modal("show");
          }
          $(".mfile").modal("hide");
        } else {
          return $().toastmessage("showWarningToast", "No se ha podido completar la transacción. " + response.raise);
        }
      }
    });
  } else {
    $().toastmessage("showWarningToast", "Seleccione un archivo para subir y ser leido.");
  }
};

blurRange = function() {
  console.info("value " + this.value);
  console.info("max " + (this.getAttribute("max")));
  if (parseInt(this.value) > parseInt(this.getAttribute("max"))) {
    this.value = parseInt(this.getAttribute("max"));
  } else if (parseInt(this.value) < parseInt(this.getAttribute("min"))) {
    this.value = parseInt(this.getAttribute("min"));
  }
};

toggleDeposito = function() {
  $("input[name=deposito]").click();
};

showBedside = function() {
  var $tb;
  $tb = $("table.table-list > tbody > tr");
  if ($tb.length) {
    $(".mpurchase").modal("toggle");
  } else {
    $().toastmessage("showWarningToast", "Debe de ingresar por lo menos un material.");
  }
};

saveOrderPurchase = function() {
  var data, valid;
  valid = false;
  data = new Object();
  $("div.mpurchase > .modal-dialog > .modal-content > .modal-body > .row").find("select,input").each(function(index, elements) {
    if (elements.type === "file") {
      return true;
    }
    if (elements.value !== "") {
      valid = true;
      return data[elements.name] = elements.value;
    } else {
      valid = false;
      data.element = elements.name;
      return valid;
    }
  });
  if (valid) {
    $().toastmessage("showToast", {
      text: "Desea generar la <q>Orden de Compra</q>?",
      type: "confirm",
      sticky: true,
      buttons: [
        {
          value: 'Si'
        }, {
          value: 'No'
        }
      ],
      success: function(result) {
        var arr, prm;
        if (result === "Si") {
          arr = new Array();
          $("table.table-list > tbody > tr").each(function(index, elements) {
            var $td, discount;
            $td = $(elements).find("td");
            discount = parseInt($td.eq(7).text().split("%")[0]);
            arr.push({
              "materials": $td.eq(1).text(),
              "quantity": parseFloat($td.eq(5).text()),
              "price": parseFloat($td.eq(6).text()),
              "discount": discount
            });
          });
          prm = new FormData();
          prm.append("proveedor", data.proveedor);
          prm.append("lugent", data.lugent);
          prm.append("documento", data.documento);
          prm.append("pagos", data.pagos);
          prm.append("moneda", data.moneda);
          prm.append("traslado", data.traslado);
          prm.append("contacto", data.contacto);
          prm.append("savePurchase", true);
          prm.append("details", JSON.stringify(arr));
          if ($("input[name=deposito]").get(0).files.length) {
            prm.append("deposito", $("input[name=deposito]").get(0).files[0]);
          }
          prm.append("csrfmiddlewaretoken", $("input[name=csrfmiddlewaretoken]").val());
          $.ajax({
            url: "",
            type: "POST",
            data: prm,
            dataType: "json",
            contentType: false,
            processData: false,
            cache: false,
            success: function(response) {
              if (response.status) {
                $().toastmessage("showNoticeToast", "Correco se a generar <q>Orden de Compra Nro " + response.nro + "</q>");
                setTimeout(function() {
                  return location.reload();
                }, 2600);
              } else {
                return $().toastmessage("showWarningToast", "No se a podido generar la <q>Orden de Compra</q>. " + response.raise);
              }
            }
          });
        }
      }
    });
  } else {
    $().toastmessage("showWarningToast", "Alerta!<br>Campo vacio, " + data.element);
  }
};
