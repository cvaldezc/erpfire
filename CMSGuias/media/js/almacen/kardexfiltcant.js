$(document).ready(function() {
  $('select').material_select();

  $(document).on("click",".btnkarsindet", karsindet);
  $(document).on("click",".btnkarcondet", karcondet);
  $(document).on("click",".btnviewkarcondet", viewkarcondet);
  $(document).on("click",".btnexportmat", exportmat);
  $(document).on("click",".btnexportmatbrand", exportmat);


  $(".btnfiltmat").on("click", filtmat);
  $(".txtbuscarmat").on("keyup",buscarmat);

  combochosen("select")
  passyear()

});


buscarmat = function(){
  buscador("txtbuscarmat","table-materiales",1,2)
}
buscador = function(idtxtsearch,idtable,col1,col2){
  var input,filter,table, tr, td,td2, i;
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

passyear = function(){
  var d = new Date()
  $(".year").val(d.getFullYear())
}


combochosen = function(combo){
$(combo).chosen({
  allow_single_deselect:true,
  width: '100%'});
}

radiomeses = function(){
	var status = ''
  limpdata()
	if (document.getElementById('rdmes').checked) {
		status = "none"
	}else{
		status = "block"
	}
	document.getElementById('divcbotomes').style.display=status
}

radioinout = function(){
  // limpdata()
}


filtmat = function(){

  var tab,cbomes,cbomesfinal,anio,cantidad,rangemes=[];
  var listfinal = [],cantidad, cbosimb, cantbymov,cbosimbbymov;
  cantidad = $(".cantidad").val()
  cantbymov = $(".cantbymov").val()
  cbosimb = $("select[id=cbosimbcant]").val()
  cbomes = $("select[id=cbofrommes]").val()
  cbomesfinal = $("select[id=cbotomes]").val()
  anio = $(".year").val()
  cantidad = $(".cantidad").val()
  tab = $(".tabs .tab a.active").attr("value")
  cbosimbbymov = $("select[id=cbosimbbymov]").val()
  console.log(cbomes)

  if (cbomes==null) {
    swal({title:"Seleccionar Mes",showConfirmButton:false,timer:1500,type:'error'})
    return false
  };

  if (document.getElementById('rdrango').checked) { // SI ES VARIOS MESES
    if (cbomesfinal==null) {
      swal({title:"Seleccionar Mes Final",showConfirmButton:false,timer:1500,type:'error'})
      return false
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
    if (cbomes>=cbomesfinal) {
      swal({title:"Mes Final debe ser Mayor al mes Inicial",showConfirmButton:false,timer:1500,type:'error'})
      return false
    };
  }else{ // SI ES UN MES
    rangemes.push({
      'mes':String(cbomes)
    })
  }

  console.log(rangemes)

  // VALIDACIONES DE CAMPOS

  if (anio.length!=4) {
    swal({title:"Año Incorrecto",showConfirmButton:false,timer:1500,type:'error'})
    return false
  };

  var data = new Object;
  data.mes = cbomes
  data.rangemes = JSON.stringify(rangemes)
  data.anio = anio

  if (document.getElementById('checkstfilt').checked) { //Si filtro avanzado es SI
    if (tab=="tab1") { // SI ESTA ACTIVADO EL TAB POR CANTIDAD DE MOVIMIENTOS
      if (cantbymov.trim()=="") {
          swal({title:"Ingresar Cantidad",showConfirmButton:false,timer:1500,type:'error'})
          return false
      }
      getcantbymov(rangemes,cantbymov,cbosimbbymov)


    }else{
      if (cantidad.trim()=="") {
        swal({title:"Ingresar Cantidad",showConfirmButton:false,timer:1500,type:'error'})
        return false
      }


      Materialize.toast('Procesando, espere!', parseInt('undefined'),'center');
      if (document.getElementById('rdin').checked) {
        console.log(data.rangemes)
        data.getmating=true
        $.getJSON("",data,function(response){
          if (response.status) {
            var lmating = response.lmating
            var lmatdev = response.lmatdev
            console.log(lmating)
            console.log(lmatdev)

            var lmatinglist = []
              lmating.forEach(function(o) {
                var existing = lmatinglist.filter(function(i) {
                  return i.codmat === o.codmat })[0];
                if (!existing)
                    lmatinglist.push(o);
              });

            console.log(lmatinglist)

            var lmatdevlist = []
              lmatdev.forEach(function(o) {
                var existing = lmatdevlist.filter(function(i) {
                  return i.codmat === o.codmat })[0];
                if (!existing)
                    lmatdevlist.push(o);
              });

            data.getcanting = true
            data.lmating = JSON.stringify(lmatinglist)
            data.lmatdev = JSON.stringify(lmatdevlist)
            $.getJSON("",data,function(response){
              if (response.status) {
                var lsumlmating = response.lsumlmating
                console.log(lsumlmating)
                var sumlist = []
                lsumlmating.forEach(function(o) {
                  var existing = sumlist.filter(function(i) {
                    return i.codmat === o.codmat })[0];
                    if (!existing)
                        sumlist.push(o);
                    else
                        existing.sumtotal += o.sumtotal;
                });
                console.log(sumlist)
                validarcant(sumlist)
              }else{
                console.log('error en getcanting')
              }
            })
          }else{
            console.log('error en getmating')
          }
        });
      }else{
        data.getmatsal = true
        console.log(rangemes,anio)
        $.getJSON("",data,function(response){
          if (response.status) {
            var lmatsal = response.lmatsal
            console.log(lmatsal)

            var sumlist = []
            lmatsal.forEach(function(o) {
              var existing = sumlist.filter(function(i) {
                return i.codmat === o.codmat })[0];
              if (!existing){
                  sumlist.push(o);
              }else{
                  existing.sumtotal += o.sumtotal;
              }
            });
            console.log(sumlist)
            validarcant(sumlist)

          };
        })
      }

    }
  }else{
    getcantbymov(rangemes,0,"mayor")
  }
}


getcantbymov = function(rangomes,cantidad,signo){
  Materialize.toast('Procesando, espere!', parseInt('undefined'));
  var data,anio;
  anio = $(".year").val()
  data = new Object
  data.rangemes = JSON.stringify(rangomes)
  data.getmatgen=true
  data.cantbymov=cantidad
  data.anio=anio
  data.signo = signo
  console.log(rangomes)
  console.log(cantidad, anio)
  $.getJSON("",data,function(response){
    if (response.status) {
      var lfilter = response.lfilter
      var lfilter2=[]

      lfilter.forEach(function(o) {
      var existing = lfilter2.filter(function(i) {
        return i.codmat == o.codmat })[0];
        if (!existing){
            lfilter2.push(o);
        }else{
            existing.sumtotal += o.sumtotal;
        }
      });




      $('.toast').remove()
      console.log(lfilter2)
      // listmaterials(lfilter2)
      validarcant(lfilter2)
      if (lfilter2.length>0) {
        swal({title:'Datos Cargados',showConfirmButton:false,timer:1500,type:'success'})
      }else{
        swal({title:'No existe movimientos con el detalle ingresado',showConfirmButton:false,timer:1500,type:'error'})
        return false
      }
    };
  })
}


validarcant = function(sumlist){
  var cbosimb='',cantidad='',cbosimbcant,cbosimbbymov,cantbycant,cantbymov,tab;
  tab = $(".tabs .tab a.active").attr("value")
  cbosimbcant = $("select[id=cbosimbcant]").val()
  cantbycant = $(".cantidad").val()
  cbosimbbymov = $("select[id=cbosimbbymov]").val()
  cantbymov = $(".cantbymov").val()
  console.log(tab)
  if (tab=="tab1") {
    cantidad = cantbymov
    cbosimb=cbosimbbymov
  }else{
    cantidad = cantbycant
    cbosimb=cbosimbcant
  }
  if (document.getElementById('checkstfilt').checked==false) {
    cbosimb="mayor"
    cantidad = 0
  };

  if (sumlist.length>0) {
    $('.toast').remove()

    // var cbosimb = $("select[id=cbosimbcant]").val()
    // var cantidad = $(".cantidad").val()
    var listfinal = []
    for (var i = 0; i < sumlist.length; i++) {
      if (cbosimb=="mayor") {
        if (sumlist[i]['sumtotal']>cantidad) {
          listfinal.push({
            'codmat':sumlist[i]['codmat'],
            'namemat':sumlist[i]['namemat'],
            'medmat':sumlist[i]['medmat'],
            'unidad':sumlist[i]['unidad'],
            'sumtotal':Math.round(sumlist[i]['sumtotal']*1000)/1000
          })
        };

      }else if (cbosimb=="menor") {
        if (sumlist[i]['sumtotal']<cantidad) {
          listfinal.push({
            'codmat':sumlist[i]['codmat'],
            'namemat':sumlist[i]['namemat'],
            'medmat':sumlist[i]['medmat'],
            'unidad':sumlist[i]['unidad'],
            'sumtotal':Math.round(sumlist[i]['sumtotal']*1000)/1000
          })
        };

      }else{
        if (sumlist[i]['sumtotal']==cantidad) {
          listfinal.push({
            'codmat':sumlist[i]['codmat'],
            'namemat':sumlist[i]['namemat'],
            'medmat':sumlist[i]['medmat'],
            'unidad':sumlist[i]['unidad'],
            'sumtotal':Math.round(sumlist[i]['sumtotal']*1000)/1000
          })
        };

      }
    }
    listmaterials(listfinal)
  }else{
    $('.toast').remove()
    swal({title:'No se registra movimientos',showConfirmButton:false,timer:2000,type:'error'})
    return false;
  }
}




listmaterials=function(lista){
  var lst=[]
  if (lista.length>0) {
    $(".lblcodmat").text('')
    $(".lbldescmat").text('')
    listbrands(lst)
  };
  document.getElementById('divtables').style.display="block"
  $tb = $("table.table-materiales > tbody");
  $tb.empty();
  template = "<tr><td>{{ item }}</td><td>{{ codmat }}</td><td>{{ namemat }} {{ medmat }}</td><td>{{ unidad }}</td><td>{{ sumtotal }}</td><td><button type=\"button\" class=\"transparent btnkarsindet\" data-codmat=\"{{ codmat }}\" data-namemat=\"{{ namemat }}\" data-medmat=\"{{ medmat }}\" style=\"font-size:20px;border:none\"><a style=\"color:#26a69a\"><i class=\"fa fa-file-pdf-o\"></i></a></button></td><td><button type=\"button\" class=\"transparent btnexportmat\" data-tipobrand=\"SM\" data-codmat=\"{{ codmat }}\" data-namemat=\"{{ namemat }}\" data-medmat=\"{{ medmat }}\" style=\"border:none;font-size:20px\"><a><i class=\"fa fa-file-excel-o\"></i></a></button></td><td style=\"text-align:center\"><button type=\"button\" class=\"transparent btnkarcondet\" data-codmat=\"{{ codmat }}\" data-namemat=\"{{ namemat }}\" data-medmat=\"{{ medmat }}\" style=\"font-size:20px;border:none;\"><a style=\"color:#EF5350\"><i class=\"fa fa-angle-double-right\"></i></a></button></td></tr>";
  for (x in lista) {
    lista[x].item = parseInt(x) + 1;
    $tb.append(Mustache.render(template, lista[x]));
  }
}




karsindet = function(){
  var hreport,ruc,t0,t1,codmat,namemat,m,y,brand,model,codbrand,codmodel;
  var rangemes=[]
  hreport = $("[name=hreport]").val();
  ruc = $("[name=ruc]").val();
  t0 = "0"; //sin marca ni modelo
  codbrand='BR000'
  codmodel='MO000'
  brand = "S/M"
  model = "S/M"
  codmat = this.getAttribute("data-codmat")
  namemat = this.getAttribute("data-namemat")+" - "+ this.getAttribute("data-medmat")+" - "+brand+" - "+model
  m = $("select[id=cbofrommes]").val()
  mfinal = $("select[id=cbotomes]").val()
  y = $(".year").val()

  if (document.getElementById('rdrango').checked) {
    var start = m
    var end = mfinal
    for (var i = parseInt(m) ; i <= end; i++) {
      if (String(i).length==1) {
        i = "0"+i
      };
      rangemes.push({
        'mes':String(i)
      })
    }
  }else{
    rangemes.push({
      'mes':String(m)
    })
  }

  for (var i = 0; i < rangemes.length; i++) {
    window.open(hreport+'Kardex?codmaterial='+codmat+'&nmaterial='+namemat+'&mes='+rangemes[i]['mes']+'&year='+y+'&cbr='+codbrand+'&cmod='+codmodel+'&ruc='+ruc,'_blank');
  };


  // if (document.getElementById('rdmes').checked) {

  //   window.open(hreport+'Kardex?codmaterial='+codmat+'&nmaterial='+namemat+'&mes='+m+'&year='+y+'&type='+t0,'_blank');
  // }else{

  //   for (var i= parseInt(m); i <= mfinal; i++) {
  //     if (String(i).length==1) {
  //       i = "0"+i
  //     }else{
  //       i = String(i)
  //     }
  //     window.open(hreport+'Kardex?codmaterial='+codmat+'&nmaterial='+namemat+'&mes='+i+'&year='+y+'&type='+t0,'_blank');
  //   };
  // }


}

karcondet = function(){
  var codmat,cbomes,cbomesfinal,namemat,medmat,filtro='',filterinout,tab;
  var rangemes=[]
  codmat = this.getAttribute("data-codmat");
  namemat = this.getAttribute("data-namemat")
  medmat = this.getAttribute("data-medmat")
  cbomes = $("select[id=cbofrommes]").val()
  cbomesfinal = $("select[id=cbotomes]").val()
  year = $(".year").val()
  filterinout = $("input[name=groupinout]:checked").val()
  console.log(filterinout)
  tab = $(".tabs .tab a.active").attr("value")

  if (document.getElementById('rdrango').checked) {
    var start = cbomes
    var end = cbomesfinal
    for (var i = parseInt(cbomes) ; i <= end; i++) {
      if (String(i).length==1) {
        i = "0"+i
      };
      console.log(i)
      rangemes.push({
        'mes':String(i)
      })
    }
  }else{
    rangemes.push({
      'mes':String(cbomes)
    })
  }

  console.log(rangemes)

  var typebrand=''
  if (document.getElementById('checkstfilt').checked && tab=="tab2") {
    typebrand='bymat'
  }else{
    typebrand='bymov'
  }


    var data= new Object
    data.codmat = codmat
    data.year = year
    data.rangemes = JSON.stringify(rangemes)
    data.getbrands = true
    data.typebrand = typebrand
    data.filtro = filterinout
    $.getJSON("",data,function(response){
      if (response.status) {
        var lbrands = ''
        var lbrandsfinal= []
        if (typebrand=='bymat') {
          lbrands = response.lbrbymat
        }else{
          lbrands = response.lbrbymov
        }

        console.log(lbrands)
        $(".lblcodmat").text(codmat)
        $(".lbldescmat").text(namemat+" - "+medmat)

        lbrands.forEach(function(o) {
           var existing = lbrandsfinal.filter(function(i) {
            return i.codbrand == o.codbrand && i.codmodel == o.codmodel })[0];
          if (!existing){
              console.log('no existe')
              lbrandsfinal.push(o);
          }else{
              console.log('existe')
              existing.cantidad += o.cantidad;
          }
        });

        listbrands(lbrandsfinal)
      };
    })


}

listbrands = function(lista){
  $tb = $("table.table-brands > tbody");
  $tb.empty();
  template = "<tr><td>{{ item }}</td><td>{{ brand }}</td><td>{{ model }}</td><td>{{ cantidad }}</td><td style=\"text-align:center\"><button type=\"button\" class=\"transparent btnviewkarcondet\" data-codbrand=\"{{ codbrand }}\" data-codmodel=\"{{ codmodel }}\" data-brand=\"{{ brand }}\" data-model=\"{{ model }}\" style=\"font-size:20px;border:none\"><a style=\"color:#26a69a\"><i class=\"fa fa-file-pdf-o\"></i></a></button></td><td><button type=\"button\" class=\"transparent btnexportmatbrand\" data-tipobrand=\"CM\" data-codbrand=\"{{ codbrand }}\" data-codmodel=\"{{ codmodel }}\" data-brand=\"{{ brand }}\" data-model=\"{{ model }}\" style=\"border:none;font-size:20px\"><a><i class=\"fa fa-file-excel-o\"></i></a></button></td></tr>";
  for (x in lista) {
    lista[x].item = parseInt(x) + 1;
    $tb.append(Mustache.render(template, lista[x]));
  }

}

viewkarcondet=function(){
  var m,y,cbomesfinal,hreport,ruc,t1,codbrand,codmodel,codmat,namemat,brand,model;
  t1="1" //con marca y modelo
  hreport = $("[name=hreport]").val();
  ruc = $("[name=ruc]").val();
  codbrand = this.getAttribute("data-codbrand")
  brand = this.getAttribute("data-brand")
  model = this.getAttribute("data-model")
  codmodel = this.getAttribute("data-codmodel")
  m = $("select[id=cbofrommes]").val()
  y = $(".year").val()
  cbomesfinal = $("select[id=cbotomes]").val()
  codmat = $(".lblcodmat").text()
  namemat = $(".lbldescmat").text()+" - "+brand+" - "+model


  if (document.getElementById('rdmes').checked) {
    window.open(hreport+'Kardex?codmaterial='+codmat+'&nmaterial='+namemat+'&mes='+m+'&year='+y+'&cbr='+codbrand+'&cmod='+codmodel+'&type='+t1+'&ruc='+ruc,'_blank');
  }else{
    for (var i= parseInt(m); i <= cbomesfinal; i++) {
      if (String(i).length==1) {
        i = "0"+i
      }else{
        i = String(i)
      }
      window.open(hreport+'Kardex?codmaterial='+codmat+'&nmaterial='+namemat+'&mes='+i+'&year='+y+'&cbr='+codbrand+'&cmod='+codmodel+'&type='+t1+'&ruc='+ruc,'_blank');
    };

  }
  // console.log(rangemes)
}

stfilt = function(){
  var display=''
  if (document.getElementById('checkstfilt').checked) {
    display='block'
  }else{
    display='none'
  }
  document.getElementById('div-detfiltro').style.display=display
  limpdata()
}


limpdata = function(){
  list=[]
  listmaterials(list)
  listbrands(list)
  $(".lblcodmat").text('')
  $(".lbldescmat").text('')
  document.getElementById('divtables').style.display="none"
  // document.getElementById('div-detfiltro').style.display="none"

  $(".cantbymov").val('')
  $(".cantidad").val('')
  $('ul.tabs').tabs('select_tab', 'divtab-cantregister');

}

exportmat = function(){
  var rangemes=[]
  var codbr='',codmod=''
  var data,codmat,codbr,codmod,anio,cbomes,cbomesfinal,tipobrand,descmat,brand,model;
  cbomes = $("select[id=cbofrommes]").val()
  cbomesfinal = $("select[id=cbotomes]").val()

  anio=$(".year").val()
  tipobrand = this.getAttribute("data-tipobrand")

  if (tipobrand=="SM") {
    name = this.getAttribute("data-namemat")
    medida = this.getAttribute("data-medmat")
    brand='S/M'
    model='S/M'
    descmat = name+" - "+medida+" - "+brand+" - "+model
    codbr='BR000'
    codmod='MO000'
    codmat = this.getAttribute('data-codmat')
  }else{
    codbr=this.getAttribute("data-codbrand")
    codmod=this.getAttribute("data-codmodel")
    codmat=$(".lblcodmat").text()
    brand=this.getAttribute("data-brand")
    model=this.getAttribute("data-model")
    descmat = $(".lbldescmat").text()+" - "+brand+" - "+model
  }
  console.log(codbr,codmod,codmat)


  if (document.getElementById('rdrango').checked) {
    var start = cbomes
    var end = cbomesfinal
    for (var i = parseInt(cbomes) ; i <= end; i++) {
      if (String(i).length==1) {
        i = "0"+i
      };
      console.log(i)
      rangemes.push({
        'mes':String(i)
      })
    }
  }else{
    rangemes.push({
      'mes':String(cbomes)
    })
  }
  console.log(codbr,codmod)
    rangemes = JSON.stringify(rangemes)
    window.open("/almacen/kardex/cantidades?exportkardex=true&codmat="+codmat+"&rangemes="+rangemes+"&anio="+anio+"&codbr="+codbr+"&codmod="+codmod+"&descmat="+descmat)

}
