$(document).ready(function() {
  $('select').material_select();
  $('.modal').modal();

  $("input[name=txtfiltracod]").on("keyup", filtromat);
  $("input[name=txtfiltramat]").on("keyup", filtromat);
  $(document).on("click",".btnviewkar", viewkardex);
  $(document).on("click",".btnselectmat", passdata);
  $(document).on("click",".btnselbrmodel", passdatabrand);
});


filtromat = function(event){
    if (event.which == 13) {
      document.getElementById('checkbrand').checked = false;
      document.getElementById('divbrmodel').style.display = "none";
      var data,text;
      text = this.value;
      data = new Object;
      data.filtramat = true;
      data.tingresado = text;
      $.getJSON("", data, function(response) {
        if (response.status) {
          var stsizemat = response.namematsize;
          console.log(stsizemat);
          if (stsizemat == true) {
          $(".lfiltmat").modal("open");
          $tb = $("table.table-lfiltmat > tbody");
          $tb.empty();
          template = "<tr><td class=\"colnum\">{{ hcount }}</td><td>{{ matname }}</td><td>{{ matmedida }}</td><td><button type=\"button\" style=\"border:none;font-weight:bold;\" class=\"transparent btnselectmat\"  value=\"{{ hcod }}\" data-namemat=\"{{ matname }}\" data-medimat = \"{{ matmedida }}\"><i class=\"fa fa-check\"></i></button></td></tr>";
          for (x in response.lmat) {
          response.lmat[x].item = parseInt(x) + 1;
          $tb.append(Mustache.render(template, response.lmat[x]));
          }
          }else{
            Materialize.toast('No existe Material',3000,'rounded');
            return false;
          }
        }
      });
     }
}

passdata = function(){
  if (document.getElementById('checkbrand').checked) {
    var data,codm,marc,mode;
    nmat = this.getAttribute("data-namemat");
    mmat = this.getAttribute("data-medimat");
    $(".titnamemat").text(nmat+" - "+mmat);

      codm = this.value;
      data = new Object;
      data.filtbrandmodel = true;
      data.codm = codm;
      $.getJSON("", data, function(response) {
        if (response.status) {
          $(".lbrandmodel").modal("open");
          $tb = $("table.table-lbrandmodel > tbody");
          $tb.empty();
          template = "<tr><td class=\"colnum\">{{ mcount }}</td><td>{{ matbrand }}</td><td>{{ matmodel }}</td><td><button type=\"button\" style=\"border:none;font-weight:bold;\" class=\"transparent btnselbrmodel\"  value=\"{{ matcod }}\" data-codbrandmat=\"{{ matbrandcod }}\" data-brandmat=\"{{ matbrand }}\" data-codmodelmat=\"{{ matmodelcod }}\" data-modelmat = \"{{ matmodel }}\"><i class=\"fa fa-check\"></i></button></td></tr>";
          for (x in response.lbrmod) {
          response.lbrmod[x].item = parseInt(x) + 1;
          $tb.append(Mustache.render(template, response.lbrmod[x]));
          }
        }
      });

  }else{
  document.getElementById('divbrmodel').style.display = "none";
  var nm, mm;
  nm = this.getAttribute("data-namemat");
  mm = this.getAttribute("data-medimat")
  $(".txtfiltracod").val(this.value);
  $(".txtfiltramat").val(nm+" - "+mm);
  $(".lfiltmat").modal("close");
  }
}

passdatabrand = function(){
  document.getElementById('divbrmodel').style.display = "block";
  document.getElementById('divbrmodel').readOnly = true;
  var br,mod,nom,codbr,codmod;
  codbr = this.getAttribute("data-codbrandmat");
  br = this.getAttribute("data-brandmat");
  codmod = this.getAttribute("data-codmodelmat");
  mod = this.getAttribute("data-modelmat");
  nom = $(".titnamemat").text();
  brand = this.getAttribute("data-brandmat");
  model = this.getAttribute("data-modelmat");

  $(".txtbrand").val(br);
  $(".txtmodel").val(mod);
  $(".txtfiltramat").val(nom);

  $(".codmarca").text(codbr);
  $(".codmodelo").text(codmod);

  $(".lbrandmodel").modal("close");
  $(".lfiltmat").modal("close");
}

viewkardex = function(){
  var codmat,namemat,t0,t1,descmat;
  t0 = "0";
  t1 = "1";
  n = $(".txtfiltramat").val();
  mar = $(".txtbrand").val();
  mode = $(".txtmodel").val();

  codmat = $(".txtfiltracod").val();
  codbrand = $(".codmarca").text();
  codmodel = $(".codmodelo").text();
  if (codmat == "") {
    Materialize.toast("Debe Ingresar Codigo de Material",2500,"rounded");
    return false;
  }
  if (namemat == "") {
    Materialize.toast("Debe Ingresar Descripcion de Material",2500,"rounded");
    return false;
  };


 if(document.getElementById('rfech').checked){
  var month = $("select[id=combomes]").val();
  m = month;
  y = $(".txtyear").val();

  if (m == null) {
    Materialize.toast("Debe Seleccionar un Mes",2500,"rounded");
    return false;
  }

  if (y.length != 2) {
    Materialize.toast("Año Ingresado Incorrecto",2500,"rounded");
    return false;
  }

  var hreport = $("[name=hreport]").val();
  if (codbrand == "" && codmodel == "") {
    namemat = n;
    window.open(hreport + '/guiasherramienta/reportkardex?codmaterial='+codmat+'&nmaterial='+namemat+'&mes='+m+'&year='+y+'&type='+t0,'_blank');
  }else{
    namemat = n+" - "+mar+" - "+mode;
    window.open(hreport + '/guiasherramienta/reportkardex?codmaterial='+codmat+'&nmaterial='+namemat+'&mes='+m+'&year='+y+'&cbr='+codbrand+'&cmod='+codmodel+'&type='+t1,'_blank');
  }


}else if(document.getElementById('rrango').checked){
  var ryear,rde,rhasta,contador,monthfrom,monthto;
  monthfrom = $("select[id=combofrommes]").val();
  monthto = $("select[id=combotomes]").val();
  ryear = $(".txtyearrango").val();
  rde = monthfrom;
  rhasta = monthto;

  if (ryear.length!=2) {
    Materialize.toast("Año Ingresado Incorrecto",2500,"rounded");
    return false;
  }
  if (rde == null || rhasta == null) {
    Materialize.toast("Debe Seleccionar un mes",2500,"rounded");
    return false;
  }
  if (rde >= rhasta) {
    Materialize.toast("Mes de Inicio debe ser Menor al de Termino",2500,"rounded");
    return false;
  };

  contador = rhasta - rde;
  var rd = parseInt(rde);

  for (var i = 0; i <= contador; i++) {
    y = ryear
    var sum = rd + i;
    if (sum < 10) {
      m = "0"+sum;
    }else{
      m = sum;
    }
    if (codbrand == "" && codmodel == "") {
      namemat = n;
      window.open('http://'+ location.hostname +':6000/guiasherramienta/reportkardex?codmaterial='+codmat+'&nmaterial='+namemat+'&mes='+m+'&year='+y+'&type='+t0,'_blank');
    }else{
      namemat = n+" - "+mar+" - "+mode;
      window.open('http://'+ location.hostname +':6000/guiasherramienta/reportkardex?codmaterial='+codmat+'&nmaterial='+namemat+'&mes='+m+'&year='+y+'&cbr='+codbrand+'&cmod='+codmodel+'&type='+t1,'_blank');
    }

  };

}
}

viewradkar = function(){
 if(document.getElementById('rfech').checked){
   document.getElementById('divfech').style.display = 'block';
   document.getElementById('divrango').style.display = 'none';
   document.getElementById('btnviewkar').style.display = 'block';

}else if(document.getElementById('rrango').checked){
   document.getElementById('divrango').style.display = 'block';
   document.getElementById('divfech').style.display = 'none';
   document.getElementById('btnviewkar').style.display = 'block';
}
}