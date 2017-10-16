
$(document).ready(function() {
  $('select').material_select();
  $('.modal').modal();

  $(".txtfiltramat").on("keyup", filtromat);
  $(".txtbuscmat").on("keyup", buscmat);
  $(".txtfiltracod").on("keyup",filtracod)
  $(document).on("click",".btnviewkar", viewkardex);
  $(document).on("click",".btnviewkarexcel", viewkardex);

  $(document).on("click",".btnselectmat", passdata);
  $(document).on("click",".btnselbrmodel", passdatabrand);
  combochosen("select")
  passyear()
});

passyear = function(){
  var d = new Date()
  $(".txtyear").val(d.getFullYear())
  $(".txtyearrango").val(d.getFullYear())
}

combochosen = function(combo){
$(combo).chosen({
  allow_single_deselect:true,
  width: '100%'});
}

stbrmod = function(){
  var codmat = $(".txtfiltracod").val()
  if (codmat.trim()!="") {
    if (document.getElementById('checkbrand').checked) {
      listbrmodel()
      getdescmat()
    }else{
      limpall()
      document.getElementById('divbrmodel').style.display = "none"
    }
  }else{
    swal({title:'Campo de codigo vacio',timer:1500,showConfirmButton:false,type:'error'})
    document.getElementById('checkbrand').checked = false
    return false
  }
}


limpall = function(){
  document.getElementById('checkbrand').checked = false;
  document.getElementById('divtablebrmod').style.display = 'none';
  $(".txtbrand").val("")
  $(".txtmodel").val("")
  $(".codmarca").text("")
  $(".codmodelo").text("")
}

listbrmodel = function(){
  var data,codmat;
  codmat = $(".txtfiltracod").val()
  data= new Object
  data.codm = codmat
  data.filtbrandmodel=true
  $.getJSON("",data,function(response){
    if (response.status) {
      var lbrmod = response.lbrmod

      var filtbrmod = []
      lbrmod.forEach(function(o) {
        var existing = filtbrmod.filter(function(i) {
          return i.matbrandcod === o.matbrandcod && i.matmodelcod === o.matmodelcod })[0];
        if (!existing)
            filtbrmod.push(o);
      });
      console.log(filtbrmod)

      if (filtbrmod.length>0) {
        document.getElementById('divtablebrmod').style.display="block"
        $tb = $("table.table-lbrandmodel > tbody");
        $tb.empty();
        template = "<tr><td>{{ matbrand }}</td><td>{{ matmodel }}</td><td><button type=\"button\" style=\"border:none;font-weight:bold;font-size:20px\" class=\"transparent btnselbrmodel\"  value=\"{{ matcod }}\" data-codbrandmat=\"{{ matbrandcod }}\" data-brandmat=\"{{ matbrand }}\" data-codmodelmat=\"{{ matmodelcod }}\" data-modelmat = \"{{ matmodel }}\"><a><i class=\"fa fa-check-square-o\"></i></a></button></td></tr>";
        for (x in filtbrmod) {
          lbrmod[x].item = parseInt(x) + 1;
          $tb.append(Mustache.render(template, filtbrmod[x]));
        }
      }else{
        document.getElementById('checkbrand').checked = false
        swal({title:'No existe ingresos del material',showConfirmButton:false,timer:1500,type:'error'})
        return false
      }

    }
  })
}

var matmed=''
getdescmat = function(){
  var data,codmat;
  codmat = $(".txtfiltracod").val()
  data = new Object
  data.getdescmat = true
  data.codmat = codmat
  $.getJSON("",data,function(response){
    if (response.status) {
      matmed = response.desc
      console.log(matmed)
      $(".lblbrmod").text(matmed)
    };
  })
}





filtromat = function(event){
    if (event.which == 13) {
      limpall()
      document.getElementById('divbrmodel').style.display = "none";
      var data,text;
      text = this.value;
      data = new Object;
      data.filtramat = true;
      // data.typfiltro = typfiltro;
      data.tingresado = text;
      $.getJSON("", data, function(response) {
        if (response.status) {
          var lmat = response.lmat;
          console.log(lmat)
          if (lmat.length > 0) {
            $(".lfiltmat").modal("open");
            $tb = $("table.table-lfiltmat > tbody");
            $tb.empty();
            template = "<tr><td>{{ item }}</td><td>{{ matname }}</td><td>{{ matmedida }}</td><td><button type=\"button\" style=\"border:none;font-weight:bold;font-size:20px\" class=\"transparent btnselectmat\"  value=\"{{ hcod }}\" data-namemat=\"{{ matname }}\" data-medimat = \"{{ matmedida }}\"><a><i class=\"fa fa-check-square-o\"></i></a></button></td></tr>";
            for (x in lmat) {
              lmat[x].item = parseInt(x) + 1;
              $tb.append(Mustache.render(template, lmat[x]));
            }
          }else{
            swal({title:'Material Incorrecto',showConfirmButton:false,timer:1500,type:'error'})
            return false;
          }
        }
      });
     }
}

passdata = function(){
  var codm,namemat,medmat;
  namemat = this.getAttribute("data-namemat")
  medmat = this.getAttribute("data-medimat");
  codm = this.value;

  $(".txtfiltracod").val(codm)
  $(".txtfiltramat").val(namemat+"-"+medmat)
  $(".lfiltmat").modal("close");
}

passdatabrand = function(){
  document.getElementById('divbrmodel').style.display = "block";
  var br,mod,nom,codbr,codmod;
  codbr = this.getAttribute("data-codbrandmat");
  br = this.getAttribute("data-brandmat");
  codmod = this.getAttribute("data-codmodelmat");
  mod = this.getAttribute("data-modelmat");
  brand = this.getAttribute("data-brandmat");
  model = this.getAttribute("data-modelmat");

  $(".txtbrand").val(br);
  $(".txtmodel").val(mod);
  $(".codmarca").text(codbr);
  $(".codmodelo").text(codmod);
}


viewkardex = function(){
  console.log(this.value)
  var typekardex = this.value
  var codmat,descmat,cbomes,cbomesfinal,anio,hreport,ruc;
  var brand='',model='',codbrand='',codmodel='';
  var rangemes=[]

  codmat = $(".txtfiltracod").val();
  cbomes=$("select[id=combofrommes]").val()
  cbomesfinal=$("select[id=combotomes]").val()
  anio = $(".txtyear").val()
  hreport = $("[name=hreport]").val();
  ruc = $("[name=ruc]").val();

  if (codmat == "") {
    swal({title:'Ingresar Codigo de Material',showConfirmButton:false,timer:1500,type:'error'})
    return false;
  }
  if (document.getElementById('checkbrand').checked) {
    brand = $(".txtbrand").val();
    model = $(".txtmodel").val();
    codbrand = $(".codmarca").text();
    codmodel = $(".codmodelo").text();

    if (brand=="") {
      swal({title:'Debe Seleccionar Marca y Modelo',showConfirmButton:false,timer:1500,type:'error'})
      return false;
    };
  }else{
    brand = 'S/M'
    model = 'S/M'
    codbrand = 'BR000'
    codmodel = 'MO000'

  }

  if (cbomes==null) {
    swal({title:'Ingresar Mes',showConfirmButton:false,timer:1500,type:'error'})
    return false;
  };

  if (anio.length!=4) {
    swal({title:'Año Incorrecto',showConfirmButton:false,timer:1500,type:'error'})
    return false;
  };

  if(document.getElementById('rrango').checked){
    if (cbomes >= cbomesfinal) {
      swal({title:'Mes Inicial debe ser menor al de termino',showConfirmButton:false,timer:1500,type:'error'})
      return false;
    }else{
      var start = cbomes
      var end = cbomesfinal
      for (var i = parseInt(start) ; i <= end; i++) {
        if (String(i).length==1) {
          i = "0"+i
        };
        rangemes.push({
          'mes':String(i)
        })
      }
    }
  }else{
    rangemes.push({
      'mes':String(cbomes)
    })
  }

  var data
  data = new Object
  data.codmat = codmat
  data.getdescmat = true
  $.getJSON("",data,function(response){
    if (response.status) {
      descmat = response.desc+" - "+brand+" - "+model

      if (typekardex=='pdf') {
        // var ruc = document.getElementsByName("ruc")[0].value
        for (var i = 0; i < rangemes.length; i++) {
          window.open(hreport+'Kardex?codmaterial='+codmat+'&nmaterial='+descmat+'&mes='+rangemes[i]['mes']+'&year='+anio+'&cbr='+codbrand+'&cmod='+codmodel+'&ruc='+ruc,'_blank');
        }
      }else{
        rangemes = JSON.stringify(rangemes)
        window.open("/almacen/kardex/cantidades?exportkardex=true&codmat="+codmat+"&rangemes="+rangemes+"&anio="+anio+"&codbr="+codbrand+"&codmod="+codmodel+"&descmat="+descmat)
      }
    }else{
      swal({title:'Codigo de Material Incorrecto', showConfirmButton:false,timer:1500,type:'error'})
      return false
    }
  })
}




viewradkar = function(){
  if(document.getElementById('rfech').checked){
      document.getElementById('divmesinicio').style.display = 'block';
      document.getElementById('divmesfinal').style.display = 'none';
      document.getElementById('divyear').style.display = 'block';

  }else if(document.getElementById('rrango').checked){
    document.getElementById('divmesinicio').style.display = 'block';
    document.getElementById('divmesfinal').style.display = 'block';
    document.getElementById('divyear').style.display = 'block';
  }
  document.getElementById('divbutton').style.display = 'block';

}

buscadortable = function(idtxtsearch,idtable,col1){
  var input,filter,table, tr, td, i;
  input = document.getElementById(idtxtsearch);
  filter = input.value.toUpperCase();
  table = document.getElementById(idtable);
  tr = table.getElementsByTagName("tr");

  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[col1];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

buscmat = function(){
  buscadortable("txtbuscmat","table-lfiltmat",1);
}

filtracod = function(){
  var codmat = this.value
    var data = new Object
    data.getdescmat = true
    data.codmat=codmat
    $.getJSON("",data,function(response){
      if (response.status) {
        $(".txtfiltramat").val(response.desc)
      }
    })
}