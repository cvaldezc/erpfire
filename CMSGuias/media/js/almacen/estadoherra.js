$(document).ready(function() {
$('.modal').modal();

$(document).on("click",".btndetestalmacen", detestalmacen);

$(document).on("click",".btncomentalmacen", comentalmacen);
$(".txtestbuscarh").on("keyup", buscaresth);
$(".txtestbuscardeth").on("keyup",buscardeth);
$(".txtbuscdetalquiler").on("keyup",buscdetalquiler);
$(".txtbuscdetrepar").on("keyup",buscdetrepar);

});


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

comentalmacen = function(){
	var comen = this.getAttribute("data-coment");
	if (comen != "") {
		$(".txtcoment").text(comen);	
		$(".coment").modal("open");
	}else{
		Materialize.toast("No existe comentario para el material seleccionado",2500,"rounded");
		return false;
	}
	
	
	
}

detestalmacen = function(){
	var data,id,idestado;
	id = this.value;
	nameh = this.getAttribute("data-nameh");
	medh = this.getAttribute("data-medidah");
	marcah = this.getAttribute("data-marcah");
	descripcionh = nameh+" "+medh+" "+marcah 
	idest = $("select[id=comboestadherra]").val();
	console.log(idest)
	if (idest == "ALQUILER" || idest == "ALMACEN") {
		if (id !== "") {
		data = {
			codhe : id,
			ldetalmacen : true,
			idestado : idest,
		};
		$.getJSON("", data, function(response) {
	        var $tb, template, x;
	      if (response.status) {
	      	if (idest == "ALMACEN") {
		      	$(".detestalmacen").modal("open");
		      	$(".titcodherra").text("CODIGO: "+id);
		      	$(".titdescherra").text(descripcionh);
		        $tb = $("table.table-detestalmacen > tbody");
		        $tb.empty();
		        template = "<tr><td class=\"colnum\">{{ count }}</td><td>{{ nompro }}</td><td>{{ numguia }}</td><td>{{ cantidad }}</td><td>{{ fechsalida }}</td><td><button type=\"button\" style=\"border:none;font-weight:bold;\" class=\"transparent btncomentalmacen\"  data-coment=\"{{ comentario }}\"><i class=\"fa fa-info-circle\"></i></button></td></tr>";
	      	}else if(idest == "ALQUILER"){
	      		console.log(idest)
		      	$(".detestalquiler").modal("open");
		      	$(".titcherra").text("CODIGO: "+id);
		      	$(".titdherra").text(descripcionh);
		        $tb = $("table.table-detestalquiler > tbody");
		        $tb.empty();
		        template = "<tr><td class=\"colnum\">{{ count }}</td><td>{{ nompro }}</td><td>{{ numguia }}</td><td>{{ cantidad }}</td><td>{{ fechsalida }}</td><td class=\"tdfecdev\">{{ fechdev }}</td><td>{{ dias }}</td><td><button type=\"button\" style=\"border:none;font-weight:bold;\" class=\"transparent btncomentalmacen\" data-coment=\"{{ comentario }}\"><i class=\"fa fa-info-circle\"></i></button></td></tr>";
		        

	      	}
	        for (x in response.lestalmacen) {
	        response.lestalmacen[x].item = parseInt(x) + 1;
	        $tb.append(Mustache.render(template, response.lestalmacen[x]));
	        }
	        changecolortd('td.tdfecdev');
	    }
	    });
	}

	}else{
		data = {
			codhe :id,
			ldetrepacion: true,
			idestado: idest,
		}
		$.getJSON("", data, function(response) {
	        var $tb, template, x;
	      if (response.status) {
		      	$(".detestreparacion").modal("open");
		      	$(".titcoherra").text("CODIGO: "+id);
		      	$(".titdesherra").text(descripcionh);
		        $tb = $("table.table-detestreparacion > tbody");
		        $tb.empty();
		        template = "<tr><td class=\"colnum\">{{ count }}</td><td>{{ nompro }}</td><td>{{ numguia }}</td><td>{{ cantidad }}</td><td>{{ fechsalida }}</td><td>{{ fechretorno }}</td><td><button type=\"button\" style=\"border:none;font-weight:bold;\" class=\"transparent btncomentalmacen\" data-coment=\"{{ comentario }}\"><i class=\"fa fa-info-circle\"></i></button></td></tr>";
	        for (x in response.lestreparacion) {
	        response.lestreparacion[x].item = parseInt(x) + 1;
	        $tb.append(Mustache.render(template, response.lestreparacion[x]));
	        }
	    }
	    });
	}
}



$(function(){
	$('#comboestadherra').change(function(){
	  var data,id,nest;
	  id = this.value;
	  nest = $("select[id=comboestadherra] > option:selected").text();
	  // $(".nombreproyecto").text(np);
	  descrcaption = "HERRAMIENTAS"+"  "+nest;
	  console.log(id);
	  
	  if (id !== "") {
	  	if (id == "ALMACEN" || id == "ALQUILER") {
	  		data = {
			    estmat: id,
			    lherraalmacen: true,
	    };
	  	}else{
	  		data = {
	  			estmat:id,
	  			lhereparacion:true,
	  		}
	  	}

	    $.getJSON("", data, function(response) {
	        var $tb, template, x;
	      if (response.status) {
	      	$(".captiontable").text(descrcaption);
	      	document.getElementById('divtabalmacen').style.display = 'block';
	        $tb = $("table.table-lalmacen > tbody");
	        $tb.empty();
	        template = "<tr><td class=\"colnum\">{{ count }}</td><td class=\"colcod\">{{ codherra }}</td><td class=\"colherra\">{{ nameherra }}</td><td class=\"colmedida\">{{ medherra }}</td><td class=\"colmarca\">{{ marcherra }}</td><td class=\"coldetalle\"><button type=\"button\" style=\"border:none;font-weight:bold;\" class=\"transparent btndetestalmacen\" value=\"{{ codherra }}\" data-nameh=\"{{ nameherra }}\" data-medidah=\"{{ medherra }}\" data-marcah=\"{{ marcherra }}\"><i class=\"fa fa-info-circle\"></i></button></td></tr>";
	        for (x in response.lestalmacen) {
	        response.lestalmacen[x].item = parseInt(x) + 1;
	        $tb.append(Mustache.render(template, response.lestalmacen[x]));
	        }
	    }
	    });
	  }

	});
});



buscaresth = function(event) {
	buscador("txtestbuscarh","table-lalmacen");
}

buscardeth = function(event){
	buscador("txtestbuscardeth","table-detestalmacen");
}

buscdetalquiler = function(event){
	buscador("txtbuscdetalquiler","table-detestalquiler");
}

buscdetrepar = function(event){
	buscador("txtbuscdetrepar","table-detestreparacion")
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