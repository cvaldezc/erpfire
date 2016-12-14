var changeCheck, changeSearch, changeSelect, listTemplate, loadIngress, saveNoteIngress, searchPurchase, showAction, showDeposit, showIngressInventory, showListFirst, validQuantityBlur;

$(document).ready(function() {
  $(".step-second,.step-tree").hide();
  $("input[name=start], input[name=end]").datepicker({
    "showAnim": "slide",
    "dateFormat": "yy-mm-dd"
  });
  $("input[name=search]").on("change", changeSearch);
  $(".btn-search").on("click", searchPurchase);
  $(document).on("click", ".btn-deposit", showDeposit);
  $(document).on("click", ".btn-action", showAction);
  $(".btn-ingress").on("click", showIngressInventory);
  $(document).on("blur", ".materials", validQuantityBlur);
  $(document).on("change", "input[name=mats]", changeCheck);
  $("[name=select]").on("change", changeSelect);
  $(".btn-generate-note").on("click", loadIngress);
  $(".btn-generate").on("click", saveNoteIngress);
  $('.btn-return').on("click", showListFirst);
  $(".btn-repeat").click(function(event) {
    location.reload();
  });
  $("#observation").trumbowyg();
  $('.trumbowyg-box,.trumbowyg-editor').css('minHeight', '128px');
});

changeSearch = function() {
  if (this.checked) {
    if (this.value === "code") {
      $("input[name=code]").attr("disabled", false);
      $("input[name=start],input[name=end]").attr("disabled", true);
      $("input[name=supplier]").attr("disabled", true);
    } else if (this.value === "dates") {
      $("input[name=code]").attr("disabled", true);
      $("input[name=start],input[name=end]").attr("disabled", false);
      $("input[name=supplier]").attr("disabled", true);
    } else if (this.value === "supplier") {
      $("input[name=code]").attr("disabled", true);
      $("input[name=start],input[name=end]").attr("disabled", true);
      $("input[name=supplier]").attr("disabled", false);
    }
  }
};

searchPurchase = function() {
  var data;
  data = new Object();
  $("input[name=search]").each(function(index, element) {
    if (element.checked) {
      data.type = element.value;
      if (element.value === "code") {
        data.code = $("input[name=code]").val();
      } else if (element.value === "dates") {
        data.start = $("input[name=start]").val();
        if ($("input[name=end]").val().length === 10) {
          data.end = $("input[name=end]").val();
        }
      } else if (element.value === "supplier") {
        data.supplier = $("input[name=supplier]").val();
      }
    }
  });
  if (data.type === "code") {
    if (data.code.length === 10) {
      data.pass = true;
    } else {
      data.pass = false;
      $().toastmessage("showWarningToast", "No se a ingresado el código.");
    }
  } else if (data.type === "dates") {
    if (data.start.length === 10) {
      data.pass = true;
    } else {
      data.pass = false;
      $().toastmessage("showWarningToast", "No se han ingresado la fecha a buscar.");
    }
  } else {
    data.pass = true;
  }
  if (data.pass) {
    $.getJSON("", data, function(response) {
      if (response.status) {
        console.log(response);
        listTemplate(response.list);
      } else {
        $().toastmessage("showWarningToast", "Se han encontrado errores. " + response.raise);
      }
    });
  }
};

listTemplate = function(list) {
  var $tb, template, x;
  $tb = $("table > tbody");
  $tb.empty();
  if (list.length) {
    template = "<tr>\n  <td>{{ item }}</td>\n  <td>{{ purchase }}</td>\n  <td>{{ reason }}</td>\n  <td>{{ document }}</td>\n  <td>{{ transfer }}</td>\n  <td class=\"text-center\">\n    <button value=\"{{ purchase }}\" data-ruc=\"{{ x.supplier }}\"\n     class=\"btn btn-link btn-xs text-black btn-deposit\">\n      <span class=\"glyphicon glyphicon-credit-card\"></span></button>\n  </td>\n  <td class=\"text-center\">\n    <a href=\"/reports/order/purchase/{{ purchase }}/\"\n     target=\"_blank\" class=\"btn btn-xs btn-link text-black\">\n      <span class=\"glyphicon glyphicon-eye-open\"></span></a>\n  </td>\n  <td class=\"text-center\">\n    <button value=\"{{ purchase }}\" data-ruc=\"{{ x.supplier }}\"\n     class=\"btn btn-link btn-xs text-black btn-action\">\n      <span class=\"glyphicon glyphicon-inbox\"></span></button>\n  </td>\n</tr>";
    for (x in list) {
      list[x].item = parseInt(x) + 1;
      $tb.append(Mustache.render(template, list[x]));
    }
  }
};

showDeposit = function() {
  var purchase, supplier, url;
  purchase = this.value;
  supplier = this.getAttribute("data-ruc");
  url = "/media/storage/compra/" + purchase + "/" + supplier + ".pdf";
  window.open(url, "Deposit");
};

showAction = function() {
  $(".maction").modal("show").find("button").val(this.value);
};

showIngressInventory = function(event) {
  var btn;
  btn = this.value;
  $.getJSON("", {
    "purchase": btn
  }, function(response) {
    var $tb, count, template;
    if (response.status) {
      $(".supplier").html(response.head.supplier);
      $(".quote").html(response.head.quote);
      $(".place").html(response.head.place);
      $(".document").html(response.head.document);
      $(".payment").html(response.head.payment);
      $(".currency").html(response.head.currency);
      $(".register").html(response.head.register);
      $(".transfer").html(response.head.transfer);
      $(".contact").html(response.head.contact);
      $(".performed").html(response.head.performed);
      count = 1;
      response['read'] = function() {
        if (this.dunit === this.unit) {
          return true;
        } else if (this.dunit === '') {
          return true;
        } else {
          return false;
        }
      };
      response['index'] = function() {
        return count++;
      };
      template = "{{#details}}\n  <tr>\n  <td><input type=\"checkbox\" name=\"mats\" value=\"{{materials}}\"></td>\n  <td class='text-center'>{{index}}</td>\n  <td><small>{{materials}}</small></td>\n  <td><small>{{name}} {{measure}}</small></td>\n  <td class='text-center'>{{brand}}</td>\n  <td class='text-center'>{{model}}</td>\n  <td class='text-center'>{{dunit}}</td>\n  <td class='text-center'>{{unit}}</td>\n  <td class=\"text-center\">{{static}}</td>\n  <td class=\"text-right\">{{quantity}}</td>\n  <td>\n    <input type=\"number\" class=\"form-control input-sm text-right\"\n    name=\"{{materials}}\" value=\"{{quantity}}\" min=\"1\"\n    max=\"{{quantity}}\" data-price=\"{{price}}\"\n    data-brand=\"{{brand_id}}\" data-model=\"{{model_id}}\" disabled />\n  </td>\n  <td>\n    <input type=\"number\" class=\"form-control input-sm text-right\"\n    id=\"conv{{materials}}\"\n    value=\"{{convert}}\" min=\"1\"\n    {{#read}}readonly=\"{{read}}\"{{/read}} data-read=\"{{read}}\"/>\n  </td>\n  </tr>\n{{/details}}";
      $tb = $("table.table-ingress > tbody");
      $tb.empty();
      $tb.html(Mustache.render(template, response));
      $(".purchase").html(btn);
      $("[name=purchase]").val(btn);
      $(".maction").modal("hide");
      $(".step-first").fadeOut(200);
      $(".step-second").fadeIn(600);
    }
  });
};

showListFirst = function() {
  $(".step-second").fadeOut(200);
  $(".step-first").fadeIn(600);
};

validQuantityBlur = function(event) {
  var max, min, val;
  min = parseFloat(this.getAttribute("min").replace(",", "."));
  max = parseFloat(this.getAttribute("max").replace(",", "."));
  val = parseFloat(this.value.replace(",", "."));
  if (val < min || val > max) {
    if (val < min) {
      this.value = min;
    } else if (val > max) {
      this.value = max;
    }
  }
};

changeCheck = function(event) {
  var $mat;
  $mat = $("input[name=" + this.value + "]");
  if (this.checked) {
    $mat.attr("disabled", false);
  } else {
    $mat.attr("disabled", true);
  }
};

changeSelect = function(event) {
  var chek;
  if (this.checked) {
    chek = Boolean(parseInt(this.value));
    $("input[name=mats]").each(function(index, element) {
      element.checked = chek;
      $(element).change();
    });
  }
};

loadIngress = function(event) {
  var arr;
  arr = new Array();
  $("input[name=mats]").each(function(index, element) {
    if (element.checked) {
      arr.push({
        "materials": element.value,
        "quantity": $("input[name=" + element.value + "]").val()
      });
    }
  });
  if (arr.length) {
    $(".mingress").modal("toggle");
  } else {
    $().toastmessage("showWarningToast", "Seleccione por lo menos un material para hacer el ingreso a almacén.");
  }
};

saveNoteIngress = function(response) {
  var data, mats, pass, valfield;
  data = new Object();
  mats = new Array();
  pass = false;
  $("input[name=mats]").each(function(index, element) {
    var max, quantity, tag;
    if (element.checked) {
      max = $("input[name=" + element.value + "]").attr("max");
      quantity = $("input[name=" + element.value + "]").val();
      tag = parseFloat(quantity) < parseFloat(max) ? "1" : "2";
      mats.push({
        "materials": element.value,
        "quantity": quantity,
        "price": $("input[name=" + element.value + "]").attr("data-price"),
        "tag": tag,
        "brand": $("input[name=" + element.value + "]").attr("data-brand"),
        "model": $("input[name=" + element.value + "]").attr("data-model"),
        "convert": $("#conv" + element.value).val()
      });
    }
  });
  data.details = JSON.stringify(mats);
  valfield = {
    'invoice': 'Factura',
    'guide': 'Guia Remisión'
  };
  $(".mingress > div > div > div.modal-body > div.row").find("input, select").each(function(index, element) {
    console.info(element);
    if (element.value !== "") {
      pass = true;
    } else {
      $().toastmessage("showWarningToast", "Campo vacio, " + valfield[element.name]);
      pass = false;
      return pass;
    }
  });
  data['observation'] = $("#observation").trumbowyg("html");
  console.log(pass);
  if (pass) {
    $().toastmessage("showToast", {
      text: "Desea generar una <q>Nota de Ingreso</q>\ncon los materiales seleccionados?",
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
        if (result === "Si") {
          data.ingress = true;
          data.observation = $("textarea[name=observation]").val();
          data.purchase = $(".purchase").html();
          data.storage = $("[name=storage]").val();
          data.guide = $("[name=guide]").val();
          data.invoice = $("[name=invoice]").val();
          data.motive = $("[name=motive]").val();
          data.receive = $("[name=receive]").val();
          data.inspection = $("[name=inspection]").val();
          data.approval = $("[name=approval]").val();
          data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
          console.warn(data);
          $.post("", data, function(response) {
            if (response.status) {
              $(".step-second").fadeOut(200);
              $(".step-tree").fadeIn(600);
              $(".modal").modal("hide");
              $(".note").html(response.ingress);
              $(".show-note-ingress").attr("href", "/reports/note/ingress/" + response.ingress + "/");
            } else {
              $().toastmessage("showWarningToast", "No se a podido generar la Nota de Ingreso. " + response.raise);
            }
          });
        }
      }
    });
  }
};
