var $requestRequireTmp, addListCusSectors, addMaterial, addMaterialUpdateMeter, addoldMaterialRemoveDeductive, aggregateMaterialsOutMeter, aggregate_nipples, approvedAdditional, approvedModify, backModify, backOrders, calMeter, calcAmountModifySector, calcAmountSector, calcDiffModify, cancelRequeriment, changeRadio, changeRdoNip, changeSelectDeductiveMeter, changeTypeDeductive, chkNippChange, clearFieldsDeductiveMeter, commentToogle, copyBack, createTableDeductive, deductiveOneCancel, delAllMaterialDeductiveGlobal, delMaterials, delPlane, delUnitDeductiveGlobal, deleteAllUpdateMeter, deleteMaterialUpdateMeter, delete_all_temp_nipples, dellAllMaterial, displayResultTable, editBrandandModel, editMaterials, generateDeductiveMeter, generateOrders, getCountDSector, getPercentAttend, listMaterials, list_temp_nipples, loadMaterials, loadSecandSub, loadSector, loadsAccounts, nextOrders, nippleDelOne, openAddMaterial, openBrand, openModel, panelPlanes, pasteAllLeft, pasteAllRight, pasteMaterials, pasteOneLeft, pasteOneRight, processRequeriment, publisherCommnet, readerPrices, savePreOrders, saveWithoutPrice, saved_or_update_nipples, searchDescDeductiveGlobal, selectChoiseOrder, sendAlertModified, showEditComment, showGuideByProyect, showHideTbody, showInitDeductive, showListNipp, showListPreOrders, showModalSetPrices, showModify, showOrders, showOrdersByProyect, showPanelAddMateialsOldDeductiveGlobal, showPreOrders, showTableDeductiveGlobal, show_edit_nipple, showaddtableoutdeductivemeter, startModidfy, tableUp, updateCommentMat, updateMaterialUpdateMeter, uploadOrdersFormat, uploadPlane, valMax, valQuantityPreOrders, validBlurNumber, validOrders, validQuantityPreOrder, viewFull;

$(document).ready(function() {
  $('[data-toggle="tooltip"]').tooltip();
  $(".panel-add,input[name=read], .step-second, .body-subandsec, .body-sector, .body-materials, .ordersbedside, .panel-modify, .btn-update-meter-cancel, .btn-show-materials-meter, .btn-deductivo-meter, .btn-upload-plane-meter, .btn-save-modify-meter, .deductive-one, .panel-deductive-global, .panel-search-material-old, .panel-materials-old, .control-deductive-one, .control-deductive-cus, .panel-price-two").hide();
  $("input[name=traslado], input[name=pre-transfer]").datepicker({
    "dateFormat": "yy-mm-dd",
    changeMonth: true,
    changeYear: true,
    minDate: "0"
  });
  $(".panel-add-mat, .view-full").hide();
  $(".btn-show-mat, .btn-show-materials-meter").on("click", openAddMaterial);
  $("input[name=plane]").on("change", uploadPlane);
  $(".btn-show-planes").on("click", panelPlanes);
  $("[name=show-full]").on("click", viewFull);
  $("[name=plane-del]").on("click", delPlane);
  $(".btn-add").on("click", addMaterial);
  $(".btn-show-del").on("click", dellAllMaterial);
  $("[name=show-plane], .btn-upload-plane-meter").on("click", function(event) {
    return $("input[name=plane]").click();
  });
  $(document).on("click", ".btn-del-mat", delMaterials);
  $(document).on("click", ".btn-show-secsub", loadSecandSub);
  $(document).on("click", ".btn-show-subproject_id", loadSector);
  $(document).on("click", ".btn-show-sector_id", loadMaterials);
  $(".btn-save-edit").on("click", editMaterials);
  $(document).on("change", ".change-modify", calcDiffModify);
  $(".btn-show-copy").on("click", function() {
    $(".mcopy").modal("show");
    $.getJSON("/json/projects/lists/", {
      "sector": true,
      "pro": $("input[name=pro]").val(),
      "sub": $("input[name=sub]").val()
    }, function(response) {
      var $sec, template, x;
      if (response.status) {
        template = "<a class=\"list-group-item\"> <button class=\"btn badge btn-primary btn-show-sector_id\" value=\"{{ sector_id }}\" data-sub=\"{{ subproject_id }}\" data-pro=\"{{ project_id }}\" data-body=\"projects\"><span class=\"glyphicon glyphicon-chevron-right\"></span></button> {{ name }} </a>";
        $sec = $("ul.sector-local");
        $sec.empty();
        for (x in response.sector) {
          $sec.append(Mustache.render(template, response.sector[x]));
        }
      }
    });
  });
  $(".btn-back").on("click", copyBack);
  $(".btn-paste").on("click", pasteMaterials);
  $("input[name=rcp]").on("change", changeRadio);
  $(document).on("click", ".btn-show-edit", function() {
    var $materials;
    $(".btn-save-edit").val(this.value);
    $materials = $("tr." + this.value + " > td");
    editBrandandModel($materials.eq(5).text(), $materials.eq(6).text());
    $(".text-edit").text(($materials.eq(2).text()) + " " + ($materials.eq(3).text()));
    $("input[name=edit-materials]").val($materials.eq(1).text());
    $("input[name=edit-quantity]").val(this.getAttribute("data-quantity"));
    $("input[name=edit-price]").val(this.getAttribute("data-purchase"));
    $("input[name=edit-sales]").val(this.getAttribute("data-sales"));
    return $(".medit").modal("toggle");
  });
  $("select[name=edit-brand]").on("change", function(event) {
    return $.getJSON("/json/model/list/option/", {
      "brand": $("select[name=edit-brand]").val()
    }, function(response) {
      var $model, template, x;
      if (response.status) {
        template = "<option value=\"{{ model_id }}\" title>{{ model }}</option>";
        $model = $("select[name=edit-model]");
        $model.empty();
        for (x in response.model) {
          if (model === response.model[x].model) {
            $model.append(Mustache.render(template.replace("title", "selected"), response.model[x]));
          } else {
            $model.append(Mustache.render(template, response.model[x]));
          }
        }
      }
    });
  });
  $("input[name=proid], input[name=proname]").on("keyup", function(event) {
    var data, key;
    key = window.Event ? event.keyCode : event.which;
    if (key === 13) {
      data = new Object();
      if (this.name === "proid") {
        data.code = $("input[name=proid]").val();
      } else {
        data.name = $("input[name=proname]").val();
      }
      data.project = true;
      $.getJSON("/json/projects/lists/", data, function(response) {
        var $tb, template, x;
        if (response.status) {
          template = "<tr><td>{{ project_id }}</td><td>{{ name }}</td><td><button class=\"btn badge btn-primary btn-xs btn-show-secsub\" value=\"{{ project_id }}\" data-body=\"projects\"><span class=\"glyphicon glyphicon-chevron-right\"></span></button></td></tr>";
          $tb = $(".table-projects > tbody");
          $tb.empty();
          for (x in response.project) {
            $tb.append(Mustache.render(template, response.project[x]));
          }
        }
      });
    }
  });
  $("input[name=choice]").on("change", selectChoiseOrder);
  $(document).on("click", ".btn-nip-edit", show_edit_nipple);
  $(document).on("click", ".btn-nip-del", nippleDelOne);
  $(".btn-show-orders").on("click", showOrders);
  $(document).on("click", ".btn-append-list-nipp", showListNipp);
  $(document).on("click", ".showhidenipp", showHideTbody);
  $(document).on("change", "input[name=rdonipp]", changeRdoNip);
  $(document).on("change", ".chknipp", chkNippChange);
  $(document).on("blur", ".valquamax", valMax);
  $(".btn-next-order").on("click", nextOrders);
  $(".btn-back-order").on("click", backOrders);
  $(".comment-mat").on("blur", updateCommentMat);
  $(".btn-generate-orders").on("click", generateOrders);
  $("#orderf").click(function() {
    return $("#orderfile").click();
  });
  $(".btn-update-meter").on("click", showModify);
  $(".btn-update-meter-cancel").on("click", backModify);
  $(".btn-reload-modify").on("click", startModidfy);
  $(document).on("blur", "table.table-modify > tbody > tr > td > input[type=number]", validBlurNumber);
  $(document).on("click", ".btn-update-update", updateMaterialUpdateMeter);
  $(document).on("click", ".btn-delete-update", deleteMaterialUpdateMeter);
  $(".btn-add-update-meter").on("click", addMaterialUpdateMeter);
  $("[name=dedmeterradio]").on("change", changeSelectDeductiveMeter);
  $(".btn-aggregate-deductive-meter-materials").on("click", aggregateMaterialsOutMeter);
  $(".btn-deductive-meter-clear-fields").on("click", clearFieldsDeductiveMeter);
  $(".btn-deductive-generate-meter").on("click", generateDeductiveMeter);
  $(".btn-approval-addcional").on("click", approvedAdditional);
  $(".btn-deductivo-meter").on("click", createTableDeductive);
  $(".btn-deductive-one-cancel").on("click", deductiveOneCancel);
  $(".btn-save-modify-meter").on("click", approvedModify);
  $(".btn-create-deductivo").on("click", showInitDeductive);
  $(".btn-add-materials-deductive-global").on("click", showPanelAddMateialsOldDeductiveGlobal);
  $("[name=typeDeductive]").on("click", changeTypeDeductive);
  $("input[name=searchdesc]").on("keyup", searchDescDeductiveGlobal);
  $(".btn-all-right").on("click", pasteAllRight);
  $(".btn-all-left").on("click", pasteAllLeft);
  $(".btn-one-right").on("click", pasteOneRight);
  $(".btn-one-left").on("click", pasteOneLeft);
  $(".btn-cust-ok").on("click", addListCusSectors);
  $(document).on("click", ".btn-add-material-remove", addoldMaterialRemoveDeductive);
  $(document).on("click", ".btn-deductive-meter-select", showaddtableoutdeductivemeter);
  $(document).on("click", ".btn-show-table-deductive-global", showTableDeductiveGlobal);
  $(".btn-delete-materials-deductive-global").on("click", delAllMaterialDeductiveGlobal);
  $(document).on("click", ".btn-delete-deductive-global-tr", delUnitDeductiveGlobal);
  calcAmountSector();
  $("button.btn-alert-modified").on("click", sendAlertModified);
  $("button.btn-del-all-modify").on("click", deleteAllUpdateMeter);
  tinymce.init({
    selector: "textarea[name=obser]",
    theme: "modern",
    menubar: false,
    statusbar: false,
    plugins: "link contextmenu",
    fullpage_default_doctype: "<!DOCTYPE html>",
    font_size_style_values: "10px,12px,13px,14px,16px,18px,20px",
    toolbar1: "styleselect | fontsizeselect | | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |",
    toolbar2: "undo redo | bold italic |"
  });
  tinymce.init({
    selector: "textarea#message",
    theme: "modern",
    menubar: false,
    statusbar: false,
    plugins: "link contextmenu",
    font_size_style_values: "10px,12px,13px,14px,16px,18px,20px",
    toolbar: "undo redo | styleselect | fontsizeselect |"
  });
  tinymce.init({
    selector: "#pre-observation,#pre-nipples",
    theme: "modern",
    menubar: false,
    statusbar: false,
    font_size_style_values: "10px,12px,13px,14px,16px,18px,20px",
    toolbar: "undo redo | styleselect | fontsizeselect | bold italic"
  });
  $("input[name=mailer-enable]").checkboxpicker().on("change", loadsAccounts);
  $("button.btn-publisher").on("click", publisherCommnet);
  $(".btn-message-edit").on("click", showEditComment);
  $("button.btn-block-comment").on("click", commentToogle);
  $("button.btn-annimate-up").on("click", tableUp);
  $("button.btn-reader-prices").on("click", readerPrices);
  $("button.btn-show-guide").on("click", showGuideByProyect);
  $("button.btn-show-orders-do").on("click", showOrdersByProyect);
  $(".btn-generate-pre-orders").on("click", showPreOrders);
  $(".btn-save-pre-orders").on("click", savePreOrders);
  $(".bshowprices").on("click", showModalSetPrices);
  $(".saveWithoutPrice").on("click", saveWithoutPrice);
  $("table.table-float").floatThead({
    useAbsolutePositioning: true,
    scrollingTop: 50
  }).mouseenter(function() {
    return $(this).floatThead("reflow");
  });
  getPercentAttend();
  getCountDSector();
});

tableUp = function(event) {
  goToElement(event, "table.table-details");
};

commentToogle = function(event) {
  var $btn;
  $btn = $(this);
  $("div.panel-comment-toogle").toggle("slow", function() {
    if (this.style.display === "block") {
      return $btn.find("span").removeClass("fa-angle-double-down").addClass("fa-angle-double-up");
    } else {
      return $btn.find("span").removeClass("fa-angle-double-up").addClass("fa-angle-double-down");
    }
  });
};

loadsAccounts = function(event) {
  if ($("input[name=mailer-enable]").is(":checked")) {
    showGlobalEnvelop();
    $("iframe#globalmbody_ifr").contents().find("body").html($("#message_ifr").contents().find("body").html());
    if ($("select[name=globalmfor]").find("option").length === 0) {
      getAllCurrentAccounts();

      /*setTimeout ->
          if globalMailerData.hasOwnProperty("fors")
              items = ["for","cc", "cco"]
              for c in items
                  $item = $("select[name=globalm#{c}]")
                  tmp = "<option value=\"{{ email }}\">{{ email }}</option>"
                  for x in globalMailerData.fors
                      $item.append "<option value=\"#{x}\">#{x}</option>"
                  $item.trigger("chosen:updated")
              return
      , 200
       */
    }
  }
};

publisherCommnet = function() {
  var data;
  data = new Object();
  if ($("input[name=edit-message]").val() !== "") {
    data.edit = $("input[name=edit-message]").val();
  }
  data.message = $.trim($("#message_ifr").contents().find("body").html());
  data.status = $("select[name=message-status]").val();
  if (data.message === "<p><br data-mce-bogus=\"1\"></p>") {
    $().toastmessage("showWarningToast", "No se puede publicar el mensaje, campo vacio.");
    return false;
  }
  data.alertmsg = true;
  data.proyecto = $("input[name=pro]").val();
  data.subproyecto = $("input[name=sub]").val();
  data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
  $.post("", data, function(response) {
    if (response.status) {
      return location.reload();
    }
  }, "json");
};

showEditComment = function() {
  var id;
  if (this.getAttribute("data-id") !== "") {
    id = this.getAttribute("data-id");
    $("#message_ifr").contents().find("body").html($(".comment" + id).find("div").eq(2).html());
    $("select[message-status]").val(this.getAttribute("data-status"));
    $("input[name=edit-message]").val(id);
  }
};

loadSecandSub = function(event) {
  $(".body-projects, .body-sector, .body-materials").hide();
  $(".body-subandsec").show(600);
  $(".btn-back").val($(this).attr("data-body"));
  $.getJSON("/json/projects/lists/", {
    "pro": this.value,
    "subproject": true,
    "sector": true
  }, function(response) {
    var $item, template, x;
    if (response.status) {
      template = "<a class=\"list-group-item\"> <button class=\"btn badge btn-primary btn-show-sector_id\" value=\"{{ sector_id }}\" data-sub=\"{{ subproject_id }}\" data-pro=\"{{ project_id }}\" data-body=\"subandsec\"><span class=\"glyphicon glyphicon-chevron-right\"></span></button> {{ name }} </a>";
      $item = $("ul.sectors");
      $item.empty();
      for (x in response.sector) {
        $item.append(Mustache.render(template, response.sector[x]));
      }
      $item = $("ul.subprojects");
      template = template.replace("sector_id", "subproject_id", 2);
      $item.empty();
      for (x in response.subproject) {
        $item.append(Mustache.render(template, response.subproject[x]));
      }
    }
  });
};

loadSector = function(event) {
  $(".body-projects, .body-subandsec, .body-materials").hide();
  $(".body-sector").show(600);
  $(".btn-back").val($(this).attr("data-body"));
  $.getJSON("/json/projects/lists/", {
    "pro": $(this).attr("data-pro"),
    "sub": $(this).attr("data-sub"),
    "sector": true
  }, function(response) {
    var $item, template, x;
    if (response.status) {
      template = "<a class=\"list-group-item\"> <button class=\"btn badge btn-primary btn-show-sector_id\" value=\"{{ sector_id }}\" data-sub=\"{{ subproject_id }}\" data-pro=\"{{ project_id }}\" data-body=\"sector\"><span class=\"glyphicon glyphicon-chevron-right\"></span></button> {{ name }} </a>";
      $item = $("ul.list-sector");
      $item.empty();
      for (x in response.sector) {
        $item.append(Mustache.render(template, response.sector[x]));
      }
    }
  });
};

loadMaterials = function(event) {
  $(".body-projects, .body-subandsec, .body-sector").hide();
  $(".body-materials").show(600);
  $(".btn-back").val($(this).attr("data-body"));
  $("input[name=cpro]").val($(this).attr("data-pro"));
  $("input[name=csub]").val($(this).attr("data-sub"));
  $("input[name=csec]").val(this.value);
  $.getJSON("/json/projects/lists/", {
    "pro": $(this).attr("data-pro"),
    "sub": $(this).attr("data-sub"),
    "sec": this.value,
    "materials": true
  }, function(response) {
    var $item, template, x;
    if (response.status) {
      template = "<tr id=\"{{ materials_id }}-copy\"><td>{{ item }}</td><td><input type=\"checkbox\" name=\"copy\" value=\"{{ materials_id }}-copy\"></td><td>{{ materials_id }}</td><td>{{ name }}</td><td>{{ measure }}</td><td>{{ unit }}</td><td>{{ quantity }}</td><td>{{ price }}</td></tr>";
      $item = $("table.table-copy > tbody");
      $item.empty();
      for (x in response.materials) {
        response.materials[x].item = parseInt(x) + 1;
        $item.append(Mustache.render(template, response.materials[x]));
      }
    }
  });
};

copyBack = function(event) {
  if ($(".body-sector").is(":visible")) {
    this.value = "subandsec";
  } else if ($(".body-sector").is(":visible")) {
    this.value = "projects";
  } else if ($(".body-subandsec").is(":visible")) {
    this.value = "projects";
  }
  if ($(".body-projects").is(":visible")) {
    $(".body-projects").hide();
  }
  if ($(".body-subandsec").is(":visible")) {
    $(".body-subandsec").hide();
  }
  if ($(".body-sector").is(":visible")) {
    $(".body-sector").hide();
  }
  if ($(".body-materials").is(":visible")) {
    $(".body-materials").hide();
  }
  $(".body-" + this.value).show(600);
};

editBrandandModel = function(brand, model) {
  $.getJSON("/json/brand/list/option/", function(response) {
    var $brand, template, x;
    if (response.status) {
      template = "<option value=\"{{ brand_id }}\" title>{{ brand }}</option>";
      $brand = $("select[name=edit-brand]");
      $brand.empty();
      for (x in response.brand) {
        if (brand === response.brand[x].brand) {
          $brand.append(Mustache.render(template.replace("title", "selected"), response.brand[x]));
        } else {
          $brand.append(Mustache.render(template, response.brand[x]));
        }
      }
      $.getJSON("/json/model/list/option/", {
        "brand": $("select[name=edit-brand]").val()
      }, function(response) {
        var $model;
        if (response.status) {
          template = "<option value=\"{{ model_id }}\" title>{{ model }}</option>";
          $model = $("select[name=edit-model]");
          $model.empty();
          for (x in response.model) {
            if (model === response.model[x].model) {
              $model.append(Mustache.render(template.replace("title", "selected"), response.model[x]));
            } else {
              $model.append(Mustache.render(template, response.model[x]));
            }
          }
        }
      });
    }
  });
};

openBrand = function() {
  var interval, url, win;
  url = "/brand/new/";
  win = window.open(url, "Popup", "toolbar=no, scrollbars=yes, resizable=no, width=400, height=600");
  interval = window.setInterval(function() {
    if (win === null || win.closed) {
      window.clearInterval(interval);
      searchBrandOption();
    }
  }, 1000);
  return win;
};

openModel = function() {
  var interval, url, win;
  url = "/model/new/";
  win = window.open(url, "Popup", "toolbar=no, scrollbars=yes, resizable=no, width=400, height=600");
  interval = window.setInterval(function() {
    if (win === null || win.closed) {
      window.clearInterval(interval);
      searchModelOption();
    }
  }, 1000);
  return win;
};

openAddMaterial = function(event) {
  event.preventDefault();
  $(".panel-add-mat").toggle(function() {
    if ($(this).is(":hidden")) {
      $(".btn-show-mat").find("span").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
    } else {
      $(".btn-show-mat").find("span").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
    }
    return $("table.table-modify").floatThead("reflow");
  });
};

uploadPlane = function(event) {
  var data;
  if (this.files[0] !== null) {
    data = new FormData();
    data.append("type", "plane");
    data.append("files", this.files[0]);
    data.append("proyecto", $("input[name=pro]").val());
    data.append("subproyecto", $("input[name=sub]").val());
    data.append("sector", $("input[name=sec]").val());
    data.append("csrfmiddlewaretoken", $("[name=csrfmiddlewaretoken]").val());
    $.ajax({
      data: data,
      url: "",
      type: "POST",
      dataType: "json",
      cache: false,
      processData: false,
      contentType: false,
      success: function(response) {
        if (response.status) {
          return location.reload();
        } else {
          return $().toastmessage("showErrorToast", "No se ha cargado un archivo.");
        }
      }
    });
  } else {
    $().toastmessage("showWarningToast", "No se ha cargado un archivo.");
  }
};

panelPlanes = function(event) {
  var btn;
  btn = this;
  $(".panel-planes > .panel-body").toggle(function() {
    if ($(".panel-planes > .panel-body").is(":hidden")) {
      $(btn).find("span").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
    } else {
      $(btn).find("span").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
    }
  });
};

viewFull = function(event) {
  var btn;
  btn = this;
  $(".view-full").toggle(function() {
    if ($(this).is(":hidden")) {
      $(".navbar").show("blind", 600);
    } else {
      $(".navbar").hide("blind", 600);
      $("#planefull").attr("src", btn.value);
    }
  });
};

delPlane = function(event) {
  var data;
  data = new Object();
  data.type = "delplane";
  data.files = this.value;
  data.pro = $("input[name=pro]").val();
  data.sub = $("input[name=sub]").val();
  data.sec = $("input[name=sec]").val();
  data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
  $().toastmessage("showToast", {
    "text": "Desea eliminar el <q>Plano</q>?",
    "type": "confirm",
    "sticky": true,
    buttons: [
      {
        value: 'Si'
      }, {
        value: 'No'
      }
    ],
    success: function(result) {
      if (result === "Si") {
        return $.post("", data, function(response) {
          if (response.status) {
            return location.reload();
          } else {
            return $().toastmessage("showWarningToast", "Error, al eliminar el plano.");
          }
        });
      }
    }
  });
};

addMaterial = function(event) {
  var currency, data, purchase;
  data = new Object();
  data.proyecto = $("input[name=pro]").val();
  data.subproyecto = $("input[name=sub]").val();
  data.sector = $("input[name=sec]").val();
  data.type = "add";
  data.materiales = $(".id-mat").text();
  data.cantidad = $("input[name=cantidad]").val();
  data.precio = $("input[name=precio]").val();
  data.sales = $("input[name=sales]").val();
  data.brand = $("select[name=brand]").val();
  data.model = $("select[name=model]").val();
  data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
  if (data.materiales !== "" && data.cantidad !== "" && data.precio !== "") {
    currency = $("select[name=moneda]").val();
    if ($("[name=currency]").val() !== currency) {
      purchase = 0;
      if ($("input[name=exchangep]").length) {
        purchase = convertNumber($("input[name=exchangep]").val());
      } else {
        if ($("[name=" + ($("[name=currency]").val()) + "]").val() === null || $("[name=" + ($("[name=currency]").val()) + "]").val() === void 0) {
          $().toastmessage("showWarningToast", "El tipo de cambio no esta registrado.");
          return false;
        }
        purchase = $("[name=" + ($("[name=currency]").val()) + "]").val();
      }
      data['precio'] = data['precio'] * parseFloat(purchase);
      data['sales'] = data['sales'] * parseFloat(purchase);
    }
    if ($("input[name=gincludegroup]").length) {
      if ($("input[name=gincludegroup]").is(":checked")) {
        data.details = JSON.stringify(tmpObjectDetailsGroupMaterials.details);
      }
    }
    data.sales = parseFloat(data.sales);
    $.post("", data, function(response) {
      var tmpObjectDetailsGroupMaterials;
      if (response.status) {
        listMaterials();
        return tmpObjectDetailsGroupMaterials = new Object;
      } else {
        return $().toastmessage("showErrorToast", "No found Transaction " + response.raise);
      }
    }, "json");
    return;
  } else {
    $().toastmessage("showWarningToast", "Existe campos vacio.");
  }
};

listMaterials = function() {
  var data;
  data = new Object();
  data.pro = $("input[name=pro]").val();
  data.sub = $("input[name=sub]").val();
  data.sec = $("input[name=sec]").val();
  data.type = "list";
  $.getJSON("", data, function(response) {
    var $tb, results, template, x;
    if (response.status) {
      template = "<tr class=\"{{ materials_id }}-{{ id }}\"> <td class=\"col-1\">{{ item }}</td> <td class=\"col-3\">{{ materials_id }}</td> <td class=\"col-6\">{{ name }}</td> <td class=\"col-5\">{{ measure }}</td> <td class=\"col-2\">{{ unit }}</td> <td class=\"col-2\">{{ brand }}</td> <td class=\"col-2\">{{ model }}</td> <td class=\"col-2\">{{ quantity }}</td> <td class=\"col-2\">{{ price }}</td> <td class=\"col-2\">{{ sales }}</td> <td class=\"col-2\"> <button class=\"btn btn-xs btn-link text-green btn-show-edit\" value=\"{{ materials_id }}-{{ id }}\" data-quantity=\"{{ quantity }}\" data-purchase=\"{{ price }}\" data-sales=\"{{ sales }}\"> <span class=\"glyphicon glyphicon-pencil\"></span> </button> </td> <td class=\"col-2\"> <button class=\"btn btn-xs btn-link text-red btn-del-mat\" value=\"{{ materials_id }}-{{ id }}\"> <span class=\"glyphicon glyphicon-trash\"></span> </button> </td> </tr>";
      $tb = $(".table-details > tbody");
      $tb.empty();
      results = [];
      for (x in response.list) {
        response.list[x].item = parseInt(x) + 1;
        results.push($tb.append(Mustache.render(template, response.list[x])));
      }
      return results;
    }
  });
};

delMaterials = function(event) {
  var $materials, btn;
  btn = this.value;
  $materials = $("." + this.value + " > td");
  $().toastmessage("showToast", {
    "text": "Desea eliminar " + ($materials.eq(2).text()) + " " + ($materials.eq(3).text()) + "?",
    "sticky": true,
    "type": "confirm",
    "buttons": [
      {
        value: 'Si'
      }, {
        value: 'No'
      }
    ],
    "success": function(result) {
      var data;
      if (result === "Si") {
        data = new Object();
        data.pro = $("input[name=pro]").val();
        data.sub = $("input[name=sub]").val();
        data.sec = $("input[name=sec]").val();
        data.materials = $materials.eq(1).text();
        data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
        data.type = "del";
        $.post("", data, function(response) {
          if (response.status) {
            $("." + btn).remove();
            $(".table-details > tbody > tr").each(function(index, element) {
              return $(element).find("td").eq(0).text(index + 1);
            });
          } else {
            return $().toastmessage("showWarningToast", "No se elimino el material.");
          }
        });
      }
    }
  });
};

editMaterials = function(event) {
  var btn, currency, data, purchase;
  btn = this;
  data = new Object();
  data.proyecto = $("input[name=pro]").val();
  data.subproyecto = $("input[name=sub]").val();
  data.sector = $("input[name=sec]").val();
  data.materiales = $("input[name=edit-materials]").val();
  data.cantidad = $("input[name=edit-quantity]").val();
  data.precio = $("input[name=edit-price]").val();
  data.sales = $("input[name=edit-sales]").val();
  data.brand = $("select[name=edit-brand]").val();
  data.model = $("select[name=edit-model]").val();
  data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
  data.type = "add";
  data.edit = true;
  if (data.cantidad !== "" && data.precio !== "") {
    currency = $("select[name=moneda-e]").val();
    if ($("[name=currency]").val() !== currency) {
      purchase = 0;
      if ($("input[name=exchangep]").length) {
        purchase = convertNumber($("input[name=exchangep]").val());
      } else {
        if ($("[name=" + ($("[name=currency]").val()) + "]").val() === null || $("[name=" + ($("[name=currency]").val()) + "]").val() === void 0) {
          $().toastmessage("showWarningToast", "El tipo de cambio no esta registrado.");
          return false;
        }
        purchase = $("[name=" + ($("[name=currency]").val()) + "]").val();
      }
      data['precio'] = data['precio'] * parseFloat(purchase);
      data.sales = data.sales * parseFloat(purchase);
    }
    $.post("", data, function(response) {
      var $materials;
      if (response.status) {
        $materials = $("." + btn.value + " > td");
        $materials.eq(5).text($("select[name=edit-brand]").find("option:selected").text());
        $materials.eq(6).text($("select[name=edit-model]").find("option:selected").text());
        $materials.eq(7).text(data.cantidad);
        $materials.eq(8).text(data.precio);
        $materials.eq(9).text(data.sales);
        $materials.eq(10).find("button").attr("data-quantity", data.cantidad).attr("data-purchase", data.precio).attr("data-sales", data.sales);
        $(".medit").modal("toggle");
        return calcAmountSector();
      } else {
        return $().toastmessage("showWarningToast", "No se edito el material.");
      }
    }, "json");
  } else {
    $().toastmessage("showWarningToast", "Existen campos vacios o menores a uno.");
  }
};

dellAllMaterial = function(event) {
  $().toastmessage("showToast", {
    "text": "Desea eliminar toda la lista de materiales?",
    "sticky": true,
    "type": "confirm",
    "buttons": [
      {
        value: 'Si'
      }, {
        value: 'No'
      }
    ],
    "success": function(result) {
      var data;
      if (result === "Si") {
        data = new Object();
        data.pro = $("input[name=pro]").val();
        data.sub = $("input[name=sub]").val();
        data.sec = $("input[name=sec]").val();
        data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
        data.type = "killdata";
        $.post("", data, function(response) {
          if (response.status) {
            return location.reload();
          } else {
            return $().toastmessage("showWarningToast", "No se elimino la lista de materiales.");
          }
        });
      }
    }
  });
};

pasteMaterials = function() {
  var $cp, arr, counter, data;
  console.log("here Click");
  $cp = $("input[name=copy]");
  data = new Object();
  arr = new Array();
  counter = 0;
  $cp.each(function(index, element) {
    var $td;
    if (this.checked) {
      counter += 1;
      $td = $("#" + this.value + " > td");
      arr.push($td.eq(2).text());
    }
  });
  data.materials = arr;
  data.paste = true;
  data.pro = $("input[name=pro]").val();
  data.sub = $("input[name=sub]").val();
  data.sec = $("input[name=sec]").val();
  data.cpro = $("input[name=cpro]").val();
  data.csub = $("input[name=csub]").val();
  data.csec = $("input[name=csec]").val();
  data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
  console.log(data);
  if (counter > 0 && counter <= $cp.length) {
    $.post("/json/projects/lists/", data, function(response) {
      console.log(response);
      if (response.status) {
        return location.reload();
      } else {
        return $().toastmessage("showErrorToast", "No found Transaction");
      }
    }, "json");
  }
};

changeRadio = function(event) {
  $(this).each(function(index, element) {
    var rdo;
    if (this.checked) {
      rdo = this;
      return $("input[name=copy]").each(function(index, element) {
        return this.checked = rdo.value === "all" ? "checked" : "";
      });
    }
  });
};

selectChoiseOrder = function(event) {
  event.preventDefault();
  $(this).each(function() {
    var chk;
    if (this.checked) {
      chk = this;
      return $("input[name=mats]").each(function(index, element) {
        this.checked = Boolean(parseInt(chk.value));
      });
    }
  });
};

list_temp_nipples = function(idmat) {
  var data;
  data = {
    "list-nip": true,
    "pro": $("input[name=pro]").val(),
    "sub": $("input[name=sub]").val(),
    "sec": $("input[name=sec]").val(),
    "mat": idmat
  };
  $.getJSON("", data, function(response) {
    var $tb, template, x;
    if (response.status) {
      template = "<tr class=\"trnip{{ id }}\"> <td>{{ quantity }}</td> <td>{{ name }}</td> <td>{{ diameter }}</td> <td>x</td> <td>{{ measure }}</td> <td>{{ unit }}</td> <td>{{ comment }}</td> <td> <button class=\"btn btn-xs btn-link text-green btn-nip-edit {{ view }}\" data-edit-nip=\"{{ materials }}\" value=\"{{ id }}\" data-tag=\"{{ tag }}\"> <span class=\"glyphicon glyphicon-pencil\"></span> </button> </td> <td> <button class=\"btn btn-xs btn-link btn-nip-del text-red {{ view }}\" data-del-nip=\"{{ materials }}\" value=\"{{ id }}\"> <span class=\"glyphicon glyphicon-trash\"></span> </button> </td> </tr>";
      $tb = $("table > tbody.tdn" + idmat);
      $tb.empty();
      for (x in response.list) {
        response.list[x].item = parseInt(x) + 1;
        template = "<tr class=\"trnip" + response.list[x].id + "\"> <td>" + response.list[x].quantity + "</td> <td>" + response.list[x].name + "</td> <td>" + response.list[x].diameter + "</td> <td>x</td> <td>" + response.list[x].measure + "</td> <td>" + response.list[x].unit + "</td> <td>" + response.list[x].comment + "</td> <td> <button class=\"btn btn-xs btn-link text-green btn-nip-edit " + response.list[x].view + "\" data-edit-nip=\"" + response.list[x].materials + "\" value=\"" + response.list[x].id + "\" data-tag=\"" + response.list[x].tag + "\"> <span class=\"glyphicon glyphicon-pencil\"></span> </button> </td> <td> <button class=\"btn btn-xs btn-link btn-nip-del text-red " + response.list[x].view + "\" data-del-nip=\"" + response.list[x].materials + "\" value=\"" + response.list[x].id + "\"> <span class=\"glyphicon glyphicon-trash\"></span> </button> </td> </tr>";
        $tb.append(template);
        console.log($tb);
        console.table(response.list[x]);
      }
      $(".in" + idmat).text(response.ingress);
      $(".res" + idmat).text(($(".totr" + idmat).val() * 100) - response.ingress);
      $("table.table-float").floatThead("reflow");
    }
  });
};

aggregate_nipples = function(idmat) {
  $(".nv" + idmat).val("");
  $(".mt" + idmat).val("");
  $(".tn" + idmat).val("");
  $(".nc" + idmat).text("");
  $(".update-quantity-" + idmat).val("");
  $(".update-id-" + idmat).val("");
  $(".tn" + idmat + ",.mt" + idmat + ",.nv" + idmat + ",.nc" + idmat + ",.bn" + idmat).attr("disabled", false);
};

saved_or_update_nipples = function(idmat) {
  var data, pass;
  if (idmat.length === 15) {
    data = new Object();
    pass = false;
    data.addnip = true;
    data.proyecto = $("input[name=pro]").val();
    data.subproyecto = $("input[name=sub]").val();
    data.sector = $("input[name=sec]").val();
    data.materiales = idmat;
    data.metrado = parseFloat($(".mt" + idmat).val());
    data.tipo = $(".tn" + idmat).val();
    data.cantidad = parseFloat($(".nv" + idmat).val());
    data.cantshop = parseFloat($(".nv" + idmat).val());
    data.comment = $($(".nc" + idmat)).val();
    data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
    if ($("input.update-id-" + idmat).val() !== "") {
      data.id = $("input.update-id-" + idmat).val();
      pass = (data.metrado * data.cantidad) <= (parseFloat(parseInt($(".res" + idmat).text()) + parseFloat(parseInt($(".update-quantity-" + idmat).val())))) ? true : false;
    } else {
      pass = (data.metrado * data.cantidad) <= parseFloat(parseInt($(".res" + idmat).text())) ? true : false;
    }
    if (pass) {
      $.post("", data, function(response) {
        if (response.status) {
          $(".tn" + idmat + ",.mt" + idmat + ",.nv" + idmat + ",.nc" + idmat + ",.bn" + idmat).attr("disabled", true);
          $(".update-quantity-" + idmat).val("");
          $(".update-id-" + idmat).val("");
          return list_temp_nipples(idmat);
        }
      });
      return;
    } else {
      $().toastmessage("showWarningToast", "Cantidad es mayor a la establecida.");
    }
  } else {
    $().toastmessage("showWarningToast", "Código incorrecto");
  }
};

show_edit_nipple = function() {
  var $td, idmat, tipo;
  idmat = $(this).attr("data-edit-nip");
  tipo = new Object();
  $(".tn" + idmat).find("option").each(function(index, element) {
    var text;
    text = $.trim(element.innerHTML);
    text = text.split("-");
    if (text.length === 2) {
      text = text[1];
    } else if (text.length === 3) {
      text = text[1] + "-" + text[2];
    }
    tipo[text] = element.value;
  });
  $(".update-id-" + idmat).val(this.value);
  $td = $(".trnip" + this.value + " > td");
  $(".nv" + idmat).val($td.eq(0).text());
  $(".mt" + idmat).val($td.eq(4).html());
  $(".tn" + idmat).val(tipo[$td.eq(1).text()]);
  $(".nc" + idmat).text($td.eq(6).text());
  $(".update-quantity-" + idmat).val(parseFloat($td.eq(0).text()) * parseFloat($td.eq(4).text()));
  $(".tn" + idmat + ",.mt" + idmat + ",.nv" + idmat + ",.nc" + idmat + ",.bn" + idmat).attr("disabled", false);
};

delete_all_temp_nipples = function(idmat) {
  if (idmat !== "") {
    $().toastmessage("showToast", {
      text: "Desea eliminar todo los niples de la tuberia?",
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
        var data;
        if (result === "Si") {
          data = new Object();
          data.delnipall = true;
          data.proyecto = $("input[name=pro]").val();
          data.subproyecto = $("input[name=sub]").val();
          data.sector = $("input[name=sec]").val();
          data.materiales = idmat;
          data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
          $.post("", data, function(response) {
            if (response.status) {
              return list_temp_nipples(idmat);
            }
          }, "json");
        }
      }
    });
    return;
  } else {
    $().toastmessage("showWarningToast", "Código de material incorrecto.");
  }
};

nippleDelOne = function() {
  var btn;
  btn = this;
  if (this.value !== "") {
    $().toastmessage("showToast", {
      text: "Desea eliminar el niple seleccionado?",
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
        var data;
        if (result === 'Si') {
          data = new Object;
          data.pk = btn.value;
          data.delnip = true;
          data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
          $.post("", data, function(response) {
            if (response.status) {
              list_temp_nipples(btn.getAttribute("data-del-nip"));
            } else {
              $().toastmessage("showWarningToast", "No se a eliminado el niple.");
            }
          });
        }
      }
    });
  }
};

showOrders = function() {
  var $tb, arr, cnip, counter, data, template, x;
  counter = 0;
  data = new Object();
  arr = new Array();
  $("input[name=mats]").each(function(index, element) {
    var $td;
    if (this.checked) {
      counter += 1;
      $td = $("tr." + this.value + " > td");
      return arr.push({
        "item": counter,
        "materials": $td.eq(2).text(),
        "name": $td.eq(3).text(),
        "measure": $td.eq(4).text(),
        "unit": $td.eq(5).text(),
        "brand": $td.eq(6).text(),
        "model": $td.eq(7).text(),
        "quantity": $td.eq(9).text(),
        "comment": $td.find("input").eq(1).val()
      });
    }
  });
  data.list = arr;
  if (counter > 0) {
    $tb = $("table.torders > tbody.materials");
    $tb.empty();
    cnip = 0;
    for (x in data.list) {
      template = "<tr> <td>{{ item }}</td> <td>{{ materials }}</td> <td>{{ name }}</td> <td>{{ measure }}</td> <td>{{ unit }}</td> <td>{{ brand }}</td> <td>{{ model }}</td> <td>{{ quantity }}</td> <td> {{! input }} </td> </tr>";
      if ($.trim(data.list[x].materials.substring(0, 3)) === "115") {
        template = template.replace("{{! input }}", "<div class=\"input-group\"> <input type=\"number\" class=\"form-control input-sm meter{{ materials }} quantityOrders\" data-mat=\"{{ materials }}\" readonly=\"readonly\" data-brand=\"{{ brand }}\" data-model=\"{{ model }}\" data-comment=\"{{ comment }}\"> <span class=\"input-group-btn\"> <button class=\"btn btn-default btn-sm btn-append-list-nipp\" value=\"{{ materials }}\" type=\"button\"> <span class=\"glyphicon glyphicon-list\"></span> </button> </span> </div>");
        cnip++;
      } else {
        template = template.replace("{{! input }}", "<input type=\"number\" min=\"1\" max=\"{{ quantity }}\" value=\"{{ quantity }}\" data-mat=\"{{ materials }}\" data-brand=\"{{ brand }}\" data-model=\"{{ model }}\" data-comment=\"{{ comment }}\" class=\"form-control input-sm valquamax quantityOrders\">");
      }
      $tb.append(Mustache.render(template, data.list[x]));
    }
    if (cnip === 0) {
      $("table.torders > tbody.nipples").empty();
    }
    $("#morders").modal("toggle");
  } else {
    $().toastmessage("showWarningToast", "Tienes que seleccionar por lo menos un material.");
  }
};

showListNipp = function() {
  var $mat, $tb, $tr, arr, counter, dat, data, idmat, template, two, x;
  idmat = this.value;
  data = new Object();
  arr = new Array();
  counter = 0;
  if ($("table.torders > tbody.nipples > tr.prenip" + idmat).length === 0) {
    $tr = $("table > tbody.tdn" + idmat + " > tr");
    if ($tr.length === 0) {
      list_temp_nipples(this.value);
    }
    $tr.each(function() {
      var $td;
      $td = $(this).find("td");
      counter += 1;
      arr.push({
        "item": counter,
        "quantity": $td.eq(0).text(),
        "name": $td.eq(1).text(),
        "diameter": $td.eq(2).text(),
        "measure": $td.eq(4).text(),
        "unit": "cm",
        "comment": $td.eq(6).text(),
        "id": $td.eq(7).find("button").val(),
        "tag": $td.eq(7).find("button").attr("data-tag")
      });
    });
  } else {
    console.log("row exists");
    counter = 1;
  }
  if (counter > 0) {
    if (arr.length > 0) {
      data.nip = arr;
      $tb = $(".torders > tbody.nipples");
      template = "<tr class=\"" + idmat + "nip{{ id }}\"><td><input type=\"checkbox\" class=\"chknipp chknipp" + idmat + "\" value=\"" + idmat + "nip{{ id }}\" value=\"{{ id }}\"></td><td><input type=\"number\" class=\"form-control input-sm valquamax\" style=\"width:90px;\" data-id=\"{{ id }}\" min=\"1\" max=\"{{ quantity }}\" value=\"{{ quantity }}\" data-mat=\"" + idmat + "\" disabled></td><td>{{ quantity }}</td><td>{{ name }}</td><td>{{ diameter }}</td><td>x</td><td>{{ measure }}</td><td>{{ unit }}</td><td>{{ comment }}</td></tr>";
      template - (two = "<tr class=\"" + idmat + "nip{{ id }}\"><td><input type=\"checkbox\" class=\"chknipp chknipp" + idmat + "\" value=\"" + idmat + "nip{{ id }}\" value=\"{{ id }}\" disabled></td><td><input type=\"number\" class=\"form-control input-sm valquamax\" style=\"width:90px;\" data-id=\"{{ id }}\" min=\"1\" max=\"{{ quantity }}\" value=\"{{ quantity }}\" data-mat=\"" + idmat + "\" disabled></td><td>{{ quantity }}</td><td>{{ name }}</td><td>{{ diameter }}</td><td>x</td><td>{{ measure }}</td><td>{{ unit }}</td><td>{{ comment }}</td></tr>");
      dat = "";
      for (x in data.nip) {
        if (data.nip[x].tag === "2") {
          dat = dat.concat(Mustache.render(template - two, data.nip[x]));
        } else {
          dat = dat.concat(Mustache.render(template, data.nip[x]));
        }
      }
      $mat = $("." + idmat + " > td");
      template = "<tr class=\"prenip" + idmat + "\"><td colspan=\"9\"> <table class=\"table table-condensed table" + idmat + "\"> <thead> <tr> <td colspan=\"8\">" + ($mat.eq(3).text()) + " - " + ($mat.eq(4).text()) + " <div class=\"form-group\">seleccionar : <label class=\"radio-inline\"><input type=\"radio\" data-mat=\"" + idmat + "\" value=\"1\" name=\"rdonipp\"> todo</label> <label class=\"radio-inline\"><input type=\"radio\" data-mat=\"" + idmat + "\" value=\"0\" name=\"rdonipp\"> ninguno.</label> </div></td> </tr> <tr><th><button value=\"" + idmat + "\" class=\"btn btn-xs btn-link showhidenipp\"><span class=\"glyphicon glyphicon-chevron-up\"></span></button></th><th>Pedido</th><th>Cantidad</th><th>Tipo</th><th>Diametro</th><th></th><th>Medida</th><th>Unidad</th></tr> </thead> <tbody>{rows}</tbody> </table> </td></tr>";
      template = template.replace("{rows}", dat);
      $tb.append(template);
    } else {
      console.log("mostramos row old ");
    }
  }
};

showHideTbody = function() {
  var btn;
  btn = this;
  if (this.value.length === 15) {
    $(".table" + this.value + " > tbody").toggle(function() {
      if ($(this).is(":hidden")) {
        return $(btn).find("span").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
      } else {
        return $(btn).find("span").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
      }
    });
  } else {
    $("" + this.value).toggle(function() {
      if ($(this).is(":hidden")) {
        return $(btn).find("span").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
      } else {
        return $(btn).find("span").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
      }
    });
  }
};

changeRdoNip = function() {
  var chk;
  chk = false;
  $(this).each(function() {
    if (this.checked) {
      chk = Boolean(parseInt(this.value));
      $(".chknipp" + ($(this).attr("data-mat"))).each(function() {
        this.checked = chk;
        $(this).change();
      });
    }
  });
};

chkNippChange = function() {
  var $td;
  if (this.value !== "") {
    $td = $("tr." + this.value + " > td");
    $td.eq(1).find("input").attr("disabled", !this.checked);
    calMeter(this.value.substring(0, 15));
  }
};

calMeter = function(matid) {
  var input, m;
  input = $(".meter" + matid);
  m = 0;
  $(".table" + matid + " > tbody > tr").each(function(index, element) {
    var $td, meter, quantity;
    $td = $(element).find("td");
    if ($td.eq(0).find("input").is(":checked")) {
      quantity = parseFloat($td.eq(1).find("input").val());
      meter = parseFloat($td.eq(6).text());
      return m += (quantity * meter) / 100;
    }
  });
  input.val(m);
};

valMax = function() {
  var $input, id, mat, max, val;
  $input = $(this);
  max = parseFloat($input.attr("max"));
  val = parseFloat($input.val());
  mat = $input.attr("data-mat");
  if (val > max) {
    $input.val(max);
  } else if (val < 0) {
    $input.val(0.1);
    id = $input.attr("data-id");
    $("tr." + mat + "nip" + id + " > td").eq(0).find("input").attr("checked", false).change();
  }
  calMeter(mat);
};

nextOrders = function() {
  var pass;
  pass = valQuantityPreOrders();
  if (pass) {
    $(".torders").fadeOut(400);
    $(".ordersbedside").fadeIn(800);
  } else {
    $().toastmessage("showWarningToast", "Existe campos vacios o con valor cero, esto es incorrecto.");
  }
};

backOrders = function() {
  $(".ordersbedside").fadeOut(400);
  $(".torders").fadeIn(800);
};

valQuantityPreOrders = function() {
  var pass;
  pass = false;
  $(".quantityOrders").each(function(index, element) {
    if (element.value === "" || element.value === 0 || element.value === "0") {
      pass = false;
    } else {
      pass = true;
    }
  });
  return pass;
};

updateCommentMat = function() {
  var data;
  data = new Object();
  data.pro = $("input[name=pro]").val();
  data.sub = $("input[name=sub]").val();
  data.sec = $("input[name=sec]").val();
  data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
  data.comment = this.value;
  data.mat = $(this).attr("data-mat");
  data.upcomment = true;
  $.post("", data);
};

validOrders = function() {
  var data, detail, nipp, pass, pipe, tipo, x;
  data = new Object();
  detail = new Array();
  nipp = new Array();
  pipe = new Array();
  pass = false;
  $(".ordersbedside > .row").find("select,input").each(function() {
    if (this.value === "") {
      if (this.name !== "orderfile") {
        pass = false;
        data.elemet = this.name;
        return pass;
      }
    } else {
      if (this.name !== "orderfile" && this.name !== "") {
        data[this.name] = this.value;
        pass = true;
      }
    }
  });
  if (pass) {
    $(".quantityOrders").each(function(index, element) {
      if (element.value !== "" || element.value !== 0 || element.value !== "0") {
        detail.push({
          "idmat": element.getAttribute("data-mat"),
          "quantity": parseFloat(element.value),
          "brand": element.getAttribute("data-brand"),
          "model": element.getAttribute("data-model"),
          "comment": element.getAttribute("data-comment")
        });
        if (element.getAttribute("data-mat").substring(0, 3) === "115") {
          pipe.push(element.getAttribute("data-mat"));
        }
      }
    });
    if (pipe.length > 0) {
      tipo = new Object();
      $(".tn" + detail[0].idmat).find("option").each(function(index, element) {
        var text;
        text = $.trim(element.innerHTML);
        text = text.split("-");
        if (text.length === 2) {
          text = text[1];
        } else if (text.length === 3) {
          text = text[1] + "-" + text[2];
        }
        tipo[text] = element.value;
      });
      for (x in pipe) {
        $(".table" + pipe[x] + " > tbody > tr").each(function(index, element) {
          var $td, ar, met;
          $td = $(element).find("td");
          if ($td.eq(0).find("input").is(":checked")) {
            ar = $("tr.trnip" + ($td.eq(1).find("input").attr("data-id"))).find("td").eq(1).text().split(",");
            met = $("tr.trnip" + ($td.eq(1).find("input").attr("data-id"))).find("td").eq(4).text();
            nipp.push({
              "quantity": parseFloat($td.eq(1).find("input").val()),
              "idnip": $td.eq(1).find("input").attr("data-id"),
              "idmat": $td.eq(1).find("input").attr("data-mat"),
              "comment": $("tr.trnip" + ($td.eq(1).find("input").attr("data-id"))).find("td").eq(6).text(),
              "type": ar[1],
              "meter": met
            });
          }
        });
      }
    }
  }
  data.detail = JSON.stringify(detail);
  data.nipples = JSON.stringify(nipp);
  data.pass = pass;
  return data;
};

generateOrders = function() {
  var btn, data, val;
  val = validOrders();
  console.log(val);
  if (val.pass) {
    btn = this;
    data = new FormData();
    if ($("input[name=orderfile]").get(0).files.length > 0) {
      data.append("orderfile", $("input[name=orderfile]").get(0).files[0]);
    }
    data.append("obser", $("#obser_ifr").contents().find("body").html());
    data.append("proyecto", $("input[name=pro]").val());
    data.append("subproyecto", $("input[name=sub]").val());
    data.append("sector", $("input[name=sec]").val());
    data.append("csrfmiddlewaretoken", $("input[name=csrfmiddlewaretoken]").val());
    data.append("almacen", val.almacen);
    data.append("asunto", val.asunto);
    data.append("empdni", val.empdni);
    data.append("traslado", val.traslado);
    data.append("details", val.detail);
    data.append("nipples", val.nipples);
    data.append("saveorders", true);
    $.ajax({
      data: data,
      url: "",
      type: "POST",
      dataType: "json",
      cache: false,
      contentType: false,
      processData: false,
      beforeSend: function() {
        return $(btn).button("loading");
      },
      success: function(response) {
        console.log(response);
        if (response.status) {
          $(btn).button('loading');
          $().toastmessage("showNoticeToast", "Correcto! se a generado el pedido a almacén nro " + response.nro);
          return setTimeout(function() {
            return location.reload();
          }, 6600);
        } else {
          return $().toastmessage("showWarningToast", "No se a generado el pedido almacén, " + response.raise);
        }
      }
    });
    return;
  } else {
    $().toastmessage("showWarningToast", "existe un error de formatado, revise los campos del formulario");
  }
};

approvedAdditional = function(event) {
  $().toastmessage("showToast", {
    text: "Desea aprobar y pasar a producción esta lista de materiales?",
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
      var $tr, arr, data, inputs, outputs, x;
      if (result === "Si") {
        $tr = $("table.table-deductive-input-new > tbody > tr");
        if ($tr.length) {
          data = new Object();
          data.rtype = $("select[name=typeDeductive]").val();
          if (data.rtype === "ONE") {
            data.relations = $("select[name=sectorone]").val();
          } else if (data.rtype === "CUS") {
            x = $("[name=inputcust]").val().split(",");
            data.relations = JSON.stringify(x);
          }
          inputs = new Array();
          $("table.table-deductive-input-new > tbody > tr").each(function(index, element) {
            var $td, relations;
            $td = $(element).find("td");
            relations = $td.eq(8).find("input").val().split(",");
            inputs.push({
              "materials": $td.eq(1).text(),
              "name": $td.eq(2).text(),
              "measure": $td.eq(3).text(),
              "unit": $td.eq(4).text(),
              "quantity": parseFloat($td.eq(5).text()),
              "price": parseFloat($td.eq(6).text()),
              "output": relations
            });
          });
          data.inputs = JSON.stringify(inputs);
          outputs = new Array();
          $("table.table-deductive-output > tbody > tr").each(function(index, element) {
            var $td;
            $td = $(element).find("td");
            outputs.push({
              "materials": $td.eq(1).text(),
              "name": $td.eq(2).text(),
              "measure": $td.eq(3).text(),
              "unit": $td.eq(4).text(),
              "quantity": parseFloat($td.eq(5).text()),
              "price": parseFloat($td.eq(6).text())
            });
          });
          data.outputs = JSON.stringify(outputs);
          arr = new Array();
          $("table.table-details > tbody > tr").each(function(index, element) {
            var $td;
            $td = $(element).find("td");
            arr.push({
              "materials": $td.eq(1).text(),
              "quantity": parseFloat($td.eq(7).text()),
              "price": parseFloat($td.eq(8).text()),
              "brand": $td.eq(9).find("button").eq(0).attr("data-brand"),
              "model": $td.eq(9).find("button").eq(0).attr("data-model")
            });
            console.log($td.eq(9).find("button").eq(0).attr("data-brand"));
          });
          data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
          data.registerdeductivegl = true;
          $.post("", data, function(response) {
            if (response.status) {
              $().toastmessage("showNoticeToast", "Correcto se ha aprovado el sector.");
              return setTimeout(function() {
                return location.reload();
              }, 2600);
            } else {
              return $().toastmessage("showWarningToast", "No se a podido realizar la aprovación del sector.");
            }
          }, "json");
        } else {
          data = new Object();
          arr = new Array();
          $("table.table-details > tbody > tr").each(function(index, element) {
            var $td;
            $td = $(element).find("td");
            arr.push({
              "materials": $td.eq(1).text(),
              "quantity": parseFloat($td.eq(7).text()),
              "price": parseFloat($td.eq(8).text()),
              "brand": $td.eq(9).find("button").eq(0).attr("data-brand"),
              "model": $td.eq(9).find("button").eq(0).attr("data-model")
            });
            console.log($td.eq(9).find("button").eq(0).attr("data-brand"));
          });
          data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
          data.approvedadditional = true;
          data.details = JSON.stringify(arr);
          console.log(data);
          return $.post("", data, function(response) {
            if (response.status) {
              $().toastmessage("showNoticeToast", "Correcto se ha aprovado el sector.");
              return setTimeout(function() {
                return location.reload();
              }, 2600);
            } else {
              return $().toastmessage("showWarningToast", "No se a podido realizar la aprovación del sector.");
            }
          }, "json");
        }
      }
    }
  });
};

showModify = function() {
  startModidfy();
  $(".table-details, .table-niple, .btn-update-meter").fadeOut(200);
  $(".panel-modify, .btn-update-meter-cancel, .btn-show-materials-meter, .btn-deductivo-meter, .btn-upload-plane-meter, .btn-save-modify-meter").fadeIn(680);
  $(".panel-price-two").fadeIn(600);
  $(".panel-price-one, .table-calc-first").fadeOut(200);
  $("table.table-modify").floatThead("reflow");
};

backModify = function() {
  $(".panel-modify, .btn-update-meter-cancel, .btn-show-materials-meter, .btn-deductivo-meter, .btn-upload-plane-meter, .btn-save-modify-meter").fadeOut(200);
  $(".table-details, .table-niple, .btn-update-meter").fadeIn(680);
  $(".panel-price-two").fadeOut(200);
  $(".panel-price-one, .table-calc-first").fadeIn(600);
};

startModidfy = function() {
  var data;
  data = new Object();
  data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
  data.modifystart = true;
  $.post("", data, function(response) {
    var $sel, $tb, area, att, b, designtable, selectBrand, selectModel, statusprice, template, tmp, x;
    if (response.status) {
      $tb = $(".table-modify > tbody");
      $tb.empty();
      area = $("input[name=area]").val();
      for (x in response.details) {
        designtable = "<tr id=\"trm-{{ materials }}\" class=\"{{!class}}\"> <td class=\"text-center\">{{ item }}</td> <td class=\"text-center col-2\"><small>{{ materials }}</small></td> <td class=\"col-5\">{{ name }} - {{ measure }}</td> <td class=\"text-center\">{{ unit }}</td> <td> <select style=\"width: 80px;\" class=\"form-control input-sm\" id=\"brand-{{ materials }}-{{ brand_id }}\"></select> </td> <td> <select style=\"width: 80px;\" class=\"form-control input-sm\" id=\"model-{{ materials }}-{{ model_id }}\"></select> </td> <td class=\"text-center\"> {{ orders }} </td> <td> <input style=\"width: 80px;\" type=\"number\" class=\"form-control input-sm change-modify\" value=\"{{ quantity }}\" min=\"0\" id=\"quantity-{{ materiales }}\"> </td> {{!prices}} <td class=\"text-center col-1\"> <button class=\"btn btn-xs btn-link text-green btn-update-update\" value=\"{{ materials }}\" data-tag=\"{{ tag }}\" data-brand=\"{{ brand_id }}\" data-model=\"{{ model_id }}\"> <span class=\"glyphicon glyphicon-edit\"></span> </button> </td> <td class=\"text-center col-1\"> <button class=\"btn btn-xs btn-link text-red btn-delete-update\" data-brand=\"{{ brand_id }}\" data-model=\"{{ model_id }}\" value=\"{{ materials }}\"> <span class=\"glyphicon glyphicon-trash\"></span> </button> </td> <td class=\"text-center col-1\">{{!attend}}</td> </tr>";
        template = designtable;
        if ($("input[name=area]").val() !== "operaciones") {
          template = template.replace("{{!prices}}", "<td> <input style=\"width: 80px;\" type=\"number\" class=\"form-control input-sm change-modify\" value=\"{{ price }}\" id=\"price-{{ materials }}\"> </td> <td> <input style=\"width: 80px;\" type=\"number\" class=\"form-control input-sm change-modify\" value=\"{{ sales }}\" id=\"sales-{{ materials }}\"> </td> <td>{{ amount }}</td>");
        }
        response.details[x].item = parseInt(x) + 1;
        att = "";
        if (response.details[x].tag === "2") {
          att = "<span class=\"glyphicon glyphicon-check\"></span>";
        } else if (response.details[x].tag === "0") {
          att = "<span class=\"glyphicon glyphicon-unchecked\"></span>";
        } else if (response.details[x].tag === "1") {
          att = "<span class=\"glyphicon glyphicon-minus\"></span>";
        }
        tmp = template;
        tmp = tmp.replace("{{!attend}}", att);
        statusprice = "";
        if (response.details[x].price <= 0 || response.details[x].quantity <= 0) {
          statusprice = "danger";
        } else {
          statusprice = "active";
        }
        tmp = tmp.replace("{{!class}}", statusprice);
        $tb.append(Mustache.render(tmp, response.details[x]));
        $sel = $("#brand-" + response.details[x].materials + "-" + response.details[x].brand_id);
        $sel.empty();
        for (b in response.listBrand) {
          selectBrand = "<option value=\"{{ brand_id }}\" {{!sel}}>{{ brand }}</option>";
          if (response.listBrand[b].brand_id === response.details[x].brand_id) {
            selectBrand = selectBrand.replace("{{!sel}}", "selected");
          }
          $sel.append(Mustache.render(selectBrand, response.listBrand[b]));
        }
        $sel = $("#model-" + response.details[x].materials + "-" + response.details[x].model_id);
        $sel.empty();
        for (b in response.listModel) {
          selectModel = "<option value=\"{{ model_id }}\" {{!sel}}>{{ model }}</option>";
          if (response.listModel[b].model_id === response.details[x].model_id) {
            selectModel = selectModel.replace("{{!sel}}", "selected");
          }
          $sel.append(Mustache.render(selectModel, response.listModel[b]));
        }
      }
      $(".amountpurchasecalcmodify").val(response.apurchase);
      return calcAmountModifySector();
    } else {
      return $().toastmessage("showErrorToast", "No se puede traer la modificación para este sector.");
    }
  }, "json");
};

validBlurNumber = function() {
  var pass, val;
  pass = false;
  val = this.value;
  val = val.replace(",", ".");
  val = parseFloat(val);
  if (!isNaN(val)) {
    if (val < 0) {
      $().toastmessage("showWarningToast", "El monto ingresado tiene que ser mayor a 0.");
      this.value = 0;
    } else {
      pass = true;
    }
  } else {
    $().toastmessage("showErrorToast", "Solo se aceptan Digitos.");
    this.value = 0;
    pass = false;
  }
  return pass;
};

updateMaterialUpdateMeter = function() {
  var $td, data, material;
  material = this.value;
  $td = $("table.table-modify > tbody > tr#trm-" + material + " > td");
  data = new Object();
  data.materials = material;
  data.brand = $td.eq(4).find("select").val();
  data.model = $td.eq(5).find("select").val();
  data.brands = this.getAttribute("data-brand");
  data.models = this.getAttribute("data-model");
  data.quantity = $td.eq(7).find("input").val().replace(",", ".");
  if ($("input[name=area]").val() === "operaciones") {
    data.price = 0;
    data.sales = 0;
  } else {
    data.price = $td.eq(8).find("input").val().replace(",", ".");
    data.sales = $td.eq(9).find("input").val().replace(",", ".");
  }
  data.updatematerialMeter = true;
  data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
  console.log(data);
  $.post("", data, function(response) {
    if (response.status) {
      startModidfy();
      $().toastmessage("showSuccessToast", "Material ingresado correctamente.");
    } else {
      $().toastmessage("showErrorToast", "No se a podido modificar el material.");
    }
  }, "json");
};

deleteMaterialUpdateMeter = function() {
  var btn, material;
  btn = this;
  material = this.value;
  $().toastmessage("showToast", {
    text: "Realmente desea eliminar el material " + this.value + "?",
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
        data = new Object();
        data.materials = material;
        data.deletematerialMeter = true;
        data.brand = btn.getAttribute("data-brand");
        data.model = btn.getAttribute("data-model");
        data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
        console.log(data);
        return $.post("", data, function(response) {
          if (response.status) {
            return startModidfy();
          } else {
            return $().toastmessage("showErrorToast", "No se a podido eliminar el material.");
          }
        }, "json");
      }
    }
  });
};

deleteAllUpdateMeter = function(event) {
  $().toastmessage("showToast", {
    text: "Desea eliminar toda la lista de materiales?",
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
        data = new Object;
        data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
        data.deleteallupdatemeter = true;
        return $.post("", data, function(response) {
          if (response.status) {
            $().toastmessage("showSuccessToast", "Se a eliminado todo la lista de modificación.");
            $("table.table-modify > tbody").empty();
            return calcDiffModify();
          } else {
            $().toastmessage("showErrorToast", "No se a podido eliminar toda la lista de materiales");
          }
        }, "json");
      }
    }
  });
};

addMaterialUpdateMeter = function() {
  var currency, data, purchase;
  data = new Object();
  data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
  data.addupdatemeter = true;
  data.materials = $(".id-mat").text();
  data.quantity = $("input[name=cantidad]").val();
  data.quantity = parseFloat(data.quantity.replace(",", "."));
  data.price = $("input[name=precio]").val();
  data.price = parseFloat(data.price.replace(",", "."));
  data.sales = $("input[name=sales]").val();
  data.sales = parseFloat(data.sales.replace(",", "."));
  data.brand = $("select[name=brand]").val();
  data.model = $("select[name=model]").val();
  if (data.materials !== "" && data.quantity !== "" && data.price !== "" && data.sales !== "") {
    currency = $("select[name=moneda]").val();
    if ($("[name=currency]").val() !== currency) {
      purchase = 0;
      if ($("input[name=exchangep]").length) {
        purchase = convertNumber($("input[name=exchangep]").val());
      } else {
        if ($("[name=" + ($("[name=currency]").val()) + "]").val() === null || $("[name=" + ($("[name=currency]").val()) + "]").val() === void 0) {
          $().toastmessage("showWarningToast", "El tipo de cambio no esta registrado.");
          return false;
        }
        purchase = $("[name=" + ($("[name=currency]").val()) + "]").val();
      }
      data.price = data.price * parseFloat(purchase);
      data.sales = data.sales * parseFloat(purchase);
    }
    if ($("input[name=gincludegroup]").length) {
      if ($("input[name=gincludegroup]").is(":checked")) {
        data.details = JSON.stringify(tmpObjectDetailsGroupMaterials.details);
      }
    }
    $.post("", data, function(response) {
      var tmpObjectDetailsGroupMaterials;
      if (response.status) {
        $("input[name=cantidad], input[name=description]").val("");
        $("select[name=meter]").empty();
        $("input[name=precio]").val("");
        $("table.tb-details > tbody").empty();
        $(".btn-show-materials-meter").click();
        tmpObjectDetailsGroupMaterials = new Object();
        startModidfy();
      } else {
        return $().toastmessage("showErrorToast", "No found Transaction " + response.raise);
      }
    }, "json");
  } else {
    $().toastmessage("showWarningToast", "Existe campos vacio.");
  }
};

createTableDeductive = function(event) {
  var data;
  data = new Object;
  data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
  data.diffmodifysec = true;
  $.post("", data, function(response) {
    var $table, template, x;
    if (response.status) {
      $table = $("table.table-deductive-only > tbody");
      $table.empty();
      template = "<tr> <td>{{ item }}</td> <td>{{ materials }}</td> <td>{{ name }} - {{ meter }}</td> <td>{{ unit }}</td> <td>{{ brand }}</td> <td>{{ model }}</td> <td>{{ quantity }}</td> <td>{{ purchase }}</td> <td>{{ sales }}</td> <td>{{ amount }}</td> </tr>";
      for (x in response.deductive) {
        response.deductive[x].item = parseInt(x) + 1;
        $table.append(Mustache.render(template, response.deductive[x]));
      }
      $table = $("table.table-deductive-out > tbody");
      $table.empty();
      for (x in response.mdelete) {
        response.deductive[x].item = parseInt(x) + 1;
        $table.append(Mustache.render(template, response.deductive[x]));
      }
    } else {
      $().toastmessage("showErrorToast", "Se a producido un Error, " + response.raise);
    }
  }, "json");
};


/*= (event) ->
    tbla = new Array()
    tblb = new Array()
    $("table.table-details > tbody > tr").each (index, element) ->
        $td = $(element).find("td")
        tbla.push {
            "materials": $td.eq(2).text(),
            "name": $td.eq(3).text(),
            "measure": $td.eq(4).text(),
            "unit": $td.eq(5).text(),
            "brand": $td.eq(6).text(),
            "model": $td.eq(7).text(),
            "quantity" : $td.eq(8).text(),
            "price":$td.eq(10).text()
        }
    $("table.table-modify > tbody > tr").each (index, element) ->
        $td = $(element).find("td")
        tblb.push {
            "materials":$td.eq(1).text(),
            "name": $td.eq(2).text(),
            "measure": $td.eq(3).text(),
            "unit": $td.eq(4).text(),
            "brand": $td.eq(5).find("select").val(),
            "model": $td.eq(6).find("select").val(),
            "quantity": $td.eq(7).find("input").val(),
            "price": $td.eq(8).find("input").val()}
    #console.log JSON.stringify tbla
    table = new Array()
    console.warn tblb.length
    for i of tblb
        tre = 0
        for j of tbla
            if tblb[i].materials is tbla[j].materials
                quanori = parseFloat tblb[i].quantity
                quanmof = parseFloat tbla[j].quantity
                if quanori isnt quanmof
                    quantity = 0
                    price = 0
                    if quanori > quanmof
                        quantity = (parseFloat(tblb[i].quantity) - parseFloat(tbla[i].quantity))
                        console.log "quantity original"
                    else if quanmof > quanori
                        quantity = (parseFloat(tbla[i].quantity) - parseFloat(tblb[i].quantity))
                        console.warn "quantity modifid"
                    else
                        console.error "quantity default"
                        #quantity = parseFloat(tblb[i].quantity)
                        continue

                    console.warn quantity
                    if quantity > 0
                        console.info "append table materials exists"
                        amount = (parseFloat(tbla[j].quantity) * parseFloat(tbla[j].price))
                        table.push {"materials": tbla[j].materials, "name":tbla[j].name, "measure":tbla[j].measure, "unit": tbla[j].unit, "brand": tbla[j].brand, "model": tbla[j].model, "quantity" : quantity, "price": tbla[j].price, "amount": amount.toFixed(2)}
            else
                tre++

        if (tbla.length - 1) isnt tre
            amount = (parseFloat(tblb[i].quantity) * parseFloat(tblb[i].price))
            table.push {"materials": tblb[i].materials, "name":tblb[i].name, "measure":tblb[i].measure, "unit": tblb[i].unit, "brand": tblb[i].brand, "model": tblb[i].model, "quantity" : parseFloat(tblb[i].quantity), "price": tblb[i].price, "amount": amount.toFixed(2)}

    if table.length
        template = "<tr>
                        <td>{{ item }}</td>
                        <td>{{ materials }}</td>
                        <td>{{ name }}</td>
                        <td>{{ measure }}</td>
                        <td>{{ unit }}</td>
                        <td>{{ brand }}</td>
                        <td>{{ model }}</td>
                        <td>{{ quantity }}</td>
                        <td>{{ price }}</td>
                        <td>{{ amount }}</td>
                        <td>
                            <div class=\"input-group\" style=\"width: 160px;\">
                                <input type=\"text\" class=\"form-control input-sm\" id=\"dedmeterquanout{{ materials }}\" readonly>
                                <span class=\"input-group-btn\">
                                    <button class=\"btn btn btn-default btn-sm btn-deductive-meter-select\" value=\"{{ materials }}\">
                                    <span class=\"glyphicon glyphicon-edit\"></span>
                                </button>
                                </span>
                            </div>
                        </td>
                    </tr>"
        $tb = $("table.table-deductive > tbody")
        $tb.empty()
        for x of table
            table[x].item = (parseInt(x) + 1)
            $tb.append Mustache.render template, table[x]

        $("table.table-modify > tbody > tr > td").find("input, select, button").attr "disabled", true
        $(".btn-show-materials-meter, .btn-upload-plane-meter").attr "disabled", true
        $(".deductive-one").fadeIn 800
        $(".deductive-one").ScrollTo duration : 800

         * create table select quantity deductive
        $tb = $("table.table-select-deductive-meter > tbody")
        $tb.empty()
        template = "<tr>
                        <td>{{ item }}</td>
                        <td>{{ materials }}</td>
                        <td>{{ name }}</td>
                        <td>{{ measure }}</td>
                        <td>{{ unit }}</td>
                        <td>{{ brand }}</td>
                        <td>{{ model }}</td>
                        <td><input type=\"number\" min=\"0\" id=\"dedmeterquan{{ materials }}\" class=\"form-control input-sm\" style=\"width: 120px;\" max=\"{{ quantity }}\" value=\"{{ quantity }}\"></td>
                        <td class=\"text-center\">
                            <input type=\"checkbox\" name=\"chkdeductivemeter\" data-mat=\"{{ materials }}\" data-brnad=\"{{ brand }}\" data-model=\"{{ model }}\">
                        </td>
                    </tr>"
        for x of tbla
            tbla[x].item = (parseInt(x) + 1)
            $tb.append Mustache.render template, tbla[x]
    else
        $().toastmessage "showWarningToast", "No se han encontrado diferencias entre las modificaciones"
    return
 */

deductiveOneCancel = function(event) {
  $("table.table-modify > tbody > tr > td").find("input, select, buttons").attr("disabled", false);
  $(".btn-show-materials-meter, .btn-upload-plane-meter").attr("disabled", false);
  $(".deductive-one").fadeOut(800);
  $(".nav-tabs").ScrollTo({
    duration: 800
  });
};

showaddtableoutdeductivemeter = function(event) {
  $(".btn-aggregate-deductive-meter-materials").val(this.value);
  $(".mdeductivereplace").modal("show");
};

changeSelectDeductiveMeter = function(event) {
  $("[name=dedmeterradio]").each(function() {
    var val;
    if (this.checked) {
      val = Boolean(parseInt(this.value));
      $("input[name=chkdeductivemeter]").each(function() {
        this.checked = val;
      });
    }
  });
};

aggregateMaterialsOutMeter = function(event) {
  var btn, count, data, value, x;
  count = 0;
  data = new Array;
  btn = this;
  $("input[name=chkdeductivemeter]").each(function() {
    if (this.checked) {
      data.push({
        "materials": this.getAttribute("data-mat"),
        "quantity": $("#dedmeterquan" + (this.getAttribute('data-mat'))).val()
      });
      count++;
    }
  });
  if (count > 0) {
    value = "";
    for (x in data) {
      if (value === "") {
        value = data[x].materials + "|" + data[x].quantity;
      } else {
        value += ", " + data[x].materials + "|" + data[x].quantity;
      }
    }
    $("#dedmeterquanout" + btn.value).val(value);
    $(".btn-aggregate-deductive-meter-materials").val("");
    $(".mdeductivereplace").modal("hide");
  } else {
    $().toastmessage("showWarningToast", "Debe de seleccionar por lo menos un material.");
  }
};

clearFieldsDeductiveMeter = function(event) {
  $("table.table-deductive > tbody > tr > td > div > input[type=text]").each(function() {
    this.value = "";
  });
};

generateDeductiveMeter = function(event) {
  var $tr, data, prm;
  $tr = $("table.table-deductive > tbody > tr");
  if ($tr.length) {
    data = new Array;
    $tr.each(function() {
      var $td;
      $td = $(this).find("td");
      data.push({
        "materials": $td.eq(1).text(),
        "brand": $td.eq(5).text(),
        "model": $td.eq(6).text(),
        "quantity": $td.eq(7).text(),
        "price": $td.eq(8).text(),
        "output": $td.eq(10).find("input").val()
      });
    });
    if (data != null) {
      prm = new Object;
      prm.generateDeductiveOne = true;
      prm.details = JSON.stringify(data);
      prm.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
      $.post("", prm, function(response) {
        if (response.status) {
          $().toastmessage("showNoticeToast", "Se genero correctamente el deductivo. Nro Deductivo " + response.deductive);
          $(".btn-deductivo-meter").attr("disabled", true);
          $(".deductive-one").fadeOut(800);
          return $(".nav-tabs").ScrollTo({
            duration: 800
          });
        }
      });
    }
  } else {
    $().toastmessage("showWarningToast", "Alerta! No se puede generar deductivo por no tener materiales.");
  }
};

approvedModify = function(event) {

  /*tbla = new Array()
  tblb = new Array()
  $("table.table-details > tbody > tr").each (index, element) ->
      $td = $(element).find("td")
      tag = ""
      console.log $td
      if $td.eq(13).find("span").attr("class").search("-check") > 0
          tag = "2"
      else if $td.eq(13).find("span").attr("class").search("-uncheck") > 0
          tag = "0"
      else
          tag = "1"
      comment = $td.eq(12).find("input").val()
      tbla.push {
          "materials": $td.eq(2).text(),
          "name": $td.eq(3).text(),
          "measure": $td.eq(4).text(),
          "unit": $td.eq(5).text(),
          "brand": $td.eq(6).text(),
          "model": $td.eq(7).text(),
          "quantity": $td.eq(8).text(),
          "quantityorders": $td.eq(9).text(),
          "price": $td.eq(10).text(),
          "tag":tag,
          "comment": comment}
      return
  
  $("table.table-modify > tbody > tr").each (index, element) ->
      $td = $(element).find("td")
      tag = ""
      console.log $td
      if $td.eq(12).find("span").attr("class").search("-check") > 0
          tag = "2"
      else
          tag = "0"
      tblb.push {
          "materials": $td.eq(1).text(),
          "name": $td.eq(2).text(),
          "measure": $td.eq(3).text(),
          "unit": $td.eq(4).text(),
          "brand": $td.eq(5).find("select").val(),
          "model": $td.eq(6).find("select").val(),
          "quantity": $td.eq(7).find("input").val(),
          "price": $td.eq(8).find("input").val(),
          "tag": tag}
      return
  
  console.table tbla
  console.table tblb
  
  for x of tblb
      count = 0
      qmodify = 0
      qoriginal = 0
      quantityorders = 0
      comment = ""
      for c of tbla
          if tblb[x].materials is tbla[c].materials
              qmodify = parseFloat(tblb[x].quantity)
              qoriginal = parseFloat(tbla[c].quantity)
              quantityorders = parseFloat(tbla[c].quantityorders)
              comment = tbla[c].comment
              break
          else
              count++
              continue
  
      console.log "cantidad de count #{count}"
      if tbla.length is count
          console.info tblb[x].materials
          tblb[x].tag = "0"
          tblb[x].comment = ""
          tblb[x].quantityorders = parseFloat tblb[x].quantity
          tblb[x].dev = 0
      else if tbla.length isnt count
          tblb[x].comment = comment
          tblb[x].quantityorders = quantityorders
          console.warn tblb[x].materials
          console.log qoriginal + " | " + qmodify + " | " + quantityorders
          if qmodify > qoriginal
              console.info "modify > original"
              if quantityorders > 0 and quantityorders < qoriginal
                  tblb[x].tag = "1"
              if qoriginal is quantityorders and quantityorders > 0
                  tblb[x].tag = "0"
              tblb[x].dev = 0
              console.error tblb[x].tag
          else if qmodify < qoriginal
              console.info "modify < original"
              if qmodify > 0 and quantityorders is 0
                  tblb[x].tag = "2"
                  tblb[x].dev = 0
              else if quantityorders > 0 and qmodify is (quantityorders - (qoriginal - qmodify))
                  tblb[x].tag = "0"
                  tblb[x].dev = 0
              else if quantityorders > 0 and qmodify > (quantityorders - (qoriginal - qmodify))
                  tblb[x].tag = "1"
              if tblb[x].tag is "2" or tblb[x].tag is "1"
                  tblb[x].dev = (qoriginal - qmodify)
              console.error tblb[x].tag
          else if qmodify is qoriginal
              if qmodify > 0 and quantityorders is qoriginal
                  tblb[x].tag = "0"
              else if qmodify > 0 and quantityorders < qoriginal and quantityorders > 0
                  tblb[x].tag = "1"
              else if quantityorders is 0
                  tblb[x].tag = "2"
              tblb[x].dev = 0
              console.info "modify equal original"
              console.error tblb[x].tag
  
  console.table tblb
   */
  var context, data;
  data = new Object;
  data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken").val();
  data.approvedModifyFinal = true;
  context = new Object;
  context.withoutprices = true;
  $.getJSON("", context, function(response) {
    var approved;
    approved = false;
    console.log("materials witout prices");
    console.log(response.details.length);
    if (response.details.length) {
      approved = false;
    } else {
      approved = true;
    }
    if (approved) {
      $().toastmessage("showToast", {
        text: "Seguro(a) que desea aprobar las modificaciones de los materiales?",
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
            $.post("", data, function(response) {
              if (response.status) {
                swal({
                  title: "Felicidades!",
                  text: "Se han realizado los cambios solicitados.",
                  type: "success",
                  timer: 2600,
                  showConfirmButton: false
                });
                setTimeout(function() {
                  location.reload();
                }, 2600);
              } else {
                $().toastmessage("showErrorToast", "Error al guardar los cambios solicitados. " + response.raise);
              }
            });
          }
        }
      });
    } else {
      swal("Alerta!", "existen materiales sin precio, solicite su ingreso para ser aprobado. " + response.raise, "warning");
    }
  });
};

showInitDeductive = function(event) {
  $(".panel-deductive-global").fadeToggle(600, function() {
    var $btn, $tnew, results, tbl, template, x;
    $btn = $(".btn-create-deductivo");
    if (this.style.display === "block") {
      $(".btn-create-deductivo").removeClass("btn-danger").addClass("btn-default");
      $btn.find("span").eq(0).removeClass("glyphicon-list").addClass("glyphicon-remove");
      tbl = new Array();
      $("table.table-details > tbody > tr").each(function(index, element) {
        var $td;
        $td = $(element).find("td");
        tbl.push({
          "materials": $td.eq(1).text(),
          "name": $td.eq(2).text(),
          "measure": $td.eq(3).text(),
          "unit": $td.eq(4).text(),
          "brand": $td.eq(5).text(),
          "model": $td.eq(6).text(),
          "quantity": parseFloat($td.eq(7).text()),
          "price": parseFloat($td.eq(8).text())
        });
      });
      $tnew = $("table.table-deductive-input-new > tbody");
      $tnew.empty();
      template = "<tr> <td class=\"text-center\">{{ item }}</td> <td>{{ materials }}</td> <td>{{ name }}</td> <td>{{ measure }}</td> <td class=\"text-center\">{{ unit }}</td> <td class=\"text-center\">{{ quantity }}</td> <td class=\"text-center\">{{ price }}</td> <td class=\"text-center\">{{ amount }}</td> <td class=\"text-center\"> <div class=\"input-group\" style=\"width: 160px;\"> <input type=\"text\" class=\"form-control input-sm\" id=\"dedmeterquanout{{ materials }}\" readonly> <span class=\"input-group-btn\"> <button class=\"btn btn-default btn-sm btn-show-table-deductive-global\" value=\"{{ materials }}\"> <span class=\"glyphicon glyphicon-list\"></span> </button> </span> </div> </td> </tr>";
      results = [];
      for (x in tbl) {
        tbl[x].item = parseInt(x) + 1;
        tbl[x].amount = (tbl[x].quantity * tbl[x].price).toFixed();
        results.push($tnew.append(Mustache.render(template, tbl[x])));
      }
      return results;
    } else if (this.style.display === "none") {
      $btn.removeClass("btn-default").addClass("btn-danger");
      $btn.find("span").eq(0).removeClass("glyphicon-remove").addClass("glyphicon-list");
    }
  });
};

showPanelAddMateialsOldDeductiveGlobal = function(event) {
  var $btn;
  $btn = $(this);
  $(".panel-search-material-old").fadeToggle(400, function() {
    if (this.style.display === "block") {
      $btn.removeClass("btn-warning").addClass("btn-default");
      $btn.find("span").eq(0).removeClass("glyphicon-plus").addClass("glyphicon-remove");
      return $btn.find("span").eq(1).text("Cancelar");
    } else if (this.style.display === "none") {
      $btn.removeClass("btn-default").addClass("btn-warning");
      $btn.find("span").eq(0).removeClass("glyphicon-remove").addClass("glyphicon-plus");
      return $btn.find("span").eq(1).text("Agregar");
    }
  });
};

searchDescDeductiveGlobal = function(event) {
  var key;
  key = window.Event ? event.keyCode : event.which;
  if (key !== 13) {
    displayResultTable($.trim(this.value.toLowerCase()));
  }
};

displayResultTable = function(text) {
  var data;
  data = new Object;
  data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
  data.text = text;
  data.typedeductive = $("select[name=typeDeductive]").val();
  if (data.typedeductive === "ONE") {
    data.sector = $("select[name=sectorone]").val();
  } else if (data.typedeductive === "CUS") {
    data.cus = $("input[name=inputcust]").val();
  }
  data.searchdescdeductive = true;
  $.post("", data, function(response) {
    var $tb, k, results, template;
    if (response.status) {
      $tb = $("table.table-materials-old > tbody");
      template = "<tr> <td>{{ materials }}</td> <td>{{ name }} - {{ measure }}</td> <td>{{ unit }}</td> <td>{{ quantity }}</td> <td> <button class=\"btn btn-xs btn-warning btn-add-material-remove text-black\" data-id=\"{{ materials }}\" data-name=\"{{ name }}\" data-measure=\"{{ measure }}\" data-unit=\"{{ unit }}\" data-quanity=\"{{ quantity }}\" data-price=\"{{ price }}\"> <span class=\"glyphicon glyphicon-plus\"></span> </button> </td> </tr>";
      $tb.empty();
      results = [];
      for (k in response.list) {
        results.push($tb.append(Mustache.render(template, response.list[k])));
      }
      return results;
    }
  });
  $("input[name=searchdesc]").focus().after($(".panel-materials-old").fadeIn(600));
};

changeTypeDeductive = function(event) {
  console.log(this.value);
  if (this.value === "ALL") {
    $(".modal-customization").modal("hide");
    $(".control-deductive-one").fadeOut();
  } else if (this.value === "ONE") {
    $(".control-deductive-one").fadeIn();
    $(".modal-customization").modal("hide");
  } else if (this.value === "CUS") {
    $(".control-deductive-one").fadeOut();
    $(".modal-customization").modal("show");
  }
};

pasteAllRight = function(event) {
  var $ds, $ps;
  $ds = $("select[name=dsectors]");
  $ps = $("select[name=psectors]");
  $ds.find("option").each(function(index, element) {
    $ps.append("<option value=\"" + element.value + "\">" + element.innerHTML + "</option>");
    return this.remove();
  });
};

pasteAllLeft = function(event) {
  var $ds, $ps;
  $ds = $("select[name=dsectors]");
  $ps = $("select[name=psectors]");
  $ps.find("option").each(function(index, element) {
    $ds.append("<option value=\"" + element.value + "\">" + element.innerHTML + "</option>");
    return this.remove();
  });
};

pasteOneRight = function(event) {
  var $ds, $ps;
  $ds = $("select[name=dsectors]");
  $ps = $("select[name=psectors]");
  $ds.find("option").each(function(index, element) {
    if ($(this).is(":selected")) {
      $ps.append("<option value=\"" + element.value + "\">" + element.innerHTML + "</option>");
      return this.remove();
    }
  });
};

pasteOneLeft = function(event) {
  var $ds, $ps;
  $ds = $("select[name=dsectors]");
  $ps = $("select[name=psectors]");
  $ps.find("option").each(function(index, element) {
    if ($(this).is(":selected")) {
      $ds.append("<option value=\"" + element.value + "\">" + element.innerHTML + "</option>");
      return this.remove();
    }
  });
};

addListCusSectors = function(event) {
  var secs;
  secs = "";
  if ($("select[name=psectors]").find("option").length) {
    $("select[name=psectors]").find("option").each(function(index, element) {
      if (secs.length === 0) {
        secs = element.value;
      } else {
        secs += "," + element.value;
      }
    });
    $("input[name=inputcust]").val(secs);
  }
  $(".modal-customization").modal("hide");
};

addoldMaterialRemoveDeductive = function(event) {
  var $tb, data, template;
  $tb = $("table.table-deductive-output > tbody");
  data = {
    "materials": this.getAttribute("data-id"),
    "name": this.getAttribute("data-name"),
    "measure": this.getAttribute("data-measure"),
    "unit": this.getAttribute("data-unit"),
    "quantity": this.getAttribute("data-quanity"),
    "price": this.getAttribute("data-price"),
    "amount": (parseFloat(this.getAttribute("data-quanity")) * parseFloat(this.getAttribute("data-price"))).toFixed(2)
  };
  template = "<tr class=\"deductive-global-tr-{{ materials }}\"> <td>{{ item }}</td> <td>{{ materials }}</td> <td>{{ name }}</td> <td>{{ measure }}</td> <td>{{ unit }}</td> <td>{{ quantity }}</td> <td>{{ price }}</td> <td>{{ amount }}</td> <td> <button class=\"btn btn-xs btn-link text-red btn-delete-deductive-global-tr\" value=\"{{ materials }}\"> <span class=\"glyphicon glyphicon-trash\"></span> </button> </td> </tr>";
  $tb.append(Mustache.render(template, data));
  $(".panel-materials-old").fadeOut(600);
  $tb.find("tr").each(function(index, element) {
    $(element).find("td").eq(0).text(index + 1);
  });
};

showTableDeductiveGlobal = function(event) {
  var $btn, $table, $tb, data, template;
  $btn = this;
  $tb = $("table.table-select-deductive-meter > tbody");
  $tb.empty();
  template = "<tr> <td>{{ item }}</td> <td>{{ materials }}</td> <td>{{ name }}</td> <td>{{ measure }}</td> <td>{{ unit }}</td> <td>ALL</td> <td>ALL</td> <td> <input type=\"number\" id=\"dedmeterquan{{ materials }}\" class=\"form-control\" value=\"{{ quantity }}\"> </td> <td> <input type=\"checkbox\" data-mat=\"{{ materials }}\" name=\"chkdeductivemeter\" > </td> </tr>";
  $table = $("table.table-deductive-output > tbody > tr");
  data = new Object;
  $table.each(function(index, element) {
    var $td;
    $td = $(element).find("td");
    data = {
      "item": index + 1,
      "materials": $td.eq(1).text(),
      "name": $td.eq(2).text(),
      "measure": $td.eq(3).text(),
      "unit": $td.eq(4).text(),
      "quantity": $td.eq(5).text(),
      "price": $td.eq(6).text()
    };
    $tb.append(Mustache.render(template, data));
  });
  $(".btn-aggregate-deductive-meter-materials").val($btn.value);
  $(".mdeductivereplace").modal("show");
};

delUnitDeductiveGlobal = function(event) {
  var btn;
  btn = this;
  $().toastmessage("showToast", {
    type: "confirm",
    text: "Desea elminar el material de la lista?",
    sticky: true,
    buttons: [
      {
        value: "Si"
      }, {
        value: "No"
      }
    ],
    success: function(result) {
      if (result === "Si") {
        return $("tr.deductive-global-tr-" + btn.value).remove();
      }
    }
  });
};

delAllMaterialDeductiveGlobal = function(event) {
  $().toastmessage("showToast", {
    type: "confirm",
    text: "Desea elminar toda la lista de materiales?",
    sticky: true,
    buttons: [
      {
        value: "Si"
      }, {
        value: "No"
      }
    ],
    success: function(result) {
      if (result === "Si") {
        $("table.table-deductive-output > tbody").empty();
        $("table.table-select-deductive-meter > tbody").empty();
        $("table.table-deductive-input-new > tbody > tr").each(function() {
          var $td;
          $td = $(this).find("td");
          $td.eq(8).find("input").val("");
        });
      }
    }
  });
};

calcAmountSector = function(event) {
  var amount, diff, estimated, estimatedsales, percentb, percentpurchasebad, percents, percentsalesbad, purchasediff, sales, salesdiff;
  amount = 0;
  sales = 0;
  if ($("input#calcAmountSector").length) {
    $("table.table-details > tbody > tr").each(function(index, element) {
      var $td;
      $td = $(element).find("td");
      amount += convertNumber($td.eq(10).text()) * convertNumber($td.eq(8).text());
      sales += convertNumber($td.eq(11).text()) * convertNumber($td.eq(8).text());
    });
  } else if ($("input#calcAmountSectorFirst").length) {
    $("table.table-details > tbody > tr").each(function(index, element) {
      var $td;
      $td = $(element).find("td");
      amount += convertNumber($td.eq(7).text()) * convertNumber($td.eq(8).text());
      sales += convertNumber($td.eq(7).text()) * convertNumber($td.eq(9).text());
    });
  }
  $(".amountmeter").text(amount.toFixed(2));
  $(".amountsales").text(sales.toFixed(2));
  estimated = convertNumber($(".amountmeterestimated").text());
  diff = estimated - amount;
  $(".amountmeterdiff").text(diff.toFixed(2));
  percentb = (amount * 100) / estimated;
  $(".percentpurchase").text(percentb.toFixed(2));
  purchasediff = 100 - percentb;
  $(".percentpurchaseres").text(purchasediff.toFixed(2));
  percentpurchasebad = 0;
  if (percentb > 100) {
    percentpurchasebad = percentb - 100;
    $(".percentpurchasediff").text(percentpurchasebad.toFixed(2)).addClass("danger");
  } else {
    $(".percentpurchasediff").text(percentpurchasebad.toFixed(2)).removeClass("danger");
  }
  estimatedsales = convertNumber($(".amountmeterestimatedsales").text());
  salesdiff = estimatedsales - sales;
  $(".amountsalesdiff").text(salesdiff.toFixed(2));
  percents = (sales * 100) / estimatedsales;
  $(".percentsales").text(percents.toFixed(2));
  salesdiff = 100 - percents;
  $(".percentsalesres").text(salesdiff.toFixed(2));
  percentsalesbad = 0;
  if (percents > 100) {
    percentsalesbad = percents - 100;
    $(".percentsalesdiff").text(percentsalesbad.toFixed(2)).addClass("warning");
  } else {
    $(".percentsalesdiff").text(percentsalesbad.toFixed(2)).removeClass("warning");
  }
};

calcDiffModify = function(event) {
  var amount, current, diff;
  amount = 0;
  $(".table.table-modify > tbody > tr").each(function(index, element) {
    var $td;
    $td = $(element).find("td");
    amount += convertNumber($td.eq(8).find("input").val()) * convertNumber($td.eq(7).find("input").val());
  });
  current = convertNumber($("label.amountmeter").text());
  diff = current - amount;
  $("label.amountcurrent").text(current);
  $("label.modifycurrent").text(amount.toFixed(2));
  $("label.modifydiff").text(diff.toFixed(2));
};

readerPrices = function(event) {
  var data;
  data = new Object();
  data.readerPrices = true;
  data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
  $.post("", data, function(response) {
    if (response.status) {
      $().toastmessage("showNoticeToast", "Se a leido correctamente el archivo.");
    } else {
      $().toastmessage("showErrorToast", "Error de lectura. " + response.raise + ".");
    }
  }, "json");
};

sendAlertModified = function(event) {
  $().toastmessage("showToast", {
    text: "Deseas enviar la alerta para que el area de ventas revise las modificaciones realizadas?",
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
      var $company, $pro, $sec, $user, context;
      if (result === "Si") {
        $pro = $("input[name=pro]");
        $sec = $("input[name=sec]");
        $user = $("input[name=user-email]");
        $company = $("input[name=companyname]");
        context = new Object;
        context.fors = new Array("luis.martinez@icrperusa.com");
        context.forsb = "luis.martinez@icrperusa.com";
        context.issue = "Modificación de Sector " + ($sec.val()) + " - " + ($sec.attr("data-name")) + " del Proyecto " + ($pro.val()) + " - " + ($pro.attr("data-name"));
        context.body = "<p>Hola Luis Martinez, este&nbsp; mensaje es para avisarte que he terminado de modificar la lista de materiales del sector <strong>" + ($sec.val()) + " - " + ($sec.attr("data-name")) + "</strong> del proyecto <strong>" + ($pro.val()) + " - " + ($pro.attr("data-name")) + "</strong>.</p><p>Espero tu pronta respuesta y aprobación de las modificaciones.</p><p>Atte&nbsp; " + ($user.attr("data-name")) + "<br></p><p><strong>" + ($company.val()) + "</strong><br data-mce-bogus=\"1\"></p><p>Hora local " + (new Date()) + "<br data-mce-bogus=\"1\"></p>";
        return $.ajax({
          url: "http://190.41.246.91:3000/mailer/",
          type: "GET",
          crossDomain: true,
          data: $.param(context),
          dataType: "jsonp",
          success: function(response) {
            if (response.status) {
              return $().toastmessage("showSuccessToast", "Tu mensaje fue enviado.");
            } else {
              return $().toastmessage("showErrorToast", "No se a Podido enviar la alerta.");
            }
          }
        });
      }
    }
  });
};

calcAmountModifySector = function(event) {
  var $cargo, apurchase, asales, ipa, ipm, percent, purchaseamount, purchaseamountdiff, salesamount, salesamountdiff;
  apurchase = 0;
  asales = 0;
  purchaseamount = parseFloat($(".amountmeter").text());
  purchaseamountdiff = parseFloat($(".amountmeterdiff").text());
  salesamount = parseFloat($(".amountsales").text());
  salesamountdiff = parseFloat($(".amountsalesdiff").text());
  $(".amopurchasecalc").text(purchaseamount);
  $(".amopurchasediff").text(purchaseamountdiff);
  $(".amsalescalc").text(salesamount);
  $(".amsalesdiff").text(salesamountdiff);
  $("table.table-modify > tbody > tr").each(function(index, element) {
    var $td, purchase, quantity, sales;
    $td = $(element).find("td");
    quantity = parseFloat($td.eq(7).find("input").val());
    purchase = parseFloat($td.eq(8).find("input").val());
    sales = parseFloat($td.eq(9).find("input").val());
    apurchase += quantity * purchase;
    asales += quantity * sales;
  });
  $(".amodifynowpurchase").text(apurchase.toFixed(3));
  $(".amsalesmodifynow").text(asales.toFixed(3));
  $(".adiffpurchase").text((apurchase - purchaseamount).toFixed(3));
  $(".aimppurchase").text((parseFloat($(".amountmeterestimated").text()) - apurchase).toFixed(3));
  $(".amsalesdifftot").text((asales - salesamount).toFixed(3));
  $(".amountsalestot").text((parseFloat($(".amountmeterestimatedsales").text()) - asales).toFixed(3));
  ipa = parseFloat($(".amountmeterestimated").text());
  ipm = parseFloat(apurchase.toFixed(3));
  percent = (ipm * 100) / ipa;
  console.log(ipa);
  console.log(ipm);
  console.log(percent);
  $cargo = $("[name=area]").attr("data-cargo");
  if ($cargo === "jefe de operaciones") {
    ipa = parseFloat($(".amountpurchaseestimated").val());
    ipm = parseFloat($(".amountpurchasecalcmodify").val());
    percent = (ipm * 100) / ipa;
    console.log(ipa);
    console.log(ipm);
    console.log(percent);
    $(".btn-save-modify-meter").addClass("hide");
    if (percent < 100) {
      $(".btn-save-modify-meter").removeClass("hide");
    } else {
      swal({
        title: "Alerta!",
        text: "Has alcanzado el maximo monto para realizar modificaciones. <br> Te recomendamos contactarte con el area de <q>Ventas</q> si se requiere seguir realizando modificaciones.",
        type: "warning",
        html: true,
        showConfirmButton: true,
        confirmButtonColor: "#DD6B55"
      });
    }
  } else {
    if (percent >= 100) {
      swal({
        title: "Alerta!",
        text: "Has alcanzado el porcentaje maximo para realizar modificaciones.",
        type: "warning",
        showConfirmButton: true,
        confirmButtonColor: "#DD6B55"
      });
    }
  }
};

showGuideByProyect = function(event) {
  var href, pro, sec, sub;
  pro = $("input[name=pro]").val();
  sub = $("input[name=sub]").val();
  sec = $("input[name=sec]").val();
  if (sub === "") {
    sub = "None";
  }
  if (sec === "") {
    sec = "None";
  }
  href = "/sales/projects/guide/list/" + pro + "/" + sub + "/" + sec;
  return location.href = href;
};

showOrdersByProyect = function(event) {
  var href, pro, sec, sub;
  pro = $("input[name=pro]").val();
  sub = $("input[name=sub]").val();
  sec = $("input[name=sec]").val();
  if (sub === "") {
    sub = "None";
  }
  if (sec === "") {
    sec = "None";
  }
  href = "/sales/projects/list/orders/" + pro + "/" + sub + "/" + sec;
  return location.href = href;
};

showPreOrders = function(event) {
  var $tb, counter, data, template, x;
  data = new Object;
  data.list = new Array;
  counter = 0;
  $("input[name=mats]").each(function(index, element) {
    var $td;
    if (element.checked) {
      counter += 1;
      $td = $("tr." + this.value + " > td");
      data.list.push({
        "item": counter,
        "materials": $td.eq(2).text(),
        "name": $td.eq(3).text() + " " + $td.eq(4).text(),
        "unit": $td.eq(5).text(),
        "brand": $td.eq(6).text(),
        "brand_id": element.getAttribute("data-brand"),
        "model": $td.eq(7).text(),
        "model_id": element.getAttribute("data-model"),
        "quantity": $td.eq(9).text(),
        "comment": $td.find("input").eq(1).val()
      });
    }
  });
  template = "<tr> <td>{{ item }}</td> <td>{{ materials }}</td> <td>{{ name }}</td> <td>{{ unit }}</td> <td>{{ brand }}</td> <td>{{ model }}</td> <td> <input type=\"number\" onBlur=\"validQuantityPreOrder(this)\" step=\"0.01\" min=\"1\" max=\"{{ quantity }}\" class=\"form-control input-sm col-2\" value=\"{{ quantity }}\" data-brand=\"{{ brand_id }}\" data-model=\"{{ model_id }}\"> </td> </tr>";
  if (data.list.length) {
    $tb = $(".table-pre-orders > tbody");
    $tb.empty();
    for (x in data.list) {
      $tb.append(Mustache.render(template, data.list[x]));
    }
    $("#preorders").modal("show");
  } else {
    $().toastmessage("showWarningToast", "Debe de seleccionar al menos un material.");
  }
};

validQuantityPreOrder = function(element) {
  var max, quantity;
  max = parseFloat(element.getAttribute("max"));
  quantity = parseFloat(element.value);
  if (quantity > max) {
    element.value = max;
  } else if (quantity <= 0) {
    element.value = max;
  }
};

savePreOrders = function(event) {
  var context;
  context = new Object;
  context.order = new Array;
  $(".table-pre-orders > tbody > tr").each(function(index, element) {
    var $td, input;
    $td = $(element).find("td");
    input = $td.eq(6).find("input").get(0);
    context.order.push({
      "materials": $td.eq(1).text(),
      "brand": input.getAttribute("data-brand"),
      "model": input.getAttribute("data-model"),
      "quantity": input.value
    });
  });
  if (context.order.length) {
    context.order = JSON.stringify(context.order);
    context.transfer = $("input[name=pre-transfer]").val();
    context.issue = $("input[name=pre-issue]").val();
    context.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
    if (context.transfer === "" && context.transfer.length === 10) {
      $().toastmessage("showWarningToast", "La fecha de traslado no es correcta o se encuentra vacia.");
      return false;
    }
    if (context.issue === "") {
      $().toastmessage("showWarningToast", "El asunto se encuentra vacia.");
      return false;
    }
    context.observation = $("#pre-observation_ifr").contents().find("body").html();
    context.nipples = $("#pre-nipples").contents().find("body").html();
    context.savepreorders = true;
    $.post("", context, function(response) {
      if (response.status) {
        $().toastmessage("showSuccessToast", "Se a generado la Pre Orden a almacén " + response.code + ".");
        setTimeout(function() {
          return location.reload();
        }, 2600);
      } else {
        $().toastmessage("showWarningToast", "No se puede Generar la pre Orden de pedido a almancen. " + response.raise);
      }
    }, "json");
  }
};

showListPreOrders = function(event) {
  var href, pro, sec, sub;
  pro = $("input[name=pro]").val();
  sub = $("input[name=sub]").val();
  sec = $("input[name=sec]").val();
  if (sub === "") {
    sub = "None";
  }
  if (sec === "") {
    sec = "None";
  }
  href = "/sales/projects/guide/list/" + pro + "/" + sub + "/" + sec;
};

getPercentAttend = function(event) {
  $.getJSON("", {
    "percentsec": true
  }, function(response) {
    var $bar;
    if (response.status) {
      $bar = $(".progress-sec");
      if (response.percent === "100.0") {
        $bar.addClass("progress-bar-success");
      }
      $bar.attr("aria-valuenow", response.percent);
      $bar.css({
        "width": response.percent + "%"
      });
      $bar.text(response.percent + " % Completo.");
    } else {
      swal({
        title: "Error!",
        text: "al obtener el porcentaje de materiales atendidos. " + response.raise,
        showConfirmButton: false,
        timer: 2800,
        type: "error"
      });
    }
  });
};

showModalSetPrices = function(event) {
  var context;
  context = new Object;
  context.withoutprices = true;
  $.getJSON("", context, function(response) {
    var $tb, counter, template;
    if (response.status) {
      counter = 1;
      response.index = function() {
        return counter++;
      };
      template = "{{#details}}\n<tr>\n  <td>{{ index }}</td>\n  <td>{{ materials_id }}</td>\n  <td>{{ materials__matnom }} - {{ materials__matmed }}</td>\n  <td>{{ brand__brand }}</td>\n  <td>{{ materials__unidad__uninom }}</td>\n  <td>\n    <input type=\"text\" class=\"form-control input-sm col-2\" data-brand=\"{{ brand_id }}\" data-model=\"{{ model_id }}\" value=\"{{ price }}\">\n  </td>\n  <td>\n    <input type=\"text\" class=\"form-control input-sm col-2\" value=\"{{ sales }}\">\n  </td>\n</tr>\n{{/details}}";
      $tb = $(".twithoutp > tbody");
      $tb.empty();
      $tb.html(Mustache.render(template, response));
      $("#withoutPrice").modal("show");
    } else {
      swal({
        title: "Error",
        text: "No ha podido traer los materiales sin precios. " + response.raise,
        type: "error",
        showConfirmButton: false,
        timer: 2600
      });
    }
  });
};

saveWithoutPrice = function(event) {
  var context, list, zero;
  context = new Object;
  context.savewithoutprice = true;
  list = new Array;
  zero = 0;
  $(".twithoutp > tbody > tr").each(function() {
    var $td, purchase, sales;
    $td = $(this).find("td");
    purchase = parseFloat($td.eq(5).find("input").eq(0).val());
    sales = parseFloat($td.eq(6).find("input").eq(0).val());
    if (purchase === 0 || sales === 0) {
      zero++;
      swal({
        title: "Alerta!",
        text: "Debe de ingresar un precio valido y mayor a cero!",
        type: "warning",
        showConfirmButton: false,
        timer: 2600
      });
      return false;
    }
    list.push({
      'materials': $td.eq(1).text(),
      'brand': $td.eq(5).find("input").eq(0).attr("data-brand"),
      'model': $td.eq(5).find("input").eq(0).attr("data-model"),
      'purchase': purchase,
      'sales': sales
    });
  });
  if (zero === 0) {
    context.list = JSON.stringify(list);
    context.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
    return $.post("", context, function(response) {
      if (response.status) {
        setTimeout(function() {
          return location.reload();
        }, 3000);
        swal({
          title: "Felicidades!",
          text: "Se a guardado los cambios correctamente.",
          type: "success",
          showConfirmButton: false,
          timer: 3000
        });
      } else {
        swal({
          title: "Error!",
          text: "No se a guardado los cambios. " + response.raise,
          type: "error",
          showConfirmButton: false,
          timer: 2600
        });
      }
    });
  }
};

getCountDSector = function() {
  var data;
  data = {
    areasdsector: true
  };
  $.getJSON('', data, function(response) {
    if (response.status) {
      console.log(response);
      if (parseFloat(response.dsectors)) {
        $("#msector, #orderSt, #lnipples, #bmuorders").hide();
      }
      return;
    }
  });
};

$requestRequireTmp = null;

uploadOrdersFormat = function() {
  var $file, $this, data;
  $this = this;
  $file = $("#fufileorders")[0];
  if ($file.files.length) {
    data = new FormData;
    data.append("fOrders", $file.files[0]);
    data.append("readNOrders", true);
    data.append("csrfmiddlewaretoken", $("[name=csrfmiddlewaretoken]").val());
    $().toastmessage("showToast", {
      text: "Seguro que desea procesar el archivo?",
      type: "confirm",
      buttons: [
        {
          value: 'Si'
        }, {
          value: 'No'
        }
      ],
      sticky: true,
      success: function(isConfirm) {
        if (isConfirm === "Si") {
          $.ajax({
            url: "",
            data: data,
            type: "post",
            dataType: "json",
            cache: false,
            contentType: false,
            processData: false,
            success: function(response) {
              var count, temp;
              if (response.status) {
                if (response.result === "showTable") {
                  $requestRequireTmp = response;
                  count = 1;
                  response.index = function() {
                    return count++;
                  };
                  temp = "{{#requeriment}}<tr><td>{{index}}</td><td>{{materials}}</td><td>{{name}} {{measure}} <br>{{#nipples}} Niple tipo {{type}} x {{measure}}cm {{quantity}} {{/nipples}}</td><td>{{unit}}</td><td>{{quantity}}</td></tr>{{/requeriment}}";
                  $(".stmrequire > tbody").html(Mustache.render(temp, response));
                  $("#mstrequire").modal("show");
                  console.log(response);
                  return;
                }
                if (response.result === "modify") {
                  $("#muordersshow").modal("hide");
                  $(".btn-update-meter").click();
                  return $().toastmessage("showWarningToast", "Esta orden modifica la lista!");
                }
              } else {
                $().toastmessage("showErrorToast", "Error al procesar. " + response.raise);
              }
            }
          });
        }
      }
    });
  } else {
    $().toastmessage("showWarningToast", "No se ha seleccionado un archivo!");
  }
};

processRequeriment = function(event) {
  swal({
    title: 'Deseas generar el Pedido?',
    text: '',
    type: 'warning',
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    confirmButtonText: "Si! Generar",
    confirmOnClose: true,
    cancelOnCancel: true
  }, function(isConfirm) {
    var da, data;
    if (isConfirm) {
      console.log("Start process requeriment");
      data = {
        'data': $requestRequireTmp,
        'processRequeriment': true,
        'csrfmiddlewaretoken': $("[name=csrfmiddlewaretoken]").val()
      };
      da = new Date($requestRequireTmp['traslate']);
      data['data']['traslate'] = (da.getFullYear()) + "-" + (da.getMonth() + 1) + "-" + (da.getUTCDate());
      data['data'] = JSON.stringify(data['data']);
      console.log(data);
      $.post("", data, function(response) {
        if (response.status) {
          swal("Pedido: " + response.orders, "", "success");
          setTimeout(function() {
            return location.reload();
          }, 2600);
        }
      }, 'json');
    }
  });
};

cancelRequeriment = function() {
  $requestRequireTmp = null;
  $("stmrequire > tbody").empty();
  $("#mstrequire").modal("hide");
};
