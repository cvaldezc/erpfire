   var cod = '';
   var m = '';
   var y = '';
  $(document).ready(function() {
  $('.collapsible').collapsible();

    $('#tbldetailscuenta td.colesta').each(function(){
    $(this).css('font-weight','bold');
    console.log($(this).text());
    if ($(this).text() == 'ACTIVO') {
      $(this).css('background-color','#aed581');
      $(this).css('color','#aed581');
    }else{
      $(this).css('background-color','#ef9a9a');
      $(this).css('color','#ef9a9a');
    }});

    $('#tabldetailssusp td.colestado').each(function(){
    $(this).css('font-weight','bold');
    if ($(this).text() == 'ACTIVO') {
      $(this).css('background-color','#aed581');
      $(this).css('color','#aed581');
    }else{
      $(this).css('background-color','#ef9a9a');
      $(this).css('color','#ef9a9a');
    }});

  $('.datepicker').pickadate({selectYears: 10,selectMonths: true,container: 'body',yearRange: "1950:2020",format: 'yyyy-mm-dd'});

  $('.datepi').pickadate({
    selectYears: 140,
    selectMonths: true,
    container: 'body',
    format: 'yyyy-mm-dd'});
  
  $('select').material_select();
  $('.modal').modal();
  $('ul.tabs').tabs();
  $("input[name=txtbuscar]").on("keyup", buscarempleado);
  $("input[name=txtbuscarexa]").on("keyup", buscarexamen);
  $("input[name=txtbuscardoc]").on("keyup", buscardoc);


  

  //ENVIA DATA PARA GUARDAR O GUARDAR EDICION
  $(document).on("click", "button[name=btnopennewemple]", sendata);
  $(document).on("click", "button[name=btncuenta]", sendatacuenta);

  $(document).on("click", "button[id=btnidcuenta]", openlistcuenta);
  $(document).on("click", "button[id=btnidtelef]", openlisttelefono);
  $(document).on("click", "button[id=btnidestudios]", openlistestudio);
  $(document).on("click", "button[id=btnidsusp]", openlistsuspension);
  $(document).on("click", "button[id=btnidobra]", openlistobra);
  $(document).on("click", "button[id=btnidinduccion]", openlistinduccion);
  $(document).on("click", "button[id=btnidexadoc]", openlistexadoc);
  $(document).on("click", "button[id=btnidsegsoc]", openlistsegsocial);
  $(document).on("click", "button[id=btnidfamilia]", openlistfamilia);
  $(document).on("click", "button[id=btnidexplab]", openlistexplab);
  $(document).on("click", "button[id=btnidmedic]", openlistmedic);
  $(document).on("click", "button[id=btnidemerg]", openlistemerg);
  $(document).on("click", "button[id=btnidfamicr]", openlistfamicr);

  $(document).on("click", "button[id=btnempexa]", openlistempexa);
  $(document).on("click", "button[id=btnempdoc]", openlistempdoc);

  $(document).on("click", "button[name=btntelefono]", sendatatelefono);
  $(document).on("click", "button[name=btnestudio]", sendataestudio);
  $(document).on("click", "button[name=btnsuspension]", sendatasuspension);
  $(document).on("click", "button[name=btnproyecto]", sendataproyecto);
  // $(document).on("click", "button[name=btninduccion]", sendatainduccion);
  $(document).on("click", "button[name=btnepps]", sendataepps);
  $(document).on("click", "button[name=btnexamen]", sendataexamen);
  $(document).on("click", "button[name=btndocumento]", sendatadocumento);
  $(document).on("click", "button[name=btnfamilia]", sendatafamilia);
  $(document).on("click", "button[name=btnexplab]", sendataexplaboral);
  $(document).on("click", "button[name=btnmedic]", sendatamedic);
  $(document).on("click", "button[name=btnemerg]", sendataemergencia);
  $(document).on("click", "button[name=btnfamicr]", sendatafamicr);
  $(document).on("click", "button[name=nbtndardebaja]", sendatamotivren);
  
  //ELIMINACIONES
  $(document).on("click", "button.btndelphone", delphone);
  $(document).on("click", "button.btndelcuenta", delcuenta);
  $(document).on("click", "button.btndelest", delestudio);
  $(document).on("click", "button.btndelsuspension", delsuspension);
  $(document).on("click", "button.btndelexamen", delexamen);
  $(document).on("click", "button.btndeldocumento", deldocumento);
  // $(document).on("click", "button.btndelproyecto", delproyecto);
  $(document).on("click", "button.btndelepps", delepps);
  // $(document).on("click", "button.btndelinduccion", delinduccion);
  $(document).on("click", "button.btndelregsal", delregimensalud);
  $(document).on("click", "button.btndelregpens", delregimenpension);
  $(document).on("click", "button.btndelcobsal", delcobsalud);
  $(document).on("click", "button.btndelfamilia", delfamilia);
  $(document).on("click", "button.btndelexplab", delexplab);
  $(document).on("click", "button.btndelmedic", delmedic);
  $(document).on("click", "button.btndelemerg", delemerg);
  $(document).on("click", "button.btndelfamicr", delfamicr);

  

  $(".btnshowedit").click(showeditEmployee);
  $(document).on("click", "button.btn-editphone", showeditphone);
  $(document).on("click", "button.btn-editcuenta", showeditcuenta);
  $(document).on("click", "button.btn-editestudios", showeditestudios);
  $(document).on("click", "button.btn-editsuspension", showeditsuspension);
  // $(document).on("click", "button.btn-editproyecto", showeditproyecto);
  // $(document).on("click", "button.btn-editinduccion", showeditinduccion);
  $(document).on("click", "button.btn-editepps", showeditepps);
  $(document).on("click", "button.btn-editexamen", showeditexamen);
  $(document).on("click", "button.btn-editdocumento", showeditdocumento);
  $(document).on("click", "button.btn-editregsalud", showeditregsalud);
  $(document).on("click", "button.btn-editregpens", showeditregpens);
  $(document).on("click", "button.btn-editcobsal", showeditcobsal);
  $(document).on("click", "button.btn-editfamilia", showeditfamilia);
  $(document).on("click", "button.btn-editexplab", showeditexplab);
  $(document).on("click", "button.btn-editmedic", showeditmedic);
  $(document).on("click", "button.btn-editemerg", showeditemerg);
  $(document).on("click", "button.btn-editfamicr", showeditfamicr);

  $(document).on("click", "button.btnshowcambest", cambestcuenta);
  $(document).on("click", "button.btnfinsusp", finsuspension);

  

  $(".btnsavetelef").click(function() { save_or_edit_telefono();});
  $(".btnsavecuenta").click(function() { save_or_edit_cuenta(); });
  $(".btnsaveestudio").click(function() { save_or_edit_estudio(); });
  $(".btnsavesuspension").click(function() { save_or_edit_suspension(); });
  $(".btnsaveemple").click(function() { save_or_edit_empleado(); });
  $(".btnsavesegsocial").click(function() { save_segsocial(); });

  $(".btnsaveep").click(function() { save_or_edit_epps(); });
  $(".btnsaveeditexamen").click(function() { save_or_edit_examen(); });
  $(".btnsaveeditdoc").click(function() { save_or_edit_documento(); });
  $(".btnsaveeditregsalud").click(function() { save_edit_regsalud(); });
  $(".btnsaveeditregpensionario").click(function() { save_edit_regpensionario(); });
  $(".btnsaveeditcobsalud").click(function() { save_edit_cobsalud(); });
  $(".btnsavefamilia").click(function() { save_or_edit_familia(); });
  $(".btnsaveexplab").click(function() { save_or_edit_explab(); });
  $(".btnsavemedic").click(function() { save_or_edit_medic(); });
  $(".btnsaveemerg").click(function() { save_or_edit_emerg(); });
  $(".btnsavefamicr").click(function() { save_or_edit_famicr(); });
  $(".btnsavemotrenuncia").click(function() { save_mot_renuncia(); });


  $(document).on("click", ".btnshoweditinduccion", listInduccion);
  //CALCULOS
  $(".btncalcular").click(calcularliq);
  


  $(".btnopennewemple").click(function() { opennewemple(); });
  $(".btnnewcuenta").click(function() { opennewcuenta(); });
  $(".btnnewtelefono").click(function() { opennewtelefono(); });
  $(".btnnewestudio").click(function() { opennewestudio(); });
  $(".btnnewsuspension").click(function() { opennewsuspension(); });
  $(".btnnewproyecto").click(function() { opennewproyecto(); });
  $(".btnnewepps").click(function() { opennewepps(); });
  $(".btnnewexamen").click(function() { opennewexamen(); });
  $(".btnnewdocumento").click(function() { opennewdocumento(); });
  $(".btnnewsegsocial").click(function() { opennewsegsocial(); });
  // $(document).on("click", "button.btnaddinduccion", opennewinduccion);
  $(".btnnewfamilia").click(function() { opennewfamilia(); });
  $(".btnnewexplab").click(function() { opennewexplaboral(); });
  $(".btnnewmedic").click(function() { opennewmedic(); });
  $(".btnnewemerg").click(function() { opennewemerg(); });
  $(".btnnewfamicr").click(function() { opennewfamicr(); });
  $(".btndardebaja").click(function() { opennewmotren(); });


  //ultimo rrhh

  //rrhh
  $("#comboproyecto").chosen({
  allow_single_deselect:true,
  width: '100%'});

  ////////////////
});







finsuspension = function(){
  var btn;
  btn = this;
  swal({
    title: "Finalizar Suspension?",
    text: "Desea Finalizar la suspension?",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dd6b55",
    confirmButtonText: "Si, Cambiar!",
    cancelButtonText: "No, Cancelar",
    closeOnConfirm: true,
    closeOnCancel: true
  }, function(isConfirm) {
    var data;
    if (isConfirm) {
      data = new Object;
      data.finsusp = true;
      data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
      data.dni = btn.value;
      data.estado = 'INACTIVO';
      data.codfinsusp = btn.getAttribute("data-codfinsusp");
      $.post("/rrhh/empleado/suspension/", data, function(response) {
        if (response.status) {
          listSuspension();
          Materialize.toast('Suspension Finalizada', 2000, 'rounded');
        } else {
          swal("Error", "Error al Finalizar Suspension", "warning");
        }
      });
    }
  }); 
}

cambestcuenta = function(){
  var btn;
  btn = this;
  swal({
    title: "Cambiar estado?",
    text: "Desea Cambiar estado de la cuenta?",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dd6b55",
    confirmButtonText: "Si, Cambiar!",
    cancelButtonText: "No, Cancelar",
    closeOnConfirm: true,
    closeOnCancel: true
  }, function(isConfirm) {
    var data;
    if (isConfirm) {
      data = new Object;
      data.cambestadocuenta = true;
      data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
      data.dni = btn.value;
      data.cmbnumcuenta = btn.getAttribute("data-cmbnumcuenta");
      if (btn.getAttribute('data-estcuenta') == 'ACTIVO') {
      data.inactivo = 'INACTIVO';
      }else{
      data.inactivo = 'ACTIVO';
      }
      $.post("/rrhh/empleado/cuentacorriente/", data, function(response) {
        if (response.status) {
          listcuenta();
          Materialize.toast('Estado de cuenta Cambiada', 2000, 'rounded');
        } else {
          swal("Error", "Error al cambiar estado", "warning");
        }
      });
    }
  });
}


calcularliq = function(){
  var mes,hora,grati,cts,bono;
  mes = $(".remunera").val();
  dia = mes/30;
  hora = dia/8;
  bono = mes*0.09;
  grati = (mes * 2) + bono;
  cts = mes;

  if(/^[a-zA-Z\s]*$/.test(mes) || mes ==""){
    Materialize.toast('Remuneracion Ingresada Incorrecta', 2500, 'rounded');
    return false
  }
  $(".costxhora").val(hora.toFixed(3));
  $(".grati").val(grati.toFixed(3));
  $(".cts").val(cts);
}

opennewmotren = function(){
  $(".addrenuncia").modal("open");
}


opennewfamicr = function(){
  $(".familiaicr").modal("open");
  limp_famicr();
}

opennewemerg = function(){
  $(".editemergencia").modal("open");
  limp_emergencia();
}

opennewmedic = function(){
  $(".editmedic").modal("open");
  limp_medic();
}

opennewexplaboral = function(){
  $(".editexplaboral").modal("open");
  limp_explab();
}

opennewfamilia = function(){
  $(".editfamilia").modal("open");
  limp_familia();
}


opennewsegsocial = function(){
var val= $(".segsoci").text();
if (val == "True") {
  $(".addsegsocial").modal("open");
  limp_segsocial();
}else{
  Materialize.toast('Debe editar "Estado Planilla" del Empleado', 4000, 'rounded')
  return false;
}
}

opennewdocumento = function(){
  $(".editdocemple").modal("open");
  limp_documento();
}

opennewexamen = function(){
  document.getElementById("divfcad").style.display = 'none';
  document.getElementById("divfileexa").style.display = 'none';
  $(".editexaemple").modal("open");
  limp_examen();
}



opennewepps = function(){
 document.getElementById("divfechrec").style.display = 'none';
 $(".editeppsemple").modal("open"); 
 limp_epps();
}

opennewproyecto = function(){
  $(".editproyemple").modal("open");
  document.getElementById("divselect").style.display = 'block';
  document.getElementById("divselectopcional").style.display = 'none';
  limp_proyecto();
}


opennewsuspension = function(){
  $(".editsuspension").modal("open");
  limp_suspension();
}

opennewemple = function(){
  document.getElementById("dni").removeAttribute("readonly");
  $(".editemple").modal("open");
  limp_empleado();
}
opennewcuenta = function(){
  document.getElementById('costoxhora').readOnly = true;
  document.getElementById('gratificacion').readOnly = true;
  document.getElementById('cts').readOnly = true;
  $(".editcuentaemple").modal("open");
  limp_cuenta();
}
opennewtelefono = function(){
  $(".ed").modal("open");
  limp_telefono();
} 

opennewestudio = function(){
  $(".editestudioemple").modal("open");
  limp_estudio();
}



openlistsegsocial = function(){
  $(".nameemplesegsoc").text(this.getAttribute("data-namesegsoc"))
  $(".dnisegsocial").text(this.getAttribute("data-segsocialdni"))
  $(".segsoci").text(this.getAttribute("data-estseg"))
  var codsegsoc = $(this).attr("data-segsocialdni");
  cod = codsegsoc;
  listsegsocial();
  $(".editsegsocial").modal("open");
}


openlistfamilia = function(){
  $(".nameemplefam").text(this.getAttribute("data-namefam"))
  $(".dniempleadofam").text(this.getAttribute("data-familiadni"))

  var codfam = $(this).attr("data-familiadni");
  cod = codfam;
  listfamilia();
  $(".editfam").modal("open");
}

openlistexplab = function(){
  $(".nameempleexplab").text(this.getAttribute("data-nameexplab"))
  $(".dniexplab").text(this.getAttribute("data-explabdni"))
  var codexplab = $(this).attr("data-explabdni");
  cod = codexplab;
  listexplab();
  $(".editexplab").modal("open");
}

openlistmedic = function(){
  var codmedic = $(this).attr("data-medicdni");
  $(".dnimedic").text(this.getAttribute("data-medicdni"))
  $(".namemedic").text(this.getAttribute("data-medicname"))
  cod = codmedic;
  listmedic();
  $(".listmedic").modal("open");
}
openlistemerg = function(){
  var codemerg = $(this).attr("data-emergdni");
  $(".dniemerg").text(this.getAttribute("data-emergdni"))
  $(".nameemergencia").text(this.getAttribute("data-emergname"))
  cod = codemerg;
  listemerg();
  $(".listemerg").modal("open");
}

openlistfamicr = function(){
  var codfamicr = $(this).attr("data-famicrdni");
  $(".dnifamicr").text(this.getAttribute("data-famicrdni"))
  $(".namefamicr").text(this.getAttribute("data-famicrname"))
  cod = codfamicr;
  listfamicr();
  $(".listfamicr").modal("open");
}

openlistempdoc = function(){
  listempdoc();
}

openlistempexa = function(){
  listempexamen();
}



listempdoc = function(){
  var data,id;
  id=$("select[id=coempdoc]").val();
  console.log(id);
  if (id !== "") {
    data = {
      codlisdoc: id,
      lempdoc: true,
    };
    $.getJSON("", data, function(response) {
        var $tb, template, x;
      if (response.status) {
        if (response.lempdoc == false) {
          Materialize.toast('No existe personal con el documento seleccionado',2500,'rounded');
          return false;
        }else{
        $('.tamlistdoc').text(response.lempdoc.length);
        $('.tittledoc').text(response.tipodoc);
        document.getElementById("cantempdoc").style.display = 'block';
        document.getElementById("table-detaildocumento").style.display = 'block';
        $tb = $("table.table-detaildocumento > tbody");
        $tb.empty();
        template = "<tr><td style=\"text-align: center;\">{{ counter }}</td><td style=\"text-align: center;\">{{ apellid }}, {{ nombr }}</td><td style=\"text-align: center;\" class=\"fca\">{{ fcaduci }}</td><td style=\"text-align: center;\">{{ cond }}</td></tr>";
        for (x in response.lempdoc) {
        response.lempdoc[x].item = parseInt(x) + 1;
        $tb.append(Mustache.render(template, response.lempdoc[x]));
        }
        changecolortd('td.fca');
      } 
    }
    });
  }
}

listempexamen = function(){
  var data,id;
  id=$("select[id=coempexamen]").val();
  console.log(id);
  if (id !== "") {
    data = {
      codlisexa: id,
      lempexamen: true,
    };
    $.getJSON("", data, function(response) {
        var $tb, template, x;

      if (response.status) {
        console.log(response.lempexa);
        if (response.lempexa == false) {
          Materialize.toast('No existe personal con el Examen Seleccionado',2500,'rounded');
          return false;
        }else{
        $('.tamlistexa').text(response.lempexa.length);
        $('.tittleexa').text(response.tipoexa);
        document.getElementById("cantempexa").style.display = 'block';
        document.getElementById("table-detailsexamenes").style.display = 'block';
        $tb = $("table.table-detailsexamenes > tbody");
        $tb.empty();
        template = "<tr><td style=\"text-align: center;\">{{ count }}</td><td>{{ ape }}, {{ nomb }}</td><td style=\"text-align: center;\">{{ lugar }}</td><td style=\"text-align: center;\">{{ fini }}</td><td style=\"text-align: center;\" class=\"fechacad\">{{ fcad }}</td><td style=\"text-align: center;\">{{ apt }}</td></tr>";
        for (x in response.lempexa) {
        response.lempexa[x].item = parseInt(x) + 1;
        $tb.append(Mustache.render(template, response.lempexa[x]));
        }
        changecolortd('td.fechacad');
        }
    }
    });
  }
}

listfamicr = function(){
  var data,id;
  id=cod;
  console.log(id);
  if (id !== "") {
    data = {
      employeeidfamicr: id,
      listafamicr: true,
    };
    $.getJSON("/rrhh/empleado/segsocial/", data, function(response) {
        var $tb, template, x;
      if (response.status) {
        $tb = $("table.table-detailsfamicr > tbody");
        $tb.empty();
        template = "<tr><td style=\"text-align: center;\">{{ nombres }}</td><td style=\"text-align: center;\">{{ parent }}</td><td style=\"text-align: center;\">{{ areatrab }}</td><td style=\"text-align: center;\"><button type=\"button\" class=\"btn btn-editfamicr\" data-namefamicr=\"{{ namefamicr }}\" value=\"{{ empdni_id }}\" data-famicrname=\"{{ nombres }}\" data-famicrparent=\"{{ parent }}\" data-famicrareatrab=\"{{ areatrab }}\"  data-codfamicr=\"{{ id }}\" ><i class=\"fa fa-pencil\"></i><span class=\"glyphicon glyphicon-edit\"></span></button></td><td class=\"text-center\"><button type=\"button\" class=\"btn red btndelfamicr\" value=\"{{ empdni_id }}\" data-delfamicr=\"{{ id }}\"=><i class=\"fa fa-trash-o\"></i></button></td></tr>";
        for (x in response.lfamicr) {
        response.lfamicr[x].item = parseInt(x) + 1;
        $tb.append(Mustache.render(template, response.lfamicr[x]));
      } 
    }
    });
  }
}

listemerg = function(){
  var data,id;
  id=cod;
  console.log(id);
  if (id !== "") {
    data = {
      employeeidemerg: id,
      listaemerg: true,
    };
    $.getJSON("/rrhh/empleado/segsocial/", data, function(response) {
        var $tb, template, x;
      if (response.status) {
        $tb = $("table.table-detailsemerg > tbody");
        $tb.empty();
        template = "<tr><td style=\"text-align: center;\">{{ nombres }}</td><td style=\"text-align: center;\">{{ direccion }}</td><td style=\"text-align: center;\">{{ telefono }}</td><td style=\"text-align: center;\">{{ parentesco }}</td><td style=\"text-align: center;\"><button type=\"button\" class=\"btn btn-editemerg\" data-nameemerg=\"{{ nameemerg }}\" value=\"{{ empdni_id }}\" data-emergname=\"{{ nombres }}\" data-emergdirec=\"{{ direccion }}\" data-emergtel=\"{{ telefono }}\"  data-emergparent=\"{{ parentesco }}\" data-codemerg=\"{{ id }}\" ><i class=\"fa fa-pencil\"></i><span class=\"glyphicon glyphicon-edit\"></span></button></td><td class=\"text-center\"><button type=\"button\" class=\"btn red btndelemerg\" value=\"{{ empdni_id }}\" data-delemerg=\"{{ id }}\"=><i class=\"fa fa-trash-o\"></i></button></td></tr>";
        for (x in response.lemerg) {
        response.lemerg[x].item = parseInt(x) + 1;
        $tb.append(Mustache.render(template, response.lemerg[x]));
      } 
    }
    });
  }
}

listmedic = function(){
  var data,id;
  id=cod;
  console.log(id);
  if (id !== "") {
    data = {
      employeeidmedic: id,
      listamedic: true,
    };
    $.getJSON("/rrhh/empleado/segsocial/", data, function(response) {
        var $tb, template, x;
      if (response.status) {
        $tb = $("table.table-detailsmedic > tbody");
        $tb.empty();
        template = "<tr><td>{{ tipo }}</td><td style=\"text-align: center;\">{{ descripcion }}</td><td style=\"text-align: center;\">{{ tiempo }}</td><td style=\"text-align: center;\"><button type=\"button\" class=\"btn btn-editmedic\" data-namemedic=\"{{ namemedic }}\" value=\"{{ empdni_id }}\" data-descmedic=\"{{ descripcion }}\" data-medictipo=\"{{ tipo }}\" data-medictime=\"{{ tiempo }}\" data-mediccoment=\"{{ comentario }}\"  data-codmedic=\"{{ id }}\" ><i class=\"fa fa-pencil\"></i><span class=\"glyphicon glyphicon-edit\"></span></button></td><td class=\"text-center\"><button type=\"button\" class=\"btn red btndelmedic\" value=\"{{ empdni_id }}\" data-delmedic=\"{{ id }}\"=><i class=\"fa fa-trash-o\"></i></button></td></tr>";
        for (x in response.lmedic) {
        response.lmedic[x].item = parseInt(x) + 1;
        $tb.append(Mustache.render(template, response.lmedic[x]));
      } 
    }
    });
  }
}



listexplab = function(){
  var data,id;
  id=cod;
  console.log(id);
  if (id !== "") {
    data = {
      employeeidexplab: id,
      listexplab: true,
    };
    $.getJSON("/rrhh/empleado/estudios/", data, function(response) {
        var $tb, template, x;
      if (response.status) {
        $tb = $("table.table-detailsexplab > tbody");
        $tb.empty();
        template = "<tr><td style=\"text-align: center;\">{{ empresa }}</td><td style=\"text-align: center;\">{{ cargo }}</td><td style=\"text-align: center;\">{{ finicio }}</td><td style=\"text-align: center;\">{{ ffin }}</td><td style=\"text-align: center;\">{{ motivoretiro }}</td><td style=\"text-align: center;\"><button type=\"button\" class=\"btn btn-editexplab\" data-nameexplab=\"{{ nameexplab }}\" value=\"{{ empdni_id }}\" data-explabemp=\"{{ empresa }}\" data-explabcargo=\"{{ cargo }}\" data-explabfini=\"{{ finicio }}\" data-explabffin=\"{{ ffin }}\" data-explabduracion=\"{{ duracion }}\" data-explabret=\"{{ motivoretiro }}\" data-codexplab=\"{{ id }}\" ><i class=\"fa fa-pencil\"></i><span class=\"glyphicon glyphicon-edit\"></span></button></td><td class=\"text-center\"><button type=\"button\" class=\"btn red btndelexplab\" value=\"{{ empdni_id }}\" data-delexplab=\"{{ id }}\"=><i class=\"fa fa-trash-o\"></i></button></td></tr>";
        for (x in response.lexplab) {
        response.lexplab[x].item = parseInt(x) + 1;
        $tb.append(Mustache.render(template, response.lexplab[x]));
      } 
    }
    });
  }
}

listfamilia = function(){
  var data,id;
  id=cod;
  console.log(id);
  if (id !== "") {
    data = {
      employeeidfam: id,
      listfamilia: true,
    };
    $.getJSON("/rrhh/empleado/segsocial/", data, function(response) {
        var $tb, template, x;
      if (response.status) {
        $tb = $("table.table-detailsfam > tbody");
        $tb.empty();
        template = "<tr><td style=\"text-align: center;\">{{ nombres }}</td><td style=\"text-align: center;\">{{ parentesco }}</td><td style=\"text-align: center;\">{{ edad }}</td><td style=\"text-align: center;\">{{ fnac }}</td><td style=\"text-align: center;\"><button type=\"button\" class=\"btn btn-editfamilia\" data-name=\"{{ namefam }}\" value=\"{{ empdni_id }}\" data-namefam=\"{{ nombres }}\" data-parentfam=\"{{ parentesco }}\" data-edadfam=\"{{ edad }}\" data-fnacfam=\"{{ fnac }}\" data-codfamilia=\"{{ id }}\" ><i class=\"fa fa-pencil\"></i><span class=\"glyphicon glyphicon-edit\"></span></button></td><td class=\"text-center\"><button type=\"button\" class=\"btn red btndelfamilia\" value=\"{{ empdni_id }}\" data-delfam=\"{{ id }}\"=><i class=\"fa fa-trash-o\"></i></button></td></tr>";
        for (x in response.lfamilia) {
        response.lfamilia[x].item = parseInt(x) + 1;
        $tb.append(Mustache.render(template, response.lfamilia[x]));
      } 
    }
    });
  }
}


listsegsocial = function(){
  var data,id;
  id=cod;
  console.log(id);
  if (id !== "") {
    data = {
      idsegsocial: id,
      listsegsocial: true,
    };
    $.getJSON("/rrhh/empleado/segsocial/", data, function(response) {
      var $tb,$tb2,$tb3, template,template2,template3, x;
      if (response.status) {
        $tb = $("table.table-detailsregsalud > tbody");
        $tb2 = $("table.table-detailsregpensionario > tbody");
        $tb3 = $("table.table-detailscobsalud > tbody");
        $tb.empty();
        $tb2.empty();
        $tb3.empty();

        template = "<tr><td style=\"text-align: center;\">{{ regimen }}</td><td style=\"text-align: center;\">{{ finicioregsal }}</td><td style=\"text-align: center;\">{{ ffinregsal }}</td><td style=\"text-align: center;\">{{ entidad }}</td><td style=\"text-align: center;\"><button type=\"button\" class=\"btn btn-xs btn-link text-green btn-editregsalud\" data-nameregsalud=\"{{ nameregsal }}\" value=\"{{ empdni_id }}\" data-tiporegsalud=\"{{ regimen_id }}\" data-finiregsal=\"{{ finicioregsal }}\" data-ffinregsal=\"{{ ffinregsal }}\" data-regentidad=\"{{ entidad }}\" data-codregsal=\"{{ id }}\"><i class=\"fa fa-pencil\"></i><span class=\"glyphicon glyphicon-edit\"></span></button></td><td class=\"text-center\"><button type=\"button\" class=\"btn red btndelregsal\" value=\"{{ empdni_id }}\" data-delregsal=\"{{ id }}\"><i class=\"fa fa-trash-o\"></i></button></td></tr>";
        template2 = "<tr><td style=\"text-align: center;\">{{ regimenpens }}</td><td style=\"text-align: center;\">{{ finiregpens }}</td><td style=\"text-align: center;\">{{ ffinregpens }}</td><td style=\"text-align: center;\">{{ cuspp }}</td><td style=\"text-align: center;\">{{ vistasctr }}</td><td style=\"text-align: center;\"><button type=\"button\" class=\"btn btn-xs btn-link text-green btn-editregpens\" data-nameregpens=\"{{ nameregpens }}\" value=\"{{ empdni_id }}\" data-regpens=\"{{ regimenpens_id }}\" data-finiregpens=\"{{ finiregpens }}\" data-ffinregpens=\"{{ ffinregpens }}\" data-cuspp=\"{{ cuspp }}\" data-sctr=\"{{ sctr }}\"  data-codregpens=\"{{ id }}\"><i class=\"fa fa-pencil\"></i><span class=\"glyphicon glyphicon-edit\"></span></button></td><td class=\"text-center\"><button type=\"button\" class=\"btn red btndelregpens\" value=\"{{ empdni_id }}\" data-delregpens=\"{{ id }}\"><i class=\"fa fa-trash-o\"></i></button></td></tr>";
        template3 = "<tr><td style=\"text-align: center;\">{{ cobertura }}</td><td style=\"text-align: center;\">{{ finicobsal }}</td><td style=\"text-align: center;\">{{ ffincobsal }}</td><td style=\"text-align: center;\"><button type=\"button\" class=\"btn btn-xs btn-link text-green btn-editcobsal\" data-namecobsalud=\"{{ namecobsal }}\" value=\"{{ empdni_id }}\" data-cobsal=\"{{ cobertura_id }}\" data-finicobsal=\"{{ finicobsal }}\" data-ffincobsal=\"{{ ffincobsal }}\"  data-codcobsal=\"{{ id }}\"><i class=\"fa fa-pencil\"></i><span class=\"glyphicon glyphicon-edit\"></span></button></td><td class=\"text-center\"><button type=\"button\" class=\"btn red btndelcobsal\" value=\"{{ empdni_id }}\" data-delcobsal=\"{{ id }}\"><i class=\"fa fa-trash-o\"></i></button></td></tr>";
        
        for (x in response.lregsalud) {
          response.lregsalud[x].item = parseInt(x) + 1;
          $tb.append(Mustache.render(template, response.lregsalud[x]));
        }
        for (x in response.lregpens) {
          response.lregpens[x].item = parseInt(x) + 1;
          $tb2.append(Mustache.render(template2, response.lregpens[x]));
        }
        for (x in response.lcobsalud) {
          response.lcobsalud[x].item = parseInt(x) + 1;
          $tb3.append(Mustache.render(template3, response.lcobsalud[x]));
        }
      }
    });
  } 
}

openlistexadoc = function(){
  //EXAMEN
  $(".dniexa").text(this.getAttribute("data-exadocdni"))
  $(".nameempleexa").text(this.getAttribute("data-nameexadoc"))
  //DOCUMENTO
  $(".dnidoc").text(this.getAttribute("data-exadocdni"))
  $(".nameempledocu").text(this.getAttribute("data-nameexadoc"))
  var codexadoc = $(this).attr("data-exadocdni");
  cod = codexadoc;
  listexadoc();
  $(".editexadoc").modal("open");
}


listexadoc = function(){
  var data,id;
  id=cod;
  console.log(id);
  if (id !== "") {
    data = {
      idexado: id,
      listexadoc: true,
    };
    $.getJSON("/rrhh/empleado/documento/", data, function(response) {
      var $tb, $tb2, template, template2, x;
      if (response.status) {
        $tb = $("table.table-detailsexa > tbody");
        $tb2 = $("table.table-detailsdoc > tbody");
        $tb.empty();
        $tb2.empty();

        template = "<tr><td style=\"text-align: center;\">{{ tipoexa }}</td><td style=\"text-align: center;\">{{ lug }}</td><td style=\"text-align: center;\">{{ finicio }}</td><td style=\"text-align: center;\">{{ fcaduca }}</td><td style=\"text-align: center;\">{{ apt }}</td><td style=\"text-align: center;\"><button type=\"button\" class=\"btn btn-xs btn-link text-green btn-editexamen\" data-nameexa=\"{{ nameexa }}\" value=\"{{ empdni_id }}\" data-tipoexa=\"{{ tipoexa_id }}\" data-lugar=\"{{ lug_id }}\" data-fini=\"{{ finicio }}\" data-fcad=\"{{ fcaduca }}\" data-arch=\"{{ archi }}\" data-apt=\"{{ apt }}\" data-coment=\"{{ coment }}\" data-codexa=\"{{ codexa }}\"><i class=\"fa fa-pencil\"></i><span class=\"glyphicon glyphicon-edit\"></span></button></td><td class=\"text-center\"><button type=\"button\" class=\"btn red btndelexamen\" value=\"{{ empdni_id }}\" data-delarchiexa=\"{{ archi }}\" data-delexa=\"{{ codexa }}\"><i class=\"fa fa-trash-o\"></i></button></td></tr>";
        template2 = "<tr><td style=\"text-align: center;\">{{ namedocu }}</td><td style=\"text-align: center;\">{{ finicio }}</td><td style=\"text-align: center;\">{{ fcaduca }}</td><td style=\"text-align: center;\">{{ condic }}</td><td style=\"text-align: center;\">{{ obser }}</td><td style=\"text-align: center;\"><button type=\"button\" class=\"btn btn-xs btn-link text-green btn-editdocumento\" data-namedoc=\"{{ namedoc }}\" value=\"{{ empdni_id }}\" data-namedocu=\"{{ docu }}\" data-condic=\"{{ condic }}\" data-dfini=\"{{ finicio }}\" data-dfcad=\"{{ fcaduca }}\" data-docestado=\"{{ obser }}\" data-archidoc=\"{{ archidoc }}\" data-coddocu=\"{{ coddocu }}\"><i class=\"fa fa-pencil\"></i><span class=\"glyphicon glyphicon-edit\"></span></button></td><td class=\"text-center\"><button type=\"button\" class=\"btn red btndeldocumento\" value=\"{{ empdni_id }}\" data-delarchidoc=\"{{ archidoc }}\" data-deldoc=\"{{ coddocu }}\"><i class=\"fa fa-trash-o\"></i></button></td></tr>";
        
        for (x in response.lexamen) {
          response.lexamen[x].item = parseInt(x) + 1;
          $tb.append(Mustache.render(template, response.lexamen[x]));
        }
        for (x in response.ldocumento) {
        response.ldocumento[x].item = parseInt(x) + 1;
        $tb2.append(Mustache.render(template2, response.ldocumento[x]));
          // $(".editexadoc").modal("open");
        }
      }
      // $(".editexadoc").modal("open");
    });
  } 
}

openlistinduccion = function(){
  var codind = $(this).attr("data-idinduccion");
  cod = codind;
  listInduccion();
  $(".editinduc").modal("open");
}

listInduccion = function(){
  $(".proyid").text(this.value)
  var data,id;
  id=cod;
  console.log(id);
  if (id !== "") {
    data = {
      employeeidinduc: id,
      listinduccion: true,
    };
    $.getJSON("/rrhh/empleado/obra/", data, function(response) {
      var $tb, template, x;
      if (response.status) {
        $tb = $("table.table-detailsinduccion > tbody");
        $tb.empty();
        template = "<tr><td style=\"text-align: center;\">{{ fechinicio }}</td><td style=\"text-align: center;\">{{ fechcaduca }}</td><td style=\"text-align: center;\">{{ comentario }}</td><td style=\"text-align: center;\"><button type=\"button\" class=\"btn btn-xs btn-link text-green btn-editinduccion\"  value=\"{{ emplecampo_id }}\" data-finduccion=\"{{ fechinicio }}\" data-estinduccion=\"{{ estadoinduc }}\" data-fcadinduccion=\"{{ fechcaduca }}\" data-cominduccion=\"{{ comentario }}\" data-codind=\"{{ codind }}\"><i class=\"fa fa-pencil\"></i><span class=\"glyphicon glyphicon-edit\"></span></button></td><td class=\"text-center\"><button type=\"button\" class=\"btn red btndelinduccion\" value=\"{{ emplecampo_id }}\" data-delinduccion=\"{{ codind }}\"><i class=\"fa fa-trash-o\"></i></button></td></tr>";
        for (x in response.linduccion) {
        response.linduccion[x].item = parseInt(x) + 1;
        $tb.append(Mustache.render(template, response.linduccion[x]));
        // $(".editinduc").modal("open");
        }
      } 
    });
  }
}


openlistobra = function(){
  $(".dniepps").text(this.getAttribute("data-obradni"))
  $(".nameempleepps").text(this.getAttribute("data-nameobra"))
  $(".dniproy").text(this.getAttribute("data-obradni"))
  $(".nameemplepro").text(this.getAttribute("data-nameobra"))
  var codobra = $(this).attr("data-obradni");
  cod = codobra;
  listObra();
  $(".editobra").modal("open");
}

listObra = function(){
var data,id;
  id=cod;
  console.log(id);
  if (id !== "") {
    data = {
      employeeidobra: id,
      listobra: true,
    };
    $.getJSON("/rrhh/empleado/obra/", data, function(response) {
      var $tb, $tb3, template, template3, x;
      if (response.status) {
        $tb = $("table.table-detailsobra > tbody");
        $tb3 = $("table.table-detailsepps > tbody");
        $tb.empty();
        $tb3.empty();

        template = "<tr><td style=\"text-align: center; width: 250px;\">{{ proyecto_id }}</td><td style=\"text-align: center;\">{{ fechinicio }}</td><td style=\"text-align: center;\">{{ carnet }}</td><td style=\"text-align: center;\">{{ foto }}</td><td style=\"text-align: center;\"><button type=\"button\" class=\"btn btn-xs btn-link text-green btn-editproyecto\" data-namepro=\"{{ namepro }}\" value=\"{{ empdni_id }}\" data-proyectoid=\"{{ proy_id }}\" data-feinicio=\"{{ fechinicio }}\" data-mag=\"{{ carnet }}\" data-fotocheck=\"{{ foto }}\" data-comenta=\"{{ comentario }}\" data-codproye=\"{{ codemplecam }}\"><i class=\"fa fa-pencil\"></i><span class=\"glyphicon glyphicon-edit\"></span></button></td><td class=\"text-center\"><button type=\"button\" class=\"btn red btndelproyecto\" value=\"{{ empdni_id }}\" data-delproy=\"{{ codemplecam }}\"><i class=\"fa fa-trash-o\"></i></button></td><td class=\"text-center\"><button type=\"button\" style=\"border:none;color:blue;font-weight:bold;\" class=\"transparent btnaddinduccion\" name=\"btninduccion\" value=\"{{ codemplecam }}\" data-addinduc=\"btnnewinduccion\"><small>Añadir</small></button><button type=\"button\" style=\"border:none;color:blue;font-weight:bold;\" class=\"transparent btnshoweditinduccion\" id=\"btnidinduccion\" value=\"{{ codemplecam }}\" data-idinduccion=\"{{ codemplecam }}\" data-addinduc=\"btneditinduccion\"><small>Ver Lista</small></button></td></tr>";
        template3 = "<tr><td style=\"text-align: center;\">{{ articulo }}</td><td style=\"text-align: center;\">{{ fechentrega }}</td><td style=\"text-align: center;\">{{ fechrecepcion }}</td><td style=\"text-align: center;\"><button type=\"button\" class=\"btn btn-xs btn-link text-green btn-editepps\" data-nameepps=\"{{ nameepps }}\" value=\"{{ empdni_id }}\" data-epps=\"{{ articulo }}\" data-fentrega=\"{{ fechentrega }}\" data-frecep=\"{{ fechrecepcion }}\" data-comenepps=\"{{ comentario }}\" data-codep=\"{{ codep }}\"><i class=\"fa fa-pencil\"></i><span class=\"glyphicon glyphicon-edit\"></span></button></td><td class=\"text-center\"><button type=\"button\" class=\"btn red btndelepps\" value=\"{{ empdni_id }}\" data-delepps=\"{{ codep }}\"><i class=\"fa fa-trash-o\"></i></button></td></tr>";
        
        for (x in response.lobra) {
          response.lobra[x].item = parseInt(x) + 1;
          $tb.append(Mustache.render(template, response.lobra[x]));
          // $(".editobra").modal("open");
        }
        for (x in response.lepps) {
        response.lepps[x].item = parseInt(x) + 1;
        $tb3.append(Mustache.render(template3, response.lepps[x]));
        // $(".editobra").modal("open");
        }
      } 
    });
  } 
}

openlistsuspension = function(){
  $(".dniempleado").text(this.getAttribute("data-suspdni"))
  $(".nameemplesusp").text(this.getAttribute("data-suspname"))
  var codsus = $(this).attr("data-suspdni");
  cod = codsus;
  listSuspension();
  $(".editsusp").modal("open");
}


listSuspension = function(){
  var data,id;
  id=cod;
  console.log(id);
  if (id !== "") {
    data = {
      employeeidsusp: id,
      lisuspension: true,
    };
    $.getJSON("/rrhh/empleado/suspension/", data, function(response) {
        var $tb, template, x;
      if (response.status) {
        $tb = $("table.table-detailssusp > tbody");
        $tb.empty();
        template = "<tr><td style=\"text-align: center;\">{{ motivo }}</td><td style=\"text-align: center;\">{{ fechinicio }}</td><td style=\"text-align: center;\">{{ fechfin }}</td><td class=\"colestado\" style=\"text-align: center;\">{{ estado }}</td><td style=\"text-align: center;\"><button type=\"button\" class=\"btn btn-xs btn-link text-green btn-editsuspension\" data-namesusp=\"{{ namesusp }}\" value=\"{{ empdni_id }}\" data-archisusp=\"{{ archisusp }}\" data-motivo=\"{{ suspension_id }}\" data-finicio=\"{{ fechinicio }}\" data-ffin=\"{{ fechfin }}\" data-coment=\"{{ comentario }}\" data-codsusp=\"{{ id }}\"><i class=\"fa fa-pencil\"></i><span class=\"glyphicon glyphicon-edit\"></span></button></td><td class=\"text-center\"><button type=\"button\" class=\"btn red btndelsuspension\" value=\"{{ empdni_id }}\" data-delarchisusp=\"{{ archisusp }}\" data-delsusp=\"{{ id }}\"><i class=\"fa fa-trash-o\"></i></button><td><button type=\"button\" style=\"border:none;color:blue;font-weight:bold;\" class=\"transparent btnfinsusp\" value=\"{{ empdni_id }}\" data-codfinsusp=\"{{ id }}\" id=\"btnfinsusp\"><small>Finalizar</small></button></td></td></tr>";
        for (x in response.lsuspension) {
        response.lsuspension[x].item = parseInt(x) + 1;
        $tb.append(Mustache.render(template, response.lsuspension[x]));
      } 
    }
    });
  }
}
openlistestudio = function(){
  $(".dniempleado").text(this.getAttribute("data-estdni"))
  $(".nameempleest").text(this.getAttribute("data-nameest"))
  var codest = $(this).attr("data-estdni");
  cod = codest;
  listEstudios();
  $(".editest").modal("open");
}

listEstudios = function(){
  var data,id;
  id=cod;
  console.log(id);
  if (id !== "") {
    data = {
      employeeidest: id,
      liestudios: true,
    };
    $.getJSON("/rrhh/empleado/estudios/", data, function(response) {
        var $tb, template, x;
      if (response.status) {
        $tb = $("table.table-detailsest > tbody");
        $tb.empty();
        template = "<tr><td style=\"text-align: center;\">{{ institucion }}</td><td style=\"text-align: center;\">{{ tipoinst }}</td><td style=\"text-align: center;\">{{ carrera }}</td><td style=\"text-align: center;\">{{ estudioperu }}</td><td style=\"text-align: center;\">{{ anoEgreso }}</td><td style=\"text-align: center;\">{{ situacioneduc }}</td><td style=\"text-align: center;\">{{ regimen }}</td><td style=\"text-align: center;\"><button type=\"button\" class=\"btn btn-xs btn-link text-green btn-editestudios\" data-nameest=\"{{ nameest }}\" value=\"{{ empdni_id }}\" data-inst=\"{{ institucion }}\" data-tipoinst=\"{{ tipoinstitucion_id }}\" data-carrera=\"{{ carrera }}\" data-estperu=\"{{ estpais }}\" data-aegreso=\"{{ anoEgreso }}\" data-siteduc=\"{{ situacioneduc }}\" data-regimen=\"{{ regimen }}\" data-finicioest =\"{{ fechini }}\" data-ffinest =\"{{ fechfin }}\"  data-codestudio=\"{{ id }}\" ><i class=\"fa fa-pencil\"></i><span class=\"glyphicon glyphicon-edit\"></span></button></td><td class=\"text-center\"><button type=\"button\" class=\"btn red btndelest\" value=\"{{ empdni_id }}\" data-delestudio=\"{{ id }}\" ><i class=\"fa fa-trash-o\"></i></button></td></tr>";
        for (x in response.lestudios) {
        response.lestudios[x].item = parseInt(x) + 1;
        $tb.append(Mustache.render(template, response.lestudios[x]));
      } 
    }
    });
  }
}


openlistcuenta = function(){
  $(".dnicuenta").text(this.getAttribute("data-cuentadni"))
  $(".nameemplecu").text(this.getAttribute("data-namecuenta"))
  var codc = $(this).attr("data-cuentadni");
  cod = codc;
  listcuenta();
  $(".editcuent").modal("open");
}

listcuenta = function(){
  var data,id;
  id = cod;
  console.log(id);
  if (id !== "") {
    data = {
      employeeidcuenta: id,
      licuenta: true,
    };
    $.getJSON("/rrhh/empleado/cuentacorriente/", data, function(response) {
        var $tb, template, x;
      if (response.status) {
        $tb = $("table.table-detailscuenta > tbody");
        $tb.empty();
        template = "<tr><td style=\"text-align: center;\" class=\"colnumcuenta\">{{ cuenta }}</td><td style=\"text-align: center;\">{{ tipodepago }}</td><td style=\"text-align: center;\">{{ remuneracion }}</td><td style=\"text-align: center;\">{{ gratificacion }}</td><td style=\"text-align: center;\">{{ cts }}</td><td style=\"text-align: center;\">{{ costxhora }}</td><td style=\"text-align: center;\">{{ tipocontrato }}</td><td style=\"text-align: center;\" class=\"estcuenta\">{{ estado }}</td><td style=\"text-align: center;\"><button type=\"button\" class=\"btn btn-xs btn-link text-green btn-editcuenta\" data-namecuen=\"{{ namecuen }}\" value=\"{{ empdni_id }}\" data-dnicuenta=\"{{ empdni_id }}\" data-numcuenta=\"{{ cuenta }}\" data-tipopago=\"{{ tipodepago_id }}\" data-estado=\"{{ estado }}\" data-remuneracion=\"{{ remuneracion }}\" data-grati=\"{{ gratificacion }}\" data-cts=\"{{ cts }}\" data-costxhora=\"{{ costxhora }}\" data-tipocontrato=\"{{ tipocontrato_id }}\" data-cod=\"{{ id }}\"><i class=\"fa fa-pencil\"></i><span class=\"glyphicon glyphicon-edit\"></span></button></td><td class=\"text-center\"><button type=\"button\" class=\"btn red btndelcuenta\" value=\"{{ empdni_id }}\" data-delcuenta=\"{{ cuenta }}\"><i class=\"fa fa-trash-o\"></i></button></td><td class=\"text-center\"><button type=\"button\" style=\"border:none;color:blue;font-weight:bold;\" class=\"transparent btnshowcambest\"  value=\"{{ empdni_id }}\" data-cmbnumcuenta=\"{{ id }}\" data-estcuenta=\"{{ estado }}\" ><small>Cambiar de Estado</small></button></td></tr>";
        for (x in response.lcuenta) {
        response.lcuenta[x].item = parseInt(x) + 1;
        $tb.append(Mustache.render(template, response.lcuenta[x]));
      } 
    }
    });
  }
}

openlisttelefono = function(){
  $(".dniempleadotel").text(this.getAttribute("data-telefdni"))
  $(".nameemple").text(this.getAttribute("data-nametel"))
  var codt = $(this).attr("data-telefdni");
  cod = codt;
  listTelef();
  $(".edittelef").modal("open");
}

listTelef = function(){
  var data,id;
  id=cod;
  console.log(id);
  if (id !== "") {
    data = {
      employeeidphone: id,
      listphone: true,
    };
    $.getJSON("/rrhh/empleado/phone/", data, function(response) {
        var $tb, template, x;
      if (response.status) {
        $tb = $("table.table-detailsphone > tbody");
        $tb.empty();
        template = "<tr><td style=\"text-align: center;\">{{ phone }}</td><td style=\"text-align: center;\">{{ descripcion }}</td><td style=\"text-align: center;\"><button type=\"button\" class=\"btn btn-editphone\" value=\"{{ empdni_id }}\" data-nametel=\"{{ nametel }}\" data-phone=\"{{ phone }}\" data-des=\"{{ descripcion }}\" data-codtelefono=\"{{ id }}\" ><i class=\"fa fa-pencil\"></i><span class=\"glyphicon glyphicon-edit\"></span></button></td><td class=\"text-center\"><button type=\"button\" class=\"btn red btndelphone\" value=\"{{ empdni_id }}\" data-delphone=\"{{ phone }}\"=><i class=\"fa fa-trash-o\"></i></button></td></tr>";
        for (x in response.listaphone) {
        response.listaphone[x].item = parseInt(x) + 1;
        $tb.append(Mustache.render(template, response.listaphone[x]));
      } 
    }
    });
  }
}

showeditfamicr = function(){
$(".accionfamicr").val("");
$(".codfamicr").text(this.getAttribute("data-codfamicr"));
$("input[name=namefamicr]").val(this.getAttribute("data-famicrname"));
$("input[name=parentfamicr]").val(this.getAttribute("data-famicrparent"));
$("input[name=areatrabfamicr]").val(this.getAttribute("data-famicrareatrab"));
$(".familiaicr").modal("open");
}


showeditemerg = function(){
$(".accionemerg").val("");
$(".codemerg").text(this.getAttribute("data-codemerg"));
$("input[name=nameemerg]").val(this.getAttribute("data-emergname"));
$("input[name=direcemerg]").val(this.getAttribute("data-emergdirec"));
$("input[name=telemerg]").val(this.getAttribute("data-emergtel"));
$("input[name=parentemerg]").val(this.getAttribute("data-emergparent"));
$(".editemergencia").modal("open");
}


showeditmedic = function (){
$(".accionmedic").val("");
$(".codmedic").text(this.getAttribute("data-codmedic"));
$("input[name=tipomedic]").val(this.getAttribute("data-medictipo"));
$("input[name=descmedic]").val(this.getAttribute("data-descmedic"));
$("input[name=timemedic]").val(this.getAttribute("data-medictime"));
$("textarea[name=txtcommedic]").val(this.getAttribute("data-mediccoment"));
$(".editmedic").modal("open");
}

showeditexplab = function(){
  $(".accionexplab").val("");
  $(".codexplab").text(this.getAttribute("data-codexplab"));
  $("label[id=nameempleexplab]").text(this.getAttribute("data-nameexplab"));
  $(".dniexplab").text(this.value);

  $("input[name=empexplab]").val(this.getAttribute("data-explabemp"));
  $("input[name=cargoexplab]").val(this.getAttribute("data-explabcargo"));
  $("input[name=iniexplab]").val(this.getAttribute("data-explabfini"));
  $("input[name=finexplab]").val(this.getAttribute("data-explabffin"));
  $("input[name=durexplab]").val(this.getAttribute("data-explabduracion"));
  $("textarea[name=motivretlab]").val(this.getAttribute("data-explabret"));
  $(".editexplaboral").modal("open");
}

showeditfamilia = function(){
  $(".accionfamilia").val("");
  $(".codfam").text(this.getAttribute("data-codfamilia"));
  $("label[id=nameemplefam]").text(this.getAttribute("data-name"));
  $(".dniempleadofam").text(this.value);
  $("input[name=namefam]").val(this.getAttribute("data-namefam"));
  $("input[name=parentfam]").val(this.getAttribute("data-parentfam"));
  $("input[name=edadfam]").val(this.getAttribute("data-edadfam"));
  $("input[name=fnacfam]").val(this.getAttribute("data-fnacfam"));
  $(".editfamilia").modal("open");
}

showeditcobsal = function(){
  $("label[id=nameemplecobsal]").text(this.getAttribute("data-namecobsalud"));
  $(".codcobsalud").text(this.getAttribute("data-codcobsal"));
  $(".dnicobsalud").text(this.value);
  $("select[id=combcobsalud]").val(this.getAttribute("data-cobsal"));
  $("input[name=finiciocobsalud]").val(this.getAttribute("data-finicobsal"));
  $("input[name=ffincobsalud]").val(this.getAttribute("data-ffincobsal"));
  $(".editcobsalud").modal("open");
}


showeditregpens = function(){
  $("label[id=nameempleregpens]").text(this.getAttribute("data-nameregpens"));
  $(".codregpensionario").text(this.getAttribute("data-codregpens"));
  $(".dniregpensionario").text(this.value);
  $("select[id=combregpensionario]").val(this.getAttribute("data-regpens"));
  $("input[name=finiciopensionario]").val(this.getAttribute("data-finiregpens"));
  $("input[name=ffinpensionario]").val(this.getAttribute("data-ffinregpens"));
  $("input[name=regpensiocuspp]").val(this.getAttribute("data-cuspp"));
  $("select[id=combsctr]").val(this.getAttribute("data-sctr"));
  $(".editregpensionario").modal("open");
}


showeditregsalud = function(){
  $("label[id=nameempleregsalud]").text(this.getAttribute("data-nameregsalud"));
  $(".codregsal").text(this.getAttribute("data-codregsal"));
  $(".dniregsal").text(this.value);
  $("select[id=combregsalud]").val(this.getAttribute("data-tiporegsalud"));
  $("input[name=finicioregsalud]").val(this.getAttribute("data-finiregsal"));
  $("input[name=ffinregsalud]").val(this.getAttribute("data-ffinregsal"));
  $("input[name=entregsalud]").val(this.getAttribute("data-regentidad"));
  $(".editregsalud").modal("open");
}


showeditdocumento = function(){
  $("label[id=nameempledocu]").text(this.getAttribute("data-namedoc"));
  data = this.getAttribute("data-archidoc");
  archivo = data.substring(37);
  $(".acciondocumento").val("")
  $(".txtchangedocu").val("");
  $(".coddoc").text(this.getAttribute("data-coddocu"));
  $(".dnidoc").text(this.value);
  $("select[id=nombredoc]").val(this.getAttribute("data-namedocu"));
  $("input[name=cdoc]").val(this.getAttribute("data-condic"));
  $("input[name=finidoc]").val(this.getAttribute("data-dfini"));
  $("input[name=fcaducdoc]").val(this.getAttribute("data-dfcad"));
  $(".archidoc").text(archivo);
  $("textarea[name=observdoc]").val(this.getAttribute("data-docestado"));
  $(".editdocemple").modal("open");
}


showeditexamen = function(){
  $(".accionexamen").val("");
  document.getElementById("divfileexa").style.display = 'block';
  document.getElementById("divfcad").style.display = 'block';
  $("label[id=nameempleexa]").text(this.getAttribute("data-nameexa"));
  data = this.getAttribute("data-arch");
  archivo = data.substring(35);
  $(".txtchangeexa").val("");
  $(".codexa").text(this.getAttribute("data-codexa"));
  $(".dniexa").text(this.value);
  $("select[id=ctipoexamen]").val(this.getAttribute("data-tipoexa"));
  $("select[id=clugar]").val(this.getAttribute("data-lugar"));
  $("input[name=finiexam]").val(this.getAttribute("data-fini"));
  $("input[name=fcadexam]").val(this.getAttribute("data-fcad"));
  $(".archiexa").text(archivo);
  $("input[name=aptexa]").val(this.getAttribute("data-apt"));
  $("textarea[name=coexa]").val(this.getAttribute("data-coment"));
  $(".editexaemple").modal("open");
}

showeditepps = function(){
  $(".accionepps").val("")
  document.getElementById("divfechrec").style.display = 'block';
  $("label[id=nameempleepps]").text(this.getAttribute("data-nameepps"));
  $(".codepps").text(this.getAttribute("data-codep"));
  $(".dniepps").text(this.value);
  $("input[name=itobra]").val(this.getAttribute("data-epps"));
  $("input[name=fentrepps]").val(this.getAttribute("data-fentrega"));
  $("input[name=frecepps]").val(this.getAttribute("data-frecep"));
  $("textarea[name=cepps]").val(this.getAttribute("data-comenepps"));
  $(".editeppsemple").modal("open");
}

showeditsuspension = function(){
  $(".accionsuspension").val("");
  data = this.getAttribute("data-archisusp");
  archivo = data.substring(37);
  $(".txtchangesusp").val("");
  $(".archisusp").text(archivo);
  $("label[id=nameemplesusp]").text(this.getAttribute("data-namesusp"));
  $(".codsusp").text(this.getAttribute("data-codsusp"));
  $(".dniempleado").text(this.value);
  $("select[id=combotiposuspension]").val(this.getAttribute("data-motivo"));
  $("input[name=fechinisusp]").val(this.getAttribute("data-finicio"));
  $("input[name=fechfinsusp]").val(this.getAttribute("data-ffin"));
  $("textarea[name=txtcomentsusp]").val(this.getAttribute("data-coment"));
  $(".editsuspension").modal("open");
}

showeditestudios = function(){
  $(".accionestudio").val("");
  $("label[id=nameempleest]").text(this.getAttribute("data-nameest"));
  $(".codest").text(this.getAttribute("data-codestudio"));
  $(".dniempleado").text(this.value);
  $("input[name=finiestudio]").val(this.getAttribute("data-finicioest"));
  $("input[name=ffinest]").val(this.getAttribute("data-ffinest"));
  $("input[name=instituto]").val(this.getAttribute("data-inst"));
  $("select[id=idcombotipoinst]").val(this.getAttribute("data-tipoinst"));
  $("input[name=ncarrera]").val(this.getAttribute("data-carrera"));
  $("select[id=idcomboestpais]").val(this.getAttribute("data-estperu"));
  $("input[name=naegreso]").val(this.getAttribute("data-aegreso"));
  $("input[name=nsiteduc]").val(this.getAttribute("data-siteduc"));
  $("input[name=ninstreg]").val(this.getAttribute("data-regimen"));
  $(".editestudioemple").modal("open");
}

showeditcuenta = function(){
  $(".accioncuenta").val("");
  document.getElementById('costoxhora').readOnly = true;
  document.getElementById('gratificacion').readOnly = true;
  document.getElementById('cts').readOnly = true;
  $(".codt").text(this.getAttribute("data-cod"));
  $("label[id=nameemplecu]").text(this.getAttribute("data-namecuen"));
  $(".dnicuenta").text(this.getAttribute("data-dnicuenta"));
  $("input[name=numcuenta]").val(this.getAttribute("data-numcuenta"));
  $("select[id=combotipopago]").val(this.getAttribute("data-tipopago"));
  // $("input[name=estadocuenta]").val(this.getAttribute("data-estado"));
  $("input[name=remuneracion]").val(this.getAttribute("data-remuneracion"));
  $("input[name=gratificacion]").val(this.getAttribute("data-grati"));
  $("input[name=cts]").val(this.getAttribute("data-cts"));
  $("input[name=costoxhora]").val(this.getAttribute("data-costxhora"));
  $("select[id=combotipocontrato]").val(this.getAttribute("data-tipocontrato"));
  $(".editcuentaemple").modal("open");
}

showeditphone= function(){
  $(".acciontelefono").val("");
  $(".dniempleadotel").text(this.value);
  $("label[id=nameemple]").text(this.getAttribute("data-nametel"));
  $(".codtel").text(this.getAttribute("data-codtelefono"));
  $("input[name=telef]").val(this.getAttribute("data-phone"));
  $("input[name=teldes]").val(this.getAttribute("data-des"));
  $(".ed").modal("open");
}


delphone = function(event){
  var btn;
  btn = this;
  swal({
    title: "Eliminar Telefono?",
    text: "Desea eliminar Telefono?",
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
      data.delphoneemple = true;
      data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
      data.dni = btn.value;
      data.phone = btn.getAttribute("data-delphone");
      $.post("/rrhh/empleado/phone/", data, function(response) {
        if (response.status) {
          listTelef();
          Materialize.toast('Telefono Eliminado', 2000, 'rounded');
        } else {
          swal("Error", "Error al eliminar el Telefono", "warning");
        }
      });
    }
  });
}



delcuenta = function(){
  var btn;
  btn = this;
  swal({
    title: "Eliminar Cuenta?",
    text: "Realmente desea eliminar la cuenta?",
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
      data.delcuentaemple = true;
      data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
      data.dni = btn.value;
      data.cuenta = btn.getAttribute("data-delcuenta");
      $.post("/rrhh/empleado/cuentacorriente/", data, function(response) {
        if (response.status) {
          listcuenta();
          Materialize.toast('Cuenta Corriente Eliminada', 2000, 'rounded');
        } else {
          swal("Error", "Error al eliminar la Cuenta Corriente", "warning");
        }
      });
    }
  });
}

delestudio = function(){
  var btn;
  btn = this;
  swal({
    title: "Eliminar Estudio",
    text: "Realmente desea eliminar el estudio?",
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
      data.delestudioemple = true;
      data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
      data.dni = btn.value;
      data.pk = btn.getAttribute("data-delestudio");
      $.post("/rrhh/empleado/estudios/", data, function(response) {
        if (response.status) {
          listEstudios();
          Materialize.toast('Estudio Eliminado', 2000, 'rounded');
        } else {
          swal("Error", "Error al eliminar el Estudio", "warning");
        }
      });
    }
  });
}

delsuspension = function(){
  var btn;
  btn = this;
  swal({
    title: "Eliminar Suspension",
    text: "Realmente desea eliminar la suspension?",
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
      url = btn.getAttribute("data-delarchisusp");
      archivo = url.substring(37);
      data = new Object;
      data.delsuspemple = true;
      data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
      data.dni = btn.value;
      data.pk = btn.getAttribute("data-delsusp");
      data.urlarchi = archivo;
      $.post("/rrhh/empleado/suspension/", data, function(response) {
        if (response.status) {
          listSuspension();
          Materialize.toast('Suspension Eliminada', 2000, 'rounded');
        } else {
          swal("Error", "Error al eliminar la suspension", "warning");
        }
      });
    }
  });
}

delexamen = function(){
  var btn;
  btn = this;
  swal({
    title: "Eliminar Examen",
    text: "Realmente desea eliminar el Examen?",
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
      url = btn.getAttribute("data-delarchiexa");
      archivo = url.substring(35);
      data = new Object;
      data.delexamenemple = true;
      data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
      data.dni = btn.value;
      data.namearchivo = archivo;
      data.pk = btn.getAttribute("data-delexa");
      $.post("/rrhh/empleado/documento/", data, function(response) {
        if (response.status) {
          listexadoc();
          Materialize.toast('Examen Eliminada', 2000, 'rounded');
        } else {
          swal("Error", "Error al eliminar el examen", "warning");
        }
      });
    }
  });
}

deldocumento = function(){
  var btn;
  btn = this;
  swal({
    title: "Eliminar Documento",
    text: "Realmente desea eliminar el Documento?",
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
      url = btn.getAttribute("data-delarchidoc");
      archivo = url.substring(37);
      data = new Object;
      data.deldocuemple = true;
      data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
      data.namearchdoc = archivo;
      data.dni = btn.value;
      data.pk = btn.getAttribute("data-deldoc");
      $.post("/rrhh/empleado/documento/", data, function(response) {
        if (response.status) {
          listexadoc();
          Materialize.toast('Documento Eliminado', 2000, 'rounded');
        } else {
          swal("Error", "Error al eliminar el Documento", "warning");
        }
      });
    }
  });
}

delepps = function(){
  var btn;
  btn = this;
  swal({
    title: "Eliminar Epps",
    text: "Realmente desea eliminar la Epps?",
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
      data.delepps = true;
      data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
      data.dni = btn.value;
      data.pk = btn.getAttribute("data-delepps");
      $.post("/rrhh/empleado/obra/", data, function(response) {
        if (response.status) {
          listObra();
          Materialize.toast('EPPS Eliminado', 2000, 'rounded');
        } else {
          swal("Error", "Error al eliminar el EPPS", "warning");
        }
      });
    }
  });
}

delregimensalud = function(){
  var btn;
  btn = this;
  swal({
    title: "Eliminar Regimen de Salud",
    text: "Realmente desea eliminar?",
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
      data.delregsalud = true;
      data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
      data.dni = btn.value;
      data.pk = btn.getAttribute("data-delregsal");
      $.post("/rrhh/empleado/segsocial/", data, function(response) {
        if (response.status) {
          listsegsocial();
          Materialize.toast('Regimen de Salud Eliminado', 2000, 'rounded');
        } else {
          swal("Error", "Error al eliminar el Regimen de Salud", "warning");
        }
      });
    }
  });
}

delregimenpension = function(){
  var btn;
  btn = this;
  swal({
    title: "Eliminar Regimen Pensionario",
    text: "Realmente desea eliminar?",
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
      data.delregpensionario = true;
      data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
      data.dni = btn.value;
      data.pk = btn.getAttribute("data-delregpens");
      $.post("/rrhh/empleado/segsocial/", data, function(response) {
        if (response.status) {
          listsegsocial();
          Materialize.toast('Regimen Pensionario Eliminado', 2000, 'rounded');
        } else {
          swal("Error", "Error al eliminar el Regimen Pensionario", "warning");
        }
      });
    }
  });
}

delcobsalud = function(){
  var btn;
  btn = this;
  swal({
    title: "Eliminar Cobertura de Salud",
    text: "Realmente desea eliminar?",
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
      data.delcobertsalud = true;
      data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
      data.dni = btn.value;
      data.pk = btn.getAttribute("data-delcobsal");
      $.post("/rrhh/empleado/segsocial/", data, function(response) {
        if (response.status) {
          listsegsocial();
          Materialize.toast('Cobertura de Salud Eliminado', 2000, 'rounded');
        } else {
          swal("Error", "Error al eliminar Cobertura de Salud", "warning");
        }
      });
    }
  });
}

delfamilia = function(){
  var btn;
  btn = this;
  swal({
    title: "Eliminar Familiar",
    text: "Realmente desea eliminar?",
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
      data.delfam = true;
      data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
      data.dni = btn.value;
      data.pk = btn.getAttribute("data-delfam");
      $.post("/rrhh/empleado/segsocial/", data, function(response) {
        if (response.status) {
          listfamilia();
          Materialize.toast('Familiar Eliminado', 2000, 'rounded');
        } else {
          swal("Error", "Error al eliminar Familiar", "warning");
        }
      });
    }
  });
}
delexplab = function(){
  var btn;
  btn = this;
  swal({
    title: "Eliminar Experiencia Laboral",
    text: "Realmente desea eliminar?",
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
      data.delexplaboral = true;
      data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
      data.dni = btn.value;
      data.pk = btn.getAttribute("data-delexplab");
      $.post("/rrhh/empleado/estudios/", data, function(response) {
        if (response.status) {
          listexplab();
          Materialize.toast('Experiencia Laboral Eliminado', 2000, 'rounded');
        } else {
          swal("Error", "Error al eliminar Experiencia Laboral", "warning");
        }
      });
    }
  });

}

delfamicr = function(){
  var btn;
  btn = this;
  swal({
    title: "Eliminar Familiar en ICR",
    text: "Realmente desea eliminar?",
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
      data.delfamiliaicr = true;
      data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
      data.dni = btn.value;
      data.pk = btn.getAttribute("data-delfamicr");
      $.post("/rrhh/empleado/segsocial/", data, function(response) {
        if (response.status) {
          listfamicr();
          Materialize.toast('Familiar en ICR Eliminado', 2000, 'rounded');
        } else {
          swal("Error", "Error al eliminar Familiar en ICR]", "warning");
        }
      });
    }
  }); 
}


delemerg = function(){
  var btn;
  btn = this;
  swal({
    title: "Eliminar Contacto de Emergencia",
    text: "Realmente desea eliminar?",
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
      data.delemerg = true;
      data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
      data.dni = btn.value;
      data.pk = btn.getAttribute("data-delemerg");
      $.post("/rrhh/empleado/segsocial/", data, function(response) {
        if (response.status) {
          listemerg();
          Materialize.toast('Contacto de Emergencia Eliminado', 2000, 'rounded');
        } else {
          swal("Error", "Error al eliminar Contacto de Emergencia]", "warning");
        }
      });
    }
  });  
}


delmedic = function(){
  var btn;
  btn = this;
  swal({
    title: "Eliminar Dato Medico",
    text: "Realmente desea eliminar?",
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
      data.delmedic = true;
      data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
      data.dni = btn.value;
      data.pk = btn.getAttribute("data-delmedic");
      $.post("/rrhh/empleado/segsocial/", data, function(response) {
        if (response.status) {
          listmedic();
          Materialize.toast('Dato Medico Eliminado', 2000, 'rounded');
        } else {
          swal("Error", "Error al eliminar Dato Medico]", "warning");
        }
      });
    }
  });

}

showeditEmployee = function(){
  var data,datafoto;
  $(".txtchangeficha").val("");
  $(".txtchangefoto").val("");
  $(".accion").val("");
  document.getElementById('dni').readOnly = true;
  var data,id;
  console.log(this)

  id=this.value
  console.log(id);
  if (id !== "") {
    data = {
      employeeid: id,
      showeditemp: true,
    };
    $.getJSON("", data, function(response) {
      if (response.status) {
        $(".dni").val(response.empdni_id);
        $(".name").val(response.firstname);
        $(".apellidos").val(response.lastname);
        $(".email").val(response.email);
        $(".fechnac").val(response.birth);
        $(".direc1").val(response.address);
        $(".cargo").val(response.charge_id);
        $(".tiptrab").val(response.tipoemple_id);
        $(".sexo").val(String(response.sexo));
        $(".estadocivil").val(String(response.estadocivil));
        $(".direc2").val(response.address2);
        $(".nacionalidad").val(String(response.nacionalidad));
        $(".discapacidad").val(String(response.discapacidad));
        $(".feching").val(response.feching);

        $(".distrito").val(response.distrito);
        $(".tallazapatos").val(response.tallazap);
        $(".tallapolo").val(response.tallapolo);
        $(".dptonac").val(response.nacdpt);
        $(".provnac").val(response.nacprov);
        $(".distnac").val(response.nacdist);
        $(".postula").val(response.cargopostula);
        data = response.archivo;
        datafoto = response.foto;
        if (data != null) {
          archivo = data.substring(39);
        }else{
          archivo = "";
        }

        if (datafoto != null) {
          arcfoto = datafoto.substring(31);  
        }else{
          arcfoto = "";
        }
        $(".archificha").text(archivo);
        $(".archifoto").text(arcfoto);
        $(".planilla").val(String(response.estadoplanilla));
        $(".editemple").modal("open");
      }
    });
  }
}

sendatamotivren = function(){
$(".namemotr").text(this.getAttribute("data-motrname"))
$(".dnimotr").text(this.getAttribute("data-motrdni"))
}

save_mot_renuncia = function(){
  var data,div;
  div=document.getElementById("dnimotr").innerHTML;
  data = new FormData();
  data.append("dni",div);
  data.append("type", "files");
  data.append("motrenun", $("textarea[name=motrenuncia]").val());
  data.append("ultdiatrab",$("input[name=ulttrabj]").val());
  data.append("csrfmiddlewaretoken", $("input[name=csrfmiddlewaretoken]").val());
  data.append("cambestemple", true);
  data.append("savemotren",true);

  ren = $("textarea[name=motrenuncia]").val();
  ultday = $("input[name=ulttrabj]").val();

  if (ren == ""){
    Materialize.toast("Debe ingresar un motivo de renuncia", 2500, 'rounded');
    return false;
  }
  if (ultday == "") {
    Materialize.toast("Debe ingresar ultimo dia de trabajo", 2500, 'rounded');
    return false;
  };


  $("input[name=docrenuncia]").each(function(index, element) {
  if (this.files[0] != null) {
  data.append(this.name, this.files[0]);
  }else{
  data.append(this.name, '');
  }
  });

    $.ajax({
    data: data,
    url: "/rrhh/empleado/segsocial/",
    type: "POST",
    dataType: "json",
    cache: false,
    processData: false,
    contentType: false,
    success: function(response) {
      if (response.status) {
        Materialize.toast('Registro de Renuncia correcto', 4000, 'rounded');
        $(".addrenuncia").modal("close");
        location.reload();
      } else {
        Materialize.toast('Error al subir los archivos al servidor', 4000, 'rounded');
        return false
      }
    }
  });

}


sendatafamicr = function(){
$(".accionfamicr").val(this.getAttribute("data-famicr"))
}

save_or_edit_famicr = function(){
  valor =document.getElementById('accionfamicr').value;
  var data,div;
  div=document.getElementById("dnifamicr").innerHTML;
  lbpk= document.getElementById("codfamicr").innerHTML;
  data = new Object;
  data.dni=div;
  data.codfamiliaicr=lbpk;
  data.famicrnombres = $("input[name=namefamicr]").val();
  data.famicrparent = $("input[name=parentfamicr]").val();
  data.famicrareatrab = $("input[name=areatrabfamicr]").val();
  data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();


  if (data.famicrnombres == ""){
    Materialize.toast("Debe ingresar Nombres y Apellidos",2500,'rounded');
    return false;
  }
  if (data.famicrparent == ""){
    Materialize.toast("Debe ingresar Parentesco",2500,'rounded');
    return false;
  }

  if (data.famicrareatrab == ""){
    Materialize.toast("Debe ingresar Area de Trabajo",2500,'rounded');
    return false;
  }


  if (valor == "btnnewfamicr") {
      data.savefamicr = true;
      $.post("/rrhh/empleado/segsocial/", data, function(response) {
        if (response.status) {
          listfamicr();
        Materialize.toast('Familiar en ICR Agregado', 2000, 'rounded');
        $(".familiaicr").modal("close");   
        }
      }, "json");

  }else{
    data.saveeditfamicr = true;
    $.post("/rrhh/empleado/segsocial/", data, function(response) {
        if (response.status) {
          cod = div;
          listfamicr();
          Materialize.toast('Edicion de Familiar en ICR correcto', 2000, 'rounded');
          $(".familiaicr").modal("close");
        }
      }, "json");
  } 
}

sendataemergencia = function(){
$(".accionemerg").val(this.getAttribute("data-emerg"))
}

save_or_edit_emerg = function(){
  valor =document.getElementById('accionemerg').value;
  var data,div,digtel;
  div=document.getElementById("dniemerg").innerHTML;
  lbpk= document.getElementById("codemerg").innerHTML;
  data = new Object;
  data.dni=div;
  data.codemergencia=lbpk;
  data.emergnombres = $("input[name=nameemerg]").val();
  data.emergdirec = $("input[name=direcemerg]").val();
  data.emergtel = $("input[name=telemerg]").val();
  data.emergparent = $("input[name=parentemerg]").val();
  data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();


  if (data.emergnombres == "") {
    Materialize.toast('Debe Ingresar Nombres y Apellidos',2500,'rounded');
    return false;
  }
  if (data.emergparent == "") {
    Materialize.toast('Debe Ingresar Parentesco',2500,'rounded');
    return false;
  }
  digtel = data.emergtel.length;
  if (digtel > 1 && digtel < 7){
    Materialize.toast('Numero de Telefono Incorrecto',2500,'rounded');
    return false;
  }

  if (valor == "btnnewemerg") {
      data.saveemerg = true;
      $.post("/rrhh/empleado/segsocial/", data, function(response) {
        if (response.status) {
        listemerg();
        Materialize.toast('Contacto de Emergencia Agregado', 2000, 'rounded');
        $(".editemergencia").modal("close");   
        }
      }, "json");

  }else{
    data.saveeditemerg = true;
    $.post("/rrhh/empleado/segsocial/", data, function(response) {
        if (response.status) {
          cod = div;
          listemerg();
          Materialize.toast('Edicion de Contacto de Emergencia correcto', 2000, 'rounded');
          $(".editemergencia").modal("close");
        }
      }, "json");
  } 
}

sendatamedic = function(){
  $(".accionmedic").val(this.getAttribute("data-medic"))
}

save_or_edit_medic = function(){
  valor =document.getElementById('accionmedic').value;
  var data,div;
  div=document.getElementById("dnimedic").innerHTML;
  lbpk= document.getElementById("codmedic").innerHTML;
  data = new Object;
  data.dni=div;
  data.codme=lbpk;
  data.tipomedic = $("input[name=tipomedic]").val();
  data.descmedic = $("input[name=descmedic]").val();
  data.timemedic = $("input[name=timemedic]").val();
  data.commedic = $("textarea[name=txtcommedic]").val();
  data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();

  if (data.descmedic =="") {
    Materialize.toast('Debe ingresar una Descripcion', 2000, 'rounded')
    return false;
  };

  if (data.tipomedic == "") {
    Materialize.toast('Debe ingresar un Tipo', 2000, 'rounded')
    return false;
  }

  if (valor == "btnnewmedic") {
      data.savemedic = true;
      $.post("/rrhh/empleado/segsocial/", data, function(response) {
        if (response.status) {
          listmedic();
        Materialize.toast('Dato Medico Agregado', 2000, 'rounded');
        $(".editmedic").modal("close");   
        }
      }, "json");

  }else{
    data.saveeditmedic = true;
    $.post("/rrhh/empleado/segsocial/", data, function(response) {
        if (response.status) {
          cod = div;
          listmedic();
          Materialize.toast('Edicion de Dato Medico correcto', 2000, 'rounded');
          $(".editmedic").modal("close");
        }
      }, "json");
  } 
}

sendataexplaboral = function(){
  $(".accionexplab").val(this.getAttribute("data-explab"))
}


save_or_edit_explab = function(){
  valor =document.getElementById('accionexplab').value;
  var data,div;
  div=document.getElementById("dniexplab").innerHTML;
  lbpk= document.getElementById("codexplab").innerHTML;
  data = new Object;
  data.dni=div;
  data.codexplab=lbpk;
  data.explabemp = $("input[name=empexplab]").val();
  data.explabcargo = $("input[name=cargoexplab]").val();
  data.explabini = $("input[name=iniexplab]").val();
  data.explabfin = $("input[name=finexplab]").val();
  data.explabdur = $("input[name=durexplab]").val();
  data.explabret = $("textarea[name=motivretlab]").val();
  data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();

  if (data.explabemp == "") {
    Materialize.toast('Debe ingresar una empresa', 2000, 'rounded');
    return false;
  }
  if (data.explabcargo == "") {
    Materialize.toast('Debe ingresar un cargo', 2000, 'rounded');
    return false;
  }
  if (data.explabini == "") {
    Materialize.toast('Debe ingresar Inicio de trabajo', 2000, 'rounded');
    return false;
  }
  if (data.explabfin == "") {
    Materialize.toast('Debe ingresar Fin de trabajo', 2000, 'rounded');
    return false;
  }
  if (data.explabdur == "") {
    Materialize.toast('Debe ingresar duracion de trabajo', 2000, 'rounded');
    return false;
  }


  if (valor == "btnnewexplab") {
      data.saveexplab = true;
      $.post("/rrhh/empleado/estudios/", data, function(response) {
        if (response.status) {
          listexplab();
        Materialize.toast('Experiencia Laboral Agregado', 2000, 'rounded');
        $(".editexplaboral").modal("close");   
        }
      }, "json");

  }else{
    data.saveeditexplab = true;
    $.post("/rrhh/empleado/estudios/", data, function(response) {
        if (response.status) {
          cod = div;
          listexplab();
          Materialize.toast('Edicion de Experiencia Laboral correcto', 2000, 'rounded');
          $(".editexplaboral").modal("close");
        }
      }, "json");
  } 

}

sendatafamilia = function(){
  $(".accionfamilia").val(this.getAttribute("data-familia"))
}

save_or_edit_familia = function(){
  valor =document.getElementById('accionfamilia').value;
  var data,div;
  div=document.getElementById("dniempleadofamilia").innerHTML;
  lbpk= document.getElementById("codfam").innerHTML;
  data = new Object;
  data.dni=div;
  data.codfamilia=lbpk;
  data.nombresfam = $("input[name=namefam]").val();
  data.parentfam = $("input[name=parentfam]").val();
  data.edadfam = $("input[name=edadfam]").val();
  data.fnacfam = $("input[name=fnacfam]").val();
  data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();

  if (data.nombresfam == "" ) {
  Materialize.toast('Debe ingresar nombres', 2000, 'rounded');
  return false;
  }
    if (data.parentfam == "" ) {
  Materialize.toast('Debe ingresar parentesco', 2000, 'rounded');
  return false;
  }
  if (data.edadfam.length > 2 || data.edadfam == "") {
  Materialize.toast('Edad Incorrecta', 2000, 'rounded');
  return false;
  }
  if (data.fnacfam == "" ) {
  Materialize.toast('Debe ingresar fecha de nacimiento', 2000, 'rounded');
  return false;
  }

  if (valor == "btnnewfam") {
      data.savefamilia = true;
      $.post("/rrhh/empleado/segsocial/", data, function(response) {
        if (response.status) {
          listfamilia();
           Materialize.toast('Familiar Agregado', 2000, 'rounded');
          $(".editfamilia").modal("close");
          limp_familia()       
        }
      }, "json");

  }else{
    data.saveeditfamilia = true;
    $.post("/rrhh/empleado/segsocial/", data, function(response) {
        if (response.status) {
          cod = div;
          listfamilia();
          Materialize.toast('Edicion de datos Familiares correcto', 2000, 'rounded');
          $(".editfamilia").modal("close");
        }
      }, "json");
  } 

}

save_edit_cobsalud = function(){
  var data,div;
  div=document.getElementById("dnicobsalud").innerHTML;
  lbpk= document.getElementById("codcobsalud").innerHTML;
  data = new Object;
  data.dni=div;
  data.codcobsal = lbpk;
  data.cobertsalud = $("select[id=combcobsalud]").val();
  data.finicobertsalud = $("input[name=finiciocobsalud").val();
  data.ffincobersalud = $("input[name=ffincobsalud]").val();
  data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
      data.saveeditcobsalud = true;
      $.post("/rrhh/empleado/segsocial/", data, function(response) {
        if (response.status) {
          cod = div;
          listsegsocial();
          Materialize.toast('Edicion Cobertura Correcta', 4000, 'rounded');
          $(".editcobsalud").modal("close");
        }
      }, "json");
}

save_edit_regpensionario = function(){
  var data,div;
  div=document.getElementById("dniregpensionario").innerHTML;
  lbpk= document.getElementById("codregpensionario").innerHTML;
  data = new Object;
  data.dni=div;
  data.codregpens = lbpk;
  data.regimenpensio = $("select[id=combregpensionario]").val();
  data.finiregimenpens = $("input[name=finiciopensionario").val();
  data.ffinregimenpens = $("input[name=ffinpensionario]").val();
  data.regipenscuspp = $("input[name=regpensiocuspp]").val();
  data.regimenpenssctr = $("select[id=combsctr]").val();
  data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();

      data.saveeditregpens = true;
      $.post("/rrhh/empleado/segsocial/", data, function(response) {
        if (response.status) {
          cod = div;
          listsegsocial();
          Materialize.toast('Edicion Regimen Pensionario Correcta', 4000, 'rounded');
          $(".editregpensionario").modal("close");
        }
      }, "json");
}

save_edit_regsalud = function(){

  var data,div;
  div=document.getElementById("dniregsal").innerHTML;
  lbpk= document.getElementById("codregsal").innerHTML;
  data = new Object;
  data.dni=div;
  data.codregsalud = lbpk;
  data.regimensalud = $("select[id=combregsalud]").val();
  data.finiregimensalud = $("input[name=finicioregsalud").val();
  data.ffinregimensalud = $("input[name=ffinregsalud]").val();
  data.regsaludentidad = $("input[name=entregsalud]").val();
  data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();

      data.saveeditregsalud = true;
      $.post("/rrhh/empleado/segsocial/", data, function(response) {
        if (response.status) {
          cod = div;
          listsegsocial();
          Materialize.toast('Edicion de Regimen de Salud Correcta', 4000, 'rounded');
          $(".editregsalud").modal("close");
        }
      }, "json");
  
}


sendatadocumento = function(){
  $(".acciondocumento").val(this.getAttribute("data-documento"))
}

save_or_edit_documento = function(){
  valor = document.getElementById('acciondocumento').value;
  var data,div;
  div=document.getElementById("dnidoc").innerHTML;
  lbpk= document.getElementById("coddoc").innerHTML;
  namearchivo= document.getElementById("archidoc").innerHTML;

  doc = $("input[name=cambdocu]").val();

  data = new FormData();
  data.append("archi",namearchivo);
  data.append("dni",div);
  data.append("coddocum",lbpk);
  data.append("type", "files");
  data.append("namedocu", $("select[id=nombredoc]").val());
  data.append("condicdoc", $("input[name=cdoc]").val());
  data.append("finidocu", $("input[name=finidoc]").val());
  data.append("fcaddocu", $("input[name=fcaducdoc]").val());
  data.append("obserdocu", $("textarea[name=observdoc]").val());
  data.append("csrfmiddlewaretoken", $("input[name=csrfmiddlewaretoken]").val());
  

  if (valor == 'btnnewdocumento') {
        if (doc == "") {
        Materialize.toast('Debe subir un Documento', 4000, 'rounded');
        return false;
        }
      data.append("savedocumento",true);
      $("input[name=cambdocu]").each(function(index, element) {
    if (this.files[0] != null) {
      data.append(this.name, this.files[0]);
    }else{
      data.append(this.name, '');
    }
  });
  }else{
      data.append("editdocum",true);
      $("input[name=cambdocu]").each(function(index, element) {
      if (this.files[0] != null) {
        data.append(this.name, this.files[0]);
      }else{
        data.append(this.name,'')
      }
    });

  }
    $.ajax({
    data: data,
    url: "/rrhh/empleado/documento/",
    type: "POST",
    dataType: "json",
    cache: false,
    processData: false,
    contentType: false,
    success: function(response) {
      if (response.status) {
        cod = div;
        listexadoc();
        Materialize.toast('Registro de datos correcto', 4000, 'rounded');
        $(".editdocemple").modal("close");
      } else {
        Materialize.toast('Error al subir los archivos al servidor', 4000, 'rounded');
        return false
      }
    }
  });

}

sendataexamen = function(){
  $(".accionexamen").val(this.getAttribute("data-examen"));
}
save_or_edit_examen = function(){
  valor = document.getElementById('accionexamen').value;
  var data,div;
  div=document.getElementById("dniexa").innerHTML;
  lbpk= document.getElementById("codexa").innerHTML;
  namearchivo= document.getElementById("archiexa").innerHTML;

  fini = $("input[name=finiexam]").val();

  if (fini == "") {
    Materialize.toast('Debe ingresar Fecha de Inicio para el examen', 4000, 'rounded');
    return false;
  }

  data = new FormData();
  data.append("arch",namearchivo);
  data.append("dni",div);
  data.append("codexa",lbpk);
  data.append("type", "files");
  data.append("tipexa", $("select[id=ctipoexamen]").val());
  data.append("lugexa", $("select[id=clugar]").val());
  data.append("finiexa", $("input[name=finiexam]").val());
  data.append("fcadexa", $("input[name=fcadexam]").val());
  data.append("aptexa", $("input[name=aptexa]").val());
  data.append("comentexa", $("textarea[name=coexa]").val());
  data.append("csrfmiddlewaretoken", $("input[name=csrfmiddlewaretoken]").val());

  if (valor == 'btnnewexamen') {
      data.append("saveexamen",true);
      $("input[name=cambexa]").each(function(index, element) {
    if (this.files[0] != null) {
      data.append(this.name, this.files[0]);
    }else{
      data.append(this.name, '');
    }
  });
  }else{
      data.append("editexamen",true);
      $("input[name=cambexa]").each(function(index, element) {
      if (this.files[0] != null) {
        data.append(this.name, this.files[0]);
      }else{
        data.append(this.name,'')
      }
    });

  }
    $.ajax({
    data: data,
    url: "/rrhh/empleado/documento/",
    type: "POST",
    dataType: "json",
    cache: false,
    processData: false,
    contentType: false,
    success: function(response) {
      if (response.status) {
        cod = div;
        listexadoc();
        Materialize.toast('Registro de datos correcto', 4000, 'rounded');
        $(".editexaemple").modal("close");
      } else {
        Materialize.toast('Error al subir los archivos al servidor', 4000, 'rounded');
        return false
      }
    }
  });
}

sendataepps = function(){
  $(".accionepps").val(this.getAttribute("data-epps"));
}

save_or_edit_epps = function(){
  valor = document.getElementById('accionepps').value;
  var data,div;
  div=document.getElementById("dniepps").innerHTML;
  lbpk= document.getElementById("codepps").innerHTML;
  data = new Object;
  data.dni=div;
  data.codeppss = lbpk;
  data.arti = $("input[name=itobra").val();
  data.fentrega = $("input[name=fentrepps]").val();
  data.frecepcion = $("input[name=frecepps]").val();
  data.comepps = $("textarea[name=cepps]").val();
  data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();

// VALIDACION DE CAMPOS
  if (data.arti === "") {
    Materialize.toast('Debe ingresar un Epps', 4000, 'rounded');
    return false;
  }
  if (data.fentrega === "") {
    Materialize.toast('Debe ingresa Fecha de Entrega', 4000, 'rounded');
    return false;
  }
////

  if (valor == 'btnnewepps') {
      data.saveepps = true;
      data.entregado = 'ENTREGADO';
      $.post("/rrhh/empleado/obra/", data, function(response) {
        if (response.status) {
          listObra();
          Materialize.toast('Asignacion de EPPS correcta', 4000, 'rounded');
          $(".editeppsemple").modal("close");
        }
      }, "json");
  }else{
    if(data.frecepcion != ""){
      data.recepcionado = 'RECEPCIONADO';
    }else{
      data.recepcionado = 'ENTREGADO';
    }
    data.editepps = true;
    $.post("/rrhh/empleado/obra/", data, function(response) {
        if (response.status) {
          cod = div;
          listObra();
          Materialize.toast('Edicion de EPPS correcto', 4000, 'rounded');
          $(".editeppsemple").modal("close");
        }
      }, "json");
  } 
}

sendataproyecto = function(){
  $(".accionproyecto").val(this.getAttribute("data-proyecto"));
}


sendatasuspension = function(){
  $(".accionsuspension").val(this.getAttribute("data-suspension"));
}

save_or_edit_suspension = function(){
  valor = document.getElementById('accionsuspension').value;
  var data,div;
  div=document.getElementById("dniempleadosusp").innerHTML;
  lbpk= document.getElementById("codsusp").innerHTML;
  namearchivo= document.getElementById("archisusp").innerHTML;

  fini = $("input[name=fechinisusp]").val();
  ffin = $("input[name=fechfinsusp]").val();

  var startDate = new Date($('#fechinisusp').val());
  var endDate = new Date($('#fechfinsusp').val());

  if (fini == "") {
  Materialize.toast('Debe ingresar Fecha de Inicio', 3000, 'rounded');
  return false;
  }
  if (ffin == "") {
    Materialize.toast('Debe ingresar Fecha de Fin', 3000, 'rounded');
    return false;
  }
  if (endDate < startDate) {
    Materialize.toast('Fecha de Fin debe ser Mayor a la Fecha de Inicio', 4000, 'rounded');
    return false;
  }



  data = new FormData();
  data.append("archi",namearchivo);
  data.append("dni",div);
  data.append("codsu",lbpk);
  data.append("type", "files");
  data.append("motivo", $("select[id=combotiposuspension").val());
  data.append("fechinicio", $("input[name=fechinisusp]").val());
  data.append("fechfinsusp", $("input[name=fechfinsusp]").val());
  data.append("comentario", $("textarea[name=txtcomentsusp]").val());
  data.append("csrfmiddlewaretoken", $("input[name=csrfmiddlewaretoken]").val());
  

  if (valor == 'btnnewsusp') {
      data.append("savesuspension",true);
      data.append("estadosusp",'ACTIVO');
      $("input[name=cambsusp]").each(function(index, element) {
    if (this.files[0] != null) {
      data.append(this.name, this.files[0]);
    }else{
      data.append(this.name, '');
    }
    $("input[name=cambsusp]").val("");
  });
  }else{
      data.append("editsus",true);
      $("input[name=cambsusp]").each(function(index, element) {
      if (this.files[0] != null) {
        data.append(this.name, this.files[0]);
      }else{
        data.append(this.name,'')
      }
    });

  }
    $.ajax({
    data: data,
    url: "/rrhh/empleado/suspension/",
    type: "POST",
    dataType: "json",
    cache: false,
    processData: false,
    contentType: false,
    success: function(response) {
      if (response.status) {
        cod = div;
        listSuspension();
        Materialize.toast('Registro de datos correcto', 4000, 'rounded');
        $(".editsuspension").modal("close");
      } else {
        Materialize.toast('Error al subir los archivos al servidor', 4000, 'rounded');
        return false
      }
    }
  });
}

sendataestudio = function(){
  $(".accionestudio").val(this.getAttribute("data-estudio"));
}
save_or_edit_estudio = function(){
  valor = document.getElementById('accionestudio').value;
  var data,div;
  div=document.getElementById("dniempleadoestudio").innerHTML;
  lbpk= document.getElementById("codest").innerHTML;
  data = new Object;
  data.codestudio = lbpk;
  data.dni=div;
  data.inst = $("input[name=instituto]").val();
  data.tipoinst = $("select[id=idcombotipoinst]").val();
  data.carrera = $("input[name=ncarrera]").val();
  data.estpais = $("select[id=idcomboestpais]").val();
  data.aegreso = $("input[name=naegreso]").val();
  data.siteduc = $("input[name=nsiteduc]").val();
  data.instreg = $("input[name=ninstreg]").val();
  data.fini = $("input[name=finiestudio]").val();
  data.ffin = $("input[name=ffinest]").val();
  data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
// VALIDACIONES DE CAMPOS  
  if (data.inst === "") {
    Materialize.toast('Debe ingresar una Institucion', 2000, 'rounded');
    return false;
  }

  if (data.instreg === "") {
    Materialize.toast('Debe ingresar Regimen de Institucion', 2000, 'rounded');
    return false;
  }
  tam = data.aegreso.length;

  if (valor == "btnnewestudio") {
    data.saveestudio = true;
    $.post("/rrhh/empleado/estudios/", data, function(response) {
      if (response.status) {
          listEstudios();
          Materialize.toast('Estudio Agregado', 2000, 'rounded');
          $(".editestudioemple").modal("close");
          limp_estudio();
        }
      }, "json");
  }else{
    data.editestudio = true;
    $.post("/rrhh/empleado/estudios/", data, function(response) {
        if (response.status) {
          cod = div;
          listEstudios();
          Materialize.toast('Edicion de Estudio correcto', 2000, 'rounded');
          $(".editestudioemple").modal("close");
        }
      }, "json");
  }
}


sendatatelefono = function(){
  $(".acciontelefono").val(this.getAttribute("data-telefono"));
}

save_or_edit_telefono = function(){
  valor =document.getElementById('acciontelefono').value;
  var data,div;
  div=document.getElementById("dniempleadotel").innerHTML;
  lbpk= document.getElementById("codtel").innerHTML;
  data = new Object;
  data.dni=div;
  data.codtelef=lbpk;
  data.telef = $("input[name=telef]").val();
  data.descripcion = $("input[name=teldes]").val();
  data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
  data.exists = true;

  if (data.telef.length < 7) {
    Materialize.toast('Telefono Incorrecto', 2000, 'rounded');
    return false;
  }
  if (data.descripcion === "") {
    Materialize.toast('Debe ingresar una Descripcion', 2000, 'rounded');
    return false;
  }


  if (valor == "btnnewtelefono") {
  $.post("/rrhh/empleado/phone/", data, function(exists) {
    if (!exists.status) {
      delete data.exists;
      data.savephone = true;
      Materialize.toast('Telefono Agregado', 2000, 'rounded');
      $.post("/rrhh/empleado/phone/", data, function(response) {
        if (response.status) {
          listTelef();
          $(".ed").modal('close')      
        }
      }, "json");
    } else {
      Materialize.toast('Telefono ingresado ya existe', 2000, 'rounded');
      return false;
    }
    }, "json");
  }else{
    data.edittelefono = true;
    $.post("/rrhh/empleado/phone/", data, function(response) {
        if (response.status) {
          cod = div;
          listTelef();
          Materialize.toast('Edicion del telefono correcto', 2000, 'rounded');
          $(".ed").modal("close");
        }
      }, "json");
  } 
}


sendatacuenta = function(){
  $(".accioncuenta").val(this.getAttribute("data-cuenta"));
}

save_or_edit_cuenta = function() {
  valor =document.getElementById('accioncuenta').value;
  var data,div,grati,ct,cxhor;
  div=document.getElementById("dniempleadocuenta").innerHTML;
  lbpk= document.getElementById("codt").innerHTML;
  grati = $("input[name=gratificacion]").val();
  ct = $("input[name=cts]").val();
  cxhor = $("input[name=costoxhora]").val();

  data = new Object;
  data.dni=div;
  data.cod =lbpk;
  data.numcuenta = $("input[name=numcuenta]").val();
  data.tipopago = $("select[id=combotipopago]").val();
  data.remuneracion = $("input[name=remuneracion]").val();
  data.tipocontrato = $("select[id=combotipocontrato]").val();
  data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
  data.exists = true;

  //VALIDACIONES DE CAMPOS
  if (data.numcuenta.length != 16 || (/^[a-zA-Z\s]*$/.test(data.numcuenta))) {
    Materialize.toast('Numero de Cuenta Incorrecta', 4000, 'rounded');
    return false;
  }
  if (data.remuneracion === "") {
    Materialize.toast('Debe ingresar una Remuneracion', 4000, 'rounded');
    return false;
  }

  /////

  //VACIO = 0
  if (grati != "") {data.gratificacion = $("input[name=gratificacion]").val();
  }else{data.gratificacion = 0;}

  if (ct != ""){data.cts = $("input[name=cts]").val();
  }else{data.cts = 0;}

  if (cxhor != ""){data.costoxhora = $("input[name=costoxhora]").val();
  }else{data.costoxhora = 0;}

  if (valor == "btnnewcuenta") {
    $.post("/rrhh/empleado/cuentacorriente/", data, function(exists) {
    if (!exists.status) {
      delete data.exists;
      data.savecuenta = true;
      data.cueactivo = 'ACTIVO';
      $.post("/rrhh/empleado/cuentacorriente/", data, function(response) {
        if (response.status) {
          listcuenta();
          Materialize.toast('Se registro la cuenta con exito', 4000, 'rounded');
          $(".editcuentaemple").modal("close");
          limp_cuenta()    
        }
      }, "json");
    } else {
      Materialize.toast('Numero de Cuenta ya existe', 4000, 'rounded');
      return false;
    }
    }, "json");

  }else{
      data.editcuenta = true;
      $.post("/rrhh/empleado/cuentacorriente/", data, function(response) {
        if (response.status) {
          cod = div;
          listcuenta();
          Materialize.toast('Edicion de la cuenta correcta', 4000, 'rounded');
          $(".editcuentaemple").modal("close");  
        }
      }, "json");
  }

}


save_segsocial = function(){
  var data;
  data = new Object;
  data.dniemple= $(".dnisegsocial").text();
  data.regsalud = $("select[id=comboregsalud]").val();
  data.regsalfechini = $("input[name=regsalfechini]").val();
  data.regsalfechfin = $("input[name=regsalfechfin]").val();
  data.regsalentidad = $("input[name=regsalentidad]").val();
  data.regpens = $("select[id=comboregpens]").val();
  data.regpensfechini = $("input[name=regpensfechini]").val();
  data.regpensfechfin = $("input[name=regpensfechfin]").val();
  data.regpenscuspp = $("input[name=regpenscuspp]").val();
  data.sctr = $("select[id=combosctr]").val();
  data.cobsalfechini = $("input[name=cobsalfechini]").val();
  data.cobsalfechfin = $("input[name=cobsalfechfin]").val();
  data.cobsalud = $("select[id=combocobsalud]").val();
  data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();

  if (data.regsalfechini === "") {
    Materialize.toast('Debe ingresar Fecha de Inicio en Regimen de Aseguramiento de Salud', 4000, 'rounded');
    return false;
  }
  if (data.regpensfechini === "") {
    Materialize.toast('Debe ingresar Fecha de Inicio en Regimen Pensionario', 4000, 'rounded');
    return false;
  }

  if (data.cobsalfechini === "") {
    Materialize.toast('Debe ingresar Fecha de Inicio en Cobertura de Salud', 4000, 'rounded');
    return false;
  }


  data.savesegsocial = true;
  $.post("/rrhh/empleado/segsocial/", data, function(response) {
    if (response.status) {
      Materialize.toast('Registro Correcto', 4000, 'rounded');
      listsegsocial();
      $(".addsegsocial").modal("close");
    }
  }, "json"); 
}



sendata = function(){
  $(".accion").val(this.getAttribute("data-emple"));
}

save_or_edit_empleado = function(event) {
  valor = document.getElementById('accion').value;
  namearchivo= document.getElementById("archificha").innerHTML;
  namefoto = document.getElementById("archifoto").innerHTML;

  nam = $("input[name=name]").val();
  lastn = $("input[name=apellidos]").val();
  dn = $("input[name=dni]").val();
  fnac = $("input[name=fechnac]").val();
  fing = $("input[name=feching]").val();
  zap = $("input[name=tallazapatos]").val();
  polo = $("input[name=tallapolo]").val();
  nacdpto = $("input[name=dptonac]").val();
  nacprov = $("input[name=provnac]").val();
  nacdist = $("input[name=distnac]").val();
  post = $("input[name=postula]").val();
  fich = $("input[name=cambficha]").val();
  foto = $("input[name=cambfoto]").val();

  if (nam == "") {
  Materialize.toast('Debe ingresar Nombres', 2500, 'rounded');
  return false;
  }
  if (lastn == "") {
  Materialize.toast('Debe ingresar Apellidos', 2500, 'rounded');
  return false;
  }
  if(/^[a-zA-Z\s]*$/.test(dn) || dn.length != 8){
    Materialize.toast('DNI Ingresado Incorrecto', 2500, 'rounded');
    return false
  }
  if (fnac == "") {
  Materialize.toast('Debe ingresar Fecha de Nacimiento', 2500, 'rounded');
  return false;
  }

  if (zap.length!=2) {
  Materialize.toast('Talla de zapato Incorrecto', 2500, 'rounded');
  return false;
  }
  if (polo.length > 2 || polo == "") {
  Materialize.toast('Talla de polo Incorrecto', 2500, 'rounded');
  return false;
  }
  if (nacdpto == "" || nacprov == "" || nacdist == "") {
  Materialize.toast('Debe ingresar datos completos en Lugar de Nacimiento', 2500, 'rounded');
  return false;
  };

  if (fing == "") {
  Materialize.toast('Debe ingresar Fecha de Ingreso', 2500, 'rounded');
  return false;
  }
  if (post == "") {
  Materialize.toast('Debe ingresar un puesto que postula', 2500, 'rounded');
  return false;
  };

  data = new FormData();
  data.append("archiv",namearchivo);
  data.append("archivfoto",namefoto);
  data.append("nombre",$("input[name=name]").val());
  data.append("apellidos",$("input[name=apellidos]").val());
  data.append("dni",$("input[name=dni]").val());
  data.append("type", "files");
  data.append("email", $("input[name=email]").val());
  data.append("sex", $("select[id=combosexo]").val());
  data.append("direc1", $("input[name=direc1]").val());
  data.append("direc2", $("input[name=direc2]").val());
  data.append("nac", $("select[id=combonac]").val());
  data.append("fechnac", $("input[name=fechnac]").val());
  data.append("estcivil", $("select[id=comboestcivil]").val());
  data.append("feching", $("input[name=feching]").val());
  data.append("planilla", $("select[id=comboplanilla]").val());
  data.append("cargo", $("select[id=combocargo]").val());
  data.append("discap", $("select[id=combodiscapacidad]").val());
  data.append("tipotrab", $("select[id=combotipotrabajo]").val());

  data.append("distr", $("input[name=distrito]").val());
  data.append("tzapat", $("input[name=tallazapatos]").val());
  data.append("tpolo", $("input[name=tallapolo]").val());
  data.append("postula", $("input[name=postula]").val());
  data.append("dptnac", $("input[name=dptonac]").val());
  data.append("provnac", $("input[name=provnac]").val());
  data.append("distnac", $("input[name=distnac]").val());
  data.append("csrfmiddlewaretoken", $("input[name=csrfmiddlewaretoken]").val());

  if (valor == 'btnnewemple') {
      data.append("exists",true);
      if (fich == "") {
      Materialize.toast('Debe ingresar Ficha de Datos', 4000, 'rounded');
      return false;
      }
      data.append("saveemployee",true);
    $("input[name=cambficha]").each(function(index, element) {
          if (this.files[0] != null) {
            data.append(this.name, this.files[0]);
          }
      });
    $("input[name=cambfoto]").each(function(index, element) {
      if (this.files[0] != null) {
        data.append(this.name, this.files[0]);
          }else{
            data.append(this.name,'');
          }
      });

  }else{
      data.append("editemployee",true);
      $("input[name=cambficha]").each(function(index, element) {
      if (this.files[0] != null) {
        data.append(this.name, this.files[0]);
      }else{
        data.append(this.name,'');
      }
      });
      $("input[name=cambfoto]").each(function(index, element) {
      if (this.files[0] != null) {
        data.append(this.name, this.files[0]);
      }else{
        data.append(this.name,'');
      }
      });

  }
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
        location.reload();
        Materialize.toast('Registro de datos correcto', 4000, 'rounded');
        $(".editemple").modal("close");
      } else {
        Materialize.toast('Error al subir los archivos al servidor', 4000, 'rounded');
        return false;
      }
    }
  });
  }


viewexadoc = function(){
 if(document.getElementById('rexa').checked){
   document.getElementById('zoneexamenes').style.display = 'block';
   document.getElementById('zonedocumento').style.display = 'none';

}else if(document.getElementById('rdoc').checked){
   document.getElementById('zonedocumento').style.display = 'block';
   document.getElementById('zoneexamenes').style.display = 'none';

}
}


//BUSQUEDAS
buscarempleado = function(event) {
  var input,filter,table, tr, td, i;
  input = document.getElementById("txtbuscar");
  filter = input.value.toUpperCase();
  table = document.getElementById("templeados");
  tr = table.getElementsByTagName("tr");

  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    td2= tr[i].getElementsByTagName("td")[2];
    td3= tr[i].getElementsByTagName("td")[3];
    if (td || td2) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1 || 
          td2.innerHTML.toUpperCase().indexOf(filter) > -1 ||
          td3.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = ""; 
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}
buscarexamen = function(event) {
  var input,filter,table, tr, td, i;
  input = document.getElementById("txtbuscarexa");
  filter = input.value.toUpperCase();
  table = document.getElementById("table-detailsexamenes");
  tr = table.getElementsByTagName("tr");

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
}

buscardoc = function(event){
  var input,filter,table, tr, td, i;
  input = document.getElementById("txtbuscardoc");
  filter = input.value.toUpperCase();
  table = document.getElementById("table-detaildocumento");
  tr = table.getElementsByTagName("tr");

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
}

limp_famicr = function(){
  $(".namefamicr").val("");
  $(".parentfamicr").val("");
  $(".areatrabfamicr").val("");
}

limp_emergencia = function(){
  $(".nameemerg").val("");
  $(".direcemerg").val("");
  $(".telemerg").val("");
  $(".parentemerg").val("");
}

limp_medic = function(){
  $(".tipomedic").val("");
  $(".timemedic").val("");
  $(".descmedic").val("");
  $("textarea[name=txtcommedic]").val("");
}


limp_explab = function(){
  $("label[name=codexplab]").text("");
  $("input[name=empexplab]").val("");
  $("input[name=cargoexplab]").val("");
  $("input[name=iniexplab]").val("");
  $("input[name=finexplab]").val("");
  $("input[name=durexplab]").val("");
  $("textarea[name=motivretlab]").val("");
}

limp_familia = function(){
  $(".codfam").text("");
  $("input[name=namefam]").val("");
  $("input[name=parentfam]").val("");
  $("input[name=edadfam]").val("");
  $("input[name=fnacfam]").val("");
}

limp_segsocial = function(){
  $("input[name=regsalfechini]").val("");
  $("input[name=regsalfechfin]").val("");
  $("input[name=regsalentidad]").val("");
  $("input[name=regpensfechini]").val("");
  $("input[name=regpensfechfin]").val("");
  $("input[name=regpenscuspp]").val("");
  $("input[name=cobsalfechini]").val("");
  $("input[name=cobsalfechfin]").val("");
}

limp_proyecto = function(){
  $("input[name=finiproy]").val("");
  $("textarea[name=comenobra]").val("");
}

limp_epps = function(){
$("input[name=itobra]").val("");
$("input[name=fentrepps]").val("");
$("input[name=frecepps]").val("");
$("textarea[name=cepps]").val("");
}

limp_examen = function(){
  $(".archiexa").text("")
  $("input[name=finiexam]").val("");
  $("input[name=fcadexam]").val("");
  $("input[name=aptexa]").val("");
  $("textarea[name=coexa]").val("");
  $("input[name=textoexamen]").val("");
  $("input[name=cambexa]").val("");
}
limp_documento = function(){
  $(".archidoc").text("");
  $("input[name=cdoc]").val("");
  $("input[name=textodocumento]").val("");
  $("input[name=finidoc]").val("");
  $("input[name=fcaducdoc]").val("");
  $("textarea[name=observdoc]").val("");
  $("input[name=textodocumento]").val("");
  $("input[name=cambdocu]").val("");
}


limp_estudio = function(){
  $("input[name=finiestudio]").val("");
  $("input[name=ffinest]").val("");
  $("input[name=instituto]").val("");
  $("input[name=ncarrera]").val("");
  $("input[name=naegreso]").val("");
  $("input[name=nsiteduc]").val("");
  $("input[name=ninstreg]").val("");
}

limp_suspension = function(){
  $(".archisusp").text("")
  $("input[name=namedoc]").val("");
  $("input[name=fechinisusp]").val("");
  $("input[name=fechfinsusp]").val("");
  $("textarea[name=txtcomentsusp]").val("");
  $("input[name=textosuspen]").val("");
  $("input[name=cambsusp]").val("");
}

limp_cuenta = function(){
  $("input[name=dnicuenta]").val("");
  $("input[name=numcuenta]").val("");
  $("input[name=estadocuenta]").val("");
  $("input[name=remuneracion]").val("");
  $("input[name=gratificacion]").val("");
  $("input[name=cts]").val("");
  $("input[name=costoxhora]").val("");
}
limp_telefono = function(){
  $("input[name=telef]").val("");
  $("input[name=teldes]").val(""); 
}

limp_empleado = function(){
  $("input[name=textoficha]").val("");
  $("input[name=textofoto]").val("");
  $(".archificha").text("");
  $(".archifoto").text("");
  $("input[name=name]").val("");
  $("input[name=apellidos]").val("");
  $("input[name=dni]").val("");
  $("input[name=email]").val("");
  $("input[name=direc1]").val("");
  $("input[name=direc2]").val("");
  $("input[name=fechnac]").val("");
  $("input[name=feching]").val("");
  $("input[name=cambficha]").val("");
  $("input[name=cambfoto]").val("");
}
limp_obra = function(){
$("input[name=fechiniproy]").val("");
$("textarea[name=comentobra]").val("");
$("input[name=fechinduccion]").val("");
$("input[name=fechcadinduccion]").val("");
$("textarea[name=comentinduccion]").val("");
$("input[name=itemobra]").val("");
$("input[name=fechentrepps]").val("");
$("input[name=fechrecepps]").val("");   
$("textarea[name=comentepps]").val("");
}


//ultimo rrhh

$(function(){
  $('.tipouniv').change(function(){
    var sup = $("#idcombotipoinst option:selected").attr("data-estsup");
    if (sup=="NO") {
      document.getElementById("divdatasuperior").style.display ="none";
    }else{
      document.getElementById("divdatasuperior").style.display ="block";
    }
  });
});