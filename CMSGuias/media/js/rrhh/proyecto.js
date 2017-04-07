var listdniemple = [];

$(document).ready(function() {
	$('select').material_select();
	$('.modal').modal();
	$('.datepicker').pickadate({selectYears: 10,selectMonths: true,container: 'body',yearRange: "1950:2020",format: 'yyyy-mm-dd'});
	$(document).on("click", ".btnasigobrero", openasigobrapers);
	$(document).on("click", ".btnaddperobra", addperobra);
	$(document).on("click", ".btnsaveasigproy", saveasigobrapers);
	$(document).on("click", "button[id=btnviewemp]", openlistempxobra);
	$(document).on("click", "button[id=btnviewinduccion]", openlistinducxobra);
	$(document).on("click", "button.btnedproy", showeditproyecto);
	$(document).on("click", "button.btndelasigobra", delproyecto);
	$(".btnsaveproy").click(function() { save_or_edit_proyecto(); });
	$(document).on("click","button.btnaddind", opennewinduccion);
	$(".btnsaveinduc").click(function() { save_or_edit_induccion(); });
	$(document).on("click", "button.btndelinduc", delinduccion);

	$(document).on("click", "button[name=btnind]", sendatainduccion);
	$(document).on("click", "button.btndetinduc",detinduc);
	$(document).on("click", "button.btnfininduc",fininduccion);
	$(document).on("click", "button.btnedinduc", showeditinduccion);
	$(document).on("click", "button.btndelempleobra",delempleobra);


	$("input[name=txtbuscarproy]").on("keyup", buscarproy);

	combochosen("#comboasigproyecto");
	combochosen("#combopersonal");
	combochosen("#combocliente");
	combochosen("#comboproyectocon");

});

combochosen = function(combo){
$(combo).chosen({
	allow_single_deselect:true,
	width: '100%'});
}


addperobra = function(){
  var data;
  data = new Object;
  data.empledni = $("select[id=combopersonal]").val();
  data.emplenames =$("select[id=combopersonal] > option:selected").text();
  data.cargoemple = $("#combopersonal option:selected").attr("data-cargo");
  data.iniproy = $(".finiobra").val();
  data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();


  for (var i = 0; i < listdniemple.length; i++) {
    if (listdniemple[i] == data.empledni) {
      Materialize.toast('Personal ya ha sido agregada',2500, 'rounded');
      return false;
    };
    };
  if (data.empledni == null) {
    Materialize.toast("Debe Seleccionar un empleado",2500,'rounded');
    return false;
  };

  if (data.iniproy == "") {
    Materialize.toast("Debe Seleccionar Fecha de Inicio de ingreso ",2500,'rounded');
    return false;
  };

  listdniemple.push(data.empledni,data.iniproy);
  console.log(listdniemple)


  for (var i = 0; i < listdniemple.length; i++) {
  var arr = "<tr><td>" + data.emplenames + "</td><td>" + data.cargoemple + "</td><td>" + data.iniproy + "</td><td><button onclick=\"deleteRow(this)\" type=\"button\" class=\"btn red btndelempleobra\" data-codemple="+ data.empledni +"><i class=\"fa fa-trash-o\"></i></button></td></tr>"; 
  }
  $("#table-lpersobra tr:last").after(arr);

}

changecolortd = function(tdata){
  var d = new Date();
  var datenow = new Date(d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate());

  var data = new Date();
  var diares = d.getDate();
  d.setDate(diares + 7);
  $(tdata).each(function(){ 
    var fech = $(this).text();
    var dat = fech.replace(/-/g , "/")
    var fechafinal = new Date(dat)
    console.log(fechafinal)

if (fech != "") {
  if (fechafinal < d && fechafinal > data) {
    $(this).css('background-color','#ffe0b2'); //orang
    $(this).css('color','black');
  }else if (fechafinal < data) {
    $(this).css('background-color','#ef9a9a'); //red
    $(this).css('color','black')
  }else{
    $(this).css('background-color','#a5d6a7'); //green
    $(this).css('color','black');
  }
}
});
}

function deleteRow(r) {
    var i = r.parentNode.parentNode.rowIndex;
    document.getElementById("table-lpersobra").deleteRow(i);
}

delempleobra = function(){
var valor = this.getAttribute("data-codemple");
for (var i = 0; i < listdniemple.length; i++) {
  if (listdniemple[i] == valor) {
    var pos = listdniemple.indexOf(valor);
    for (var k = 0; k < 2; k++) {
      listdniemple.splice(pos,1)
    };
  };
};
for (var i = 0; i < tamherra.length; i++) {
    for (var k = 0; k < tamherra[i].length; k++) {
      if (tamherra[i][k] == valor) {
        tamherra.splice(i,1);
      };
    };
}
}

delproyecto = function(){
  var btn;
  btn = this;
  swal({
    title: "Eliminar Empleado",
    text: "Realmente Desea Quitar Empleado Del Proyecto?",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dd6b55",
    confirmButtonText: "Si, eliminar!",
    cancelButtonText: "No, Cancelar",
    closeOnConfirm: true,
    closeOnCancel: true
  }, function(isConfirm) {
    var data;
    if (isConfirm) {
      data = new Object;
      data.delproy = true;
      data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
      data.dni = btn.value;
      data.pk = btn.getAttribute("data-delproy");
      $.post("/rrhh/empleado/obra/", data, function(response) {
        if (response.status) {
          // listObra();
          listproy();
          Materialize.toast('Proyecto Eliminado', 2000, 'rounded');
        } else {
          swal("Error", "Error al eliminar el Proyecto", "warning");
        }
      });
    }
  });
}


delinduccion = function(){
  var btn;
  btn = this;
  swal({
    title: "Anular Induccion",
    text: "Realmente desea Quitar Induccion al Personal?",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dd6b55",
    confirmButtonText: "Si, Quitar!",
    cancelButtonText: "No, Cancelar",
    closeOnConfirm: true,
    closeOnCancel: true
  }, function(isConfirm) {
    var data;
    if (isConfirm) {
      data = new Object;
      data.delinduccion = true;
      data.st = 'AN';
      data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
      data.dni = btn.value;
      data.pk = btn.getAttribute("data-delinduccion");
      $.post("/rrhh/empleado/obra/", data, function(response) {
        if (response.status) {
          // listInduccion();
          listind();
          Materialize.toast('Induccion Eliminado', 2000, 'rounded');
        } else {
          swal("Error", "Error al eliminar la Induccion", "warning");
        }
      });
    }
  });
}

detinduc = function(){
  var n = this.getAttribute("data-names");
  var a = this.getAttribute("data-lastnames");
  var mag = this.getAttribute("data-magn");
  var fot = this.getAttribute("data-fot");
  var ini = this.getAttribute("data-fechini");
  var fin = this.getAttribute("data-fechcad");

  if (mag == 'true') {
    ma = 'SI';
  }else{
    ma = 'NO';
  }

  if (fot == 'true'){
    fo = 'SI';
  }else{
    fo = 'NO'
  }

  $(".detindnames").text(a+", "+n);
  $(".detindproy").text(": "+this.getAttribute("data-namepro"));
  $(".detindcargo").text(": "+this.getAttribute("data-charge"));
  $(".detduracion").text(": "+ini+" / "+fin);
  $(".detindestado").text(": "+this.getAttribute("data-status"));
  $(".detindmagfoto").text(": "+ma+" / "+fo);
  $(".detindcoment").text(": "+this.getAttribute("data-comment"));

  $(".detinduccion").modal("open");
}

fininduccion = function(){
  var nom = this.getAttribute("data-nomb");
  var ape = this.getAttribute("data-apel");
  $(".lblnombempleind").text(ape+", "+nom);

  document.getElementById("divfcadind").style.display = 'block';
  document.getElementById("divestinduc").style.display = 'block';
  document.getElementById("divfind").style.display = 'none';
  document.getElementById("divmagfoto").style.display = 'none';

  $(".accioninduccion").val("fin");
  $(".codinduc").text(this.getAttribute("data-codfinind"));
  $(".dniinduc").text(this.value);
  $("input[name=estinduccion]").val(this.getAttribute("data-estfinind"));
  $("input[name=fcadinduccion]").val(this.getAttribute("data-fcadfinind"));
  $("textarea[name=cominduccion]").val(this.getAttribute("data-comentfinind"));
  $(".editinduccionemple").modal("open");
}

listindxobra = function(){
  var data,id;
  codi = "1";
  id=$("select[id=comboproyectocon]").val();
  codcli = $("select[id=combocliente]").val();
  radiopro = document.getElementById("radiopro").checked;
  radiocli = document.getElementById("radiocli").checked;

  if (id == null && radiopro) {
    Materialize.toast("Debe Seleccionar un PROYECTO",2500,"rounded");
    return false;
  };
  if (codcli == null && radiocli) {
    Materialize.toast("Debe Seleccionar un CLIENTE", 2500, "rounded");
    return false;
  };


  if (radiopro) {
    if (id !== "") {
        data = {
          datindxobr: id,
          lempxinduccion: true,
        };
        $.getJSON("", data, function(response) {
            var $tb, template, x;
          if (response.status) {
            if (response.lindxobra == false) {
              Materialize.toast('No existe inducciones para este proyecto',3000,'rounded');
              return false;
            }else{
            document.getElementById("table-indxobra").style.display = 'block';
            document.getElementById("table-detailproyecto").style.display = 'none';
            document.getElementById("table-detempxcli").style.display = 'none';
            document.getElementById("table-detindxcli").style.display = 'none';
            $tb = $("table.table-indxobra > tbody");
            $tb.empty();
            template = "<tr><td class=\"colnumdetind\">{{ conta }}</td><td class=\"colnomdetind\">{{ apellidos }}, {{ nombres }}</td><td class=\"coldniind\">{{ dni }}</td><td class=\"colcargoind\">{{ cargo }}</td><td class=\"colfiniind\">{{ finicio }}</td><td class=\"colfcadind\">{{ fcad }}</td><td class=\"colestind\">{{ estad }}</td></tr>";
            for (x in response.lindxobra) {
            response.lindxobra[x].item = parseInt(x) + 1;
            $tb.append(Mustache.render(template, response.lindxobra[x]));
            }
            changecolortd("td.colfcadind")
          } 
        }
        });
  }
  }else
  {

    if (codcli !== "") {
          data = {
            datcliindxobr: codcli,
            lclixinduccion: true,
            idobra:codi
          };
          $.getJSON("", data, function(response) {
              var $tb, template, x;
            if (response.status) {
              if (response.lclixobra == false) {
                Materialize.toast('No existe inducciones',3000,'rounded');
                return false;
              }else{
              document.getElementById("table-indxobra").style.display = 'none';
              document.getElementById("table-detailproyecto").style.display = 'none';
              document.getElementById("table-detindxcli").style.display = 'block';
              document.getElementById("table-detempxcli").style.display = 'none';
              $tb = $("table.table-detindxcli > tbody");
              $tb.empty();
              template = "<tr><td class=\"colnumdetpro\">{{ cli_conta }}</td><td class=\"coldurdetpro\">{{ cli_apellidos }}, {{ cli_nombres }}</td><td class=\"colentrdetpro\">{{ cli_nompro }}</td><td class=\"coldniind\">{{ cli_cargo }}</td><td class=\"coldniind\">{{ cli_finicio }}</td><td class=\"colcad\">{{ cli_fcad }}</td><td class=\"colnumdetpro\">{{ cli_estad }}</td><td class=\"coldniind\" style=\"text-align:center;\"><button type=\"button\" style=\"border:none;font-weight:bold;font-size:20px;\" class=\"transparent btnfininduc\" name=\"btnfininduccion\" data-nomb=\"{{ cli_nombres }}\" data-apel=\"{{ cli_apellidos }}\" value=\"{{ cli_empcampo }}\" data-comentfinind=\"{{ cli_comentario }}\" data-estfinind=\"{{ cli_estad }}\" data-codfinind=\"{{ cli_id }}\" data-fcadfinind=\"{{ cli_fcad }}\"><i class=\"fa fa-check-square-o\"></i></button><button type=\"button\" style=\"border:none;font-weight:bold;font-size:20px;\" class=\"transparent btnedinduc\" name=\"btnedinduccion\" value=\"{{ cli_empcampo }}\" data-cominduccion=\"{{ cli_comentario }}\" data-estinduccion=\"{{ cli_estad }}\" data-fcadinduccion=\"{{ cli_fcad }}\" data-finduccion=\"{{ cli_finicio }}\" data-codind=\"{{ cli_id }}\" data-editinduccion=\"btnnewinduccion\" data-magnetico=\"{{ cli_magnetico }}\" data-fotocheck=\"{{ cli_fotocheck }}\" data-nomb=\"{{ cli_nombres }}\" data-apel=\"{{ cli_apellidos }}\"><i class=\"fa fa-pencil-square-o\"></i></button><button type=\"button\" style=\"border:none;font-weight:bold;font-size:20px;\" class=\"transparent btndelinduc\" value=\"{{ cli_empcampo }}\" data-delinduccion=\"{{ cli_id }}\" data-idinduccion=\"{{ cli_empcampo }}\"><i class=\"fa fa-trash-o\"></i></button></td></tr>";
              tempcompl = "<tr class=\"trind\"><td class=\"colnumdetpro\">{{ cli_conta }}</td><td class=\"coldurdetpro\">{{ cli_apellidos }}, {{ cli_nombres }}</td><td class=\"colentrdetpro\">{{ cli_nompro }}</td><td class=\"coldniind\">{{ cli_cargo }}</td><td class=\"coldniind\">{{ cli_finicio }}</td><td class=\"colfcad\">{{ cli_fcad }}</td><td class=\"colnumdetpro\">{{ cli_estad }}</td><td class=\"coldniind\" style=\"text-align:center;\"><button type=\"button\" style=\"border:none;font-weight:bold;font-size:20px;\" class=\"transparent btndetinduc\"  data-names=\"{{ cli_nombres }}\" data-lastnames=\"{{ cli_apellidos }}\" value=\"{{ cli_empcampo }}\" data-comment=\"{{ cli_comentario }}\" data-status=\"{{ cli_estad }}\" data-id=\"{{ cli_id }}\" data-fechcad=\"{{ cli_fcad }}\" data-fechini = \"{{ cli_finicio }}\" data-charge=\"{{ cli_cargo }}\" data-namepro=\"{{ cli_nompro }}\" data-magn=\"{{ cli_magnetico }}\" data-fot=\"{{ cli_fotocheck }}\"><i class=\"fa fa-info-circle\"></i></button></td></tr>";
              for (x in response.lclixobra) {
              response.lclixobra[x].item = parseInt(x) + 1;
              if (response.lclixobra[x]['cli_st'] == 'CO') {
                $tb.append(Mustache.render(tempcompl, response.lclixobra[x]));
              }else if (response.lclixobra[x]['cli_st'] == 'PE'){
                $tb.append(Mustache.render(template, response.lclixobra[x]));
              }
              }
            changecolortd("td.colfcad")

            } 
          }
          });
        }

  }
}

listempxobra = function(){
  var data,id,codproy;
  codproy = $("select[id=comboproyectocon]").val();
  nomproy = $("#comboproyectocon option:selected").attr("data-nompro");
  codcli = $("select[id=combocliente]").val();
  radiopro = document.getElementById("radiopro").checked;
  radiocli = document.getElementById("radiocli").checked;

  if (codproy == null && radiopro) {
    Materialize.toast("Debe Seleccionar un PROYECTO",2500,"rounded");
    return false;
  }
  if (codcli == null && radiocli) {
    Materialize.toast("Debe Seleccionar un CLIENTE", 2500, "rounded");
    return false;
  }

  if (radiopro) {
      $(".lbltitempxpro").text(codproy+" - "+nomproy);
      id=codproy;
      console.log(id);
      if (id !== "") {
        data = {
          dat: id,
          lempxobra: true,
        };
        $.getJSON("", data, function(response) {
            var $tb, template, x;
          if (response.status) {
            if (response.lobras == false) {
              Materialize.toast('No existe trabajadores asignados para este proyecto',3000,'rounded');
              return false;
            }else{
            document.getElementById("table-indxobra").style.display = 'none';
            document.getElementById("table-detailproyecto").style.display = 'block';
            document.getElementById("table-detempxcli").style.display = 'none';
            document.getElementById("table-detindxcli").style.display = 'none';
            $tb = $("table.table-detailproyecto > tbody");
            $tb.empty();
            template = "<tr><td class=\"colnumdetpro\">{{ conta }}</td><td class=\"colnomdetpro\">{{ ape }}, {{ nomb }}</td><td class=\"coldurdetpro\">{{ dni }}</td><td class=\"colentrdetpro\">{{ finiproy }}</td><td><ul id=\"dropproy\"><li><a><i class=\"fa fa-list\"></i></a><ul><li class=\"litproy\"><button style=\"border:none;\" type=\"button\" class=\"transparent btnedproy\" value=\"{{ dni }}\" data-namepro=\"{{ ape }}\" data-codproye=\"{{ idempcampo }}\" data-proyectoid=\"{{ proyectocod }}\" data-feinicio=\"{{ finiproy }}\" data-comenta=\"{{ comentar }}\"><a class=\"title\"><i class=\"fa fa-pencil-square-o\"></i>Editar</a></button></li><li class=\"litdelproy\"><button style=\"border:none;\" type=\"button\" class=\"transparent btndelasigobra\" value=\"{{ dni }}\" data-delproy=\"{{ idempcampo }}\" data-proyectoid=\"{{ proyectocod }}\"><a class=\"title\"><i class=\"fa fa-trash-o\"></i>Eliminar</a></button></li></ul></li></ul></td></tr>";
            for (x in response.lobras) {
            response.lobras[x].item = parseInt(x) + 1;
            $tb.append(Mustache.render(template, response.lobras[x]));
            }
          }
        }
        });
      }
  }else{
      id=codcli;
      console.log(id);
      if (id !== "") {
        data = {
          datcli: id,
          lempxcli: true,
        };
        $.getJSON("", data, function(response) {
            var $tb, template, x;
          if (response.status) {
            if (response.lpro == false) {
              Materialize.toast('No existe trabajadores asignados',3000,'rounded');
              return false;
            }else{
            document.getElementById("table-indxobra").style.display = 'none';
            document.getElementById("table-detailproyecto").style.display = 'none';
            document.getElementById("table-detempxcli").style.display = 'block';
            document.getElementById("table-detindxcli").style.display = 'none';
            $tb = $("table.table-detempxcli > tbody");
            $tb.empty();
            template = "<tr><td class=\"colnumdetpro\">{{ cli_conta }}</td><td class=\"colnomdetpro\">{{ cli_ape }}, {{ cli_nomb }}</td><td class=\"coldurdetpro\">{{ cli_proyecto }}</td><td class=\"colentrdetpro\">{{ cli_finiproy }}</td><td class=\"colopcdetpro\"><button type=\"button\" style=\"border:none;font-weight:bold;font-size:20px;\" class=\"transparent btnaddind\" name=\"btnind\" value=\"{{ cli_emplecamp }}\" data-nameemple=\"{{ cli_nomb }}\" data-lastemple=\"{{ cli_ape }}\" data-addinduc=\"btnnewinduccion\"><i class=\"fa fa-plus-square-o\"></i></button></td></tr>";
            for (x in response.lpro) {
            response.lpro[x].item = parseInt(x) + 1;
            $tb.append(Mustache.render(template, response.lpro[x]));
            }
          }
        }
        });
      }
    
  }

}

listind = function(){
	var codind = $(this).attr("data-idinduccion");
	codi = codind;
	listindxobra();
}

listproy = function(){
  var codp = $(this).attr("data-proyectoid");//proyecto_id
  id = codp;
  listempxobra();

}

openasigobrapers = function(){
  $(".asigobrero").modal("open");
  limp_asigobrero();
  listdniemple = [];
}

openlistempxobra = function(){
  listempxobra();
}

openlistinducxobra = function(){
  listindxobra();
}

opennewinduccion = function(){
  document.getElementById("divfcadind").style.display = 'none';
  document.getElementById("divestinduc").style.display = 'none';
  document.getElementById("divmagfoto").style.display = 'block';
  document.getElementById("divfind").style.display = 'block';
  var nam = this.getAttribute("data-nameemple");
  var lastna = this.getAttribute("data-lastemple");
  console.log(nam);
$(".lblnombempleind").text(lastna+", "+nam);
$(".dniinduc").text(this.value);
$(".editinduccionemple").modal("open");
limp_induccion();
}

saveasigobrapers = function(){
  var btn;
  btn = this;
  var data;
  data = new Object;
  data.codproye = $("select[id=comboasigproyecto]").val();
  data.listadni = listdniemple;
  data.saveperobra = true;
  data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();

    if (data.codproye == null) {
    Materialize.toast("Debe Seleccionar un Proyecto",2500,'rounded');
    return false;
    };
    if (listdniemple.length == 0) {
      Materialize.toast("Debe Ingresar al menos un personal",2500,'rounded');
      return false;
    };

  swal({
    title: "Agregar Lista",
    text: "Realmente Desea Agregar la lista al proyecto?",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dd6b55",
    confirmButtonText: "Si, Finalizar!",
    cancelButtonText: "No, Cancelar",
    closeOnConfirm: true,
    closeOnCancel: true
  }, function(isConfirm) {
    if (isConfirm) {
        $.post("", data, function(response) {
        if (response.status) {
        Materialize.toast('Asignacion de personal correcta', 2000, 'rounded');
        $(".asigobrero").modal("close");
        }
        }, "json");
    }
  });
}


save_or_edit_induccion = function(){
  valor = document.getElementById('accioninduccion').value;
  var data,div;
  div=document.getElementById("dniinduc").innerHTML;
  lbpk= document.getElementById("codinduc").innerHTML;
  data = new Object;
  data.dni=div;
  data.codinduccion = lbpk;
  data.finduc = $("input[name=finduccion").val();
  data.fcadinduc = $("input[name=fcadinduccion]").val();
  data.estinduc = $("input[name=estinduccion]").val();
  data.comentinduc = $("textarea[name=cominduccion]").val();

  // MAGNETICO Y FOTOCHECK
  data.magnetico = $("select[id=combomagnetico]").val();
  data.fotocheck = $("select[id=combofotocheck]").val();
  //
  data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();

  if (valor == 'btnnewinduccion') {
        if (data.finduc == "") {
        Materialize.toast('Debe Ingresar una Fecha de Inicio', 2500, 'rounded');
        return false;
        }
      data.saveinduccion = true;
      data.sta = 'PE'
      $.post("/rrhh/empleado/obra/", data, function(response) {
        if (response.status) {
          Materialize.toast('Asignacion de Induccion correcta', 2500, 'rounded');
          $(".editinduccionemple").modal("close");
        }
      }, "json");
  }else if (valor == 'fin'){
      data.indfin = true;
      data.sta = 'CO'
      $.post("/rrhh/empleado/obra/", data, function(response){
        if (response.status) {
          listind()
          Materialize.toast('INDUCCION CORRECTA', 2500, 'rounded');
          $(".editinduccionemple").modal("close");
        };
      })
  }else{
    if (data.finduc == "") {
    Materialize.toast('Debe Ingresar una Fecha de Inicio', 2500, 'rounded');
    return false;
    }
    data.editinduccion = true;
    $.post("/rrhh/empleado/obra/", data, function(response) {
        if (response.status) {
          // cod = div;
          // listInduccion();
          listind();
          Materialize.toast('Edicion de Induccion correcto', 2500, 'rounded');
          $(".editinduccionemple").modal("close");
        }
      }, "json");
  } 
}

save_or_edit_proyecto = function(){

  valor = document.getElementById('accionproyecto').value;
  var data,div;
  div=document.getElementById("dniempleadoproy").innerHTML;
  lbpk= document.getElementById("codproy").innerHTML;
  data = new Object;
  data.dni=div;
  data.codproy = lbpk;
  data.finiproy = $("input[name=finiproy]").val();
  data.mag = $("select[id=ccarnetmag]").val();
  data.fot = $("select[id=combfotocheck]").val();
  data.comentproy = $("textarea[name=comenobra]").val();
  data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();


  if (data.finiproy === "") {
    Materialize.toast('Debe ingresar Fecha de Inicio', 3000, 'rounded');
    return false;
  }

  if (valor == 'btnnewproyecto') {
      data.proy = $("select[id=comboproyecto").val();
      data.saveproyecto = true;
      $.post("/rrhh/empleado/obra/", data, function(response) {
        if (response.status) {
          listObra();
          Materialize.toast('Asignacion de Proyecto correcto', 3000, 'rounded');
          $(".editproyemple").modal("close");
        }
      }, "json");
  }else{
    data.proy = $("select[id=comboproyopcional").val();
    data.editproy = true;
    $.post("/rrhh/empleado/obra/", data, function(response) {
        if (response.status) {
          listproy();
          Materialize.toast('Edicion de Proyecto Correcta', 3000, 'rounded');
          $(".editproyemple").modal("close");
        }
      }, "json");
  } 

}

sendatainduccion = function(){
  $(".accioninduccion").val(this.getAttribute("data-addinduc"));
}

showeditinduccion = function(){
  var nomb = this.getAttribute("data-nomb");
  var apel = this.getAttribute("data-apel");
  $(".lblnombempleind").text(apel+", "+nomb);
  document.getElementById("divfcadind").style.display = 'none';
  document.getElementById("divestinduc").style.display = 'none';
  document.getElementById("divmagfoto").style.display = 'block';
  document.getElementById("divfind").style.display = 'block';
  datacar = this.getAttribute("data-magnetico")
  datafoto = this.getAttribute("data-fotocheck")
  console.log(datacar)
  console.log(datafoto)
  
  if (datacar == 'true') {
    valorc = 'true';
  }else{
    valorc = 'false';
  }
  if (datafoto == 'true') {
    valorf = 'true';
  }else{
    valorf = 'false';
  }

  $("select[id=combomagnetico]").val(valorc);
  $("select[id=combofotocheck]").val(valorf);

  $(".codinduc").text();
  $(".accioninduccion").val("");
  $(".codinduc").text(this.getAttribute("data-codind"));
  $(".dniinduc").text(this.value);
  $("input[name=finduccion]").val(this.getAttribute("data-finduccion"));
  $("input[name=estinduccion]").val(this.getAttribute("data-estinduccion"));
  $("input[name=fcadinduccion]").val(this.getAttribute("data-fcadinduccion"));
  $("textarea[name=cominduccion]").val(this.getAttribute("data-cominduccion"));
  $(".editinduccionemple").modal("open");
}

showeditproyecto = function(){
  document.getElementById("divselect").style.display = 'none';
  document.getElementById("divselectopcional").style.display = 'block';

  $(".accionproyecto").val("");
  $("label[id=nameemplepro]").text(this.getAttribute("data-namepro"));
  var datacar,datafoto,valorc,valorf;
  datacar = this.getAttribute("data-mag")
  datafoto = this.getAttribute("data-fotocheck")
  
  if (datacar == 'SI') {
    valorc = 'true';
  }else{
    valorc = 'false';
  }
  if (datafoto == 'SI') {
    valorf = 'true';
  }else{
    valorf = 'false';
  }
  $(".codproy").text(this.getAttribute("data-codproye"));
  $(".dniproy").text(this.value);
  $("select[id=comboproyopcional]").val(this.getAttribute("data-proyectoid"));
  $("input[name=finiproy]").val(this.getAttribute("data-feinicio"));
  $("select[id=ccarnetmag]").val(valorc);
  $("select[id=combfotocheck]").val(valorf);
  $("textarea[name=comenobra]").val(this.getAttribute("data-comenta"));
  $(".editproyemple").modal("open");
}


viewproyclien = function(){
  if (document.getElementById("radiopro").checked) {
    document.getElementById("divfilcli").style.display = "none";
    document.getElementById("divfilpro").style.display = "block";
  }else{
    document.getElementById("divfilcli").style.display = "block";
    document.getElementById("divfilpro").style.display = "none";
  }
}







buscarproy = function(event){
  var input,filter,table,table2, tr,tr2, td, i;
  input = document.getElementById("txtbuscarproy");
  filter = input.value.toUpperCase();
  table = document.getElementById("table-detailproyecto");
  table2 = document.getElementById("table-indxobra");
  table3 = document.getElementById("table-detempxcli");
  table4 = document.getElementById("table-detindxcli");
  tr = table.getElementsByTagName("tr");
  tr2 = table2.getElementsByTagName("tr");
  tr3 = table3.getElementsByTagName("tr");
  tr4 = table4.getElementsByTagName("tr");

  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = ""; 
      } else {
        tr[i].style.display = "none";
      }
    }
  }
  for (i = 0; i < tr2.length; i++) {
    td = tr2[i].getElementsByTagName("td")[1];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr2[i].style.display = ""; 
      } else {
        tr2[i].style.display = "none";
      }
    }
  }
  for (i = 0; i < tr3.length; i++) {
    td = tr3[i].getElementsByTagName("td")[1];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr3[i].style.display = ""; 
      } else {
        tr3[i].style.display = "none";
      }
    }
  }

  for (i = 0; i < tr4.length; i++) {
    td = tr4[i].getElementsByTagName("td")[1];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr4[i].style.display = ""; 
      } else {
        tr4[i].style.display = "none";
      }
    }
  }

}





limp_asigobrero = function(){
  $(".finiobra").val("");
  $("#table-lpersobra").find("tr:not(:first)").remove();
}

limp_induccion = function(){
$("input[name=finduccion]").val("");
$("input[name=fcadinduccion]").val("");
$("input[name=estinduccion]").val("");
$("textarea[name=cominduccion]").val("");
}