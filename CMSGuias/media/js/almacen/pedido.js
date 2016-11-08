var aggregate_materials, aggregate_nipples, btn_delete_show, btn_edit_show, delete_all_temp_nipples, delete_temp_nipple, edit_quantity_tmp, edit_temp_nipple, get_niples, list_temp_materials, list_temp_nipples, saved_or_update_nipples;

$(document).ready(function() {
  $(".description, .block-add-mat").hide();
  $(".in-date").datepicker({
    minDate: "0",
    maxDate: "+2M",
    changeMonth: true,
    changeYear: true,
    showAnim: "slide",
    dateFormat: "yy-mm-dd"
  });
  $(".btnadd").click(function() {
    aggregate_materials();
  });
  $(".btn-edit-cantidad").click(function() {
    edit_quantity_tmp();
  });
  $(".btn-delete-mat").click(function() {
    var $btn, $dni, $mid, $token, data;
    $mid = $(".del-mid");
    $dni = $(".empdni");
    $btn = $(this);
    $token = $("[name=csrfmiddlewaretoken]");
    if ($mid.html() !== "") {
      $btn.button("loading");
      data = {
        dni: $dni.val(),
        mid: $mid.html(),
        csrfmiddlewaretoken: $token.val()
      };
      $.post("/json/post/delete/tmp/materials/", data, (function(response) {
        if (response.status) {
          $btn.button("reset");
          list_temp_materials();
          $(".modal-delete-mid").modal("hide");
        }
      }), "json");
    }
  });
  list_temp_materials();
  $(".btn-add-mat").click(function() {
    var $block, $btn;
    $block = $(".block-add-mat");
    $btn = $(".btn-add-mat > span");
    if ($block.is(":hidden")) {
      $block.show("blind", 600);
      $btn.removeClass("glyphicon-plus").addClass("glyphicon-minus");
    } else {
      $block.hide("blind", 600);
      $btn.addClass("glyphicon-plus").removeClass("glyphicon-minus");
    }
    console.log("yes, go it");
  });
  $(".btn-list").click(function() {
    list_temp_materials();
  });
  $(".btn-niples").click(function() {
    get_niples();
  });
  $(".btn-del-all-temp-show").click(function() {
    $(".modal-delete-all-temp").modal("show");
  });
  $(".btn-up-file-show").click(function() {
    $(".modal-up-file").modal("show");
  });
  $(".btn-del-all-temp").click(function() {
    var data;
    data = {
      dni: $(".empdni").val(),
      csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val()
    };
    $.post("/json/post/delete/all/temp/order/", data, (function(response) {
      if (response.status) {
        location.reload();
      }
    }), "json");
  });
  $(".btn-order-show").click(function(event) {
    event.preventDefault();
    $(".modal-order").modal("show");
  });
  $.getJSON("/json/get/projects/list/", function(response) {
    var $pro, template, x;
    if (response.status) {
      $pro = $(".pro");
      $pro.empty();
      template = "<option value='{{proyecto_id}}'>{{nompro}}</option>";
      for (x in response.list) {
        $pro.append(Mustache.render(template, response.list[x]));
      }
    }
  });
  $.getJSON("/json/get/stores/list/", function(response) {
    var $al, template, x;
    if (response.status) {
      $al = $(".al");
      $al.empty();
      template = "<option value='{{almacen_id}}'>{{nombre}}</option>";
      for (x in response.list) {
        $al.append(Mustache.render(template, response.list[x]));
      }
    }
  });
  $(".pro").click(function(event) {
    var $sec, $sub, data;
    event.preventDefault();
    $sub = $(".sub");
    $sec = $(".sec");
    $.getJSON("/json/get/subprojects/list/", {
      pro: this.value
    }, function(response) {
      var template, x;
      if (response.status) {
        template = "<option value='{{subproyecto_id}}'>{{nomsub}}</option>";
        $sub.empty();
        $sub.append("<option value=''>-- Nothing --</option>");
        for (x in response.list) {
          $sub.append(Mustache.render(template, response.list[x]));
        }
      }
    });
    data = {
      pro: this.value
    };
    $.getJSON("/json/get/sectors/list/", data, function(response) {
      var template, x;
      if (response.status) {
        template = "<option value='{{sector_id}}'>{{nomsec}} {{planoid}}</option>";
        $sec.empty();
        for (x in response.list) {
          $sec.append(Mustache.render(template, response.list[x]));
        }
      }
    });
  });
  $(".tofile").click(function(event) {
    event.preventDefault();
    $("#file").click();
  });
  $("#file").change(function() {
    console.log("in change");
    if (this.value !== "") {
      $(".file-container,.tofile").removeClass("alert-warning text-warning").addClass("alert-success text-success");
    }
  });
  $(".btn-saved-order").click(function(event) {
    $(".modal-order").modal("hide");
    $().toastmessage("showToast", {
      text: "Seguro(a) que termino de ingresar los materiales al pedido?",
      buttons: [
        {
          value: "No"
        }, {
          value: "Si"
        }
      ],
      type: "confirm",
      sticky: true,
      success: function(result) {
        if (result === "Si") {
          setTimeout((function() {
            $().toastmessage("showToast", {
              text: "Seguro(a) que termino de ingresar los Niples al pedido, recuerde que una vez que se guarde el pedido no podra modificarse.?",
              buttons: [
                {
                  value: "No"
                }, {
                  value: "Si"
                }
              ],
              type: "confirm",
              sticky: true,
              success: function(resp2) {
                if (resp2 === "Si") {
                  setTimeout((function() {
                    $().toastmessage("showToast", {
                      sticky: true,
                      text: "Desea Generar Pedido almacén?",
                      type: "confirm",
                      buttons: [
                        {
                          value: "No"
                        }, {
                          value: "Si"
                        }
                      ],
                      success: function(resp3) {
                        var data;
                        if (resp3 === "Si") {
                          data = new FormData($("form").get(0));
                          $.ajax({
                            data: data,
                            url: "",
                            type: "POST",
                            dataType: "json",
                            cache: false,
                            processData: false,
                            contentType: false,
                            success: function(response) {
                              console.log(response);
                              if (response.status) {
                                location.reload();
                              }
                            }
                          });
                        } else {
                          $(".modal-order").modal("show");
                        }
                      }
                    });
                  }), 600);
                } else {
                  $(".modal-order").modal("show");
                }
              }
            });
          }), 600);
        } else {
          $(".modal-order").modal("show");
        }
      }
    });
  });
  $(".obs").focus(function() {
    $(this).animate({
      height: "102px"
    }, 600);
  });
  $(".obs").blur(function() {
    $(this).animate({
      height: "34px"
    }, 600);
  });
  $(".btn-down-temp").click(function(event) {
    var url;
    url = "/media/storage/templates/Orderstmp.xls";
    window.open(url, "_blank");
  });
  $(".show-input-file-temp").click(function(event) {
    event.preventDefault();
    $(".input-file-temp").click();
  });
  $(".btn-upload-file-temp").click(function(event) {
    var $input, btn, data, file;
    $input = $("[name=input-file-temp]").get(0);
    file = $input.files[0];
    btn = this;
    if (file != null) {
      data = new FormData();
      data.append("ftxls", file);
      data.append("csrfmiddlewaretoken", $("[name=csrfmiddlewaretoken]").val());
      $.ajax({
        url: "/json/post/upload/orders/temp/",
        type: "POST",
        dataType: "json",
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        beforeSend: function() {
          $(btn).button("loading");
        },
        success: function(response) {
          $(btn).button("complete");
          if (response.status) {
            setTimeout((function() {
              location.reload();
            }), 1000);
          }
        }
      });
    } else {
      $().toastmessage("showWarningToast", "No se a seleccionado un archivo!");
    }
  });
});

aggregate_materials = function() {
  var $cant, $dni, $mid, $token, data;
  $mid = $(".id-mat");
  $cant = $(".cantidad");
  $dni = $(".empdni");
  $token = $("[name=csrfmiddlewaretoken]");
  if ($mid.html() !== "" && $cant.val() !== "") {
    data = {
      mid: $mid.html(),
      cant: $cant.val(),
      dni: $dni.val(),
      brand: $("select[name=brand]").val(),
      model: $("select[name=model]").val(),
      csrfmiddlewaretoken: $token.val()
    };
    if ($("input[name=gincludegroup]").length) {
      if ($("input[name=gincludegroup]").is(":checked")) {
        data.details = JSON.stringify(tmpObjectDetailsGroupMaterials.details);
      }
    }
    $.post("/json/post/aggregate/tmp/materials/", data, (function(response) {
      console.log(response);
      if (response.status) {
        list_temp_materials();
      } else {
        console.error("Error en la transación add");
      }
    }), "json");
  } else {
    console.warn("No se a ingresado codigo y cantidad.");
  }
};

list_temp_materials = function() {
  var $mid;
  $mid = $(".id-mat");
  if ($(".edit-mid").html() !== "") {
    $mid = $(".edit-mid");
  }
  return $.getJSON("/json/get/list/temp/order/", {
    dni: $(".empdni").val()
  }, function(response) {
    var $tbody, template, tmp, x;
    if (response.status) {
      $tbody = $("[template-data-user=tmporder]");
      $tbody.empty();
      if (response.list.length > 0) {
        template = "<tr class=\"{{!new}}\"> <td class='text-center'>{{ item }}</td> <td>{{ materiales_id }}</td> <td>{{ matnom }}</td> <td>{{ matmed }}</td> <td>{{ brand }}</td> <td>{{ model }}</td> <td class='text-center'>{{ unidad }}</td> <td class='text-center'>{{ cantidad }}</td> <td class='text-center'> <button class='btn btn-xs btn-info text-black' onClick='btn_edit_show({{ materiales_id }},{{ cantidad }});'> <span class='glyphicon glyphicon-edit'></span> </button> </td> <td class='text-center'> <button class='btn btn-xs btn-danger text-black' onClick='btn_delete_show({{ materiales_id }},{{ cantidad }})'> <span class='glyphicon glyphicon-remove'></span> </button> </td> </tr>";
        for (x in response.list) {
          tmp = template;
          if (response.list[x].materiales_id === $mid.html()) {
            tmp = tmp.replace("{{!new}}", "success");
          } else {
            tmp = tmp.replace("{{!new}}", "warning");
          }
          $tbody.append(Mustache.render(tmp, response.list[x]));
        }
        $(".success").ScrollTo({
          duration: 1000,
          callback: function() {
            setTimeout((function() {
              $(".well").ScrollTo({
                duration: 1000
              });
              $(".description").focus();
            }), 1000);
          }
        });
      }
    }
  });
};

btn_edit_show = function(id, cant) {
  var data;
  id = String(id).valueOf();
  if (id !== "") {
    data = {
      mid: id
    };
    $.getJSON("/json/get/details/materials/", data, function(response) {
      if (response.status) {
        $(".edit-mid").html(id);
        $(".edit-des").html(response.matnom);
        $(".edit-med").html(response.matmed);
        $(".edit-unid").html(response.unidad_id);
        $(".edit-cant").val(cant);
        $(".modal-edit-cant").modal("show");
      }
    });
  }
};

btn_delete_show = function(id, cant) {
  $.getJSON("/json/get/details/materials/", {
    mid: id
  }, function(response) {
    if (response.status) {
      $(".del-mid").html(id);
      $(".del-des").html(response.matnom);
      $(".del-med").html(response.matmed);
      $(".del-unid").html(response.unidad_id);
      $(".del-cant").html(cant);
      $(".modal-delete-mid").modal("show");
    }
  });
};

edit_quantity_tmp = function() {
  var $btn, $cant, $dni, $mid, $token, data;
  $mid = $(".edit-mid");
  $cant = $(".edit-cant");
  $dni = $(".empdni");
  $btn = $(".btn-edit-cantidad");
  $token = $("[name=csrfmiddlewaretoken]");
  if ($mid.html() !== "" && $cant.val() !== 0) {
    $btn.button("loading");
    data = {
      dni: $dni.val(),
      mid: $mid.html(),
      cantidad: $cant.val(),
      csrfmiddlewaretoken: $token.val()
    };
    $.post("/json/post/update/tmp/materials/", data, (function(response) {
      if (response.status) {
        $btn.button("reset");
        $(".modal-edit-cant").modal("hide");
        list_temp_materials();
        setTimeout((function() {
          $(".edit-mid").html("");
        }), 3000);
      }
    }), "json");
  }
};

get_niples = function() {
  var template;
  template = "<div class='panel panel-default panel-warning'>" + "<div class='panel-heading'>" + "<h4 class='panel-title'>" + "<a data-toggle='collapse' class='collapsed' data-parent='#niples' onClick='list_temp_nipples({{materiales_id}});' href='#des{{materiales_id}}'>{{matnom}} - {{matmed}}</a>" + "<span class='pull-right badge badge-warning'>Quedan <span class='res{{materiales_id}}'></span> cm</span>" + "<span class='pull-right badge badge-warning'>Ingresado <span class='in{{materiales_id}}'></span> cm</span>" + "<span class='pull-right badge badge-warning'>Total {{cantidad}} {{unidad}}</span>" + "<input type='hidden' class='totr{{materiales_id}}' value='{{cantidad}}'>" + "</h4>" + "</div>" + "<div id='des{{materiales_id}}' class='panel-collapse collapse'>" + "<div class='panel-body c{{materiales_id}}'>" + "<div class='table-responsive'>" + "<table class='table table-condensed table-hover'>" + "<caption class='text-left'><div class='row'><div class='col-md-4'><div class='btn-group'>" + "<button class='btn btn-default btn-xs btn-add-nipple-{{materiales_id}}' onClick='aggregate_nipples({{materiales_id}});' type='Button' data-loading-text='Proccess...'><span class='glyphicon glyphicon-plus-sign'></span> Agregar</button>" + "<button class='btn btn-default btn-xs' onClick='list_temp_nipples({{materiales_id}});' type='Button' data-loading-text='Proccess...'><span class='glyphicon glyphicon-refresh'></span> Recargar</button>" + "<button class='btn btn-danger btn-xs' onClick='delete_all_temp_nipples({{materiales_id}});' type='Button' data-loading-text='Proccess...'><span class='glyphicon glyphicon-trash'></span> Eliminar Todo</button>" + "</div></div>" + "<div class='col-md-8'><div class='form-inline pull-right'>" + "<div class='form-group '>" + "<select name='controlnipples' class='form-control input-sm tn{{materiales_id}}' title='Tipo Niple' placeholder='Tipo Niple' DISABLED>" + "<option value='A'>A - Roscado</option><option value='B'>B - Ranurado</option><option value='C'>C - Roscado - Ranurado</option>" + "</select>" + "</div>" + "<div class='form-group col-md-4'>" + "<div class='input-group input-group-sm'><input type='number' name='controlnipples' placeholder='Medida' min='0' class='form-control input-sm mt{{materiales_id}}' DISABLED><span class='input-group-addon'><strong>cm</strong><span></div>" + "</div>" + "<div class='form-group'>" + "<input type='number' name='controlnipples' placeholder='Cantidad' min='1' class='form-control input-sm nv{{materiales_id}}' DISABLED>" + "</div>" + "<input type='hidden' class='update-id-{{materiales_id}}' value=''>" + "<input type='hidden' class='update-quantity-{{materiales_id}}' value=''>" + "<button class='btn btn-success text-black btn-sm' name='controlnipples' type='Button' onClick='saved_or_update_nipples({{materiales_id}})' DISABLED><span class='glyphicon glyphicon-floppy-save'></span> Guardar</button>" + "</div></div>" + "</caption>" + "<thead><th>Cantidad</th><th>Descripción</th><th>Diametro</th><th><th><th>Medida</th><th>Unidad</th><th>Editar</th><th>Eliminar</th></thead>" + "<tbody class='tb{{materiales_id}}'></tbody>" + "</table>" + "</div>" + "</div>" + "</div>" + "</div>";
  $.getJSON("/json/get/nipples/temp/oreder/", function(response) {
    var $collapse, x;
    if (response.status) {
      $collapse = $("#niples");
      $collapse.empty();
      for (x in response.nipples) {
        $collapse.append(Mustache.render(template, response.nipples[x]));
      }
    } else {
      $().toastmessage("showNoticeToast", "No se han encontrado Tuberia para generar niples.");
    }
  });
};

aggregate_nipples = function(mid) {
  mid = String(mid).valueOf();
  $("[name=controlnipples]").attr("DISABLED", false);
  $(".update-id-" + mid).val("");
};

list_temp_nipples = function(mid) {
  var data;
  mid = String(mid).valueOf();
  if (mid !== "") {
    data = {
      mid: mid,
      dni: $(".empdni").val()
    };
    $.getJSON("/json/get/list/temp/nipples/", data, function(response) {
      var $tb, incm, res, template, totcm, x;
      if (response.status) {
        $tb = $(".tb" + mid);
        template = "<tr><td class='text-center'>{{cantidad}}</td><td>{{matnom}}</td><td>{{matmed}}</td><td>x<td><td class='text-center'>{{metrado}}</td><td class='text-center'>cm</td><td class='text-center'><button type='Button' class='btn btn-xs btn-info text-black' onClick=edit_temp_nipple({{id}},{{materiales_id}},{{cantidad}},{{metrado}},'{{tipo}}');><span class='glyphicon glyphicon-edit'></span></button></td><td class='text-center'><button type='Button' class='text-black btn btn-xs btn-danger' onClick='delete_temp_nipple({{id}},{{materiales_id}})'><span class='glyphicon glyphicon-remove'></span></button></td>";
        $tb.empty();
        totcm = 0;
        incm = 0;
        res = 0;
        totcm = (parseInt($(".totr" + mid).val())) * 100;
        for (x in response.list) {
          $tb.append(Mustache.render(template, response.list[x]));
          incm += response.list[x].cantidad * response.list[x].metrado;
        }
        res = totcm - incm;
        $(".in" + mid).html(incm);
        $(".res" + mid).html(res);
        if (res === 0 || res < 0) {
          $(".btn-add-nipple-" + mid).attr("disabled", true);
        } else {
          $(".btn-add-nipple-" + mid).attr("disabled", false);
        }
      }
    });
  }
};

saved_or_update_nipples = function(mid) {
  var $nv, $quantity, $type, $update, data, nv, pass, res, uco, valcant;
  mid = String(mid).valueOf();
  $update = $(".update-id-" + mid);
  $quantity = $(".mt" + mid);
  $type = $(".tn" + mid);
  $nv = $(".nv" + mid);
  nv = 0;
  pass = Boolean(false).valueOf();
  if ($quantity.val().trim() === "") {
    $().toastmessage("showWarningToast", "No se a ingresado una cantidad.");
    return pass;
  } else {
    pass = Boolean(true).valueOf();
    console.info(pass);
  }
  if ($nv.val().trim() === "" || $nv.val().trim() === 0) {
    nv = 1;
  } else {
    nv = $nv.val();
  }
  valcant = parseInt($quantity.val().trim()) * parseInt(nv);
  res = parseInt($(".res" + mid).html().trim());
  if ($update.val().trim() !== "") {
    uco = $(".update-quantity-" + mid).val();
    pass = (valcant <= (parseInt(uco) + res) ? Boolean(true).valueOf() : Boolean(false).valueOf());
  } else if (valcant > res) {
    pass = Boolean(false).valueOf();
    $().toastmessage("showWarningToast", "La cantidad ingresada es superior a la establecida.");
    return false;
  }
  if (pass && nv >= 1) {
    data = {};
    if ($update.val().trim() === "") {
      data = {
        tra: "new",
        cant: $quantity.val().trim(),
        mid: mid,
        type: $type.val(),
        veces: nv,
        dni: $(".empdni").val(),
        csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val()
      };
    } else {
      data = {
        tra: "update",
        id: $update.val(),
        cant: $quantity.val().trim(),
        mid: mid,
        type: $type.val(),
        veces: nv,
        dni: $(".empdni").val(),
        csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val()
      };
    }
    $.post("/json/post/saved/temp/nipples/", data, function(response) {
      if (response.status) {
        list_temp_nipples(mid);
        $("[name=controlnipples]").attr("DISABLED", true);
        $(".update-id-" + mid).val("");
        $(".update-quantity-" + mid).val("");
      }
    });
  } else {
    $().toastmessage("showWarningToast", "La cantidad o la medida no se han ingresado o no son correctas.");
  }
};

edit_temp_nipple = function(id, mid, cant, med, tipo) {
  $("[name=controlnipples]").attr("DISABLED", false);
  mid = String(mid).valueOf();
  $(".mt" + mid).val(med);
  $(".nv" + mid).val(cant);
  $(".tn" + mid).val(tipo);
  $(".tn" + mid).attr("DISABLED", true);
  $(".update-id-" + mid).val(id);
  $(".update-quantity-" + mid).val(parseInt(cant) * parseInt(med));
};

delete_temp_nipple = function(id, mid) {
  $().toastmessage("showToast", {
    text: "Seguro(a) que desea eliminar el niple?",
    type: "confirm",
    sticky: true,
    buttons: [
      {
        value: "No"
      }, {
        value: "Si"
      }
    ],
    success: function(result) {
      var data;
      if (result === "Si") {
        mid = String(mid).valueOf();
        data = {
          id: id,
          mid: mid,
          dni: $(".empdni").val(),
          csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val()
        };
        $.post("/json/post/delete/temp/nipples/item/", data, (function(response) {
          if (response.status) {
            mid = String(mid).valueOf();
            list_temp_nipples(mid);
          }
        }), "json");
      }
    }
  });
};

delete_all_temp_nipples = function(mid) {
  $().toastmessage("showToast", {
    text: "Seguro(a) que desea eliminar toda la lista de niples?",
    type: "confirm",
    sticky: true,
    buttons: [
      {
        value: "No"
      }, {
        value: "Si"
      }
    ],
    success: function(result) {
      var data;
      if (result === "Si") {
        mid = String(mid).valueOf();
        data = {
          mid: mid,
          dni: $(".empdni").val(),
          csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val()
        };
        $.post("/json/post/delete/all/temp/nipples/", data, (function(response) {
          if (response.status) {
            mid = String(mid).valueOf();
            list_temp_nipples(mid);
          }
        }), "json");
      }
    }
  });
};
