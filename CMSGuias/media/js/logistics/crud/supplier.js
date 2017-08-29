var getDataRUC;

$(document).ready(function() {
  $("input,select").attr("class", "form-control input-lg");
  $("select[name=pais]").on("click", getDepartamentOption);
  $("select[name=departamento]").on("click", getProvinceOption);
  $("select[name=provincia]").on("click", getDistrictOption);
  $("button.btn-search").on("click", getDataRUC);



  $(".btnsavesupplier").on("click", savesupplier);
  $(".btnnewsupplier").on("click", newsupplier);
  $(document).on("click", ".btneditprov", editprov);
  $(document).on("click", ".btndelprov", delproveedor);
  $(".btnlimpiarprov").on("click", limpiarprov);


  $("input[name=txtbuscprov]").on("keyup",buscprov)







  setTimeout(function() {
    return $("input[name=proveedor_id]").keyup(function(event) {
      if (this.value.length === 11) {
        // getDataRUC();
      }
    });
  }, 1500);
  if ($(".alert-success").is(":visible")) {
    setTimeout(function() {
      window.close();
    }, 2600);
  }

  listproveedor()
});


delproveedor = function(){
  var data, ruc;
  ruc = this.value

  swal({
    title:'Eliminar Proveedor',
    text: 'Seguro de Eliminar Proveedor?',
    showConfirmButton:true,
    showCancelButton:true,
    closeOnConfirm:false,
    closeOnCancel:true,
    type:'warning'

  },function(isConfirm){
    if (isConfirm) {
        data = new Object
        data.ruc = ruc
        data.delprov = true
        data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
        $.post("",data,function(response){
          if (response.status) {
            swal({title:'Proveedor Eliminado', showConfirmButton:false, timer:1500,type:'success'})
            listproveedor()
          }else{
            swal({title:'ERROR: Proveedor ya esta siendo usado', showConfirmButton:false, timer:1500,type:'error'})
            return false
          }
        })
    };
  })
}

getDataRUC = function() {
  var data, ruc;
  ruc = $("input[name=proveedor_id]").val();
  if (ruc.length === 11) {
    data = new Object();
    data.ruc = ruc;
    data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
    $.post("/json/restful/data/ruc/", data, function(response) {
      console.log(response);
      if (response.status) {
        $("input[name=razonsocial]").val(response.reason);
        $("input[name=direccion]").val(response.address);
        return $("input[name=telefono]").val(response.phone);
      } else {
        return $().toastmessage("showWarningToast", "No se a encontrado el Proveedor.");
      }
    }, "json");
    return;
  } else {
    $().toastmessage("showWarningToast", "El numero de ruc es invalido!");
  }
};

editprov=function(){
  document.getElementById('proveedor_id').readOnly=true
  $(".lbltipo").text("edit");
  $(".divnewprov").slideDown(500);
  var ruc,rsocial,dir,pais,telef,tipo,origen,email,contact,rubro,coddpto,namedpto,codprov,nameprov,coddist,namedist;
  ruc = this.value
  rsocial = this.getAttribute("data-rsocial")
  dir = this.getAttribute("data-direccion")
  pais = this.getAttribute("data-pais")
  telef = this.getAttribute("data-telef")
  tipo = this.getAttribute("data-tipo")
  origen = this.getAttribute("data-origen")
  email = this.getAttribute("data-email")
  contact = this.getAttribute("data-contacto")
  rubro = this.getAttribute("data-rubro")

  coddpto = this.getAttribute("data-coddpto")
  namedpto = this.getAttribute("data-namedpto")
  codprov = this.getAttribute("data-codprov")
  nameprov = this.getAttribute("data-nameprov")
  coddist = this.getAttribute("data-coddist")
  namedist = this.getAttribute("data-namedist")


  $("input[name=proveedor_id]").val(ruc)
  $("input[name=razonsocial]").val(rsocial)
  $("input[name=direccion]").val(dir)
  $("select[id=cbopais]").val(pais)
  $("input[name=telefono]").val(telef)
  $("input[name=tipo]").val(tipo)
  $("input[name=origen]").val(origen)
  $("input[name=email]").val(email)
  $("input[name=contact]").val(contact)
  $("select[id=cborubro]").val(rubro)

  var listdpto=[],listprov=[],listdist=[]

  listdpto.push({
    'codigo':coddpto,
    'name':namedpto
  })
  listprov.push({
    'codigo':codprov,
    'name':nameprov
  })
  listdist.push({
    'codigo':coddist,
    'name':namedist
  })
  almcboedits('cbodepartamento',listdpto)
  almcboedits('cboprovincia',listprov)
  almcboedits('cbodistrito',listdist)
}

almcboedits = function(cbo,lista){
  $("#"+cbo).empty();
  idcbo = document.getElementById(cbo);
  almcbo(lista,'name','codigo',idcbo);
  $("select[id="+cbo+"]").val(lista[0]['codigo'])
}


newsupplier = function(){
  document.getElementById('proveedor_id').readOnly=false
  $(".lbltipo").text("new");
  $(".divnewprov").slideToggle(500);
  limpiarprov()
}

listproveedor = function(){
  var data = new Object
  data.listproveedor = true
  $.getJSON("",data,function(response){
    if (response.status) {
      var lproveedor= response.lproveedor
      $tb = $("table.table-listprov > tbody");
      $tb.empty();
      template = "<tr><td class=\"\">{{ item }}</td><td>{{ ruc }}</td><td class=\"\">{{ razonsocial }}</td><td>{{ direcomp }}</td><td class=\"\">{{ telefono }}</td><td>{{ email }}</td><td class=\"\">{{ contacto }}</td><td class=\"\"><button type=\"button\" class=\"transparent btneditprov\" style=\"border:none;font-size:20px;\" value=\"{{ ruc }}\" data-rsocial=\"{{ razonsocial }}\" data-direccion=\"{{ direccion }}\" data-pais=\"{{ pais }}\" data-telef=\"{{ telefono }}\" data-tipo=\"{{ tipo }}\" data-origen=\"{{ origen }}\" data-email=\"{{ email }}\" data-contacto=\"{{ contacto }}\" data-rubro=\"{{ rubro }}\" data-coddpto=\"{{ coddpto }}\" data-namedpto=\"{{ namedpto }}\" data-codprov=\"{{ codprov }}\" data-nameprov=\"{{ nameprovincia }}\" data-coddist=\"{{ coddist }}\" data-namedist=\"{{ namedist }}\"><a style=\"\"><span class=\"glyphicon glyphicon-edit\"></span></a></button></td><td><button type=\"button\" class=\"transparent btndelprov\" style=\"border:none;margin-left:20px;font-size:20px;;\" value=\"{{ ruc }}\"><a style=\"color:#ef5350\"><i class=\"fa fa-trash\"></i></a></button></td></tr>";
      for (x in lproveedor) {
      lproveedor[x].item = parseInt(x) + 1;
      $tb.append(Mustache.render(template, lproveedor[x]));
      }
    }
  })
}

savesupplier = function(){
  var rucprov,rsocial,direc,pais,dpt,prov,dist,telef,tipo,origen,email,contacto,rubro,lbltipo;
  rucprov = $("input[name=proveedor_id]").val()
  rsocial = $("input[name=razonsocial]").val()
  direc = $("input[name=direccion]").val()
  pais = $("select[id=cbopais]").val()
  dpt = $("select[id=cbodepartamento]").val()
  prov = $("select[id=cboprovincia]").val()
  dist = $("select[id=cbodistrito]").val()
  telef = $("input[name=telefono]").val()
  tipo = $("input[name=tipo]").val()
  origen = $("input[name=origen]").val()
  email = $("input[name=email]").val()
  contacto = $("input[name=contact]").val()
  rubro = $("select[id=cborubro]").val()
  lbltipo = $("label[name=lbltipo]").text()
  console.log(tipo)
  console.log(dpt)

  if (rucprov.trim()=="") {
    swal({title:'Debe ingresar Ruc de Proveedor', showConfirmButton:false, timer:1500, type:'error'})
    return false;
  }

  if (rsocial.trim()=="") {
    swal({title:'Debe ingresar Razon Social', showConfirmButton:false, timer:1500, type:'error'})
    return false;
  };
  if (direc.trim()=="") {
    swal({title:'Debe ingresar Direccion', showConfirmButton:false, timer:1500, type:'error'})
    return false;
  };

  if (pais=="") {
    swal({title:'Debe Seleccionar Pais', showConfirmButton:false, timer:1500, type:'error'})
    return false;
  };

  if (dpt=="") {
    swal({title:'Debe Seleccionar departamento', showConfirmButton:false, timer:1500, type:'error'})
    return false;
  };

  if (prov=="") {
    swal({title:'Debe Seleccionar provincia', showConfirmButton:false, timer:1500, type:'error'})
    return false;
  };

  if (dist=="") {
    swal({title:'Debe Seleccionar Distrito', showConfirmButton:false, timer:1500, type:'error'})
    return false;
  };

  if (telef.trim()=="") {
    swal({title:'Debe ingresar Telefono', showConfirmButton:false, timer:1500, type:'error'})
    return false;
  };

  if (tipo.trim()=="") {
    swal({title:'Debe ingresar Tipo', showConfirmButton:false, timer:1500, type:'error'})
    return false;
  };

  if (origen.trim()=="") {
    swal({title:'Debe ingresar Origen', showConfirmButton:false, timer:1500, type:'error'})
    return false;
  };

  var data= new Object
  data.rucprov = rucprov
  data.rsocial=rsocial
  data.direc=direc
  data.pais=pais
  data.dpt=dpt
  data.prov=prov
  data.dist=dist
  data.telef=telef
  data.tipo=tipo
  data.origen=origen
  data.email=email
  data.contacto=contacto
  data.rubro=rubro
  data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();


  if (lbltipo=="new") {
    var dato= new Object
    dato.rucprov = rucprov
    dato.exists = true
    dato.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
    $.post("",dato,function(exists){
      if (!exists.status) {
        delete dato.exists;

        swal({
          title:'Crea Proveedor',
          text:'Seguro de Crear Proveedor',
          showConfirmButton:true,
          showCancelButton:true,
          closeOnConfirm: false,
          closeOnCancel: true,
          type:'warning'
        },function(isConfirm){
          if (isConfirm) {
            data.savesupplier = true
            $.post("",data,function(response){
              if (response.status) {
                  swal({title:'Proveedor Agregado', showConfirmButton:false,timer:1500,type:'success'})
                  listproveedor()
              };
            })
          };
        })
      }else{
        swal({title:'Numero de Ruc ya existe', showConfirmButton:false,timer:1500,type:'error'})
        return false
      }
    })
  }else{
    data.editprove = true
    $.post("",data,function(response){
      if (response.status) {
        swal({title:'Proveedor Editado', showConfirmButton:false,timer:1500,type:'success'})
        listproveedor()
      };
    })
  }
}

limpiarprov = function(){
  $("input[name=proveedor_id]").val('')
  $("input[name=razonsocial]").val('')
  $("input[name=direccion]").val('')
  $("select[id=cbopais]").val('')
  $("select[id=cbodepartamento]").val('')
  $("select[id=cboprovincia]").val('')
  $("select[id=cbodistrito]").val('')
  $("input[name=telefono]").val('')
  $("input[name=tipo]").val('')
  $("input[name=origen]").val('')
  $("input[name=email]").val('')
  $("input[name=contact]").val('')
}


almcbo = function(lista,contenido,id,combo){
  console.log(lista)
  var optt = document.createElement("option")
  optt.textContent = "Seleccionar";
  optt.value = "";
  combo.appendChild(optt)
  for(var i = 0; i < lista.length; i++) {
      var opt = document.createElement("option");
      opt.textContent = lista[i][contenido];
      opt.value = lista[i][id];
      combo.appendChild(opt)
  }
}

cboalmdpto = function(cbovalue,cboalm){
  $(function(){
    $(cbovalue).change(function(){
      $("#"+cboalm).empty();
      var data;
      data = new Object;
      data.codigo = this.value;
      console.log(this.value)
      if (cbovalue=="#cbopais") {
        data.listdpto = true;
      }else if(cbovalue=="#cbodepartamento"){
        data.listprov = true
      }else{
        data.listdist = true
      }
      $.getJSON("", data, function(response) {
        var lista = response.lista;
        console.log(cboalm)
        cbodpto = document.getElementById(cboalm);
        console.log(cbodpto)
        almcbo(lista,'name','codigo',cbodpto);
      });
    });
  });
}

cboalmdpto("#cbopais","cbodepartamento");
cboalmdpto("#cbodepartamento","cboprovincia");
cboalmdpto("#cboprovincia","cbodistrito");


buscprov = function(event){
  buscador("txtbuscprov","table-listprov")
}

buscador = function(idtxtinput,idtable){
  var input,filter,table, tr, td,td2, i;
  input = document.getElementById(idtxtinput);
  filter = input.value.toUpperCase();
  table = document.getElementById(idtable);
  tr = table.getElementsByTagName("tr");

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
}