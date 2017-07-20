var cod = '';
var flag = '';
var iddoc = '';
var cambest = '';
var cambestado = '';
var dataherra = [];
var tamherra = [];
var fav = [];
var total = '';
var idde = '';
var idhedev = '';
var rtotal = '';
var respstock = '';
var stfinal = '';
var herra = '';
var iddetguiahe = '';
ltotales = [];
lflag = [];
lcodigos = [];
ltot = [];
lcant = [];
lishg = [];
lidherra = [];
lcantid = [];
lnum = [];
lto = [];
lcandev = [];
lcdev = [];
ltotaldev = [];
lchdev = [];
lcg = [];
lesth = [];

$(document).ready(function () {
  $('.datepicker').pickadate({ selectYears: 10, selectMonths: true, container: 'body', yearRange: "1950:2020", format: 'yyyy-mm-dd' });
  $('.datepickrange').pickadate({ selectYears: 10, selectMonths: true, container: 'body', yearRange: "1950:2020", format: 'dd-mm-yyyy' });
  $('.modal').modal();

  //SAVE OR EDIT
  $(".btnsaveherramienta").click(function () { save_or_edit_herramienta(); });
  $(".btnsaveguiaherra").click(function () { save_or_edit_guiaherramienta(); });
  $(".saveguiafin").click(function () { save_guia_fin(); });
  $(".edsaveherraguia").click(function () { save_edit_guia(); });
  $(".saveguiadev").click(function () { save_guiadev(); });
  $(".btnsaveeditherradev").click(function () { save_editherradev(); });
  $(".btnedsavehe").click(function () { getstock(); });
  $(".btnneweditsaveguiaherra").click(function () { savenewguiaherra(); });
  $(".btnsaveguiafinedit").click(function () { saveguiafinedit(); });
  $(document).on("click", "button[id=btneditguia]", editguia);
  $(document).on("click", ".btneditheguia", editheguia);
  $(document).on("click", ".btneditherradev", editherradev);
  $(".btnaddstock").click(function () { verstock(); });
  $(".btnviewdivstock").click(viewdivstock);

  $(document).on("click", "button[id=btngenguia]", generarguia);

  // ver pdf
  $(document).on("click", ".btnviewguiaherrapdf", verguiaherrapdf);
  $(document).on("click", ".btnviewguiacopdf", verguiacompdf);
  $(document).on("click", ".btnviewdocdevpdf", verdocherrapdf);



  //OPEN MODALS
  $(".btnopennewherra").click(function () { opennewherra(); });
  $(".btnopennewguia").click(function () { opennewguia(); });
  $(".btnaddguiaherra").click(function () { opennewguiaherra(); });
  $(".btnnewguiaherra").click(function () { openaddguiaherra(); });
  $(".btnaddherraguiadev").click(function () { openherraguiadev(); });
  $(".btnopendevolucion").click(function () { opendevolucion(); });
  $(".btneditherramienta").click(openeditherra);
  $(document).on("click", "button[id=btnshowherra]", openlistherraguia);
  $(document).on("click", ".viewherradocdev", opendetherradev);
  $(document).on("click", ".btndetconsul", opendetconsul);
  $(document).on("click", ".btndetconsulproyherra", opendetconsulproyherra);
  $(document).on("click", ".btnshowdetalle", opendetguiagene);
  $(document).on("click", ".btndetherracompletas", opendetherracompl);
  $(document).on("click", ".btnnewguiadev", opennewguiadev);
  $(document).on("click", ".btndev", opennewdev);
  $(document).on("click", ".btnaddguiaherraedit", openaddguiaherraedit);
  $(document).on("click", ".btnselectherra", selectherramienta);
  $(document).on("click", "button.btn-editherraguia", showeditherraguia);

  //DELETE
  $(document).on("click", "button.btndelherraguiabase", delherraguia);
  $(document).on("click", "button.btndelherraguia", delherraguiapre);
  $(document).on("click", "button.btndelguiape", delguiape);
  $(document).on("click", "button.btndelheguia", deleditheguia);




  //SEND DATA
  $(document).on("click", "button[name=btnopennewherra]", sendata_herramienta);
  $(document).on("click", "button[name=btnaddguiaherra]", sendata_codguia);
  $(document).on("click", "button[name=btnnewguiaherra]", sendata_newherra);



  //BUSCAR
  $("input[name=txtbuscar]").on("keyup", buscarherra);
  $("input[name=txtbuscarguia]").on("keyup", buscarguia);
  $("input[name=txtbuscarherramienta]").on("keyup", buscarherramienta);
  $("input[name=txtbuscardoc]").on("keyup", buscardoc);
  $("input[name=txtbuscarh]").on("keyup", buscarhxproy);
  $("input[name=txtbuscarheedit]").on("keyup", buscheedit);

  //combochosen
  combochosen("#searchInput");
  combochosen(".comboherra");
  combochosen("#combolproy");
  combochosen("#comboproyecto");
  combochosen("#comboneweditherra");

  //mostrar_ocultar combofechdev
  show_hide_combestado("#idcomboestado", ".fguiadevol", "#divfdev");
  show_hide_combestado("#comboeditestado", ".editfdev", "#diveditfdev");
  show_hide_combestado("#comboneweditestado", ".neweditfguiadevol", "#divneweditfdev");
});

show_hide_combestado = function (combo, txttoclean, div_show_hide) {
  $(combo).on('change', function () {
    $(txttoclean).val("");
    if (this.value == 'ALQUILER') {
      $(div_show_hide).show();
    } else {
      $(div_show_hide).hide();
    }
  });
}

combochosen = function (combo) {
  $(combo).chosen({
    allow_single_deselect: true,
    width: '100%'
  });
}

viewdivstock = function () {
  $(".hercod").val(this.value);
  $(".herstock").val(this.getAttribute("data-herrastock"));
  $(".cardherra").slideDown(1000);
}


saveguiafinedit = function () {
  var data, nguias, edproy, edtrans, edcond, edplaca, edfechsalida, edcomenta;
  data = new Object;
  data.nguias = $(".editnumguia").val();
  data.edproy = $("select[id = comboeditproyecto]").val();
  data.edtrans = $("select[id = comboedittransportista]").val();
  data.edcond = $("select[id = comboeditconductor]").val();
  data.edplaca = $("select[id = comboeditplaca]").val();
  data.edfechsalida = $(".fguiasalidaedit").val();
  data.edcomenta = $("textarea[name=txtcomentguiaedit]").val();

  if (data.edfechsalida == "") {
    Materialize.toast("Debe Ingresar una fecha de salida", 2500, "rounded");
    return false;
  };
  data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
  data.savecabguiaedit = true;

  $.post("", data, function (response) {
    if (response.status) {
      Materialize.toast("Guia Guardada", 2500, "rounded");
      $(".editguia").modal("close");
      location.reload();
    };
  }, "json")

  console.log(nguias);
  console.log(edproy);
  console.log(edtrans);
  console.log(edcond);
  console.log(edplaca);
  console.log(edfechsalida);
  console.log(edcomenta);
}

savenewguiaherra = function () {
  var data;
  data = new Object;
  data.viewstock = true;
  data.herra = $("select[id=comboneweditherra]").val();
  $.getJSON("/almacen/herramienta/inventario", data, function (response) {
    if (response.status) {
      respstock = response.cantalmacen;
      console.log(respstock)
      savenewguiaherra2();
    };
  }, "json");

}

savenewguiaherra2 = function () {
  var data, numberguia, newherra, newhcant, newhestado, newhcoment,
    data = new Object;
  data.newherra = $("select[id=comboneweditherra]").val();
  data.numberguia = $(".keyguia").text();
  data.newhcant = $(".neweditherracant").val();
  data.newhcoment = $("textarea[name=txtneweditcomentguiah]").val();
  data.newhestado = $("select[id=comboneweditestado]").val();
  data.newfechdev = $(".neweditfguiadevol").val();

  if (data.newhcant < 1 || data.newhcant == "") {
    Materialize.toast("Cantidad Ingresada INCORRECTA", 2500, "rounded");
    return false;
  }
  if (data.newhestado == 'ALQUILER' && data.newfechdev == "") {
    Materialize.toast('Debe Ingresar una fecha de Devolucion', 2500, 'rounded');
    return false;
  }
  if (data.newhcant > respstock) {
    Materialize.toast("Cantidad Ingresada es mayor al Stock", 2500, 'rounded');
    return false;
  }
  data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
  data.exists_detherra = true;
  $.post("", data, function (exists) {
    if (!exists.status) {
      delete data.exists_detherra;
      data.savenewherra = true;
      $.post("", data, function (response) {
        if (response.status) {
          $(".neweditherramientaguia").modal("close");
          Materialize.toast('Herramienta AGREGADA', 2000, 'rounded');
          cod = data.numberguia;
          listeditguia();
        }
      }, "json");
    } else {
      Materialize.toast("Herramienta ya esta agregado a la guia", 2500, 'rounded');
      return false;
    }
  }, "json");


}


openaddguiaherraedit = function () {
  var keyguia = $(".editnumguia").val();
  $(".neweditherracant").val("");
  $("textarea[name=txteditcomentguiah]").val("");
  $(".keyguia").text(keyguia);
  $(".neweditherramientaguia").modal("open");
}


getstock = function () {
  var data, codh;
  codh = $(".lbleditcodhe").text();
  data = new Object;
  data.viewstock = true;
  data.herra = codh;
  $.getJSON("/almacen/herramienta/inventario", data, function (response) {
    if (response.status) {
      respstock = response.cantalmacen;
      console.log(respstock)
      saveedithe();
    };
  }, "json");
}

saveedithe = function () {
  var data, st, numeroguia;
  numeroguia = $(".lblnumeroguia").text();
  data = new Object;
  cantstatic = $(".cantstatic").text();
  data.codigohe = $(".lbleditcodhe").text();
  data.codhe = $(".lblid").text();
  data.cantidad = $(".edcanthe").val();
  data.estado = $("select[id=comboeditestado]").val();
  data.fechdevolucion = $(".editfdev").val();
  data.comenta = $("textarea[name=txtedcomenthe]").val();

  if (data.cantidad == "" || data.cantidad < 1) {
    Materialize.toast("Cantidad Ingresada INCORRECTA", 2500, "rounded");
    return false;
  }
  if (data.estado == 'ALQUILER' && data.fechdevolucion == "") {
    Materialize.toast('Debe Ingresar una fecha de Devolucion', 2500, "rounded");
    return false;
  }

  console.log(respstock)
  console.log(cantstatic)
  st = parseInt(respstock) + parseInt(cantstatic);
  descuento = parseInt(cantstatic) - parseInt(data.cantidad);
  console.log("descuento " + descuento)
  stockfinal = respstock + parseInt(descuento);
  console.log("stockfinal " + stockfinal);
  console.log(st);
  if (data.cantidad > st) {
    Materialize.toast("Cantidad Ingresada es Mayor al Stock Total", 2500, "rounded");
    return false;
  };
  data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
  data.stockfin = stockfinal;
  data.editdetguia = true;

  $.post("", data, function (response) {
    if (response.status) {
      Materialize.toast('Edicion de la Herramienta correcta', 2500, 'rounded');
      $(".editherraguia").modal("close");
      cod = numeroguia;
      listeditguia();
    }
  }, "json");
}




editheguia = function () {
  var codigoherramienta, estado, nameher, medidaher, marcaher, data;
  data = new Object;
  codigoherramienta = this.getAttribute("data-codhe");

  estado = this.getAttribute("data-estado");
  if (estado == "ALQUILER") {
    document.getElementById('diveditfdev').style.display = "block";
  } else {
    document.getElementById('diveditfdev').style.display = "none";
  }
  nameher = this.getAttribute("data-nameherramienta");
  medidaher = this.getAttribute("data-medida");
  marcaher = this.getAttribute("data-marca");
  $(".lblnumeroguia").text(this.getAttribute("data-codigo"));
  $(".edstock").text(respstock);
  $(".lblid").text(this.value);
  $(".cantstatic").text(this.getAttribute("data-cantidad"));
  $(".lbleditcodhe").text(codigoherramienta);
  $(".lbleditdesche").text(nameher + " " + medidaher + "" + marcaher);
  $(".edcanthe").val(this.getAttribute("data-cantidad"));
  $("select[id=comboeditestado]").val(estado);
  $(".editfdev").val(this.getAttribute("data-fechadevolucion"));
  $("textarea[id=txtedcomenthe]").val(this.getAttribute("data-coment"));

  data.viewstock = true;
  data.herra = codigoherramienta;
  $.getJSON("/almacen/herramienta/inventario", data, function (response) {
    if (response.status) {
      $(".lbleditstock").text(response.cantalmacen);
    };
  })

  $(".editherraguia").modal("open");
}



editguia = function () {
  var idguia = this.value;
  $(".editnumguia").val(idguia);
  $("select[id=comboeditproyecto]").val(this.getAttribute("data-proy"));
  $("select[id=comboedittransportista]").val(this.getAttribute("data-transp"));
  $("select[id=comboeditconductor]").val(this.getAttribute("data-conductor"));
  $("select[id=comboeditplaca]").val(this.getAttribute("data-placa"));
  $(".fguiasalidaedit").val(this.getAttribute("data-fechasalida"));
  $("textarea[name=txtcomentguiaedit]").val(this.getAttribute("data-comentario"));
  cod = idguia;
  listeditguia();
}

listeditguia = function () {
  var data, id;
  id = cod;
  if (id !== "") {
    data = {
      idherraguia: id,
      leditguia: true,
    };
    $.getJSON("", data, function (response) {
      var $tb, template, x;
      if (response.status) {
        $(".editguia").modal("open");
        $tb = $("table.table-detailsguiaherraedit > tbody");
        $tb.empty();
        template = "<tr><td class=\"column5\">{{ edcount }}</td><td class=\"column15\">{{ edcodherra }}</td><td class=\"column35\">{{ ednombherra }} {{ edmedherra }} {{ edbrandherra }}</td><td class=\"column5\">{{ edcant }}</td><td class=\"column15\">{{ edest }}</td><td class=\"column15\">{{ edfdev }}</td><td class=\"column10\"><button type=\"button\" class=\"transparent btneditheguia\" style=\"border:none;font-size:20px;\" value=\"{{ edid }}\" data-codhe=\"{{ edcodherra }}\" data-codigo=\"{{ edcodguia }}\" data-nameherramienta=\"{{ ednombherra }}\" data-medida=\"{{ edmedherra }}\" data-marca=\"{{ edbrandherra }}\" data-cantidad=\"{{ edcant }}\" data-estado=\"{{ edest }}\" data-fechadevolucion=\"{{ edfdev }}\" data-coment=\"{{ edcoment }}\"><i class=\"fa fa-pencil\"></i><span class=\"glyphicon glyphicon-edit\"></span></button><button type=\"button\" class=\"transparent btndelheguia\" style=\"border:none;margin-left:20px;font-size:20px;;\" value=\"{{ edid }}\" data-codherra =\"{{ edcodherra }}\" data-cantidad=\"{{ edcant }}\"><i class=\"fa fa-trash-o\"></i></button></td></tr>";
        for (x in response.leditheguia) {
          response.leditheguia[x].item = parseInt(x) + 1;
          $tb.append(Mustache.render(template, response.leditheguia[x]));
        }
      }
    });
  }
}



$(function () {
  $('#combolproy').change(function () {
    var data, id, np;
    id = this.value;
    np = $("select[id=combolproy] > option:selected").text();
    $(".nombreproyecto").text(np);
    console.log(id);
    if (id !== "") {
      data = {
        codigoproy: id,
        lproyherra: true,
      };
      $.getJSON("", data, function (response) {
        var $tb, template, x;
        if (response.status) {
          suma = []
          var dato = response.listaproyherra;
          console.log(dato);

          dato.forEach(function (o) {
            var existing = suma.filter(function (i) {
              return i.herraid === o.herraid
            })[0];
            if (!existing)
              suma.push(o);
            else
              existing.cantid += o.cantid;
          });
          console.log(suma);

          document.getElementById('divtabherraproy').style.display = 'none';
          document.getElementById('divtabproyherra').style.display = 'block';
          $tb = $("table.tabla-detproyherra > tbody");
          $tb.empty();
          template = "<tr><td class=\"colnum\">{{ item }}</td><td>{{ nombreherra }} {{ medidaherra }}</td><td>{{ cantid }}</td><td><button type=\"button\" style=\"border:none;font-weight:bold;\" class=\"transparent btndetconsulproyherra\" data-medherra=\"{{ medidaherra }}\" data-nameherra=\"{{ nombreherra }}\" value=\"{{ herraid }}\"><i class=\"fa fa-info-circle\"></i></button></td></tr>";
          for (x in suma) {
            suma[x].item = parseInt(x) + 1;
            $tb.append(Mustache.render(template, suma[x]));
          }
        }
      });
    }

  });
});

editherradev = function () {
  $(".editherradev").modal("open");
  var idh, canh, esth, nd, iddev, nameh, medh, march;
  idh = this.value;
  iddev = this.getAttribute("data-coguia");
  nd = this.getAttribute("data-ndoc");
  canh = this.getAttribute("data-cant");
  esth = this.getAttribute("data-est");
  nameh = this.getAttribute("data-nherra");
  medh = this.getAttribute("data-mherra");
  march = this.getAttribute("data-marherra")

  $(".titherradev").text(nameh + " " + medh + " " + march);
  $(".iddev").text(iddev);
  $(".titcanthedev").text(canh);
  $(".iddocu").text(nd);
  $(".idhedev").text(idh);
  $(".cantherradev").val(canh);
  $("select[id=comboestherradev]").val(esth);
}


selectherramienta = function () {
  var id, h, m, data;
  id = this.value;
  h = this.getAttribute("data-name");
  m = this.getAttribute("data-medida");
  marc = this.getAttribute("data-marca");

  console.log(id);
  $(".nombreherra").text(h + " " + m + " " + marc);
  $(".lblcodhe").text(id);
  if (id !== "") {
    data = {
      codigoherra: id,
      lherraproy: true,
    };
    $.getJSON("", data, function (response) {
      var $tb, template, x;
      if (response.status) {
        console.log(response.listaherraproy)
        sum = []
        var dato = response.listaherraproy;

        dato.forEach(function (o) {
          var existing = sum.filter(function (i) {
            return i.proyc === o.proyc
          })[0];
          if (!existing)
            sum.push(o);
          else
            existing.cantidad += o.cantidad;
        });
        console.log(sum);

        document.getElementById('divtabherraproy').style.display = 'block';
        document.getElementById('divtabproyherra').style.display = 'none';
        $tb = $("table.tabla-detherraproy > tbody");
        $tb.empty();
        template = "<tr><td class=\"colnum\">{{ item }}</td><td>{{ proyc }} - {{ proynom }}</td><td>{{ cantidad }}</td><td><button type=\"button\" style=\"border:none;font-weight:bold;\" class=\"transparent btndetconsul\" id=\"\" data-nameproy=\"{{ proynom }}\" value=\"{{ proyc }}\"><i class=\"fa fa-info-circle\"></i></button></td></tr>";
        for (x in sum) {
          sum[x].item = parseInt(x) + 1;
          $tb.append(Mustache.render(template, sum[x]));
        }
        $(".lconsherra").modal("close");
      }
    });
  }
}


opendetconsulproyherra = function () {
  var herra, proyid, nameproy;
  herra = this.value;
  nh = this.getAttribute("data-nameherra");
  nm = this.getAttribute("data-medherra");
  proycod = $("select[id=combolproy]").val();
  nameproy = $("select[id=combolproy] > option:selected").text()
  cherra = herra;
  codproy = proycod;
  $(".titproyherra").text("HERRAMIENTA: " + nh + " " + nm);
  $(".titherra").text("PROYECTO: " + nameproy);
  listdetconsult();
  $(".detherraconsult").modal("open");
}

opendetconsul = function () {
  var herra, proyid, nameproy, nherra;
  nameproy = this.getAttribute("data-nameproy");
  herra = $(".lblcodhe").text();
  nherra = $(".nombreherra").text();
  proyid = this.value;
  cherra = herra;
  codproy = proyid;
  $(".titproyherra").text("PROYECTO: " + proyid + " - " + nameproy);
  $(".titherra").text("HERRAMIENTA: " + nherra);
  listdetconsult();
  $(".detherraconsult").modal("open");
}

listdetconsult = function () {
  var data, id;
  id = codproy;
  idherra = cherra;
  if (id !== "") {
    data = {
      numproy: id,
      ldetcons: true,
      idherramienta: idherra,
    };
    $.getJSON("", data, function (response) {
      var $tb, template, x;
      if (response.status) {
        var fech = response.detherraxproy;
        console.log(fech)
        $tb = $("table.table-detherraconsult > tbody");
        $tb.empty();
        template = "<tr><td class=\"colnum\">{{ conta }}</td><td>{{ nguia }}</td><td>{{ regisyear }}-{{ regismonth }}-{{ regisday }}</td><td>{{ fecsalida }}</td><td>{{ nameherra }} {{ medherra }}</td><td>{{ marcahe }}</td><td>{{ cantiherra }}</td><td>{{ estado }}</td><td class=\"fechdev\">{{ fde }}</td></tr>";
        for (x in response.detherraxproy) {
          response.detherraxproy[x].item = parseInt(x) + 1;
          $tb.append(Mustache.render(template, response.detherraxproy[x]));
        }
        changecolortd('td.fechdev');
      }
    });
  }
}


verstock = function () {
  var data;
  data = new Object;
  data.herra = $(".hercod").val();
  data.canti = $("input[name=ingcant]").val();
  data.viewstock = true;

  if (data.canti == "") {
    Materialize.toast('Cantidad INCORRECTA', 2500, 'rounded');
    return false;
  };
  $.getJSON("", data, function (response) {
    total = parseInt(response.cantalmacen) + parseInt(data.canti);
    console.log(total);
    addstockherra();
  }, "json");
}
addstockherra = function () {
  swal({
    title: "Agregar Stock?",
    text: "Desea Agregar Stock?",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dd6b55",
    confirmButtonText: "Si, Agregar!",
    cancelButtonText: "No, Cancelar",
    closeOnConfirm: true,
    closeOnCancel: true
  }, function (isConfirm) {
    var data;
    if (isConfirm) {
      data = new Object;
      data.herra = $(".hercod").val();
      data.canti = $("input[name=ingcant]").val();
      data.price = $("input#ingprice").val();
      data.ingresoherra = true;
      data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
      data.sum = total;
      $.post("", data, function (response) {
        if (response.status) {
          location.reload();
          Materialize.toast('Stock Ingresado', 2000, 'rounded');
        } else {
          swal("Error", "Error al ingresar stock", "warning");
        }
      });
    }
  });
}

deleditheguia = function () {
  var data, cant;
  iddetguiahe = this.value;
  cant = this.getAttribute("data-cantidad")
  herra = this.getAttribute("data-codherra");
  data = new Object;
  data.herra = herra;
  data.viewstock = true;
  $.getJSON("/almacen/herramienta/inventario", data, function (response) {
    if (response.status) {
      respstock = response.cantalmacen;
      stfinal = parseInt(respstock) + parseInt(cant);
      console.log(respstock);
      console.log(stfinal);
      deveditheguia();
    }
  }, "json");
}


deveditheguia = function () {
  console.log(stfinal);
  var btn, codher;
  btn = this;
  swal({
    title: "Quitar Herramienta?",
    text: "Desea eliminar herramienta de la guia?",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dd6b55",
    confirmButtonText: "Si, Eliminar!",
    cancelButtonText: "No, Cancelar",
    closeOnConfirm: true,
    closeOnCancel: true
  }, function (isConfirm) {
    var data;
    if (isConfirm) {
      data = new Object;

      iddetalle = btn.value;
      data.deleditherguia = true;
      data.coddetalle = iddetguiahe;

      data.devherraguia = true;
      data.codhe = herra;
      data.stfinal = stfinal;
      data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
      $.post("", data, function (response) {
        if (response.status) {
          Materialize.toast("Eliminacion de Herramienta Correcta", 2500, "rounded");
          cod = $(".editnumguia").val();
          listeditguia();
        }
      });
    }
  });
}




delguiape = function () {
  limp_list();
  var btn, data;
  btn = this;
  data = new Object;
  ng = btn.value;
  idpro = btn.getAttribute("data-idproy");
  data.nguia = ng;
  data.idproy = idpro;
  // data.listacodigos = lcodigos;
  data.devolstk = true;
  $.getJSON("", data, function (response) {
    if (response.status) {
      var lhg = response.lherrguia;
      for (var i = 0; i < lhg.length; i++) {
        lishg.push(lhg[i]['codherra'], lhg[i]['cantidad']);
        lidherra.push(lhg[i]['codherra']);
        lcantid.push(lhg[i]['cantidad']);
      };
      console.log(lishg);
      console.log(lidherra);
      console.log(lcantid);
      devolvstock();
    }

  }, "json");
}

devolvstock = function () {
  var btn;
  btn = this;
  swal({
    title: "Anular Guia?",
    text: "Desea anular Guia pendiente?",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dd6b55",
    confirmButtonText: "Si, Anular!",
    cancelButtonText: "No, Cancelar",
    closeOnConfirm: true,
    closeOnCancel: true
  }, function (isConfirm) {
    var data;
    if (isConfirm) {
      data = new Object;
      data.anularguiapendiente = true;
      data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
      data.nuguia = ng;
      data.idproy = idpro;
      data.lthg = lishg;
      $.post("", data, function (response) {
        if (response.status) {
          devstock();
          Materialize.toast('Guian pendiente Eliminada', 2500, 'rounded');
          location.reload();
        } else {
          swal("Error", "Error al eliminar la guia", "warning");
        }
      });
    }
  });
}

devstock = function () {
  var btn, data;
  data = new Object;
  console.log('lll');
  console.log(lidherra);
  data.devstock = true;
  data.lidherra = lidherra;
  $.getJSON("", data, function (response) {
    if (response.status) {
      var lista = response.listainventario;
      console.log('sd')
      console.log(lcantid);
      for (var i = 0; i < lista.length; i++) {
        lnum.push(lista[i]['cantalmacen']);
      };
      for (var i = 0; i < lista.length; i++) {
        tot = lnum[i] + lcantid[i]
        lto.push(lidherra[i], tot);
      };
      console.log(lnum);
      console.log(lto);
      stkfin();
    };
  }, "json");
}

stkfin = function () {
  var data, fecha;
  data = new Object;
  data.stkfinal = lto;
  data.devstockfinal = true;
  data.lcantidad = lishg;
  data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
  $.post("", data, function (response) {
    if (response.status) {
    }
  }, "json");

}







delherraguiapre = function () {
  // var pos=tamherra.indexOf( this );
  var valor = this.getAttribute("data-codhe");
  for (var i = 0; i < dataherra.length; i++) {
    if (dataherra[i] == valor) {
      var pos = dataherra.indexOf(valor);
      for (var k = 0; k < 5; k++) {
        dataherra.splice(pos, 1)
      };
    };
  };
  for (var i = 0; i < tamherra.length; i++) {
    for (var k = 0; k < tamherra[i].length; k++) {
      if (tamherra[i][k] == valor) {
        tamherra.splice(i, 1);
      };
    };
  }
}

openherraguiadev = function () {
  var nguia = $(".lblnumguia").text();
  $(".codguia").text(nguia);
  $(".newherraguiadev").modal("open");
}



opennewguiadev = function () {
  var codt = this.value;
  cod = codt;
  $(".lblnumguia").text(codt);
  $(".newguiadev").modal("open");
  listdetguiadev();
}


save_guiadev = function () {
  fret = $("input[name=fdevret]").val();
  if (fret == "") {
    Materialize.toast('Debe de Ingresar una Fecha de Retorno', 2500, 'rounded');
    return false;
  };

  console.log('dds')
  console.log(lcandev)
  for (var i = 0; i < lcandev.length; i++) {
    var idguia = $(".numguiadev").text();
    var cdev = $(".cantdev" + lcandev[i]).val();
    var estado = $("select[id=comboest" + lcandev[i] + "]").val();
    var coment = $("textarea[name=coment" + lcandev[i] + "]").val();
    if (cdev != "" || cdev > 0) {
      lcdev.push(lcandev[i], cdev, estado, coment, idguia)
    }
  };
  if (lcdev.length == 0) {
    Materialize.toast('Debe devolver al menos 1 herramienta para generar la guia', 3500, 'rounded')
    return false;
  } else {
    for (var i = 0; i < lcdev.length; i++) {
      if (lcdev[i + 1] < 0) {
        Materialize.toast('Cantidad ' + lcdev[i + 1] + ' debe ser POSITIVO', 2500, 'rounded');
        lcdev = [];
        return false;
        i = i + 5;
      };
    };
  }

  console.log(lcdev)
  data = new Object;
  data.lcd = lcdev;
  data.vstockregreso = true;
  $.getJSON("", data, function (response) {
    if (response.status) {
      var linventario = response.linve;
      var lcantidadenv = response.lcantenviada;
      var lcantdevpend = response.lcantdevpendiente;
      console.log('linve');
      console.log(linventario);
      console.log('lcantidadenv');
      console.log(lcantidadenv);
      console.log('lcantdevpendiente');
      console.log(lcantdevpend);

      lcdevuelto = [];
      for (var i = 0; i < lcdev.length; i++) {
        lcdevuelto.push(lcdev[i + 1])
        i = i + 4;
      };
      p = 0
      for (var i = 0; i < lcantidadenv.length; i++) {
        var totales = parseInt(lcantdevpend[i]['cantdevpe']) + parseInt(lcdevuelto[i])
        ltotales.push(lcantdevpend[i]['guiaid'], lcantdevpend[i]['codherramienta'], totales)
        console.log(ltotales);
        if (lcantidadenv[i]['cantenviada'] < ltotales[p + 2]) {
          Materialize.toast('Ingreso Erroneo de Cantidad en ' + lcantidadenv[i]['nameherra'] + ' ' + lcantidadenv[i]['medidherra'], 4000, 'rounded');
          lcdev = [];
          ltotales = [];
          return false;
        }
        p = p + 3;
      }
      j = 0;
      for (var i = 0; i < lcdevuelto.length; i++) {
        if (ltotales[j + 2] == lcantidadenv[i]['cantenviada']) {
          flag = true;
        } else {
          flag = false;
        }
        lflag.push(flag)
        j = j + 3;
      };

      console.log('ltotales');
      console.log(ltotales);

      contador = 0;
      for (var i = 0; i < lflag.length; i++) {
        if (lflag[i] == true) {
          contador++
        };
      };
      console.log('contador');
      console.log(contador);
      if (contador == lcandev.length) {
        cambest = true;
      };
      console.log(cambest);
      /////
      console.log(lcdevuelto)
      console.log('linventario')
      console.log(lcdev)
      var j = 0;
      for (var i = 0; i < lcdevuelto.length; i++) {
        if (lcdev[j + 2] == 'BAJA') {
          var totaldev = parseInt(linventario[i]['cantidadh']) - parseInt(lcdevuelto[i])
        } else {
          var totaldev = parseInt(lcdevuelto[i]) + parseInt(linventario[i]['cantidadh'])
        }
        ltotaldev.push(linventario[i]['codh'], totaldev);
        j = j + 5;
      };
      console.log('ltotaldev');
      console.log(ltotaldev)
      regresarstock();
    }
  }, "json");

}


/////
regresarstock = function () {

  var fecharet;
  fecharet = $("input[name=fdevret]").val();

  if (fecharet == "") {
    Materialize.toast('Debe de Ingresar una Fecha de Retorno', 2500, 'rounded');
    lcdev = [];
    ltotaldev = [];
    return false;
  };

  swal({
    title: "GENERAR GUIA",
    text: "Desea Generar Guia de devolucion?",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dd6b55",
    confirmButtonText: "Si, Generar!",
    cancelButtonText: "No, Cancelar",
    closeOnConfirm: true,
    closeOnCancel: true
  }, function (isConfirm) {
    var data;
    if (isConfirm) {
      data = new Object;
      data.stkfin = ltotaldev;
      console.log('lcdevregresarstock');
      console.log(lcdev);
      console.log('flag');
      console.log(lflag);
      data.flagd = lflag;
      data.ltotalespe = ltotales;
      data.estadocamb = cambest;
      data.regrestock = true;
      data.lcant = lcdev;
      data.codg = $(".numguiadev").text();
      data.tra = $("select[id=devcotrans]").val();
      data.co = $("select[id=devcoconduc]").val();
      data.pla = $("select[id=devcoplaca]").val();
      data.fret = $("input[name=fdevret]").val();
      data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();

      $.post("", data, function (response) {
        if (response.status) {
          iddoc = response.numdoc;
          Materialize.toast('Devolucion de herramientas Correcta', 2500, 'rounded');
          window.open('http://' + location.hostname + ':6000/guiasherramienta/reportguiadevherra?ndoc=' + iddoc, '_blank');
          $(".newdev").modal("close");
          location.reload();
          validcant();
        }
      }, "json");

    } else {
      lcdev = [];
      ltotales = [];
      ltotaldev = [];
    }
  });
}
//opcional
validcant = function () {
  console.log('valcant');
  var data;
  data = new Object;
  data.numdoc = iddoc;
  data.lista = lcdev;
  console.log(lcdev)
  data.valcant = true;
  $.getJSON("", data, function (response) {
    if (response.status) {
      console.log('listacan');
      console.log(response.lvalcantidad)
    }
  }, "json");
}



opennewdev = function () {

  var codg = this.value;
  cod = codg;
  $(".numguiadev").text(codg);
  $(".newdev").modal("open");
  listherradev();
}

listherradev = function () {
  var data, id;
  console.log('aa');
  console.log(cod);
  id = cod;
  if (id !== "") {
    data = {
      nguia: id,
      lherradev: true,
    };
    $.getJSON("", data, function (response) {
      var $tb, template, x;
      if (response.status) {
        lcandev = [];
        var lhd = response.listherradev;
        for (var i = 0; i < lhd.length; i++) {
          lcandev.push(lhd[i]['codherra']);
        };
        console.log(lcandev);
        $tb = $("table.table-herradev > tbody");
        $tb.empty();
        template = "<tr><td>{{ nameherra }} {{ medherra }} </td><td class=\"colcant\">{{ cantiherra }}</td><td class=\"colcant\">{{ cantdevuelta }}</td><td class=\"coldev\"><input type=\"text\" class=\"cantdev{{ codherra }}\"></td><td class=\"colestado\"><select id=\"comboest{{ codherra }}\" class=\"browser-default devcotrans\"><option value=\"BUENO\">Bueno</option><option value=\"REPARACION\">Reparacion</option><option value=\"BAJA\">De Baja</option></select><td><textarea class=\"materialize-textarea\" length=\"200\" name=\"coment{{ codherra }}\"></textarea></td></td></tr>";
        for (x in response.listherradev) {
          response.listherradev[x].item = parseInt(x) + 1;
          $tb.append(Mustache.render(template, response.listherradev[x]));
        }
      }
    });
  }
}

save_editherradev = function () {
  var data, titcanthedev;
  idde = $(".iddev").text();
  idhedev = $(".idhedev").text();
  titcanthedev = $(".titcanthedev").text();

  data = new Object;
  data.coddochedev = $(".iddocu").text();
  data.codhedev = idhedev;
  data.canthedev = $(".cantherradev").val();
  data.esthedev = $("select[id=comboestherradev]").val();

  if (data.canthedev < 0 || data.canthedev == "" || /^[a-zA-Z\s]*$/.test(data.canthedev)) {
    Materialize.toast("Cantidad Ingresada Erronea", 2500, 'rounded');
    return false;
  } else if (titcanthedev < data.canthedev) {
    Materialize.toast("Debe ingresar una cantidad menor a la anterior", 2500, 'rounded');
    return false;
  }

  data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
  data.edherradev = true;
  $.post("", data, function (response) {
    if (response.status) {
      listherradocdev();
      cherradev();
    }
  }, "json");
}

opendetherradev = function () {
  var docid = this.value;
  cod = docid;
  listherradocdev();
  $(".ldetherradev").modal("open");
}

cherradev = function () {
  var c, codd;
  c = idde;
  codd = idhedev;
  console.log('iddev')
  console.log(c)
  data = {
    idd: c,
    idhe: codd,
    cantherradev: true,
  };

  dato = {
    herra: codd,
    viewstock: true
  }
  $.getJSON("/almacen/herramienta/inventario", dato, function (response) {
    if (response.status) {
      var r, sttotal, ca, canew;
      sttotal = response.cantalmacen;
      console.log(sttotal);
      ca = $(".titcanthedev").text();
      console.log(ca)
      canew = $(".cantherradev").val();
      console.log(canew)
      r = parseInt(ca) - parseInt(canew);
      console.log(r)

      rtotal = parseInt(sttotal) - parseInt(r);
      console.log(rtotal);
      updstock();
    };
  }, 'json')


  $.getJSON("", data, function (response) {
    if (response.status) {
      lchdev = response.lcanherradev;
      console.log('lcanherradev')
      console.log(lchdev)
      savecantedit();
    };
  })
}
updstock = function () {
  var data;
  data = new Object;
  data.herramid = $(".idhedev").text();
  data.updst = true;
  data.totfin = rtotal;
  data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
  $.post("", data, function (response) {
    if (response.status) {
    }
  }, "json");
}

savecantedit = function () {
  var data, v, ch;
  ch = $(".cantherradev").val();
  if (lchdev[0]['cherra'] == ch) {
    v = true;
  } else {
    v = false;
  }
  console.log(v);
  data = new Object;
  data.can = ch;
  data.g = $(".iddev").text();
  data.v = v;
  data.h = $(".idhedev").text();
  data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
  data.savecaedit = true;
  $.post("", data, function (response) {
    if (response.status) {
      updestguia();
    }
  }, "json");
}

updestguia = function () {
  var data, ig;
  ig = $(".iddev").text();
  data = new Object;
  data = {
    idg: ig,
    cguia: true,
  };
  $.getJSON("", data, function (response) {
    if (response.status) {
      var lestado;
      lestado = response.lestadosh;
      lcg = response.lcantguia;
      console.log(lcg);
      console.log(lestado);
      cont = 0
      for (var i = 0; i < lestado.length; i++) {
        if (lestado[i]['estadosh'] == true) {
          cont++
        }
      }
      if (cont == lcg) {
        cambestado = 'DEVCOMP';
      } else {
        cambestado = 'GE';
      }
      cambestguiadev();
    }
  })
}
cambestguiadev = function () {
  var data;
  data = new Object;
  data.estcamb = cambestado;
  data.codigoguia = $(".iddev").text();
  data.cambestdev = true;
  data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
  $.post("", data, function (response) {
    if (response.status) {
      Materialize.toast('Edicion de Guia correcta', 4000, 'rounded');
      $(".editherradev").modal("close");
    }
  }, "json");

}


listherradocdev = function () {
  var data, id;
  id = cod;
  if (id !== "") {
    data = {
      numerodoc: id,
      lherradoc: true,
    };
    $.getJSON("", data, function (response) {
      var $tb, template, x;
      if (response.status) {
        $tb = $("table.table-detherradev > tbody");
        $tb.empty();
        template = "<tr><td class=\"colnum\">{{ he_count }}</td><td>{{ he_name }} {{ he_medida }} {{ he_marca }}</td><td>{{ he_cant }}</td><td>{{ he_est }}</td><td><button type=\"button\" class=\"btn btneditherradev\" value=\"{{ he_id }}\" data-coguia=\"{{ coguia }}\" data-ndoc=\"{{ docdev }}\" data-cant=\"{{ he_cant }}\" data-est=\"{{ he_est }}\" data-nherra=\"{{ he_name }}\" data-mherra=\"{{ he_medida }}\" data-marherra=\"{{ he_marca }}\"><i class=\"fa fa-pencil\"></i><span class=\"glyphicon glyphicon-edit\"></span></button></td></tr>";
        for (x in response.lherradoc) {
          response.lherradoc[x].item = parseInt(x) + 1;
          $tb.append(Mustache.render(template, response.lherradoc[x]));
        }
      }
    });
  }
}


opendevolucion = function () {
  fav = [];
  var check = $('.checkdevguia:checked').each(function () {
    cod = $(this).val();
    fav.push(cod);
  });

  if (fav.length == 0) {
    Materialize.toast('Debe Seleccionar una o mas Guias', 2500, 'rounded');
    return false;
  };

  listdetguiadev();
  $(".newguiadev").modal("open");
}

listdetguiadev = function () {
  var data, id;
  if (id !== "") {
    data = {
      listaherraguia: true,
      tamdev: fav,
    };
    $.getJSON("", data, function (response) {
      var $tb, template, x;
      if (response.status) {
        $tb = $("div.divherradev");
        $tb.empty();
        template = "<div class=\"row\"><div class=\"input-field col s2\"><label style=\"color:black;\">{{ codg }}</label></div><div class=\"input-field col s2\"><label style=\"color:black;\">{{ nameherra }} {{ medherra }}</label></div><div class=\"input-field col s2\"><label style=\"color:black;\">{{ cant }}</label></div><div class=\"input-field col s2\"><input type=\"checkbox\" data-canti=\"{{ cant }}\" value=\"{{ codg }}\" class=\"filled-in checkdevherra\" data-cant={{ cant }} id=\"{{ codg }}{{ conta }}\"/><label for=\"{{ codg }}{{ conta }}\"></label></div><div style=\"\" id=\"divcantdev\" class=\"input-field col s4 divcantdev\"><input placeholder=\"\" id=\"cantdev\" name=\"cantdev\" type=\"text\" class=\"cantdev\"></div></div></br>";
        for (x in response.lcod) {
          response.lcod[x].item = parseInt(x) + 1;
          $tb.append(Mustache.render(template, response.lcod[x]));
        }
      }
    });
  }
}

opendetherracompl = function () {
  var coddet = $(".numguiadev").text();
  cod = coddet;
  listdetherracompl();
  $(".detherracompl").modal("open");
}

listdetherracompl = function () {
  var data, id;
  id = cod;
  if (id !== "") {
    data = {
      idherraguia: id,
      listaherraguia: true,
    };
    $.getJSON("", data, function (response) {
      var $tb, template, x;
      if (response.status) {
        $tb = $("table.table-detherrac > tbody");
        $tb.empty();
        template = "<tr><td class=\"colnum\">{{ count }}</td><td>{{ nombherra }} {{ medherra }} {{ brandherra }}</td><td>{{ cant }}</td></tr>";
        for (x in response.lherraguia) {
          response.lherraguia[x].item = parseInt(x) + 1;
          $tb.append(Mustache.render(template, response.lherraguia[x]));
        }
      }
    });
  }
}


opendetguiagene = function () {
  var codt = this.value;
  cod = codt;
  $(".dnumguia").text(this.getAttribute("data-dnumguia"));
  $(".dnameproy").text(this.getAttribute("data-dnomproy"));
  $(".dfsalid").text(this.getAttribute("data-dfsalid"));
  $(".dtransp").text(this.getAttribute("data-dtrans"));
  $(".dconduc").text(this.getAttribute("data-dcond"));
  $(".dnumplaca").text(this.getAttribute("data-dplaca"));
  $(".dcoment").text(this.getAttribute("data-dcoment"));
  $(".dlleg").text(this.getAttribute("data-dllega"));
  $(".ddest").text(this.getAttribute("data-ddest"));
  $(".dsupervisor").text(this.getAttribute("data-dsuperv"));
  listdetguiagene();
  $(".detguiagen").modal("open");
}


listdetguiagene = function () {
  var data, id;
  id = cod;
  if (id !== "") {
    data = {
      idherraguia: id,
      listaherraguia: true,
    };
    $.getJSON("", data, function (response) {
      var $tb, template, x;
      if (response.status) {
        console.log(response.lcod)
        $tb = $("table.table-dguiagene > tbody");
        $tb.empty();
        template = "<tr><td class=\"colnum\">{{ count }}</td><td>{{ codherra }}</td><td>{{ nombherra }} {{ medherra }} {{ brandherra }}</td><td>{{ cant }}</td><td>{{ est }}</td><td>{{ fdev }}</td></tr>";
        for (x in response.lherraguia) {
          response.lherraguia[x].item = parseInt(x) + 1;
          $tb.append(Mustache.render(template, response.lherraguia[x]));
        }
      }
    });
  }
}


delherraguia = function (event) {
  var btn;
  btn = this;
  swal({
    title: "Eliminar Herramienta?",
    text: "Desea eliminar la herramienta de la guia?",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dd6b55",
    confirmButtonText: "Si, eliminar!",
    cancelButtonText: "No, Cancelar",
    closeOnConfirm: true,
    closeOnCancel: true
  }, function (isConfirm) {
    var data;
    if (isConfirm) {
      data = new Object;
      data.delherguia = true;
      data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
      data.tablepk = btn.value;
      data.guia = btn.getAttribute("data-delherraguia");
      $.post("", data, function (response) {
        if (response.status) {
          listherraguia();
          Materialize.toast('Herramienta Eliminada de la Guia', 2000, 'rounded');
        } else {
          swal("Error", "Error al eliminar la herramienta", "warning");
        }
      });
    }
  });

}





showeditherraguia = function () {
  $(".accionguia").val("");
  if (this.getAttribute("data-est") == 'ALQUILER') {
    document.getElementById('divfdev').style.display = 'block';
  } else {
    document.getElementById('divfdev').style.display = 'none';
  }
  $(".iddetguia").text(this.getAttribute("data-iddetguiaherra"));
  $(".codguia").text(this.getAttribute("data-codguia"));
  $("select[id=comboherra]").val(this.value);
  $(".guiaherracant").val(this.getAttribute("data-cantidad"));
  // $(".").val(this.getAttribute("data-")); ESTADO
  $(".fguiadevol").val(this.getAttribute("data-fdevolucion"));
  $(".txtcomentguiah").val(this.getAttribute("data-coment"));
  $(".newherramientaguia").modal("open");
}




openeditherra = function () {
  var data, id;
  $(".accionherra").val("");
  // $(".idherra").val(this.value);
  id = this.value
  console.log(id);
  if (id !== "") {
    data = {
      herraid: id,
      showeditherra: true,
    };
    $.getJSON("", data, function (response) {
      if (response.status) {
        $(".idherra").val(response.herramienta_id);
        $(".nameherra").val(response.nombre);
        $(".medida").val(response.medida);
        $("select[id=combomarca]").val(response.marca_id);
        $("select[id=combounid]").val(response.unidad_id);
        $(".tvida").val(response.tvida);
        $(".newherramienta").modal("open");
      }
    });
  }
}

openaddguiaherra = function () {
  $(".newherramientaguia").modal("open");
  limp_newherraguia();
}


opennewguiaherra = function () {
  $(".newherramientaguia").modal("open");
  limp_newherraguia();
}

opennewguia = function () {
  dataherra = [];
  $(".newguia").modal("open");
  limp_guia();
}

opennewherra = function () {
  $(".newherramienta").modal("open");
  limp_herramienta();
}

sendata_newherra = function () {
  var a = $(".ednumguia").val()
  $(".codguia").text(a);
  $(".accionguia").val(this.getAttribute("data-newguiaherra"));
}

sendata_codguia = function () {
  var a = $(".numguia").val();
  $(".codguia").text(a);
  $(".accionguia").val(this.getAttribute("data-guiaherra"))
  // $(".codguiaherra").val()
}

sendata_herramienta = function () {
  $(".accionherra").val(this.getAttribute("data-herra"));
}

save_edit_guia = function () {
  var data, fecha;
  fecha = $("input[name=edfguiasalida]").val();

  data = new Object;
  data.numguia = $("input[name=ednumguia]").val();
  data.proyecto = $("select[id=edcomboproyecto]").val();
  data.conductor = $("select[id=edcomboconductor]").val();
  data.placa = $("select[id=edcomboplaca]").val();
  data.fsalida = $("input[name=edfguiasalida]").val();
  data.transp = $("select[id=edcombotransportista]").val();
  data.comentario = $("textarea[name=edtxtcomentguia]").val();
  data.est = 'PE';
  data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();

  data.saveeditcabguia = true;
  $.post("", data, function (response) {
    if (response.status) {
      location.reload();
      $(".lherraguia").modal("close");
      Materialize.toast('Edicion de la Guia Correcta', 2000, 'rounded');
    }
  }, "json");

}

save_guia_fin = function () {

  nguia = $("input[name=numguia]").val();
  fsal = $("input[name=fguiasalida]").val();
  comen = $("textarea[name=txtcomentguia]").val();
  if (nguia.length != 12) {
    Materialize.toast('Numero de Guia INCORRECTA', 2500, 'rounded');
    lcodigos = [];
    lcant = [];
    ltot = [];
    return false;
  }
  if (fsal == "") {
    Materialize.toast('Debe Ingresar una Fecha de Salida', 2500, 'rounded');
    lcodigos = [];
    lcant = [];
    ltot = [];
    return false;
  }
  if (comen.length > 200) {
    Materialize.toast('Excede la cantidad de caracteres en Comentario', 2500, 'rounded');
    return false;
  };

  if (dataherra.length == 0) {
    Materialize.toast('Debe Ingresar al menos 1 Herramienta', 2500, 'rounded');
    return false;
  }



  for (var i = 0; i < tamherra.length; i++) {
    lcodigos.push(tamherra[i][0], tamherra[i][1])
  };
  console.log(lcodigos.length)
  console.log(lcodigos)
  for (var i = 0; i < lcodigos.length; i++) {
    lcant.push(lcodigos[i + 1])
    i = i + 1
  };
  console.log('ooo');
  console.log(lcant);

  var data;
  data = new Object;
  data.listacodigos = lcodigos;
  data.vstock = true;
  $.getJSON("", data, function (response) {
    if (response.status) {
      var linv = response.listainve;
      for (var i = 0; i < linv.length; i++) {
        console.log(linv[i]['cantalmacen'])
        console.log(lcant[i])
        tot = parseInt(linv[i]['cantalmacen']) - parseInt(lcant[i]);
        ltot.push(linv[i]['herramienta_id'], tot);
        console.log('qdsasa')
        console.log(linv[i]['herramienta_id'])
      };
      listcod();
    }
    console.log('ppp');
    console.log(ltot);
  }, "json");
}

listcod = function () {
  var btn;
  btn = this;
  swal({
    title: "GUARDAR GUIA",
    text: "Desea guardar la guia",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dd6b55",
    confirmButtonText: "Si, GUARDAR!",
    cancelButtonText: "No, CANCELAR",
    closeOnConfirm: true,
    closeOnCancel: true
  }, function (isConfirm) {
    var data;
    if (isConfirm) {
      var data;
      data = new Object;
      data.numguia = $("input[name=numguia]").val();
      data.proyecto = $("select[id=comboproyecto]").val();
      data.conductor = $("select[id=comboconductor]").val();
      data.placa = $("select[id=comboplaca]").val();
      data.fsalida = $("input[name=fguiasalida]").val();
      data.transp = $("select[id=combotransportista]").val();
      data.comentario = $("textarea[name=txtcomentguia]").val();
      data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
      data.exists = true;
      data.est = 'PE';
      data.detherra = dataherra;
      data.tamdetherra = tamherra.length;
      $.post("", data, function (exists) {
        if (!exists.status) {
          delete data.exists;
          data.savecabguia = true;
          data.listacod = lcodigos;
          data.ltotal = ltot;
          $.post("", data, function (response) {
            if (response.status) {
              location.reload();
              $(".newguia").modal("close");
              Materialize.toast('Guia Guardada', 2000, 'rounded');
            }
          }, "json");
        } else {
          console.log(data.numguia);
          Materialize.toast('Numero de Guia ya existe', 2000, 'rounded');
          return false;
        }
      }, "json");
    } else {
      lcodigos = [];
      lcant = [];
      ltot = [];
    }
  })
}


save_or_edit_herramienta = function () {
  valor = document.getElementById('accionherra').value;
  var data, div;
  lbpk = document.getElementById("codherra").innerHTML;
  data = new Object;
  data.codherramienta = lbpk;
  data.idherra = $("input[name=idherra]").val();
  data.nameherra = $("input[name=nameherra]").val();
  data.medherra = $("input[name=medida]").val();
  data.marcaherra = $("select[id=combomarca]").val();
  data.unidherra = $("select[id=combounid]").val();
  data.tvida = $("input[name=tvida]").val();
  data.exists = true;
  data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();

  if (data.idherra.length != 15) {
    Materialize.toast('Codigo de Herramienta INCORRECTA', 2500, 'rounded')
    return false;
  };

  if (data.nameherra == "") {
    Materialize.toast("Debe Ingresar un NOMBRE", 2500, 'rounded');
    return false;
  };

  if (data.medherra == "") {
    Materialize.toast("Debe Ingresar una MEDIDA", 2500, 'rounded');
    return false;
  }

  if (valor == "btnnewherra") {
    $.post("", data, function (exists) {
      if (!exists.status) {
        delete data.exists;
        data.saveherramienta = true;
        $.post("", data, function (response) {
          if (response.status) {
            Materialize.toast('Herramienta Agregado', 4000, 'rounded');
            $(".newherramienta").modal('close');
            location.reload();
          }
        }, "json");
      } else {
        Materialize.toast('Codigo de Herramienta ya EXISTE', 4000, 'rounded');
        return false;
      }
    }, "json");
  }
  else {
    data.editherra = true;
    $.post("", data, function (response) {
      if (response.status) {
        Materialize.toast('Edicion de la Herramienta correcta', 4000, 'rounded');
        $(".newherramienta").modal("close");
        location.reload();
      }
    }, "json");
  }
}

stockfromcombo = function (combo, txt_to_stock) {
  $(function () {
    $(combo).change(function () {
      var data;
      data = new Object;
      data.herra = this.value;
      data.viewstock = true;
      $.getJSON("/almacen/herramienta/inventario", data, function (response) {
        var stk = response.cantalmacen;
        $(txt_to_stock).text("Stock " + stk)
      }, "json");
    });
  });
}
stockfromcombo('#comboherra', ".textstock");
stockfromcombo('#comboneweditherra', ".textneweditstock");




save_or_edit_guiaherramienta = function () {
  var data;
  data = new Object;
  data.herra = $("select[id=comboherra]").val();
  data.canti = $("input[name=guiaherracant]").val();
  data.viewstock = true;

  for (var i = 0; i < dataherra.length; i++) {
    if (dataherra[i] == data.herra) {
      Materialize.toast('Herramienta ya ha sido agregada', 2500, 'rounded');
      return false;
    };
  };

  $.getJSON("/almacen/herramienta/inventario", data, function (response) {
    var c = parseInt(data.canti);
    var d = parseInt(response.cantalmacen);
    if (c > d) {
      Materialize.toast('Cantidad Ingresada es Mayor al Stock', 2500, 'rounded');
      return false;
    };
    validstock();
  }, "json");
}
validstock = function () {
  var valor, codguia, can, radio, data;
  valor = document.getElementById('accionguia').value;
  data = new Object;
  lbpk = document.getElementById("iddetguia").innerHTML;
  codguia = document.getElementById("codguia").innerHTML;
  data.tablepk = lbpk;
  data.numguia = codguia;

  data.herra = $("select[id=comboherra]").val();
  data.herraview = $("select[id=comboherra] > option:selected").text();
  data.est = $("select[id=idcomboestado]").val();
  data.fdev = $("input[name=fguiadevol]").val();
  data.canti = $("input[name=guiaherracant]").val();
  data.coment = $("textarea[name=txtcomentguiah]").val();
  data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();


  if (data.canti == "" || data.canti < 1) {
    Materialize.toast('Cantidad de Herramienta INCORRECTA', 2500, 'rounded');
    return false;
  }

  if (/^[a-zA-Z\s]*$/.test(data.canti)) {
    Materialize.toast('No se permite letras en cantidad', 2500, 'rounded');
    return false;
  }

  if (data.est == 'ALQUILER' && data.fdev == "") {
    Materialize.toast('Debe Ingresar una fecha de Devolucion', 2500, 'rounded');
    return false;
  };

  if (data.coment.length > 200) {
    Materialize.toast('Excede la cantidad de caracteres en Comentario', 2500, 'rounded');
    return false;
  };

  dataherra.push(data.herra, data.canti, data.fdev, data.est, data.coment);
  tamherra.push([data.herra, data.canti, data.fdev, data.est, data.coment]);
  console.log('listaaa')
  console.log(dataherra)


  if (valor == "btnaddguiaherra") {
    for (var i = 0; i < dataherra.length; i++) {
      var arr = "<tr><td class=\"colnewguiahe\" style=\"width: 75%;\">" + data.herraview + "</td><td class=\"colnewguiacant\">" + data.canti + "</td><td class=\"colnewguiaest\">" + data.est + "</td><td class=\"colnewguiafdev\">" + data.fdev + "</td><td class=\"colnewguiadel\"><button onclick=\"deleteRow(this)\" type=\"button\" class=\"btn red btndelherraguia\" data-codhe=" + data.herra + "><i class=\"fa fa-trash-o\"></i></button></td></tr>";
    }
    $("#table-detailsguiaherra tr:last").after(arr);
    $(".newherramientaguia").modal("close");

  } else if (valor == "btnnewguiaherra") {
    data.addherraguia = true;
    $.post("", data, function (response) {
      if (response.status) {
        listherraguia();
        cod = codguia;
        listherraguia();
        Materialize.toast('Herramienta Guardada', 2000, 'rounded');
        $(".newherramientaguia").modal("close");
      }
    }, "json");

  } else {
    data.editherraguia = true;
    $.post("", data, function (response) {
      if (response.status) {
        listherraguia();
        cod = codguia;
        listherraguia();
        Materialize.toast('Edicion de la Herramienta correcta', 2000, 'rounded');
        $(".newherramientaguia").modal("close");
      }
    }, "json");
  }

}


openlistherraguia = function () {
  var codt = this.value;
  document.getElementById('ednumguia').readOnly = true;
  $(".ednumguia").val(this.getAttribute("data-ednumguia"));
  $("select[id=edcomboproyecto]").val(this.getAttribute("data-proyid"));
  $("select[id=edcombotransportista]").val(this.getAttribute("data-trans"));
  $("select[id=edcomboconductor]").val(this.getAttribute("data-cond"));
  $("select[id=edcomboplaca]").val(this.getAttribute("data-placa"));
  $(".edfguiasalida").val(this.getAttribute("data-fsalid"));
  $(".edtxtcomentguia").val(this.getAttribute("data-coment"));
  cod = codt;
  listherraguia();
  $(".lherraguia").modal("open");
}


listherraguia = function () {
  var data, id;
  // id = $(".codguia").text();
  id = cod;
  console.log(id);
  if (id !== "") {
    data = {
      idherraguia: id,
      listaherraguia: true,
    };
    $.getJSON("", data, function (response) {
      var $tb, template, x;
      if (response.status) {
        $tb = $("table.table-detailherraguia > tbody");
        $tb.empty();
        template = "<tr><td>{{ count }}</td><td>{{ nombherra }} {{ medherra }}</td><td style=\"text-align: center;\">{{ cant }}</td><td style=\"text-align: center;\">{{ est }}</td><td style=\"text-align: center;\">{{ fdev }}</td><td style=\"text-align: center;\"><button type=\"button\" class=\"btn btn-editherraguia\" value=\"{{ codherra }}\" data-codguia=\"{{ codguia }}\" data-cantidad=\"{{ cant }}\" data-est=\"{{ est }}\" data-fdevolucion=\"{{ fdev }}\" data-coment=\"{{ coment }}\" data-iddetguiaherra=\"{{ id }}\" ><i class=\"fa fa-pencil\"></i><span class=\"glyphicon glyphicon-edit\"></span></button><button type=\"button\" class=\"btn red btndelherraguiabase\" value=\"{{ id }}\" data-delherraguia=\"{{ codguia }}\"><i class=\"fa fa-trash-o\"></i></button></td></tr>";
        for (x in response.lherraguia) {
          response.lherraguia[x].item = parseInt(x) + 1;
          $tb.append(Mustache.render(template, response.lherraguia[x]));
        }
      }
    });
  }
}

verdocherrapdf = function () {
  window.open('http://' + location.hostname + ':8089/reports/guide/toolsreturn?ndoc=' + this.value, '_blank');
}

verguiaherrapdf = function () {
  window.open('http://' + location.hostname + ':8089/reports/guide/tools?ng=' + this.value, '_blank');
}
verguiacompdf = function () {
  window.open('http://' + location.hostname + ':8089/reports/guide/tools?ng=' + this.value, '_blank');
}

generarguia = function () {
  nguia = this.value;
  // listcod();
  var btn;
  btn = this;
  swal({
    title: "Generar Guia?",
    text: "Desea generar guia de herramienta?",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dd6b55",
    confirmButtonText: "Si, Generar!",
    cancelButtonText: "No, Cancelar",
    closeOnConfirm: true,
    closeOnCancel: true
  }, function (isConfirm) {
    var data;
    if (isConfirm) {
      data = new Object;
      data.genguia = true;
      data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
      data.numguia = btn.value;
      data.gener = 'GE';
      $.post("", data, function (response) {
        if (response.status) {
          window.open('http://' + location.hostname + ':6000/guiasherramienta/reportguiaherra?ng=' + btn.value, '_blank');
          location.reload();
          Materialize.toast('Guia de Herramienta Generada', 2000, 'rounded');
        } else {
          swal("Error", "Error al generar la guia herramienta", "warning");
        }
      });
    }
  });
}


busc2colherra = function (idtxtsearch, idtable, col1, col2) {
  var input, filter, table, tr, td, td2, i;
  input = document.getElementById(idtxtsearch);
  filter = input.value.toUpperCase();
  table = document.getElementById(idtable);
  tr = table.getElementsByTagName("tr");

  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[col1];
    td2 = tr[i].getElementsByTagName("td")[col2];
    if (td || td2) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1 ||
        td2.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

buscheedit = function () {
  busc2colherra("txtbuscarheedit", "table-detailsguiaherraedit", 1, 2);
}

buscarherra = function () {
  busc2colherra("txtbuscar", "tabla-herra", 1, 2);
}

buscarherramienta = function () {
  busc2colherra("txtbuscarherramienta", "tabla-invent", 1, 2);
}
buscardoc = function () {
  busc2colherra("txtbuscardoc", "tabla-listdev", 1, 2);
}


buscarguia = function (event) {
  var input, filter, table, tr, td, i;
  input = document.getElementById("txtbuscarguia");
  filter = input.value.toUpperCase();
  table = document.getElementById("tabla-guia");
  table2 = document.getElementById("tabla-guiagene");
  table3 = document.getElementById("tabla-guiaco")
  tr = table.getElementsByTagName("tr");
  tr2 = table2.getElementsByTagName("tr");
  tr3 = table3.getElementsByTagName("tr");

  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    td2 = tr[i].getElementsByTagName("td")[2];
    if (td || td2) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1 ||
        td2.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }

  for (i = 0; i < tr2.length; i++) {
    td = tr2[i].getElementsByTagName("td")[1];
    td2 = tr2[i].getElementsByTagName("td")[2];
    if (td || td2) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1 ||
        td2.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr2[i].style.display = "";
      } else {
        tr2[i].style.display = "none";
      }
    }
  }
  for (i = 0; i < tr3.length; i++) {
    td = tr3[i].getElementsByTagName("td")[1];
    td2 = tr3[i].getElementsByTagName("td")[2];
    if (td || td2) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1 ||
        td2.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr3[i].style.display = "";
      } else {
        tr3[i].style.display = "none";
      }
    }
  }

}

buscarhxproy = function (event) {
  if (event.which == 13) {
    var data, text;
    text = this.value;
    data = new Object;
    data.buscarh = true;
    data.textoing = text;
    $.getJSON("", data, function (response) {
      if (response.status) {
        var stsizehe = response.namehesize;
        console.log(stsizehe);
        if (stsizehe == true) {
          $(".lconsherra").modal("open");
          $tb = $("table.table-lconsherra > tbody");
          $tb.empty();
          template = "<tr><td class=\"colnum\">{{ count }}</td><td>{{ name }}</td><td>{{ medida }}</td><td>{{ marcah }}</td><td><button type=\"button\" style=\"border:none;font-weight:bold;\" class=\"transparent btnselectherra\"  value=\"{{ codh }}\" data-name=\"{{ name }}\" data-medida=\"{{ medida }}\" data-marca=\"{{ marcah }}\"><i class=\"fa fa-check\"></i></button></td></tr>";
          for (x in response.namehe) {
            response.namehe[x].item = parseInt(x) + 1;
            $tb.append(Mustache.render(template, response.namehe[x]));
          }
        } else {
          Materialize.toast('No existe Herramienta con la palabra ingresada', 3000, 'rounded');
          return false;
        }
      }
    });
  }
}



viewestguia = function () {
  if (document.getElementById('radiope').checked) {
    document.getElementById('divtableguiape').style.display = 'block';
    document.getElementById('divtableguiagene').style.display = 'none';
    document.getElementById('divtableguiaco').style.display = 'none';
  } else if (document.getElementById('radioge').checked) {

    document.getElementById('divtableguiagene').style.display = 'block';
    document.getElementById('divtableguiape').style.display = 'none';
    document.getElementById('divtableguiaco').style.display = 'none';

  } else if (document.getElementById('radioco').checked) {
    document.getElementById('divtableguiaco').style.display = 'block';
    document.getElementById('divtableguiagene').style.display = 'none';
    document.getElementById('divtableguiape').style.display = 'none';
  }
}


changecolortd = function (tdata) {
  var d = new Date();
  var datenow = new Date(d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate());

  var data = new Date();
  var diares = d.getDate();
  d.setDate(diares + 7);
  $(tdata).each(function () {
    var fech = $(this).text();
    var dat = fech.replace(/-/g, "/")
    var fechafinal = new Date(dat)
    console.log(fechafinal)

    if (fech != "") {
      if (fechafinal < d && fechafinal > data) {
        $(this).css('background-color', '#ffe0b2'); //orang
        $(this).css('color', 'black');
      } else if (fechafinal < data) {
        $(this).css('background-color', '#ef9a9a'); //red
        $(this).css('color', 'black')
      } else {
        $(this).css('background-color', '#a5d6a7'); //green
        $(this).css('color', 'black');
      }
    }
  });
}






//filtro combo por proyecto
$(function () {
  var $table = $('#tabla-guia');
  var $table2 = $('#tabla-guiagene');
  var $table3 = $('#tabla-guiaco');

  $('#searchInput').change(function () {
    $(".searchInputFech").val("");
    var value = $(this).val();
    if (value) {
      $('tbody tr.' + value, $table).show();
      $('tbody tr.' + value, $table2).show();
      $('tbody tr.' + value, $table3).show();
      $('tbody tr:not(.' + value + ')', $table).hide();
      $('tbody tr:not(.' + value + ')', $table2).hide();
      $('tbody tr:not(.' + value + ')', $table3).hide();
    }
    else {
      $('tbody tr', $table).show();
      $('tbody tr', $table2).show();
      $('tbody tr', $table3).show();
    }
  });
});

// rango de fecha
$(function () {
  $(".searchInputFech").on("input", function () {
    var from = stringToDate($("#searchFrom").val());
    var to = stringToDate($("#searchTo").val());

    $("#fbody tr").each(function () {
      var row = $(this);
      var date = stringToDate(row.find("td").eq(4).text());
      var date2 = stringToDate(row.find("td").eq(3).text());
      var show = true;
      if (from && (date || date2) < from)
        show = false;
      if (to && (date || date2) > to)
        show = false;

      if (show)
        row.show();
      else
        row.hide();
    });
  });
});

function stringToDate(s) {
  var ret = NaN;
  var parts = s.split("-");
  date = new Date(parts[2], parts[0], parts[1]);
  if (!isNaN(date.getTime())) {
    ret = date;
  }
  return ret;
}

function deleteRow(r) {
  var i = r.parentNode.parentNode.rowIndex;
  document.getElementById("table-detailsguiaherra").deleteRow(i);
}

limp_list = function () {
  lishg = [];
  lidherra = [];
  lcantid = [];
  lnum = [];
  lto = [];
}
limp_herramienta = function () {
  $(".idherra").val("");
  $(".nameherra").val("");
  $(".medida").val("");
  $(".tvida").val("");
}
limp_newherraguia = function () {
  $(".guiaherracant").val("");
  $(".fguiadevol").val("");
  $(".txtcomentguiah").val("");
}

limp_guia = function () {
  $(".numguia").val("001-");
  $(".fguiasalida").val("");
  $(".txtcomentguia").val("");
  $("#table-detailsguiaherra").find("tr:not(:first)").remove();
}

