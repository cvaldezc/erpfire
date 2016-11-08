var autoSearchMaterialGroup, bgModalAddMaterials, bgModalBack, bgModalErase, counter_materials_global, getDataBrand, getDataModel, getDescription, getDetailsGroupMaterials, getMeters, getSummaryMaterials, getidli, globalDataBrand, globalDataModel, keyCode, keyDescription, keyUpDescription, mat, modalGlobalGroupMaterial, moveTopBottom, openBrand, openModel, searchBrandOption, searchMaterial, searchMaterialCode, searchModelOption, searchUnitOption, selectMaterial, setDataBrand, setDataModel, tmpObjectDetailsGroupMaterials;

mat = new Object;

counter_materials_global = 0;

getDescription = function(name) {
  $.getJSON("/json/get/materials/name/", {
    nom: name
  }, function(response) {
    var $opt, i, template, x;
    template = "<li id='li{{ id }}' onClick=getidli(this);><a class='text-primary' onClick='selectMaterial(this);'>{{ matnom }}</a></li>";
    $opt = $(".matname-global");
    $opt.empty();
    i = 0;
    for (x in response.name) {
      response.name[x].id = i;
      $opt.append(Mustache.render(template, response.name[x]));
      i += 1;
    }
    $(".matname-global").show();
    $("[name=description]").focus().after($(".matname-global"));
  });
};

getidli = function(item) {
  $("[name=description]").val($("#" + item.id + " > a").text()).focus();
  $(".matname-global").hide();
  counter_materials_global = 0;
  getMeters();
};

selectMaterial = function(all) {
  $("[name=description]").val(all.innerHTML).focus();
  $(".matname-global").hide();
  counter_materials_global = 0;
};

keyUpDescription = function(event) {
  var key;
  key = event.keyCode || event.which;
  if (key === 13) {
    if ($(".matname-global").is(":visible")) {
      $("[name=description]").val($(".item-selected > a").text());
      $(".matname-global").hide();
    }
    getMeters();
    counter_materials_global = 0;
  }
};

getMeters = function() {
  var $nom, data;
  $nom = $("[name=description]");
  if ($nom.val() !== "") {
    data = {
      matnom: $nom.val()
    };
    $.getJSON("/json/get/meter/materials/", data, function(response) {
      var $med, template, x;
      template = "<option value=\"{{ materiales_id }}\">{{ matmed }}</option>";
      $med = $("[name=meter]");
      $med.empty();
      for (x in response.list) {
        $med.append(Mustache.render(template, response.list[x]));
      }
      return getSummaryMaterials();
    });
    return;
  } else {
    console.warn("The Field Name is empty!");
  }
};

getSummaryMaterials = function() {
  var $med, $nom, $pro, $sec, data;
  $nom = $("[name=description]");
  $med = $("[name=meter]");
  $pro = $("input[name=pro]");
  $sec = $("input[name=sec]");
  if ($nom.val().trim() !== "" && $med.val() !== "") {
    data = {
      matnom: $nom.val(),
      matid: $med.val(),
      pro: $pro.val(),
      sec: $sec.val()
    };
    $.getJSON("/json/get/resumen/details/materiales/", data, function(response) {
      var $lstp, $lsts, $tb, template, x;
      console.log(response);
      searchUnitOption();
      template = "<tr><th>Codigo :</th><td class='id-mat'>{{materialesid}}</td></tr><tr><th>Descripción :</th><td>{{matnom}}</td></tr><tr><th>Medida :</th><td>{{matmed}}</td></tr><tr><th>Unidad :</th><td>{{unidad}}</td></tr>";
      $tb = $(".tb-details > tbody");
      $tb.empty();
      for (x in response.list) {
        $tb.append(Mustache.render(template, response.list[x]));
      }
      searchBrandOption();
      autoSearchMaterialGroup(response.list[0].materialesid);
      $("input[name=cantidad]").val(response.list[0].quantity);
      $("input[name=precio]").val(response.list[0].purchase);
      $("input[name=sales]").val(response.list[0].sale);
      $("input[name=sale]").val(response.list[0].sale);
      $lstp = $("#lstpurchase");
      $lstp.empty();
      if ($lstp.length > 0 && response.purchase) {
        $lstp.append(Mustache.render("{{#purchase}}<option label=\"{{currency}}\" value=\"{{purchase}}\" />{{/purchase}}", response));
      }
      $lsts = $("#lstsales");
      $lsts.empty();
      if ($lsts.length > 0 && response.purchase) {
        $lsts.append(Mustache.render("{{#purchase}}<option label=\"{{currency}}\" value=\"{{sales}}\" />{{/purchase}}", response));
      }
      if ($("#unit").length > 0) {
        setTimeout(function() {
          console.log(response.list[0].unidad);
          $("#unit").val(response.list[0].unidad);
        }, 800);
      }
    });
  }
};

moveTopBottom = function(key) {
  var code, liSelected, ul;
  code = key;
  ul = document.getElementById("matname-global");
  if (code === 40) {
    if ($("#matname-global li.item-selected").length === 0) {
      $("#matname-global li:first").addClass("item-selected");
    } else {
      $("#matname-global li:first").addClass("item-selected");
    }
  } else if (code === 38) {
    $("#matname-global li.item-selected").removeClass("item-selected");
  } else if (code === 39) {
    liSelected = $("#matname-global li.item-selected");
    if (liSelected.length === 1 && liSelected.next().length === 1) {
      liSelected.removeClass("item-selected").next().addClass("item-selected");
      if (counter_materials_global > 9) {
        ul.scrollTop += 30;
      }
      counter_materials_global++;
    }
  } else if (code === 37) {
    liSelected = $("#matname-global li.item-selected");
    if (liSelected.length === 1 && liSelected.prev().length === 1) {
      liSelected.removeClass("item-selected").prev().addClass("item-selected");
      if (counter_materials_global > 9) {
        ul.scrollTop -= 30;
      }
      counter_materials_global--;
    }
  }
};

searchMaterialCode = function(code) {
  var data, pass;
  pass = false;
  if (code.length < 15 || code.length > 15) {
    $().toastmessage("showWarningToast", "Format Code Invalid!");
    pass = false;
  } else {
    if (code.length === 15) {
      pass = true;
    }
  }
  if (pass) {
    data = new Object();
    data["code"] = code;
    data.pro = $("input[name=pro]").val();
    data.sec = $("input[name=sec]").val();
    $.getJSON("/json/get/materials/code/", data, function(response) {
      var $lstp, $lsts, $met, $tb, mats, template;
      mats = response;
      if (response.status) {
        $met = $("[name=meter]");
        $met.empty();
        searchUnitOption();
        $met.append(Mustache.render("<option value='{{ matmed }}'>{{ matmed }}</option>", response.list));
        $("[name=description]").val(response.list.matnom);
        template = "<tr><th>Codigo :</th><td class='id-mat'>{{ materialesid }}</td></tr><tr><th>Descripción :</th><td>{{ matnom }}</td></tr><tr><th>Medida :</th><td>{{ matmed }}</td></tr><tr><th>Unidad :</th><td>{{ unidad }}</td></tr>";
        $tb = $(".tb-details > tbody");
        $tb.empty();
        $tb.append(Mustache.render(template, response.list));
        searchBrandOption();
        $("input[name=cantidad]").val(response.list.quantity);
        $("input[name=precio]").val(response.list.purchase);
        $("input[name=sale]").val(response.list.sale);
        $("input[name=sales]").val(response.list.sale);
        $lstp = $("#lstpurchase");
        $lstp.empty();
        if ($lstp.length > 0 && response.purchase) {
          $lstp.append(Mustache.render("{{#purchase}}<option label=\"{{currency}}\" value=\"{{purchase}}\" />{{/purchase}}", response));
        }
        $lsts = $("#lstsales");
        $lsts.empty();
        if ($lsts.length > 0 && response.purchase) {
          $lsts.append(Mustache.render("{{#purchase}}<option label=\"{{currency}}\" value=\"{{sales}}\" />{{/purchase}}", response));
        }
        if ($("#unit").length > 0) {
          setTimeout(function() {
            console.log(response.list.unidad);
            $("#unit").val(response.list.unidad);
          }, 800);
        }
      } else {
        console.log("materials not found");
        $().toastmessage("showWarningToast", "The material not found.");
      }
    });
  }
};

autoSearchMaterialGroup = function(materials) {
  var data;
  if ($("input[name=gincludegroup]").length && $("input[name=gincludegroup]").is(":checked")) {
    if ($(".msgparent").is(":visible")) {
      $(".msgparent").addClass("hide");
    }
    data = new Object;
    data.materials = materials;
    data.searchGroupMaterial = true;
    $.getJSON("/json/get/group/materials/bedside/", data, function(response) {
      var $tb, template, x;
      console.warn(response);
      if (response.status) {
        if (response.result) {
          if (!$("#searchGroupModalGlobal").length) {
            $("footer").append(modalGlobalGroupMaterial);
          }
          if (response.hasOwnProperty('parent')) {
            $("#gparent").val(1);
            $(".msgparent").removeClass("hide");
          } else {
            $("#gparent").val(0);
          }
          template = "<tr> <td>{{ item }}</td> <td>{{ description }}</td> <td>{{ name }}</td> <td>{{ tdesc }}</td> <td> <button class=\"btn btn-xs btn-link text-primary bg-modal-view-details\" value=\"{{ mgroup }}\" data-mat=\"{{ materials }}\"> <span class=\"fa fa-chevron-circle-down\"></span> </button> </td> </tr>";
          $tb = $("table.table-group-materials-global > tbody");
          $tb.empty();
          for (x in response.list) {
            response.list[x].item = parseInt(x) + 1;
            $tb.append(Mustache.render(template, response.list[x]));
          }
          $("#searchGroupModalGlobal").modal("show");
        } else {
          $().toastmessage("showErrorToast", "No se han encontrado un grupo de materiales.");
        }
      }
    });
  }
};

getDetailsGroupMaterials = function(event) {
  var data, mgroup;
  mgroup = this.value;
  if (mgroup.length === 10) {
    data = new Object;
    data.DetailsGroupMaterials = true;
    data.mgroup = mgroup;
    $.getJSON("/json/get/group/materials/bedside/", data, function(response) {
      var $tb, meter, o, op, options, s, sel, template, tmp, x;
      if (response.status) {
        template = "<tr> <td>{{ item }}</td> <td>{{ materials }}</td> <td>{{ name }}</td> <td> {{!meter}} </td> <td>{{ unit }}</td> <td> <input type=\"text\" style=\"width: 80px;\" class=\"form-control input-sm text-right\" value=\"{{ quantity }}\" onKeyUp=\"numberOnly(event);\"></td> </tr>";
        $tb = $("table.table-group-materials-details-global > tbody");
        $tb.empty();
        options = "<option value=\"{{ materials }}\" {{!select}}>{{ meter }}</option>";
        sel = "<select class=\"form-control input-sm\" style=\"width: 200px\">{{!ops}}</select>";
        for (x in response.details) {
          tmp = template;
          meter = "";
          s = sel;
          for (o in response[response.details[x].materials]) {
            op = options;
            if ($.trim(response[response.details[x].materials][o].meter) === $.trim(response.details[x].diameter)) {
              op = op.replace("{{!select}}", "selected");
            }
            meter += Mustache.render(op, response[response.details[x].materials][o]);
          }
          s = s.replace("{{!ops}}", meter);
          tmp = tmp.replace("{{!meter}}", s);
          response.details[x].item = parseInt(x) + 1;
          $tb.append(Mustache.render(tmp, response.details[x]));
        }
        $("div.global-group-modal-two, .bg-modal-back, .bg-modal-save").removeClass("hide");
        $("div.global-group-modal-one").addClass("hide");
        if (parseInt($("#gparent").val())) {
          $(".bg-modal-create").removeClass("hide");
        }
      } else {
        $().toastmessage("showErrorToast", "No hay detalles para mostrar.");
      }
    });
    return;
  } else {
    $().toastmessage("showErrorToast", "Formato de Codigo Incorrecto.");
    return;
  }
};

bgModalBack = function(event) {
  $("div.global-group-modal-one").removeClass("hide");
  $("div.global-group-modal-two, .bg-modal-back, .bg-modal-save, .bg-modal-create").addClass("hide");
};

bgModalErase = function(event) {
  var tmpObjectDetailsGroupMaterials;
  $("#searchGroupModalGlobal").modal("hide");
  $("table.table-group-materials-global > tbody").empty();
  $("table.table-group-materials-details-global > tbody").empty();
  $("div.global-group-modal-one").removeClass("hide");
  $("div.global-group-modal-two, .bg-modal-back, .bg-modal-save, .bg-modal-create").addClass("hide");
  tmpObjectDetailsGroupMaterials = new Object;
  if ($(".msgparent").is(":visible")) {
    $(".msgparent").addClass("hide");
  }
};

tmpObjectDetailsGroupMaterials = new Object;

bgModalAddMaterials = function(event) {
  var tm;
  tm = new Array;
  $("table.table-group-materials-details-global > tbody > tr").each(function(index, element) {
    var $td;
    $td = $(element).find("td");
    tm.push({
      "materials": $td.eq(3).find("select").val(),
      "quantity": $td.eq(5).find("input").val()
    });
  });
  tmpObjectDetailsGroupMaterials.details = tm;
  $("#searchGroupModalGlobal").modal("hide");
  $("table.table-group-materials-global > tbody").empty();
  $("table.table-group-materials-details-global > tbody").empty();
  $("div.global-group-modal-one").removeClass("hide");
  $("div.global-group-modal-two, .bg-modal-back, .bg-modal-save, .bg-modal-create").addClass("hide");
  if ($(".msgparent").is(":visible")) {
    $(".msgparent").addClass("hide");
  }
};

searchBrandOption = function() {
  $.getJSON("/json/brand/list/option/", function(response) {
    var $brand, template, x;
    if (response.status) {
      template = "<option value=\"{{ brand_id }}\" {{ select }}>{{ brand }}</option>";
      $brand = $("select[name=brand]");
      $brand.empty();
      for (x in response.brand) {
        if (response.brand[x].brand_id === "BR000") {
          response.brand[x].select = "selected";
        }
        $brand.append(Mustache.render(template, response.brand[x]));
      }
      $brand.click();
    } else {
      $().toastmessage("showWarningToast", "No se a podido obtener la lista de marcas.");
    }
  });
};

searchModelOption = function() {
  var brand, data;
  brand = $("select[name=brand]").val();
  if (brand !== "") {
    data = {
      brand: brand
    };
    $.getJSON("/json/model/list/option/", data, function(response) {
      var $model, template, tmp, x;
      if (response.status) {
        template = "<option value=\"{{ model_id }}\" {{!sel}}>{{ model }}</option>";
        $model = $("select[name=model]");
        $model.empty();
        for (x in response.model) {
          tmp = template;
          if (response.model[x].model_id === "MO000") {
            tmp = tmp.replace("{{!sel}}", "selected");
          }
          $model.append(Mustache.render(tmp, response.model[x]));
        }
      } else {
        $().toastmessage("showWarningToast", "No se a podido obtener la lista de marcas.");
      }
    });
  }
};

searchUnitOption = function() {
  var $unit, data;
  $unit = $("[name=unit]");
  if ($unit.length) {
    data = {
      list: true
    };
    $.get("/unit/list/", data, function(response) {
      var template;
      if (response.status) {
        template = "<option selected>--Elije una unidad--</option>{{#lunit}}<option value=\"{{unidad_id}}\">{{uninom}}</option>{{/lunit}}";
        $unit.empty();
        $unit.html(Mustache.render(template, response));
      } else {
        $().toastmessage("showWarningToast", "Error al listar unidades");
      }
    });
    return;
  }
};

globalDataBrand = new Object;

getDataBrand = function() {
  $.getJSON("/json/brand/list/option/", function(response) {
    globalDataBrand = response.brand;
    if (response.status) {
      return response.brand;
    } else {
      return new Object;
    }
  });
};

globalDataModel = new Object;

getDataModel = function() {
  $.getJSON("/json/model/list/option/", function(response) {
    if (response.status) {
      globalDataModel = response.model;
      return response.model;
    } else {
      return new Object;
    }
  });
};

setDataBrand = function(element, value) {
  $.getJSON("/json/brand/list/option/", function(response) {
    var $sel, template, tmp, x;
    if (response.status) {
      template = "<option value=\"{{ brand_id }}\" {{!sel}}>{{ brand }}</option>";
      $sel = $("" + element);
      $sel.empty();
      for (x in response.brand) {
        tmp = template;
        if (response.brand[x].brand_id === value) {
          tmp = tmp.replace("{{!sel}}", "selected");
        }
        $sel.append(Mustache.render(tmp, response.brand[x]));
      }
    }
  });
};

setDataModel = function(element, value) {
  $.getJSON("/json/model/list/option/", function(response) {
    var $sel, template, tmp, x;
    if (response.status) {
      template = "<option value=\"{{ model_id }}\" {{!sel}}>{{ model }}</option>";
      $sel = $("" + element);
      $sel.empty();
      for (x in response.model) {
        tmp = template;
        if (response.model[x].model_id === value) {
          tmp = tmp.replace("{{!sel}}", "selected");
        }
        $sel.append(Mustache.render(tmp, response.model[x]));
      }
    }
  });
};

keyDescription = function(event) {
  var key;
  key = void 0;
  key = (window.Event ? event.keyCode : event.which);
  if (key !== 13 && key !== 40 && key !== 38 && key !== 39 && key !== 37) {
    getDescription(this.value.toLowerCase());
  }
  if (key === 40 || key === 38 || key === 39 || key === 37) {
    moveTopBottom(key);
  }
};

keyCode = function(event) {
  var key;
  key = void 0;
  key = (window.Event ? event.keyCode : event.which);
  if (key === 13) {
    return searchMaterialCode(this.value);
  }
};

searchMaterial = function(event) {
  var code, desc;
  code = void 0;
  desc = void 0;
  desc = $("input[name=description]").val();
  code = $("input[name=code]").val();
  if (code.length === 15) {
    return searchMaterialCode(code);
  } else {
    return getDescription($.trim(desc).toLowerCase());
  }
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

$(document).on("click", "select[name=brand]", function(event) {
  searchModelOption();
});

$(document).on("keyup", "input[name=description]", keyDescription);

$(document).on("keypress", "input[name=description]", keyUpDescription);

$(document).on("click", "select[name=meter]", getSummaryMaterials);

$(document).on("keypress", "input[name=code]", keyCode);

$(document).on("click", ".bg-modal-view-details", getDetailsGroupMaterials);

$(document).on("click", ".bg-modal-back", bgModalBack);

$(document).on("click", ".bg-modal-erase", bgModalErase);

$(document).on("click", ".bg-modal-save", bgModalAddMaterials);

$(document).on("click", ".btn-new-brand", openBrand);

$(document).on("click", ".btn-new-model", openModel);

modalGlobalGroupMaterial = "<div class=\"modal fade\" id=\"searchGroupModalGlobal\" data-backdrop=\"static\"> <div class=\"modal-dialog modal-lg\"> <div class=\"modal-content\"> <div class=\"modal-header\"> <h4 class=\"modal-title\"> Grupo de Materiales </h4> </div> <div class=\"modal-body global-group-modal-one\"> <input type=\"hidden\" id=\"gparent\"> <div class=\"alert alert-block alert-warning hide msgparent\"> <strong>Alerta!</strong> <p> El material no cuenta con un grupo de materiales diseñado para este, pero existén parecidos. </p> </div> <div class=\"table-responsive\"> <table class=\"table table-condensed table-hover table-group-materials-global\"> <thead> <tr> <th>Item</th> <th>Descripción</th> <th>Material</th> <th>Tipo</th> <th></th> </tr> </thead> <tbody></tbody> </table> </div> </div> <div class=\"modal-body global-group-modal-two hide\"> <div class=\"alert alert-info alert-block\"> <a data-dismiss=\"alert\" class=\"close\">&times;</a> <strong>Ten encuenta.</strong> <p> Que los cambios realizados en este cuadro son locales no afectán al grupo de materiales guardado inicialmente. </p> </div> <div class=\"table-responsive\"> <table class=\"table table-condensed table-hover table-group-materials-details-global\"> <thead> <tr> <th>Item</th> <th>Código</th> <th>Descripción</th> <th>Medida</th> <th>Und</th> <th>Cantidad</th> <th></th> </tr> </thead> <tbody></tbody> </table> </div> </div> <div class=\"modal-footer\"> <button class=\"btn btn-default btn-sm pull-left bg-modal-erase\"> <span class=\"glyphicon glyphicon-remove\"></span> No añadir grupo </button> <button class=\"btn btn-default btn-sm pull-left bg-modal-back hide\"> <span class=\"fa fa-chevron-circle-left\"></span> Regresar </button> <button class=\"btn btn-danger btn-sm bg-modal-create hide\" disabled> <span class=\"fa fa-list-alt\"></span> Crear Grupo </button> <button class=\"btn btn-primary btn-sm bg-modal-save hide\"> <span class=\"fa fa-save\"></span> Añadir grupo </button> </div> </div> </div> </div>";


/*
For search group materials
<div class="col-md-2">
    <div class="form-group has-warning">
        <label class="control-label">Incluir Grupo</label>
        <!-- <div class="btn-group" data-toggle="buttons">
            <label class="btn btn-sm btn-danger btn-block"> -->
            <input type="checkbox" name="gincludegroup" value="0">
             <!--    GM
            </label>
        </div> -->
    </div>
</div>
 */


/*
 * For Sear Material Template
<div class="panel-body panel-add bg-warning">
    <div class="row">
        <div class="col-md-12">
            <div class="row">
                <div class="col-md-4">
                    <div class="form-group has-warning">
                        <label class="control-label">Descripción / Nombre de material</label>
                        <input type="text" class="form-control input-sm" name="description">
                        <ul id="matname-global" class="matname-global"></ul>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="form-group has-warning">
                        <label class="control-label">Código</label>
                        <input type="text" class="form-control input-sm" maxlength="15" name="code">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group has-warning">
                        <label class="control-label">Medida</label>
                        <select class="form-control input-sm" name="meter"></select>
                    </div>
                </div>
                <div class="col-md-6">
                  <div class="row">
                    <div class="col-md-4">
                        <div class="form-group has-warning">
                            <label class="control-label">Metrado/Cantidad</label>
                            <input type="text" class="form-control input-sm" name="quantity" min="1" placeholder="0">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group has-warning">
                            <label class="control-label">Precio</label>
                            <input type="text" class="form-control input-sm" name="price" min="1" placeholder="0">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group has-warning">
                            <label class="control-label">Marca</label>
                            <div class="input-group">
                                <select name="brand" id="brand" class="form-control input-sm"></select>
                                <span class="input-group-btn">
                                    <button class="btn btn-sm btn-default btn-new-brand"><span class="glyphicon glyphicon-plus"></span></button>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group has-warning">
                            <label class="control-label">Modelo</label>
                            <div class="input-group">
                                <select name="model" id="model" class="form-control input-sm"></select>
                                <span class="input-group-btn">
                                    <button class="btn btn-default btn-sm btn-new-model"><span class="span glyphicon glyphicon-plus"></span></button>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <div class="form-group has-warning">
                            <label class="control-label">Incluir Grupo</label>
                            <input type="checkbox" name="gincludegroup" value="0">
                        </div>
                    </div>
                    <div class="col-md-2">
                        <div class="form-group has-warning">
                            <label class="control-label">Agregar</label>
                            <button class="btn btn-block btn-warning text-black btn-add">
                                <span class="glyphicon glyphicon-plus"></span>
                            </button>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <p>
                            <small>
                                El precio del sistema esta expresado en <q class="currency-name">{{ system.moneda.moneda }}</q>
                            </small>
                        </p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                    <div class="alert alert-warning alert-block">
                        <strong>Resumén</strong>
                        <table class="table-condensed tb-details">
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
 */
