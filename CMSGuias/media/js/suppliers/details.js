var calcTotals, getListDetails, saveBedside, saveBlurDigit, saveBlurString, showBedsideAfter, showBedsideBefore, showBrowser, uploadSheet, validMinandMax;

$(document).ready(function() {
  $(".bedside-after, .panel-bedside").hide();
  $("input[name=dates],input[name=traslado], input[name=validez]").datepicker({
    "minDate": "0",
    "dateFormat": "yy-mm-dd",
    "showAnim": "slide"
  });
  $(document).on("focus", ".input-dates", function() {
    $(this).datepicker({
      "minDate": "0",
      "dateFormat": "yy-mm-dd",
      "showAnim": "slide"
    });
  });
  $(document).on("blur", "input[name=prices], input[name=desct]", saveBlurDigit);
  $(document).on("blur", "input[name=brands], input[name=models]", saveBlurString);
  $(document).on("change", "input[name=dates]", saveBlurString);
  $(".btn-file").on("click", showBrowser);
  $(document).on("change", "input[name=sheettech]", uploadSheet);
  calcTotals();
  $(".btn-show-bedside").on("click", showBedsideAfter);
  $(".btn-cancel").on("click", showBedsideBefore);
  $(".btn-send").on("click", saveBedside);
  tinymce.init({
    selector: "textarea[name=obser]",
    theme: "modern",
    menubar: false,
    statusbar: false,
    plugins: "link contextmenu fullscreen",
    fullpage_default_doctype: "<!DOCTYPE html>",
    font_size_style_values: "10px,12px,13px,14px,16px,18px,20px",
    toolbar1: "styleselect | fontsizeselect | fullscreen |",
    toolbar2: "undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |"
  });
  setTimeout(function() {
    return $(document).find("div#mceu_2").click(function(event) {
      if ($(this).attr("aria-pressed") === "false" || $(this).attr("aria-pressed") === void 0) {
        $(".navbar").hide();
      } else if ($(this).attr("aria-pressed") === "true") {
        $(".navbar").show();
      }
    });
  }, 2000);
});

validMinandMax = function(item) {
  if ($.trim(item.value) !== "") {
    if (parseFloat($.trim(item.value)) >= parseInt(item.getAttribute("min")) && parseFloat($.trim(item.value)) <= parseInt(item.getAttribute("max"))) {
      return true;
    } else {
      item.value = item.getAttribute("min");
      return false;
    }
  } else {
    item.value = item.getAttribute("min");
    return false;
  }
};

saveBlurDigit = function(event) {
  var btn, data;
  validMinandMax(this);
  if (!isNaN(parseFloat(this.value))) {
    console.log(this);
    btn = this;
    data = new Object();
    data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
    if (this.name === "prices") {
      data.blur = "price";
    } else if (this.name === "desct") {
      data.blur = "desct";
    }
    data.val = parseFloat(this.value);
    data.brand = this.getAttribute("data-brand");
    data.model = this.getAttribute("data-model");
    data.materials = this.getAttribute("data-mat");
    data.pk = this.getAttribute("data-pk");
    $.post("", data, function(response) {
      if (response.status) {
        return getListDetails();

        /*$td = $("table > tbody > tr.#{btn.getAttribute "data-mat"} > td")
        quantity = response.quantity
        if data.blur is "desct"
            price = parseFloat $td.eq(4).find("input").val()
            discount = parseFloat data.val
        else
            price = parseFloat data.val
            discount = parseFloat if $td.eq(5).find("input").val() is "" then 0 else $td.eq(5).find("input").val()
        discount = (price - ((price * discount) / 100))
        amount = (quantity * discount)
        $td.eq(6).text amount.toFixed(2)
         */
      }
    });
    return;
  }
};

calcTotals = function() {
  var amount, cigv, igv, totals;
  amount = 0;
  $("table > tbody > tr").each(function(index, element) {
    amount += parseFloat($(element).find("td").eq(6).text());
  });
  cigv = parseInt($("input[name=igv]").val());
  igv = (amount * cigv) / 100;
  totals = amount + igv;
  $(".subtc").text(amount.toFixed(2));
  $(".igvc").text(igv.toFixed(2));
  $(".totalc").text(totals.toFixed(2));
};

saveBlurString = function(event) {
  var data;
  console.log(this.value);
  if ($.trim(this.value) && $.trim(this.value) !== "None") {
    data = new Object();
    data.val = this.value;
    data.blur = this.name;
    data.materials = this.getAttribute("data-mat");
    data.pk = this.getAttribute("data-pk");
    data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
    $.post("", data);
  }
};

showBrowser = function(event) {
  $("input[name=sheettech]").click().attr("data-mat", this.value);
};

uploadSheet = function(event) {
  var data, input;
  if ($.trim(this.getAttribute("data-mat")) !== "" && this.files[0] !== null) {
    input = this;
    data = new FormData();
    data.append("type", "file");
    data.append("materials", this.getAttribute("data-mat"));
    data.append("sheet", this.files[0]);
    data.append("csrfmiddlewaretoken", $("input[name=csrfmiddlewaretoken]").val());
    $.ajax({
      url: "",
      data: data,
      type: "POST",
      dataType: "json",
      cache: false,
      contentType: false,
      processData: false,
      success: function(response) {
        var $file, clon;
        console.log(response);
        if (!response.status) {
          $().toastmessage("showWarningToast", "No se a podido cargar la hoja técnica. " + response.raise);
        }
        $file = $(input);
        $file.attr("data-mat", "");
        $file.val("");
        clon = $file.clone();
        return $file.replaceWith(clon);
      }
    });
  } else {
    this.setAttribute = "";
  }
};

showBedsideAfter = function(event) {
  $(".bedside-after, .panel-bedside").show(600);
  return $(".bedside-before").hide(200);
};

showBedsideBefore = function(event) {
  $(".bedside-after, .panel-bedside").hide(200);
  $(".bedside-before").show(600);
};

saveBedside = function(event) {
  var data;
  data = new Object();
  data.traslado = $("input[name=traslado]").val();
  data.validez = $("input[name=validez]").val();
  data.moneda = $("select[name=moneda]").val();
  data.contacto = $("input[name=contact]").val();
  data.obser = $("#obser_ifr").contents().find("body").html();
  if (data.traslado.length === 10 && data.traslado !== "" && data.validez.length === 10 && data.validez !== "" && data.moneda !== "") {
    data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
    data.client = true;
    $.post("", data, function(response) {
      var parameter, url, windowmsg;
      if (response.status) {
        console.log(response);
        data = new Object();
        data.texto = "System<br><br>Se a respondido a la cotización Nro " + response.quote + " del proveedor RUC " + response.supplier + " " + response.reason + "<br><br><br>---------------------------------<br><strong>System ICR PERU S.A.</strong>";
        data.para = "logistica@icrperusa.com";
        data.asunto = "Respuesta de Cotización";
        parameter = $.param(data);
        url = "http://190.41.246.91:3000/?" + parameter;
        windowmsg = window.open(url, "Send Msg", "toolbar=no, scrollbars=no, resizable=no, width=100, height=100");
        setTimeout(function() {
          windowmsg.close();
        }, 8000);
        $().toastmessage("showNoticeToast", "Se ha guardado y enviado la cotización.");
        return setTimeout(function() {
          return location.reload();
        }, 2600);
      }
    });
    return;
  } else {
    $().toastmessage("showWarningToast", "Existe un campo vacio o con formato incorrecto, revise y vuelva a intentarlo.");
  }
};

getListDetails = function(event) {
  var data;
  data = new Object;
  data.list = true;
  $.getJSON("", data, function(response) {
    var $tb, template, x;
    if (response.status) {
      template = "<tr class=\"{{ materials }}\"> <td class=\"text-center\">{{ item }}</td> <td>{{ names }}</td> <td>{{ unit }}</td> <td>{{ quantity }}</td> <td> <input type=\"number\" name=\"prices\" class=\"form-control input-sm\" value=\"{{ price }}\" min=\"0\" max=\"9999999\" data-mat=\"{{ materials }}\" data-pk=\"{{ pk }}\"> </td> <td> <input type=\"number\" name=\"desct\" class=\"form-control input-sm text-right\" min=\"0\" max=\"100\" value=\"{{ discount }}\" data-mat=\"{{ materials }}\" data-pk=\"{{ pk }}\"> </td> <td class=\"text-right\">{{ amount }}</td> <td> <input type=\"text\" data-mat=\"{{ materials }}\" data-pk=\"{{ pk }}\" value=\"{{ brand }}\" name=\"brands\" class=\"form-control input-sm\"> </td> <td> <input type=\"text\" data-mat=\"{{ materials }}\" data-pk=\"{{ pk }}\" name=\"models\" value=\"{{ model }}\" class=\"form-control input-sm\" > </td> <td> <input type=\"text\" data-mat=\"{{ materials }}\" data-pk=\"{{ pk }}\" placeholder=\"aaaa-mm-dd\" maxlength=\"10\" value=\"{{ delivery }}\" name=\"dates\" class=\"form-control input-sm input-dates\"> </td> <td class=\"text-center\"> <button class=\"btn btn-xs btn-link text-black btn-file\" value=\"{{ materials }}\" data-pk=\"{{ pk }}\" ><span class=\"glyphicon glyphicon-cloud-upload\"></span></button> </td> </tr>";
      $tb = $("table.table-details > tbody");
      $tb.empty();
      for (x in response.details) {
        response.details[x].item = parseInt(x) + 1;
        $tb.append(Mustache.render(template, response.details[x]));
      }
      return calcTotals();
    }
  });
};
