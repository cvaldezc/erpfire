arrlcodmat = [];
arrlcodbrand = [];
arrlcodmodel = [];
codgdevmat = '';
var lmat = '';
var sizelistmat = '';
var datenow = '';
var codgdevm = '';
var tamlisdsector = '';
var codproyecto = '';
var nomproyecto = '';
var cgroup= '';
var descgroup = '';
var comat = '';
var dessector = '';
var text = '';
var motdev = ''
var lniple=''
ldetdev=[]
var codped=''
ldetnip = []
var codmat='',namemat='',medmat='',codmarcmat='',codmodmat='',textcodmat = ''
var estguia=''
var lnipple='',idguiadevmat='',search_one=''


$(document).ready(function() {
$('.datepicker').pickadate({
	selectYears: 10,
	selectMonths: true,
	container: 'body',
	format: 'yyyy-mm-dd',
	min:true});
$('.modal').modal();
$('select').material_select();

$('.lmaterials').modal({
	dismissible: false
});
$('.modlniple').modal({
	dismissible: false
});
$(".modlnippleop").modal({
	dismissible:false
})


// Busquedas
$("input[name=txtbuscarguia]").on("keyup", listdetmat);
$("input[name=txtbuscamat]").on("keyup", lmatdetguiarem);
$("input[name=txtbuscmaterial]").on("keyup", buscmaterial);
$(".txtbuscmat").on("keyup", buscmat);
$("input[name=txteditbuscmaterial]").on("keyup", busceditmaterial);
$("input[name=txtbuscguiatable]").on("keyup", searchguiadev);
$("input[name=txtbuscproy]").on("keyup", buscproy);
$(".txtbuscproyecto").on("keyup",buscproyecto);




// guardar
$(".btnsavedevmat").click(savedevmat);
$(".btnsavedetniple").click(savedetniple);
$(".btnsaveeditmat").click(saveeditmat);
$(".btnsavecabgdev").click(savecabgdev);

$(".btnsaveguiafin").click(saveguiafin);
$(".btnsavenipple").click(savenipple);


//Ediciones
$(document).on("click", ".btneditmat", editmat);
$(document).on("click", ".btneditguiadev", editguiadev);
$(document).on("click", ".btneditmatdet_mat", editmatdet_mat);

$(document).on("click", ".btnedsavemat", edsavemat);


//genera pdf
$(document).on("click", ".btngenguiadev", genguiadev);


//Eliminaciones
$(document).on("click", ".btndelguiadev", delguiadev);
$(document).on("click", ".btndelmatdet", delmatdet);
$(document).on("click", ".btneddelniple", eddelniple);
$(document).on("click", ".btndevmatdelnip", devmatdelnip);





$(document).on("click", ".btneditniple", editniple);

$(".btncloseguiadev").click(closeguiadev);

//ver comentario
$(document).on("click", ".btninfomatdet", infomatdet);

// ver pdf
$(document).on("click", ".btnviewpdf", viewpdf);


//delete
$(document).on("click", ".btndelmatdet_mat", delmatdet_mat);


//////////////////////////////
$("input[name=txtlistaproy]").on("keyup", openlmat);
$(document).on("click", ".btnopendetsector", listasector);
$(document).on("click", ".btnlistagainproy", listagainproy);
$(document).on("click", ".btnaddmat", addmat);
$(document).on("click", ".btnselectmat", selectmat);
$(document).on("click", ".btncleardatatemp", cleardatatemp);


$(document).on("click", ".btnopencab", opencab);

$(document).on("click", ".btnmataddcoment", mataddcoment);
$(document).on("click", ".btnnipaddcoment", nipaddcoment);

$(document).on("click", ".btncommguiamat", commguiamat);

$(document).on("click", ".btncomentnip",comentnip);

$(document).on("click", ".btnopenlniple",openlniple);

$(document).on("click", ".btndevmateditnip",devmateditnip);




//////////////////////////////
combochosen("#comboempleado");
combochosen("#comboeditempleado");
combochosen("#cbolistempleado");
combochosen("#cbolistguias");
combochosen("#cboguiatransp");
combochosen("#cboguiaconductor")
combochosen("#cboguiaplaca")
combochosen("#cboedguiatr")
combochosen("#cboedguiacond")
combochosen("#cboedguiaplaca")
combochosen("#cbomatcond")
combochosen("#cbomattransp")
combochosen("#cbomatplaca")

estguia='PE'
search_one=false
listdevmat()

var urlactual=window.location.href;

	if (urlactual=='http://'+location.hostname+(location.port != ''? ':'+location.port:'')+'/almacen/devolucionmaterial/') {
		console.log(localStorage.getItem('codrandmat'))

		openstorage()
		if (localStorage.getItem('codrandmat')!=null || localStorage.getItem('codrandniple')!=null) {
			document.getElementById('divbtnstorage').style.display="block"
		}
	};
	var codproysave=localStorage.getItem('codrandproy')
	console.log(localStorage.getItem(codproysave))
	$(".lblcodproystorage").text(localStorage.getItem(codproysave))

});

almcbocond = function(lista,contenido,id,combo,idcombo){
	for(var i = 0; i < lista.length; i++) {
	    var el = document.createElement("option");
	    el.textContent = lista[i][contenido];
	    el.value = lista[i][id];
	    combo.appendChild(el)
	}
	$(idcombo).trigger('chosen:updated')

}

almcbo = function(cbovalue,cbocond,cboplaca,status){
	$(function(){
		$(cbovalue).change(function(){
			$("#"+cbocond).empty();
			$("#"+cboplaca).empty();
			console.log(this.value);
			var data;
			data = new Object;
			data.codtransp = this.value;
			if (status=="conmat") {
				console.log('adw')
				data.lcbotransxmat=true
			}else{
				data.lcbotransxguia = true;
			}

			$.getJSON("", data, function(response) {
				var lcond = response.lcond;
				var cboconductor = document.getElementById(cbocond);
				var ltransp = response.ltransp;
				var cbotransp = document.getElementById(cboplaca);

				// almacena combo conductores
				if (status=="conmat") {
					console.log(lcond)
					console.log('conmat')
					almcbocond(lcond,'name_cond','cod_cond',cbomatcond,'#cbomatcond');
				}else{
					console.log('conguia')
					almcbocond(lcond,'name_cond','cod_cond',cboguiaconductor,'#cboguiaconductor');
					almcbocond(lcond,'name_cond','cod_cond',cboedguiacond,'#cboedguiacond');
				}


				// almacena combo placa
				for (var i = 0; i < ltransp.length; i++) {
					var opttr = ltransp[i]['placa']+" - "+ltransp[i]['marca']
					var valtr = ltransp[i]['placa']
					var eltr = document.createElement("option");
					eltr.textContent = opttr;
					eltr.value = valtr;
					cbotransp.appendChild(eltr)
				};
				$("#"+cboplaca).trigger('chosen:updated')

					console.log(response.lcond)
			}, "json");
		});
	});
}
almcbo("#cboguiatransp","cboguiaconductor","cboguiaplaca",'conguia');
almcbo("#cboedguiatr","cboedguiacond","cboedguiaplaca",'conguia');
almcbo("#cbomattransp","cbomatcond","cbomatplaca",'conmat');

locStorage=function(typelist,list){

	if (typelist=='typeniple') {
		// var ldetniple=JSON.stringify(lnippleselect)
		var ldetniple=list
		randniple = Math.random().toString(36).substr(2, 5);
		console.log(randniple)
		localStorage.setItem(randniple, ldetniple);
		localStorage.setItem('codrandniple',randniple);

	}else if (typelist=='typeproy') {
		randcodproy= Math.random().toString(36).substr(2, 5);
		console.log(randcodproy)
		localStorage.setItem(randcodproy,$(".lblcodproject").text())
		localStorage.setItem('codrandproy',randcodproy)
	}else{
		// var ldetdev=JSON.stringify(ldetdevfin)
		var ldetdev=list
		randmat = Math.random().toString(36).substr(2, 5);
		localStorage.setItem(randmat, ldetdev);
		localStorage.setItem('codrandmat',randmat)
		console.log(randmat)

	}
}


devmateditnip=function(){
	console.log(this.value)
	var item,cantnip,codped,codguia,codmat,codbr,codmod,inputcant,metrado;
	item=this.getAttribute("data-item")
	cantnip=this.getAttribute("data-edcantniple")
	codped=this.getAttribute("data-edncodped")
	codguia=this.getAttribute("data-edncodguia")
	codmat=this.getAttribute("data-edncodmat")
	codbr=this.getAttribute("data-edncodbr")
	codmod=this.getAttribute("data-edncodmod")
	inputcant=this.getAttribute("data-edninputcant")
	metrado=this.getAttribute("data-ednmetrado")
	console.log(cantnip)
	console.log(inputcant)
	swal({
		title: "Ingresar Cantidad",
		text: "Solo puede ingresar hasta "+cantnip+" items",
		type: "input",
		showCancelButton: true,
		closeOnConfirm: false,
		animation: "slide-from-top",
		},
		function(inputValue){
			if (inputValue=="" || inputValue=="0" || (!/^[0-9]+$/.test(inputValue))) {
				swal.showInputError("Cantidad ingresada INCORRECTA");
				return false
			};
			if (parseFloat(inputValue) > parseFloat(cantnip)) {
				swal.showInputError("Cantidad es mayor a lo permitido");
				return false
			};
			//update detalle de guia
			var metdec=metrado/100
			var restcant=0
			var estado=''
			if (parseFloat(inputValue)>parseFloat(inputcant)){
				estado='suma'
				restcant=Math.round(((inputValue-inputcant)*metdec)*1000)/1000
			}else{
				estado='resta'
				restcant=Math.round(((inputcant-inputValue)*metdec)*1000)/1000
			}
			console.log(restcant)

			for (var i = 0; i < ldetdevfin.length; i++) {
				console.log('as')
				if (ldetdevfin[i]['codped']==codped && ldetdevfin[i]['nguia']==codguia && ldetdevfin[i]['codmat']==codmat && ldetdevfin[i]['codbr']==codbr && ldetdevfin[i]['codmod']==codmod){
					console.log('qw')
					if (estado=='suma') {
						console.log('suma')
						ldetdevfin[i]['cantidad']=Math.round((ldetdevfin[i]['cantidad']+parseFloat(restcant))*1000)/1000
					}else{
						console.log('resta')
						ldetdevfin[i]['cantidad']=Math.round((ldetdevfin[i]['cantidad']-parseFloat(restcant))*1000)/1000
					}
				};
			};
			swal({title:'Niple Editado',timer:1500,showConfirmButton: false,type: "success"})

			//update detalle de guia
			var lstor=JSON.stringify(ldetdevfin)
			console.log(ldetdevfin)
			locStorage('typemat',lstor)
			listdetguiadev()
			//update detalle de niples
			lnippleselect[parseInt(item)-1]['inputcant']=inputValue
			var lstornip=JSON.stringify(lnippleselect)
			console.log(lnippleselect)
			locStorage('typeniple',lstornip)
			listtabniple()
		})
}



openlniple = function(){
	var codrow=this.getAttribute("data-codopenlniple")
	var cmat=this.getAttribute("data-codmat")
	var descmat=this.getAttribute("data-descmat")
	// console.log(numrow[i])
	console.log(codrow)
	console.log(numrow[codrow])
	var niplista=[]


 	for (x in numrow[codrow]){
 		for (y in numrow[codrow][x.toString()]){
 			niplista.push(numrow[codrow][x.toString()][y])
 		}
 	}
 	console.log(niplista)
 	if (niplista.length >0) {
 		$(".lblinfocodmat").text(cmat)
 		$(".lblinfodescmat").text(descmat)
 		$(".modinfoniple").modal("open")
		$tb = $("table.tab-linfoniple > tbody");
	    $tb.empty();
	    template = "<tr><td>{{ item }}</td><td>{{ canti }}</td><td>{{ metrado }}</td><td>{{ tipo }}</td></tr>";
	    for (x in niplista) {
		    niplista[x].item = parseInt(x) + 1;
		    $tb.append(Mustache.render(template, niplista[x]));
		}
 	};
}

comentnip = function(){
	var cguianipcod=this.getAttribute("data-commentcod")
	console.log(cguianipcod)

	var lastcoment=$(".comentnip"+cguianipcod).val()
	console.log(lastcoment)

	swal({
		title: "Ingresar Comentario",
		text: "<div class=\"input-field col s12\"><textarea maxlength=\"200\" placeholder=\"\" class=\"materialize-textarea comentguianiple\" name=\"comentguianiple\"></textarea></div>",
		showCancelButton: true,
		showConfirmButton:true,
		closeOnConfirm: true,
		closeOnCancel:true,
		animation: "slide-from-top",
		html:true
		},
		function(isConfirm){
			var comment=$("textarea[name=comentguianiple]").val()

			if (isConfirm) {
				if (comment==""){
					swal.showInputError("Debe ingresar un comentario");
					return false
				}else{
					$(".comentnip"+cguianipcod).val(comment)
				}
			};
		})
	$("textarea[name=comentguianiple]").val(lastcoment)
}

commguiamat = function(){

	var cguiamatcod=this.getAttribute("data-countguiamat")
	console.log(cguiamatcod)

	var lastcoment=$(".coment"+cguiamatcod).val()
	console.log(lastcoment)


	swal({
		title: "Ingresar Comentario",
		text: "<div class=\"input-field col s12\"><textarea maxlength=\"200\" placeholder=\"\" class=\"materialize-textarea comentguiamat\" name=\"comentguiamat\"></textarea></div>",
		showCancelButton: true,
		showConfirmButton:true,
		closeOnConfirm: true,
		closeOnCancel:true,
		animation: "slide-from-top",
		html:true
		},
		function(isConfirm){
			var comment=$("textarea[name=comentguiamat]").val()

			if (isConfirm) {
				if (comment==""){
					swal.showInputError("Debe ingresar un comentario");
					return false
				}else{
					$(".coment"+cguiamatcod).val(comment)
				}
			};
		})
	$("textarea[name=comentguiamat]").val(lastcoment)
}


nipaddcoment = function(){
	var cnipcod=this.getAttribute("data-countnipcod")
	console.log(cnipcod)

	var lastcoment=$(".comentnipple"+cnipcod).val()
	console.log(lastcoment)


	swal({
		title: "Ingresar Comentario",
		text: "<div class=\"input-field col s12\"><textarea maxlength=\"200\" placeholder=\"\" class=\"materialize-textarea nipcomentdet\" name=\"nipcomentdet\"></textarea></div>",
		showCancelButton: true,
		showConfirmButton:true,
		closeOnConfirm: true,
		closeOnCancel:true,
		animation: "slide-from-top",
		html:true
		},
		function(isConfirm){
			var comment=$("textarea[name=nipcomentdet]").val()

			if (isConfirm) {
				if (comment==""){
					swal.showInputError("Debe ingresar un comentario");
					return false
				}else{
					$(".comentnipple"+cnipcod).val(comment)
				}
			};
		})
	$("textarea[name=nipcomentdet]").val(lastcoment)
}

mataddcoment = function(){
	var ccod=this.getAttribute("data-countcod")
	console.log(ccod)

	var lastcoment=$(".comentario"+ccod).val()
	console.log(lastcoment)


	swal({
		title: "Ingresar Comentario",
		text: "<div class=\"input-field col s12\"><textarea maxlength=\"200\" placeholder=\"\" class=\"materialize-textarea matcomentdet\" name=\"matcomentdet\"></textarea></div>",
		showCancelButton: true,
		showConfirmButton:true,
		closeOnConfirm: true,
		closeOnCancel:true,
		animation: "slide-from-top",
		html:true
		},
		function(isConfirm){
			var comment=$("textarea[name=matcomentdet]").val()
			console.log(text)

			if (isConfirm) {
				if (comment==""){
					swal.showInputError("Debe ingresar un comentario");
					return false
				}else{
					$(".comentario"+ccod).val(comment)
				}
			};
		})
	$("textarea[name=matcomentdet]").val(lastcoment)
}

cleardatatemp=function(){
	localStorage.clear();
	blockornonediv('divbtnstorage','none')
	blockornonediv('divtableddetfinal','none')
	blockornonediv('divtabledetniple','none')
	blockornonediv('divcabguiadev','none')
	ldetdevfin=[]
	lnippleselect=[]
	location.reload()
	// listdetguiadev()
	// listtabniple()
}


opencab=function(){

	if (lnippleselect.length=='0' && ldetdevfin.length=='0') {
		swal({title:'Devolver al menos un material',timer:1500,showConfirmButton: false,type: "error"})
		return false
	};

	$(".modcabecera").modal("open");
	$(".fechdevmat").val(fechactual)

}

fechactual=function(){
	var today = new Date()
	var day = today.getDate()
	var month = today.getMonth()+1
	var year = today.getFullYear()

	if (day<10) {
		day='0'+day
	}
	if (month<10) {
		month='0'+month
	};
	var fechnow=year+"-"+month+"-"+day
	console.log(fechnow)
	return fechnow
}




searchguiadev=function(event){
	if (event.which == 13) {
		var estadoguia=''
		idguiadevmat=this.value
		search_one=true
		if (document.getElementById('radioge').checked) {
			estadoguia='GE'
		}else{
			estadoguia='PE'
		}
		estguia=estadoguia
		listdevmat()
	}
}

floatThead=function(table){
$("table."+table).floatThead({
    useAbsolutePositioning: false,
    scrollingTop: 65
  });
}



combochosen = function(combo){
$(combo).chosen({
	allow_single_deselect:true,
	width: '100%'});
}


busc2colmat = function(idtxtsearch,idtable,col1,col2){
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

buscmat = function(){
	busc2colmat("txtbuscmat","tab-lmaterials",1,2)
}

buscproyecto = function(){
	busc2colmat("txtbuscproyecto","tablelistproy",1,2);
}

buscmaterial = function(){
	busc2colmat("txtbuscmaterial","table-lmaterials",1,2);
}
busceditmaterial = function(){
	busc2colmat("txteditbuscmaterial","table-leditmaterials",1,4);
}

buscproy = function(){
	busc2colmat("txtbuscproy","table-lmatconmat",1,2);
}


devmatdelnip = function(){
	var idvalue,codped,nguia,codmat,codbr,codmod,inputcant,metrado;
	idvalue = this.value
	codped=this.getAttribute("data-delcodped")
	nguia=this.getAttribute("data-delnnguia")
	codmat=this.getAttribute("data-delncodmat")
	codbr=this.getAttribute("data-delncodbr")
	codmod=this.getAttribute("data-delncodmod")
	inputcant=this.getAttribute("data-delninputcant")
	metrado=this.getAttribute("data-delnmetrado")

	console.log(idvalue)
	console.log(ldetdevfin)

	for (var i = 0; i < lnippleselect.length; i++) {
		if (idvalue==lnippleselect[i]['idtabnipgrem']) {
			lnippleselect.splice(i,1)
		}
	}

	for (var i = 0; i < ldetdevfin.length; i++) {
		if (ldetdevfin[i]['codped']==codped && ldetdevfin[i]['nguia']==nguia && ldetdevfin[i]['codmat']==codmat && ldetdevfin[i]['codbr']==codbr && ldetdevfin[i]['codmod']==codmod) {
			var met=Math.round((inputcant*(metrado/100))*1000)/1000
			var rest=ldetdevfin[i]['cantidad']-Math.round(met*1000)/1000
			ldetdevfin[i]['cantidad']=Math.round(rest*1000)/1000

			if (ldetdevfin[i]['cantidad']==0) {
				ldetdevfin.splice(i,1)
			};
		};
	};

	swal({title:'Niple Eliminado',timer:1500,showConfirmButton: false,type: "success"})
	var lstor=JSON.stringify(ldetdevfin)
	var lstornip=JSON.stringify(lnippleselect)
	locStorage('typemat',lstor)
	locStorage('typeniple',lstornip)
	console.log(ldetdevfin)
	listdetguiadev()
	listtabniple()
}

delmatdet_mat = function(){

	console.log(ldetdevfin)
	var c_numguia = this.getAttribute("data-delcodguia");
	var c_matid = this.getAttribute("data-cod_mat");
	var c_brid = this.getAttribute("data-cod_br");
	var c_modid = this.getAttribute("data-cod_mod");

	for (var i = 0; i < ldetdevfin.length; i++) {
		if (c_numguia == ldetdevfin[i]['codgremision'] &&
			c_matid == ldetdevfin[i]['codmat'] &&
			c_brid == ldetdevfin[i]['codbr'] &&
			c_modid == ldetdevfin[i]['codmod']) {
			ldetdevfin.splice(i,1);
		};
	}
	swal({title:'Eliminacion de Material CORRECTA',timer:1500,showConfirmButton: false,type: "success"});
	var lstor=JSON.stringify(ldetdevfin)
	locStorage('typemat',lstor)
	console.log(ldetdevfin)
	lguiadev=ldetdevfin
	listdetguiadev()

}

delguiadev = function(){
	var cguiadevmat;
	cguiadevmat=this.value

	swal({
    title: "ANULAR GUIA",
    text: "Seguro de ANULAR Guia de Devolucion?",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dd6b55",
    confirmButtonText: "Si, Anular!",
    cancelButtonText: "No, Cancelar",
    closeOnConfirm: false,
    closeOnCancel: true
  }, function(isConfirm) {

    if (isConfirm) {

    var dato = new Object
    dato.ngdevmat=cguiadevmat
    dato.getdetgdevmatnip= true
    $.getJSON("",dato,function(response){
    	if (response.status) {
    		var lgdevmatnip=response.lgdevmatnip
    		console.log(lgdevmatnip) //detalle nipleguiadevmat

    		var dat= new Object
    		dat.lmatguiadev=true
    		dat.codgdevmat=cguiadevmat
    		$.getJSON("",dat,function(response){
    			if (response.status) {
    				var ldetgdevmat=response.lmat
    				console.log(ldetgdevmat) //detalle detgdevmat

    				var data = new Object;
					data.codguidevmat = cguiadevmat;
					data.lgdevmatnip=JSON.stringify(lgdevmatnip)
					data.ldetgdevmat=JSON.stringify(ldetgdevmat)
					data.updestguiadevmat = true;
					data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
				      $.post("",data,function(response){
						if (response.status) {
							swal({title:'Guia de Devolucion de Material ANULADA',timer:2000,showConfirmButton: false,type: "success"});
							search_one=false
							estguia='PE'
							listdevmat()
						};
					});

    			};
    		})
    	};
    })

    }


  });
}






delmatdet = function(){
	var data,btn,idtable,coddev;
	btn = this;
	coddev = this.getAttribute("data-coddev");
	console.log(coddev);
	swal({
    title: "ELIMINAR MATERIAL",
    text: "Seguro de eliminar el material de la guia de Devolucion?",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dd6b55",
    confirmButtonText: "Si, Eliminar!",
    cancelButtonText: "No, Cancelar",
    closeOnConfirm: true,
    closeOnCancel: true
  }, function(isConfirm) {
    if (isConfirm) {
    data = new Object;
	data.idtable =  btn.value;
	data.delmatdet = true;
	data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
      $.post("",data,function(response){
		if (response.status) {
			swal({title:'Eliminacion de material CORRECTA',timer:2000,showConfirmButton: false,type: "success"});
			codgdevmat = coddev;
			listmatguiadev();
		};
	});
    }
  });
}

eddelniple = function(){
	var codmat,codbr,codmod,codguiadevmat,cant,metrado,idtable;
	codguiadevmat = this.getAttribute("data-delidguiadevmat")
	codmat=this.getAttribute("data-delcodmat")
	codbr=this.getAttribute("data-delcodbr")
	codmod=this.getAttribute("data-delcodmod")
	cant=this.getAttribute("data-delcantidad")
	metrado=this.getAttribute("data-delmetrado")
	idtable=this.value

	swal({
	    title: "QUITAR NIPLE",
	    text: "Seguro de eliminar niple del detalle?",
	    type: "warning",
	    showCancelButton: true,
	    confirmButtonColor: "#dd6b55",
	    confirmButtonText: "Si, Eliminar!",
	    cancelButtonText: "No, Cancelar",
	    closeOnConfirm: true,
	    closeOnCancel: true
	  }, function(isConfirm) {

	    if (isConfirm) {
	    	var data = new Object
	    	data.getcantdevmat = true
	    	data.codgdevmat =codguiadevmat
	    	data.codmat=codmat
	    	data.codbr=codbr
	    	data.codmod=codmod
	    	$.getJSON("",data,function(response){
	    		if (response.status) {
	    			var cantdevmat=response.cantidad
	    			console.log(cantdevmat)

	    			var cantmet=parseFloat(cant)*(parseFloat(metrado)/100)
	    			var canttotal = parseFloat(cantdevmat)-parseFloat(cantmet)

	    			var dato = new Object;
	    			dato.codgdevmat=codguiadevmat
	    			dato.codmat=codmat
	    			dato.idtable=idtable
	    			dato.codbr=codbr
	    			dato.codmod=codmod
	    			dato.delnipdevmat = true
	    			dato.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
	    			dato.canttotal=Math.round(parseFloat(canttotal)*100)/100
	    			$.post("",dato,function(response){
	    				if (response.status) {
	    					codgdevmat = codguiadevmat
	    					codmat=codmat
	    					codmarcmat=codbr
	    					codmodma=codmod
	    					listmatguiadev()
	    					listdetnip()
	    				};
	    			})


	    		};
	    	})
	    }
	  });
}

edsavemat = function(){
	var canti,motivo,coment,item,capermit;
	canti=$(".txtedcantidad").val()
	motivo=$(".cboedmotivo").val()
	coment=$("textarea[name=txtedcom]").val()
	item=$(".lbledititem").text()
	capermit = $(".lblcantmax").text()

	if (canti=="" || canti=="0") {
		swal({title:'Cantidad INCORRECTA',timer:1500,showConfirmButton: false,type: "error"})
		return false
	};

	if (canti > capermit) {
		swal({title:'Cantidad supera cantidad permitida',timer:1500,showConfirmButton: false,type: "error"})
		return false
	};

	objIndex = ldetdevfin.findIndex((obj => obj.item == parseInt(item)));
	ldetdevfin[objIndex].cantidad = canti
	ldetdevfin[objIndex].motivo = motivo
	ldetdevfin[objIndex].comentario = coment

	console.log(ldetdevfin)
	var lstor=JSON.stringify(ldetdevfin)
	locStorage('typemat',lstor)
	$(".modeditmat").modal("close")
	swal({title:'Cantidad Editada',timer:1500,showConfirmButton: false,type: "success"})
	lguiadev = ldetdevfin
	listdetguiadev()

}

editniple = function(){
	var data,codtab,idref,codguiadevmat,codmat,codbr,codmod,cant,metrado;

	data = new Object;
	codmat = this.getAttribute("data-edcodmat")
	codbr=this.getAttribute("data-edcodbr")
	codmod=this.getAttribute("data-edcodmod")
	codtab = this.value
	metrado = this.getAttribute("data-edmetrado")
	idref = this.getAttribute("data-idref")
	cant = this.getAttribute("data-edcantidad")
	codguiadevmat=this.getAttribute("data-edidguiadevmat")
	console.log(codtab,idref)


	data.getcantnip=true
	data.codtabnip=idref
	$.getJSON("",data,function(response){
		if (response.status) {
			var cenvdevmat = response.cenvdevmat
			var cantidad = response.cantmov
			// var cantpermit = parseFloat(cantidad)-parseFloat(cenvdevmat)
			var cantpermit = parseFloat(cantidad)
			console.log(response.cenvdevmat,response.cantidad)

			var dat=new Object;
			dat.getcantdevmat = true
			dat.codmat=codmat
			dat.codbr=codbr
			dat.codmod=codmod
			dat.codgdevmat = codguiadevmat
			$.getJSON("",dat, function(response){
				if (response.status) {
					var respocant=response.cantidad
					console.log(respocant)


					swal({
					title: "Ingresar Cantidad",
					text: "Cantidad maxima a ingresar: "+cantpermit,
					type: "input",
					showCancelButton: true,
					closeOnConfirm: false,
					animation: "slide-from-top",
					},
					function(inputValue){
						if (inputValue=="" || inputValue=="0" || (!/^[0-9.]+$/.test(inputValue))) {
							swal.showInputError("Cantidad ingresada INCORRECTA");
							return false
						};

						if (parseFloat(inputValue)>parseFloat(cantpermit)) {
							swal.showInputError("Cantidad Ingresada es Mayor al permitido");
							return false;
						}else{
							console.log(cant)
							var rest,totmet,canttot;
							if (parseFloat(inputValue)>parseFloat(cant)) {
								rest=parseFloat(inputValue)-parseFloat(cant)
								totmet=(parseFloat(metrado)/100)*parseFloat(rest)
								canttot=parseFloat(respocant)+parseFloat(totmet)
							}else{
								rest=parseFloat(cant)-parseFloat(inputValue)
								totmet=(parseFloat(metrado)/100)*parseFloat(rest)
								canttot=parseFloat(respocant)-parseFloat(totmet)
							}
							Math.round(parseFloat(canttot)*100)/100
							var dato = new Object
							dato.upddevmatniple = true
							dato.codtab=codtab
							dato.codguiadevmat=codguiadevmat
							dato.cantupdnip=inputValue
							dato.canttot=Math.round(parseFloat(canttot)*100)/100
							dato.codmat=codmat
							dato.codbr=codbr
							dato.codmod=codmod
							dato.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
							$.post("",dato,function(response){
								if (response.status) {
									swal({title:'Niple editado',timer:1500,showConfirmButton: false,type: "success"});
									codgdevmat = codguiadevmat
									codmat=codmat
									codmarcmat=codbr
									codmodmat=codmod
									listdetnip()
									listmatguiadev()
								};
							})
						}

					})

				};
			})

		};
	})
}

editmatdet_mat = function(){

	var item,cantguiarem,codguiaremision,namemat,medmat,codmat,cantdevuel,cantpermit,motivo,coment,inputcant;

	item = this.getAttribute("data-item")
	cantguiarem = this.getAttribute("data-cantguiarem")
	codguiaremision = this.getAttribute("data-codguiaremision")
	namemat = this.getAttribute("data-namemat")
	medmat=this.getAttribute("data-medmat")
	codmat=this.getAttribute("data-cod_mat")
	cantdevuel = this.getAttribute("data-cantdev")
	cantpermit = parseFloat(cantguiarem)-parseFloat(cantdevuel)
	motivo = this.getAttribute("data-motdev")
	coment = this.getAttribute("data-comentdev")
	inputcant=this.getAttribute("data-inputcant")

	$(".lbledititem").text(item)
	$(".lblcodednumguia").text(codguiaremision)
	$(".lblcodigomaterial").text(codmat)
	$(".lbldescrmaterial").text(namemat+" "+medmat)
	$(".lblcantmax").text(cantpermit)
	$(".txtedcantidad").val(inputcant)
	$(".cboedmotivo").val(motivo)
	$("textarea[name=txtedcom]").val(coment)
	$(".modeditmat").modal("open")
}


editmat = function(){

	var codg,id,marcmat,modmat,numguia;
	id = this.getAttribute("data-id");
	codmat = this.getAttribute("data-codmat");
	namemat = this.getAttribute("data-nombmat");
	medmat = this.getAttribute("data-medmat");
	codmarcmat = this.getAttribute("data-codmarcamat");
	marcmat = this.getAttribute("data-marcamat");
	codmodmat = this.getAttribute("data-codmodmat");
	modmat = this.getAttribute("data-modmat");
	motivo = this.getAttribute("data-motiv");
	cantidad =this.getAttribute("data-cantidad")
	codgdevmat = this.getAttribute("data-guiadevmat");
	comment = this.getAttribute("data-com")
	numguia = this.getAttribute("data-numguia")
	codped = this.getAttribute("data-codped")
	codg = $(".neditguiadev").val();
	console.log(cantidad)
	var dato = new Object
	dato.getniple = true
	dato.idgdevmat=codgdevmat
	dato.idmat=codmat
	dato.codped=codped
	dato.idbr=codmarcmat
	dato.idmod=codmodmat
	$.getJSON("",dato,function(response){
		if (response.status) {
			var stlni = response.stlni
			console.log(response.stlni)

			if (stlni==false) {
				$(".lblcodguiadev").text(codgdevmat);
				$(".lblid").text(id);
				$(".comboeditmotivo").val(motivo);
				$(".formeditmat").modal("open");
				$(".lblcodigo").text(codmat);
				$(".lbldescripcion").text(namemat+" "+medmat+" "+marcmat+" "+modmat);
				$(".cantidadeditmat").val(cantidad);
				$(".comenteditmat").val(comment);
				var data=new Object
				data.viewcant = true;
				data.codmat = codmat;
				data.codped = codped
				data.numguia = numguia;
				data.codbrand = codmarcmat;
				data.codmodel = codmodmat;
				$.getJSON("", data, function(response){
					if (response.status) {
						var cdev,cenv,disp;
						cdev = response.cantdev
						// cenv = response.cantmov;
						disp = response.cantmov;
						console.log(disp)
						$(".lblcantdev").text(cdev);
						$(".cantdisponible").text(disp);
					};
				})
			}else{

				listdetnip()

			}
		};
	})
}

listdetnip = function(){
	var data=new Object;
	data.codgdevmat = codgdevmat
	data.codmat=codmat
	data.codbr=codmarcmat
	data.codmod=codmodmat
	data.codped=codped
	data.glnipdevmat = true
	$.getJSON("",data,function(response){
		if (response.status) {
			var lnipdev = response.lnipdev
			console.log('as')
			$(".lblidmat").text(codmat)
			$(".lblnamemat").text(namemat)
			$(".lblmedmat").text(medmat)
			$(".modedlniple").modal("open")
			$tb = $("table.tab-edlniple > tbody");
		    $tb.empty();
		    template = "<tr><td>{{ item }}</td><td>{{ cantidad }}</td><td>{{ metrado }}</td><td>{{ tipo }}</td><td><button type=\"button\" style=\"border:none\" value=\"{{ idtable }}\" data-idref=\"{{ idrefid }}\" data-edidguiadevmat=\"{{ codguiadevmat }}\" data-edcodmat=\"{{ codmat }}\" data-edmetrado=\"{{ metrado }}\" data-edcantidad=\"{{ cantidad }}\" data-edcodbr=\"{{ codbr }}\" data-edcodmod=\"{{ codmod }}\" class=\"transparent btneditniple\"><a style=\"font-size:25px;\"><i class=\"fa fa-pencil-square\"></i></a></button><button type=\"button\" style=\"border:none\" class=\"transparent btneddelniple\" value=\"{{ idtable }}\" data-delidguiadevmat=\"{{ codguiadevmat }}\" data-delcodmat=\"{{ codmat }}\" data-delcodbr=\"{{ codbr }}\" data-delcodmod=\"{{ codmod }}\" data-delmetrado=\"{{ metrado }}\" data-delcantidad=\"{{ cantidad }}\"><a style=\"font-size:25px;color:#ef5350\"><i class=\"fa fa-times-circle\"></i></a></button></td></tr>";
		    for (x in lnipdev) {
		    lnipdev[x].item = parseInt(x) + 1;
		    $tb.append(Mustache.render(template, lnipdev[x]));
			  }
		};
	})
}




editguiadev = function(){

	// $(".neditguiadev").val(this.getAttribute("data-guiaref"));
	$(".ednumdoc").val(this.value)
	$(".comenteditguiadev").val(this.getAttribute("data-coment"));
	$(".fdeveditguiadev").val(this.getAttribute("data-fdev"))
	$(".lblcodgdevmat").text(this.value);
	$("select[id=comboeditempleado]").val(this.getAttribute("data-empleaut"));
	$("#comboeditempleado").trigger('chosen:updated')
	$("select[id=cboedguiatr]").val(this.getAttribute("data-transp"))
	$("#cboedguiatr").trigger('chosen:updated');
	$("select[id=cboedguiacond]").val(this.getAttribute("data-cond"))
	// document.getElementById('cboedguiacond').disabled=true
	$("#cboedguiacond").trigger('chosen:updated');
	$("select[id=cboedguiaplaca]").val(this.getAttribute("data-placa"))
	// document.getElementById('cboedguiaplaca').disabled=true
	$("#cboedguiaplaca").trigger('chosen:updated');
	codgdevmat = this.value;
	listmatguiadev();
}


infomatdet = function(){
	var coment;
	coment = this.getAttribute("data-coment");
	if (coment != "") {
		$(".infomatdet").modal("open");
		$(".comentdetmat").text(coment);
	}else{
		swal({title:'No existe comentario para este material',timer:1500,showConfirmButton: false,type: "warning"});
		return false;
	}



}

listmatguiadev = function(){

	var data = new Object;
	data.codgdevmat = codgdevmat;
	data.lmatguiadev = true
	$.getJSON("", data, function(response){
		if (response.status) {
			var lmat = response.lmat

			if (lmat.length > 0) {
				console.log(lmat)
				var dato = new Object
				dato.listmat=JSON.stringify(lmat)
				dato.getlistnip=true
				$.getJSON("",dato,function(response){
					if (response.status) {
						var lestados = response.lestados
						console.log(response.lestados)
						$(".leditmaterials").modal("open");
					    $tb = $("table.table-leditmaterials > tbody");
					    $tb.empty();
					    template = "<tr><td class=\"col5\" style=\"text-align:center\">{{ count }}</td><td class=\"col10\">{{ numguia }}</td><td class=\"col10\">{{ codped }}</td><td class=\"col10\">{{ codmat }}</td><td>{{ nommat }} {{ medmat }}</td><td class=\"col10\">{{ nommarca }}</td><td class=\"col10\">{{ nommodel }}</td><td class=\"col5\">{{ cantidad }}</td><td class=\"col10\"><button type=\"button\" style=\"border:none;\" class=\"transparent btneditmat\" value=\"{{ codmat }}\" data-codped=\"{{ codped }}\" data-numguia=\"{{ numguia }}\" data-guiadevmat=\"{{ guiadevmat }}\" data-id=\"{{ id }}\" data-cantidad=\"{{ cantidad }}\" data-motiv=\"{{ motiv }}\" data-com=\"{{ coment }}\" data-codmat=\"{{ codmat }}\" data-nombmat=\"{{ nommat }}\" data-medmat=\"{{ medmat }}\" data-codmarcamat=\"{{ codmarca }}\" data-marcamat=\"{{ nommarca }}\" data-codmodmat=\"{{ codmodel }}\" data-modmat=\"{{ nommodel }}\"><a style=\"font-size:25px;\"><i class=\"fa fa-pencil-square\"></i></a></button><button style=\"border:none;\" type=\"button\" class=\"transparent btndelmatdet\" value=\"{{ id }}\" data-coddev=\"{{ guiadevmat }}\"><a style=\"font-size:25px;color:#ef5350;\"><i class=\"fa fa-times-circle\"></i></a></button><button style=\"border:none;\" type=\"button\" class=\"transparent btninfomatdet\" data-coment=\"{{ coment }}\"><a style=\"font-size:25px;color:#4caf50;\"><i class=\"fa fa-commenting\"></i></a></button></td></tr>";
					    template2 = "<tr><td class=\"col5\" style=\"text-align:center\">{{ count }}</td><td class=\"col10\">{{ numguia }}</td><td class=\"col10\">{{ codped }}</td><td class=\"col10\">{{ codmat }}</td><td>{{ nommat }} {{ medmat }}</td><td class=\"col10\">{{ nommarca }}</td><td class=\"col10\">{{ nommodel }}</td><td class=\"col5\">{{ cantidad }}</td><td class=\"col10\"><button type=\"button\" style=\"border:none;\" class=\"transparent btneditmat\" value=\"{{ codmat }}\" data-codped=\"{{ codped }}\" data-numguia=\"{{ numguia }}\" data-guiadevmat=\"{{ guiadevmat }}\" data-id=\"{{ id }}\" data-cantidad=\"{{ cantidad }}\" data-motiv=\"{{ motiv }}\" data-com=\"{{ coment }}\" data-codmat=\"{{ codmat }}\" data-nombmat=\"{{ nommat }}\" data-medmat=\"{{ medmat }}\" data-codmarcamat=\"{{ codmarca }}\" data-marcamat=\"{{ nommarca }}\" data-codmodmat=\"{{ codmodel }}\" data-modmat=\"{{ nommodel }}\"><a style=\"font-size:25px;\"><i class=\"fa fa-pencil-square\"></i></a></button></td></tr>";
					    for (x in lmat) {
					    lmat[x].item = parseInt(x) + 1;
					    if (lestados[parseInt(x)]['estado']==false) {
					    	$tb.append(Mustache.render(template, lmat[x]));
					    }else{
					    	$tb.append(Mustache.render(template2, lmat[x]));
					    }

						}
					};
				})
			}else{
				swal({title:'Guia sin detalle',showConfirmButton:true,type:'warning'})
				$(".leditmaterials").modal("close")
				$(".modedlniple").modal("close")
				search_one=false
				estguia='PE'
				listdevmat()
			}
		}
	})
}


genguiadev = function(){
	var codgdevmat,numguia,iddsector;
	codgdevmat=this.value;
	iddsector=this.getAttribute("data-iddsector")
	console.log(codgdevmat)

	swal({
	    title: "GENERA GUIA",
	    text: "Seguro de generar guia de devolucion?",
	    type: "warning",
	    showCancelButton: true,
	    confirmButtonColor: "#dd6b55",
	    confirmButtonText: "Si, Generar!",
	    cancelButtonText: "No, Cancelar",
	    closeOnConfirm: true,
	    closeOnCancel: true
	  }, function(isConfirm) {
	    if (isConfirm) {

	    	var data=new Object
	    	data.lmatguiadev=true
	    	data.codgdevmat=codgdevmat
	    	$.getJSON("",data,function(response){
	    		if (response.status) {
	    			var lmat=response.lmat //lista de detguiadevmat
	    			console.log(lmat)

	    			var dato=new Object
	    			dato.getcantdetguiarem = true
	    			dato.getdetgdevmatnip=true
	    			dato.lmat=JSON.stringify(lmat)
	    			// dato.numguia=numguia
	    			dato.ngdevmat=codgdevmat
	    			// dato.iddsector=iddsector
	    			$.getJSON("",dato,function(response){
	    				if (response.status) {
	    					var ldetgrem = response.ldetgrem
	    					var ldetinven = response.ldetinven
	    					var ldetpedido = response.ldetpedido
	    					console.log(ldetgrem)//lista upd detguiaremision
	    					console.log(ldetinven)//lista upd inventorybrand
	    					console.log(ldetpedido)//lista upd ldetpedido


	    					var lgdevmatnip = response.lgdevmatnip
	    					console.log(lgdevmatnip)
	    					var da = new Object
	    					da.sumcantnip=true
	    					da.lgdevmatnip = JSON.stringify(lgdevmatnip)
	    					$.getJSON("",da, function(response){
	    						if (response.status) {
	    							// var lgdevnip=response.lgdev
	    							var lnip=response.lnip
	    							var lnippedido=response.lnippedido
	    							// console.log(lgdevnip)
	    							console.log(lnip) //lista upd nipleguiaremision
	    							console.log(lnippedido) //lista upd niple


	    							var dat=new Object
				    				dat.updsavedevmat = true//Actualiza (detguiaremision,nipleguiaremision, niple,detpedido,inventorybrand)
				    				dat.ldetgrem = JSON.stringify(ldetgrem)
				    				dat.ldetpedido = JSON.stringify(ldetpedido)
				    				dat.ldetinven = JSON.stringify(ldetinven)
				    				dat.lnippedido = JSON.stringify(lnippedido)
				    				// dat.ldetdsmetrado = JSON.stringify(ldetdsmetrado)
				    				// dat.lgdevnip=JSON.stringify(lgdevnip)
				    				dat.lnip=JSON.stringify(lnip)
				    				dat.codguiadevmat=codgdevmat
				    				dat.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
				    				$.post("",dat,function(response){
				    					if (response.status) {
				    						console.log('aoskao')
				    						swal({title:'Guia de Devolucion GENERADA',timer:2000,showConfirmButton: false,type: "success"});
				    						genpdf(codgdevmat, false)
				    						search_one=false
				    						estguia='PE'
											listdevmat()
				    					};
				    				})

	    						};
	    					})
	    				};
	    			})

	    		};
	    	})
	    }
	  });

}


genpdf = function(codguiadev, format) {
	var hreport = $('#hreport').val();
	var ruc = $('#ruc').val();
	if (format) {
		window.open(hreport + 'guide/return/materials?nguide='+codguiadev+'&format=true&ruc='+ruc,'_blank');
	}else{
		window.open(hreport + 'guide/return/materials?nguide='+codguiadev+'&ruc='+ruc,'_blank');
	}
}

savecabgdev = function(){
	var data,ng,fdev,empleaut,coment,codgdev;
	data = new Object;

	codgdev = $(".lblcodgdevmat").text();
	ng = $(".neditguiadev").val();
	fdev = $(".fdeveditguiadev").val();
	coment = $(".comenteditguiadev").val();
	empleaut = $("select[id=comboeditempleado]").val();

	if (fdev == "") {
		swal({title:'Debe ingresar una FECHA DE DEVOLUCION', timer:2500, showConfirmButton: false,type: "error"});
		return false;
	}


	swal({
	    title: "Guardar Datos",
	    text: "Seguro de Guardar Datos de la cabecera?",
	    type: "warning",
	    showCancelButton: true,
	    confirmButtonColor: "#dd6b55",
	    confirmButtonText: "Si, Guardar!",
	    cancelButtonText: "No, Cancelar",
	    closeOnConfirm: true,
	    closeOnCancel: true
	  }, function(isConfirm) {
	    if (isConfirm) {
	    	data.savecabgdev = true;
			data.fdev = fdev;
			data.codgdev = codgdev;
			data.coment = coment;
			data.empleaut = empleaut;
			data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
			$.post("", data, function(response){
				if (response.status) {
					$(".leditmaterials").modal("close");
					swal({title:'Edicion CORRECTA',timer:1500,showConfirmButton: false,type: "success"});
					search_one=false
					estguia='PE'
					listdevmat()
				};
			})
	    }
		});
}

saveeditmat = function(){
	var data,ca,disp,id,cg,motiv;
	ca = $(".cantidadeditmat").val();
	disp = $(".cantdisponible").text();
	id = $(".lblid").text();
	com = $(".comenteditmat").val();
	cgdev = $(".lblcodguiadev").text();
	motiv = $(".comboeditmotivo").val();

	data = new Object;
	if (parseInt(ca) > parseInt(disp)) {
		swal({title:'Cantidad supera disponibilidad de devolucion',timer:2500,showConfirmButton: false,type: "error"});
		return false;
	}
	if (parseInt(ca) < 1 || ca == "") {
		swal({title:'Cantidad ingresada INCORRECTA',timer:2500,showConfirmButton: false,type: "error"});
		return false;
	};

	data.idt = id;
	data.com = com;
	data.cant = ca;
	data.motivo = motiv;
	data.saveeditmat = true;
	data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
	$.post("",data,function(response){
		if (response.status) {
			$(".formeditmat").modal("close");
			swal({title:'Edicion de Material CORRECTA',timer:2500,showConfirmButton: false,type: "success"});
			codgdevm = cgdev;
			listmatguiadev()
		};
	})
}


selectmat = function(){
	$(".mlistmat").modal("close")
	var cmat = this.value;
	text = cmat;
	lproy()
}


limparray = function(){
	arrlcodmat =[];
	arrlcodbrand = [];
	arrlcodmodel = [];
}

listdetmat = function(event){
    if (event.which == 13) {
    	var data,text;
    	limparray();
    	text = this.value;

    	var dato=new Object;
      		dato.existguiape = true
      		dato.codguia=text
      		$.getJSON("",dato,function(response){
      			if (response.status) {
      				var stlgdev = response.stlgdev
      				console.log(stlgdev)

      				if (stlgdev==false) {
      					data = new Object;
					    data.listmaterials = true;
					    data.txtingresado = text;
					    $.getJSON("", data, function(response) {
					      if (response.status) {

					      	lmat = response.lmaterials;
					      	console.log(lmat)
					      	var listmat = response.listmat;
					      	// sizelistmat = response.sizelistmat;
					      	console.log(listmat);

					      	var dato=new Object;
				      		dato.existsnip = true
				      		dato.lmat=JSON.stringify(lmat)
				      		$.getJSON("",dato,function(response){
				      			if (response.status) {
				      				var lstniple = response.lstniple

				      				console.log(lstniple)


				      			if (listmat == true) {
					  				for(var i=0; i < lmat.length;i++){
							      		arrlcodmat.push(lmat[i]["codmat"]);
							      		arrlcodbrand.push(lmat[i]["codbrand"]);
							      		arrlcodmodel.push(lmat[i]["codmodel"]);
							      	}
							      	console.log("cod material: "+ arrlcodmat);
							      	console.log("cod brand: "+arrlcodbrand);
							      	console.log("cod model: "+arrlcodmodel);

						      		$(".nguiadev").val(text);
						      		$(".lblcodproyguia").text(lmat[0]['codproy'])
								    $(".lmaterials").modal("open");
								    $(".fdevguiadev").val(fechactual)
								    $tb = $("table.table-lmaterials > tbody");
								    $tb.empty();
								    template = "<tr><td class=\"colst40\">{{ count }}</td><td class=\"colst150\">{{ codmat }}</td><td class=\"colst150\">{{ codped }}</td><td>{{ namemat }} {{ medmat }}</td><td>{{ namebrand }}</td><td>{{ namemodel }}</td><td class=\"colst100\">{{ cantmov }}</td><td class=\"colst100\">{{ cantdev }}</td><td class=\"colst100\" onclick=\"getdataRow('{{ countcod }}','{{ codped }}','{{ codmat }}','{{ namemat }}','{{ medmat }}','{{ codbrand }}','{{ codmodel }}')\"><div style=\"display:none\"><label class=\"lblnip{{ countcod }}\">noniple</label></div><input readOnly=\"true\" type=\"text\" class=\"cantdev{{ countcod }}\" id=\"cantdev{{ countcod}}\" style=\"width:40px;height:15px;\"></td><td class=\"colst40\"><input type=\"checkbox\" id=\"{{ countcod }}\" value=\"{{ countcod }}\" cantguide=\"{{ cantmov}}\" data-cantdev=\"{{ cantdev }}\" data-codmat=\"{{ codmat }}\" data-codbr=\"{{ codbrand }}\" data-codmod=\"{{ codmodel }}\" id=\"{{ countcod }}\"  name=\"checkdevmat{{ countcod }}\" class=\"checkbox{{ countcod }}\" onclick=\"getRow('{{ countcod }}','{{ cantmov }}','{{ cantdev }}','false','{{ codped }}','{{ codmat }}','{{ codbrand }}','{{ codmodel }}','{{ numguia }}')\"/><label for=\"{{ countcod }}\"></label></td><td class=\"colst150\"><div id=\"divcbomotivo{{ countcod }}\" style=\"\"><input type=\"text\" maxlength=\"55\" class=\"combomotivo{{ countcod }}\" style=\"height:30px\"></div></td><td><div id=\"divcommguiamat{{ countcod }}\" style=\"\"><button style=\"border:none;\" type=\"button\" class=\"transparent btncommguiamat\" data-countguiamat=\"{{ countcod }}\"><a style=\"font-size:25px;color:#039be5;\"><i class=\"fa fa-commenting\"></i></a></button></div><div style=\"display:none\"><input class=\"coment{{ countcod }}\" length=\"50px;\" style=\"height:15px;\"></td></tr>";
								    template2 ="<tr><td class=\"colst40\">{{ count }}</td><td class=\"colst150\">{{ codmat }}</td><td class=\"colst150\">{{ codped }}</td><td>{{ namemat }} {{ medmat }}</td><td>{{ namebrand }}</td><td>{{ namemodel }}</td><td class=\"colst100\">{{ cantmov }}</td><td class=\"colst100\">{{ cantdev }}</td><td class=\"colst100\" onclick=\"getdataRow('{{ countcod }}','{{ codped }}','{{ codmat }}','{{ namemat }}','{{ medmat }}','{{ codbrand }}','{{ codmodel }}')\"><div style=\"display:none\"><label class=\"lblnip{{ countcod }}\">niple</label></div><input readOnly=\"true\" type=\"text\" class=\"cantdev{{ countcod }}\" id=\"cantdev{{ countcod}}\" style=\"width:40px;height:15px;\"></td><td class=\"colst40\"><input type=\"checkbox\" id=\"{{ countcod }}\" value=\"{{ countcod }}\" cantguide=\"{{ cantmov}}\" data-cantdev=\"{{ cantdev }}\" data-codmat=\"{{ codmat }}\" data-codbr=\"{{ codbrand }}\" data-codmod=\"{{ codmodel }}\" id=\"{{ countcod }}\"  name=\"checkdevmat{{ countcod }}\" class=\"checkbox{{ countcod }}\" onclick=\"getRow('{{ countcod }}','{{ cantmov }}','{{ cantdev }}','true','{{ codped }}','{{ codmat }}','{{ codbrand }}','{{ codmodel }}','{{ numguia }}')\"/><label for=\"{{ countcod }}\"></label><button style=\"border:none;\" type=\"button\" class=\"transparent btnopenlniple\" data-codopenlniple=\"{{ countcod }}\" data-codmat=\"{{ codmat }}\" data-descmat=\"{{ namemat }} {{ medmat }} {{ namebrand }} {{ namemodel }}\"><a style=\"color:#039be5;\"><i class=\"fa fa-list\"></i></a></button></td><td class=\"colst150\"></td><td class=\"colst40\"></td></tr>";
								    for (x in lmat) {
								    	lmat[x].item = parseInt(x) + 1;
								    	if (lstniple[parseInt(x)]['estado']== true) {
								    		$tb.append(Mustache.render(template2, lmat[x]));
								    	}else{
								    		$tb.append(Mustache.render(template, lmat[x]));
								    	}
									  }

						      	}else{
						      		swal({
						      			title:'<h5>Guia debe cumplir con lo siguiente</h5>',
						      			html:true,
						      			text:'Estado: Generado<br>Estado de Pedido: Aprobado o Incompleto<br>Estado de Proyecto: Activo',
						      			showConfirmButton: true,
						      			type: "error"});
						      		return false;
						      	}

				      			}
				      		})
					      }
					    });

      				}else{
      					swal({title:'Guia ya existe (PENDIENTE)',text:'Debe generar o anular la guia pendiente',showConfirmButton: true,type: "error"});
			      		return false;
      				}

      		}
      	})
     }
}




getRow=function(countcod,cantguide,cantdev,niple,codped,codmat,codbr,codmod,numguia){

	var checkbox= "input[name=checkdevmat"+countcod+"]";
	var cantrest=parseFloat(cantguide)
	console.log(checkbox)
	console.log(cantrest)

	if($(checkbox).is(':checked')){
		var data=new Object
		data.getlnip=true
		data.numguia=numguia
		data.codped=codped
		data.codmat=codmat
		data.comnip=''
		data.motinip=''
		data.codbr=codbr
		data.codmod=codmod
		data.num=countcod
		console.log(countcod)
		$.getJSON("",data,function(response){
			if (response.status) {
				var listanipleria=response.listnip
				console.log(listanipleria)
				if (listanipleria.length!=0) {
					numrow[listanipleria[0]['num']]=[]
					numrow[listanipleria[0]['num']].push(listanipleria)
				};

			};
		})

		$(".cantdev"+countcod).val(parseFloat(cantrest))
		$(".combomotivo"+countcod).val("OTROS")
		if (niple=='false') {
			document.getElementById("cantdev"+countcod).readOnly=false
		}
	}else{
		numrow[countcod]=[]
		$(".cantdev"+countcod).val("")
		$(".combomotivo"+countcod).val("")
		document.getElementById("cantdev"+countcod).readOnly=true
	}

}

var cped='', cmat='', cbr='', cmod='', coucod=''
getdataRow = function(countcod,idped,idmat,namemat,medmat,idbr,idmod){
	console.log(idped,idmat,idbr,idmod)
	cped=idped,
	cmat=idmat,
	cbr=idbr,
	cmod=idmod
	coucod=countcod
	$(".lblcodmat").text(idmat)
	$(".lblnamemat").text(namemat)
	$(".lblmedmat").text(medmat)
	$(".lblcodbr").text(idbr)
	$(".lblcodmod").text(idmod)
	$(".lblcountcod").text(coucod)

	if ($(".checkbox"+countcod).is(':checked')) {
		listniple()
	};
}

listniple=function(){
	var data = new Object;

	data.getlnip=true
	data.codped=cped
	data.codmat=cmat
	data.codbr=cbr
	data.codmod=cmod
	$.getJSON("",data,function(response){
		if (response.status) {
			lniple = response.listnip
			console.log(response.stlistnip)
			console.log(response.listnip)
			if (response.stlistnip==true) {
				document.getElementById("cantdev"+coucod).readOnly=true

				$(".modlniple").modal("open")
				$tb = $("table.tab-lniple > tbody");
			    $tb.empty();
			    template = "<tr><td class=\"colst40\">{{ item }}</td><td class=\"colst100\">{{ cantidad }}</td><td class=\"colst100\">{{ metrado }}</td><td class=\"colst40\">{{ tipo }}</td><td class=\"colst100\">{{ cenvmat }}</td><td class=\"colst100\"><input style=\"height:25px;width:50px;\" type=\"text\" class=\"cnipleenv{{ countcod }}\" maxlength=\"4\"></td><td class=\"colst40\"><input type=\"checkbox\" name=\"boxguianip{{ countcod }}\" id=\"boxguianip{{ countcod }}\" class=\"boxguianip{{ countcod }}\" onclick=\"checkguianip('{{ countcod }}','{{ cenvmat }}','{{ canti }}')\"/><label for=\"boxguianip{{ countcod }}\"></label></td><td class=\"colst150\"><input type=\"text\" maxlength=\"55\" class=\"cbomotiv{{ countcod }}\" style=\"height:30px\"></td><td class=\"colst40\"><button style=\"border:none;\" type=\"button\" class=\"transparent btncomentnip\" data-commentcod=\"{{ countcod }}\"><a style=\"font-size:25px;color:#039be5;\"><i class=\"fa fa-commenting\"></i></a></button><div style=\"display:none\"><input class=\"comentnip{{ countcod }}\" length=\"50px;\" style=\"height:15px;\"></div></td></tr>";
			    for (x in lniple){
				    lniple[x].item = parseInt(x) + 1;
				    $tb.append(Mustache.render(template, lniple[x]));
				    console.log(x)
				}

				console.log(numrow[coucod])
				if (numrow[coucod]!=null) {
					// console.log(numrow[coucod][0].length)
					for (var i = 0; i < numrow[coucod][0].length; i++) {
						// $(".cbomotiv"+i).val("OTROS");
						document.getElementById('boxguianip'+i).checked=true
						$(".cnipleenv"+numrow[coucod][0][i]['row']).val(numrow[coucod][0][i]['canti'])
						$(".cbomotiv"+numrow[coucod][0][i]['row']).val('OTROS')
						// $(".comentnip"+numrow[coucod][0][i]['row']).val(numrow[coucod][0][i]['comnip'])
					};

				};
			};
		};
	})
}


var numrow = new Object
savedetniple = function(){
	var count = $(".lblcountcod").text()
	console.log(count)
	var cantdev=$(".cantdev"+count).val()
	console.log(cantdev)
	var ldetnip=[]
	var cant;
	if (cantdev=="") {
		cant=0
	}else{
		cant=cantdev
	}

	var countcod=$(".lblcountcod").text()//es un digito
	var ctotniple;
	var totalniple;
	console.log(lniple)
	var cantniple=0.0
	// numrow= new Object
	for (var i = 0; i < lniple.length; i++) {
		var txtcant=$(".cnipleenv"+i).val()
		var motnip=$(".cbomotiv"+i).val()
		var comnip=$(".comentnip"+i).val()
		var suma=parseFloat(txtcant)
		console.log(lniple[i]['cenvmat'],txtcant)
		// console.log(suma)
		if (parseFloat(suma)>lniple[i]['cantidad']) {
			swal({title:'Cantidad es Mayor al total en ITEM '+lniple[i]['item'],timer:2500,showConfirmButton: false,type: "error"});
			return false;
		}

		if (txtcant.trim()!="") {
			if (ldetnip.length>0) {
				for (var y=0;y<ldetnip.length;y++) {
					if (ldetnip[y]['idtabnipgrem']==lniple[i]['idtabnipgrem']) {
						swal({title:'ITEM '+lniple[i]['item']+' ya esta agregado',showConfirmButton: true,type: "error"})
						return false
					};
				};
			};

			if (!/^[0-9.]+$/.test(txtcant) || txtcant=='0') {
				swal({title:'',text:'Cantidad Erronea en ITEM '+lmat[i]['item'],timer:1500,showConfirmButton: false,type: "error"})
				return false
			}
			if ($(".cbomotiv"+i).val().trim()=="") {
				swal({title:'Debe ingresar motivo en ITEM '+lniple[i]['item'],showConfirmButton: false,timer:1500,type: "error"})
				return false
			};

			console.log($(".cantdev"+countcod).val())
			if ($(".cantdev"+countcod).val()=="") {
				ctotniple=0;
			}else{
				ctotniple=$(".cantdev"+countcod)
			}
			console.log($(".cnipleenv"+i).val())
			totalniple=parseFloat(ctotniple)+parseFloat($(".cnipleenv"+i).val())

			ldetnip.push({
				'row':i,
				'codmat':lniple[i]['codmat'],
				'namemat':lniple[i]['namemat'],
				'medmat':lniple[i]['medmat'],
				'metrado':lniple[i]['metrado'],
				'tipo':lniple[i]['tipo'],
				'canti':txtcant,
				'idtabnipgrem':lniple[i]['idtabnipgrem'],
				'motinip':motnip,
				'comnip':comnip,
				'codped':lniple[i]['codped'],
				'codbr':lniple[i]['codbr'],
				'codmod':lniple[i]['codmod'],
				'idtabnipgrem':lniple[i]['idtabnipgrem'],
				'numguia':$(".nguiadev").val()
			})

			var metr=Math.round((lniple[i]['metrado']/100)*1000)/1000
			console.log(metr)
			cantniple=cantniple+Math.round((parseFloat(txtcant)*metr)*1000)/1000

		}
	};

	numrow[count]=[]
	numrow[count].push(ldetnip)

	var cantniplefin=Math.round(cantniple*1000)/1000
	$(".cantdev"+$(".lblcountcod").text()).val(cantniplefin)
	console.log(cantniplefin)
	console.log(numrow)



	console.log(totalniple)

	console.log(ldetnip)
	if (ldetnip.length > 0) {
		swal({title:'Niples Agregados',timer:1500,showConfirmButton: false,type: "success"})
		$(".modlniple").modal("close")
		// document.getElementById('divtablniple').style.display="block"
	}else{
		swal({title:'Devolver al menos un niple',timer:1500,showConfirmButton: false,type: "error"})
		ldetnip=[]
		return false
	}
}

saveguiafin = function(){
	var auth,fechdev,comenconmat,codtr,codcond,codplaca,codguia;
	codguia=$(".matnumeroguia").val()
	codtr=$("select[id=cbomattransp]").val()
	codcond=$("select[id=cbomatcond]").val()
	codplaca=$("select[id=cbomatplaca]").val()
	auth = $("select[id=cbolistempleado]").val()
	fechdev = $(".fechdevmat").val()
	comenconmat=$(".comentconmat").val()
	console.log(lnippleselect)
	console.log(ldetdevfin)
	console.log(lnippleselect.length,ldetdevfin.length)

	if (codguia.length !=12) {
		swal({title:'Numero de Guia INCORRECTA',timer:1500,showConfirmButton: false,type: "error"})
		return false
	};

	console.log(codtr)
	if (codtr==null) {
		swal({title:'Seleccionar Transportista',timer:1500,showConfirmButton: false,type: "error"})
		return false
	}

	if (auth==null) {
		swal({title:'Seleccionar personal que autorizo devolucion',timer:1500,showConfirmButton: false,type: "error"})
		return false
	}
	if (fechdev=="") {
		swal({title:'Debe ingresar una fecha de devolucion',timer:1500,showConfirmButton: false,type: "error"})
		return false
	}

	var dat= new Object
	dat.exists=true
	dat.codguia=codguia
	dat.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
	$.post("/almacen/devolucionguia/",dat, function(exists){
		if (!exists.status) {
			delete dat.exists;
			var datos = new Object
			datos.exguiadevmat=true
			console.log('asfei')
			datos.codguia=codguia
			datos.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
			$.post("/almacen/devolucionguia/",datos,function(exists){
				if (!exists.status) {
					delete datos.exists;
					swal({
				    title: "GUARDAR DEVOLUCION",
				    text: "Seguro de guardar guia de devolucion?",
				    type: "warning",
				    showCancelButton: true,
				    confirmButtonColor: "#dd6b55",
				    confirmButtonText: "Si, Guardar!",
				    cancelButtonText: "No, Cancelar",
				    closeOnConfirm: true,
				    closeOnCancel: true
				  }, function(isConfirm) {
				    if (isConfirm) {
				    	var lsinniple=[]

						for (var i = 0; i < ldetdevfin.length; i++) {
							if (ldetdevfin[i]['niple']==false) {
								lsinniple.push(ldetdevfin[i])
							};
						};
						console.log(lsinniple)

						var data=new Object
				    	data.savefinconmat=true
				    	data.auth=auth
				    	data.cproy=$(".lblcodproystorage").text()
				    	data.codtr=codtr
						data.codguia=codguia
				    	data.codcond=codcond
				    	data.codplaca=codplaca;
				    	data.comenconmat=comenconmat
				    	data.estado='PE'
				    	data.fechdev=fechdev
				    	data.lnippleselect=JSON.stringify(lnippleselect)
				    	data.ldetdevfin=JSON.stringify(lsinniple)
				    	data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
				    	$.post("",data,function(response){
				    		if (response.status) {
				    			// 'http://'+location.hostname+(location.port != ''? ':'+location.port:'')+'/almacen/devolucionmaterial/'
				    			localStorage.clear()
				    			$(".modcabecera").modal("close")
				    			setTimeout(function(){
				 					swal({
				    				title:"GUIA DE DEVOLUCION GUARDADA",
				    				text:"Para Generar el PDF <a href=\"http://"+location.hostname+(location.port != '' ? ':'+location.port: '')+"/almacen/devolucionguia\" target=\"_self\">clic aqui</a>",
				    				showConfirmButton: true,
				    				type:"success",
				    				html:true},
					    				function(isConfirm) {
										    if (isConfirm) {
										    	location.reload()
											}
										}
				    				);

					 			},500);
				    		}
				    	})
				    }
				  });
				}else{
					swal({title:'Guia ya existe en Guias de Devolucion', timer:1500, showConfirmButton: false, type:'error'})
					return false
				}
			})
		}else{
			swal({title:'Guia ya existe en Guias de Remision', timer:1500, showConfirmButton: false, type:'error'})
			return false
		}
	})
}

var lnippleselect=[]
var randniple=''
var randcodproy=''
savenipple = function(){
	console.log(lnipple)
	var listanipple=lnipple
	var cantnipvirt=0
	var txtnull=[]

	var cantmat=ldetdevfin.length+lnippleselect.length
	console.log(ldetdevfin.length)
	console.log(lnippleselect.length)
	console.log(cantmat)
	if (cantmat>9) {
		swal({title:'ERROR DE CANTIDAD DE MATERIALES',text:'Solo se permite 10 materiales por guia',showConfirmButton: true,type: "error"})
		return false
	};

	for (var i = 0; i < listanipple.length; i++){
		var cantnipdev = $(".cantnipdev"+i).val()
		var cbonipplemotivo = $(".cbonipplemotivo"+i).val()
		var comentnipple = $(".comentnipple"+i).val()
		var sum=parseFloat(listanipple[i]['cenvdevmat'])+parseFloat(cantnipdev)

		if (parseFloat(sum) > listanipple[i]['cantidad']){
			swal({title:'Cantidad No permitida en el ITEM '+listanipple[i]['item'],timer:1500,showConfirmButton: false,type: "error"})
			return false;
		}

		if (cantnipdev.trim()!="") {
			if (!/^[0-9.]+$/.test(cantnipdev) || cantnipdev==0) {
				swal({title:'Cantidad INCORRECTA EN ITEM '+listanipple[i]['item'],timer:1500,showConfirmButton: false,type: "error"})
				return false;
			};

			if (cantnipdev!=0) {
				if (cbonipplemotivo.trim()=="") {
					swal({title:"",text:"Debe ingresar motivo en item "+listanipple[i]['item'],timer:1500,showConfirmButton: false,type: "error"})
					lnippleselect=[]
					return false
				};
				console.log(lnippleselect.length)
				console.log(lnippleselect)
				console.log(listanipple[i]['idtabnipgrem'])

				if (lnippleselect.length > 0){
					for (var y = 0; y < lnippleselect.length; y++) {
						if (lnippleselect[y]['idtabnipgrem']==listanipple[i]['idtabnipgrem']) {
							swal({title:'ITEM '+listanipple[i]['item']+" ya esta agregado al detalle",timer:1500,showConfirmButton: false,type: "error"})
							return false;
						};
					};
				}
			}
		}else{
			txtnull.push('null')
		}
	}


	console.log(txtnull)
	if (txtnull.length == listanipple.length) {
		swal({title:'Devolver al menos un niple', timer: 1500, showConfirmButton: false,type: "error"})
		return false;
	};

	swal({
	    title: "GUARDAR NIPLE",
	    text: "Seguro de agregar niple al detalle?",
	    type: "warning",
	    showCancelButton: true,
	    confirmButtonColor: "#dd6b55",
	    confirmButtonText: "Si, Guardar!",
	    cancelButtonText: "No, Cancelar",
	    closeOnConfirm: true,
	    closeOnCancel: true
	  }, function(isConfirm) {
	    if (isConfirm) {
	    	for (var i = 0; i < listanipple.length; i++) {
	    		var cantnipdev = $(".cantnipdev"+i).val()
				var cbonipplemotivo = $(".cbonipplemotivo"+i).val()
				var comentnipple = $(".comentnipple"+i).val()

				if (cantnipdev.trim()!=""){
					lnippleselect.push({
						'codmat':$(".nippcodmat").text(),
						'namemat':$(".nippnamemat").text(),
						'medmat':$(".nippmedmat").text(),
						'inputcant':cantnipdev,
						'metrado':listanipple[i]['metrado'],
						'tipo':listanipple[i]['tipo'],
						'comentario':comentnipple,
						'motivo':cbonipplemotivo,
						'cantidad':listanipple[i]['cantidad'],
						'codbr':listanipple[i]['codbr'],
						'codmod':listanipple[i]['codmod'],
						'codped':listanipple[i]['codped'],
						'idtabnipgrem':listanipple[i]['idtabnipgrem'],
						// 'idtab_opnipple':listanipple[i]['related'],
						'cenvdevmat':listanipple[i]['cenvdevmat'],
						'numguia':$("select[id=cbolistguias] > option:selected").attr("data-codguia")
					})
					cantnipvirt= cantnipvirt+Math.round((parseFloat(cantnipdev)*(parseFloat(listanipple[i]['metrado'])/100))*1000)/1000;
					console.log(cantnipvirt)
				};
	    	}
	    	var codmat=$(".nippcodmat").text()
			var codped=$(".nippcodped").text()
			var codbr=$(".nippcodbr").text()
			var codmod=$(".nippcodmod").text()
			var medmat=$(".nippmedmat").text()
			var marca=$(".nippbrand").text()
			var modelo=$(".nippmodel").text()
			var nguia=$("select[id=cbolistguias] > option:selected").attr("data-codguia")
			var namemat=$(".nippnamemat").text()

			var existmat=''
	    	if (ldetdevfin.length>0) {
	    		console.log(ldetdevfin.length)
	    		for (var i = 0; i < ldetdevfin.length; i++) {
	    			if (ldetdevfin[i]['codped']==codped &&
	    				ldetdevfin[i]['nguia']==nguia &&
	    				ldetdevfin[i]['codmat']==codmat &&
	    				ldetdevfin[i]['codbr']==codbr &&
	    				ldetdevfin[i]['codmod']==codmod){
	    				console.log('existe mat')
	    				existmat=true
	    				console.log(i)
	    				ldetdevfin[i]['cantidad']=Math.round((ldetdevfin[i]['cantidad']+parseFloat(cantnipvirt))*1000)/1000
	    			}
	    		}
	    		if (existmat=='') {
	    			ldetdevfin.push({
						'cantidad':Math.round(cantnipvirt*1000)/1000,
						'codmat':codmat,
						'codped':codped,
						'codbr':codbr,
						'codmod':codmod,
						'medmat':medmat,
						'marca':marca,
						'modelo':modelo,
						'namemat':namemat,
						'nguia':nguia,
						'niple':true
					})
	    		};



	    	}else{
	    		console.log('mat new 2')
	    		ldetdevfin.push({
					'cantidad':Math.round(cantnipvirt*1000)/1000,
					'codmat':codmat,
					'codped':codped,
					'codbr':codbr,
					'codmod':codmod,
					'medmat':medmat,
					'marca':marca,
					'modelo':modelo,
					'namemat':namemat,
					'nguia':nguia,
					'niple':true,
				})
	    	}

			console.log(lnippleselect)
			console.log(ldetdevfin)

	    	var ldetniple=JSON.stringify(lnippleselect)
			var ldetdev=JSON.stringify(ldetdevfin)
			locStorage('typeniple',ldetniple)
			locStorage('typemat',ldetdev)

			var cpro=$(".lblcodproject").text()
			$(".lblcodproystorage").text(cpro)
			locStorage('typeproy',cpro)

			console.log(ldetdevfin)
			listdetguiadev()
			console.log(lnippleselect)
			$(".modlnippleop").modal("close")
			blockornonediv('divtableddetfinal','block');
			setTimeout(function(){
				swal({title:'Niples Agregados',timer:1500,showConfirmButton: false,type: "success"})
 			},200);
			listtabniple()
	    }
	  });
}

selboxnipguia=function(){
	console.log(lniple)
	var cant,stcheck,mot;
	for (var i = 0; i < lniple.length; i++) {
		if (document.getElementById('radnipall').checked) {
			cant=parseFloat(lniple[i]['cantmov'])
			stcheck = true
			mot="OTROS"
		}else{
			cant=""
			stcheck=false
			mot=""
		}
		$(".cnipleenv"+i).val(cant)
		document.getElementById('boxguianip'+i).checked = stcheck;
		$(".cbomotiv"+i).val(mot)
	};
}

selboxnipmat=function(){
	console.log(lnipple)
	var cant,stcheck,mot;
	for (var i = 0; i < lnipple.length; i++) {
		if (document.getElementById('radmatnipall').checked) {
			cant=parseFloat(lnipple[i]['cantidad'])-parseFloat(lnipple[i]['cenvdevmat'])
			stcheck=true
			mot="OTROS"
		}else{
			cant=""
			stcheck=false
			mot=""
		}
		$(".cantnipdev"+i).val(cant)
		document.getElementById('boxmatnip'+i).checked=stcheck
		$(".cbonipplemotivo"+i).val(mot)
	};
}


checkguianip=function(countcod,cenvmat,canti){
	var cant,mot;
	if($(".boxguianip"+countcod).is(':checked')){
		cant=parseFloat(canti)
		mot="OTROS"
	}else{
		cant=""
		mot=""
	}
	$(".cnipleenv"+countcod).val(cant)
	$(".cbomotiv"+countcod).val(mot)
}

checkmatnip=function(count,cenvdevmat,cantidad){
	var cant,mot;
	if ($(".boxmatnip"+count).is(':checked')) {
		cant=parseFloat(cantidad)-parseFloat(cenvdevmat)
		mot="OTROS"
	}else{
		cant=""
		mot=""
	}
	$(".cantnipdev"+count).val(cant)
	$(".cbonipplemotivo"+count).val(mot)

}

selcheckbox = function(){
	numrow=[]
	if(document.getElementById('radioall').checked){
		console.log(lmat)
		selectall(true,"");
	}else{
		selectall(false,"");
	}
}


selectall = function(estado,cantidad){
	for(var i=0; i < lmat.length; i++){
		var canti=lmat[i]['cantmov']
		var mot;
		if (estado==true){
			var data=new Object
			data.getlnip=true
			data.num=i
			data.numguia=lmat[i]['numguia']
			data.comnip=''
			data.motinip=''
			data.codped=lmat[i]['codped']
			data.codmat=lmat[i]['codmat']
			data.codbr=lmat[i]['codbrand']
			data.codmod=lmat[i]['codmodel']
			data.canti=canti
			$.getJSON("",data,function(response){
				if (response.status) {
					var listnipleria=response.listnip
					console.log(listnipleria)
					if (listnipleria.length!=0) {
						numrow[listnipleria[0]['num']]=[]
						numrow[listnipleria[0]['num']].push(listnipleria)
					};
				};
			})

			canti=canti
			mot='OTROS'
			document.getElementById("cantdev"+i).readOnly=false
		}else{
			canti=""
			mot=""
			document.getElementById("cantdev"+i).readOnly=true
		}

		$(".cantdev"+i).val(canti)
		$(".combomotivo"+i).val(mot)
		var idcheck = lmat[i]['countcod'];
		document.getElementById(idcheck).checked = estado;
	}
}





listtabniple=function(){
	console.log(lnippleselect)
	if (lnippleselect.length>0) {
		blockornonediv('divtabledetniple','block')
		var listadetniple = lnippleselect
		$tb = $("table.tab-detniple > tbody");
	    $tb.empty();
	    template = "<tr><td class=\"colst40\" style=\"text-align:center\">{{ item }}</td><td class=\"colst150\">{{ numguia }}</td><td class=\"colst150\">{{ codmat }}</td><td>{{ namemat }} {{ medmat }}</td><td class=\"colst40\">{{ inputcant }}</td><td class=\"colst100\">{{ metrado }}</td><td class=\"colst50\">{{ tipo }}</td><td class=\"colst100\"><button style=\"border:none;\" type=\"button\" class=\"transparent btndevmateditnip\" value=\"{{ idtabnipgrem }}\" data-edcantniple=\"{{ cantidad }}\" data-item=\"{{ item }}\" data-edncodped=\"{{ codped }}\" data-edncodguia=\"{{ numguia }}\" data-edncodmat=\"{{ codmat }}\" data-edncodbr=\"{{ codbr }}\" data-edncodmod=\"{{ codmod }}\" data-edninputcant=\"{{ inputcant }}\" data-ednmetrado=\"{{ metrado }}\"><a style=\"font-size:25px;color:#039be5;\"><i class=\"fa fa-pencil-square\"></i></a></button><button style=\"border:none;\" type=\"button\" class=\"transparent btndevmatdelnip\" value=\"{{ idtabnipgrem }}\" data-delcodped=\"{{ codped }}\" data-delnnguia=\"{{ numguia }}\" data-delncodmat=\"{{ codmat }}\" data-delncodbr=\"{{ codbr }}\" data-delncodmod=\"{{ codmod }}\" data-delninputcant=\"{{ inputcant }}\" data-delnmetrado=\"{{ metrado }}\"><a style=\"font-size:25px;color:#F44336;\"><i class=\"fa fa-times-circle\"></i></a></button></td></tr>";
	    for (x in listadetniple) {
		    listadetniple[x].item = parseInt(x) + 1;
		    $tb.append(Mustache.render(template, listadetniple[x]));
		 }
	}else{
		blockornonediv('divtabledetniple','none')
	}
	if (ldetdevfin.length==0 && lnippleselect.length==0) {
		$(".lblcodproystorage").text('');
	};

}


// search_one=false
// estguia='PE'
listdevmat = function(){
	var data=new Object
	data.idguiadevmat = idguiadevmat
	data.lguiasdev=true
	data.search_one=search_one
	data.stguia=estguia //PE OR GE
	$.getJSON("",data,function(response){
		if (response.status) {
			var lguia=response.lguia
			console.log(lguia)

			if (estguia=='PE') {
				$tb = $("table.table-guiadevpe > tbody");
			    $tb.empty();
			    template= "<tr><td class=\"colst40\">{{ item }}</td><td class=\"colst100\">{{ codguiadev }}</td><td>{{ codproy }}-{{ nameproyecto }}</td><td>{{ autnames }}</td><td class=\"colst150\">{{ registro }}</td><td class=\"colst150\">{{ fechdev }}</td><td class=\"colst150\"><button style=\"border:none;\" type=\"button\" class=\"transparent btngenguiadev\" id=\"btngenguiadev\" value=\"{{ codguiadev }}\" data-iddsector=\"{{ iddsector }}\" data-guiaref=\"{{ nguia }}\"><a style=\"font-size:25px;color:#4caf50;\"><i class=\"fa fa-check-circle\"></i></a></button><button style=\"border:none;\" type=\"button\" class=\"transparent btneditguiadev\" id=\"btneditguiadev\" value=\"{{ codguiadev }}\" data-empleaut=\"{{ empleaut }}\" data-guiaref=\"{{ nguia }}\" data-fdev=\"{{ fechdev }}\" data-coment=\"{{ coment }}\" data-cond=\"{{ cond }}\" data-placa=\"{{ placa }}\" data-transp=\"{{ transp }}\"><a style=\"font-size:25px;\"><i class=\"fa fa-pencil-square\"></i></a></button><button style=\"border:none;\" type=\"button\" class=\"transparent btndelguiadev\" value=\"{{ codguiadev }}\"><a style=\"font-size:25px;color:#ef5350;\"><i class=\"fa fa-times-circle\"></i></a></button></td></tr>";
		    	for (x in lguia) {
		    		lguia[x].item = parseInt(x) + 1;
					$tb.append(Mustache.render(template, lguia[x]));
				}
			}else{
				$tb = $("table.table-guiadevge > tbody");
			    $tb.empty();
			    template2= "<tr><td class=\"colst40\">{{ item }}</td><td class=\"colst200\">{{ codguiadev }}</td><td>{{ codproy }}-{{ nameproyecto }}</td><td>{{ autnames }}</td><td class=\"colst150\">{{ registro }}</td><td class=\"colst150\">{{ fechdev }}</td><td class=\"colst150\"><button style=\"border:none;\" type=\"button\" class=\"transparent btnviewpdf\" value=\"{{ codguiadev }}\"><a style=\"font-size:25px\"><i class=\"fa fa-file-pdf-o\"></i></a></button></td></tr>";
		    	for (x in response.lguia) {
				    response.lguia[x].item = parseInt(x) + 1;
				    $tb.append(Mustache.render(template2, response.lguia[x]));
				}
			}

		};
	})
}


closeguiadev = function(){
	ldetnip=[]
	numrow=[]
}


lmatdetguiarem = function(){
    if (event.which == 13) {
    	var data,text;
    	text = this.value;
	    data = new Object;
	    data.lmatdetguia = true;
	    data.txtcodmat = text;
	    $.getJSON("", data, function(response) {
	      if (response.status) {
	      	var lmaterial = response.lmateriales;
	      	var listmat = response.listmateriales;
	      	console.log(listmat);
	      	console.log(lmaterial);
	      	if (listmat == true) {
	      		console.log(lmaterial[0]['matcod'])
	      		var txtbusc = $(".txtbuscamat").val();
	      		$(".codconmat").text(txtbusc);
	      		$(".desconmat").text(lmaterial[0]['matnom']);

	      		// $(".nguiadev").val(text);
			    $(".lmatconmat").modal("open");
			    $tb = $("table.table-lmatconmat > tbody");
			    $tb.empty();
			    template = "<tr><td class=\"col5\">{{ count }}</td><td>{{ codproy }}</td><td>{{ nompro }}</td><td><button style=\"border:none;\" type=\"button\" class=\"transparent btnopendetsector\" value=\"{{ codproy }}\" data-nompro=\"{{ nompro }}\"><a style=\"font-size:25px;color:#4caf50;\"><i class=\"fa fa-check-circle\"></i></a></button></td></tr>";
			    for (x in response.lmateriales) {
			    response.lmateriales[x].item = parseInt(x) + 1;
			    $tb.append(Mustache.render(template, response.lmateriales[x]));
				  }
	      	}else{
	      		swal({title:'Material No existe en ningun Proyecto',timer:2500,showConfirmButton: false,type: "error"})
	      		return false;
	      	}
	      }
	    });
     }
}


savedevmat = function(){

	var fdev,auth,lblniple,transport,cond,placa,codproy,codguia;
	codguia=$(".numguia").val()
	fdev = $(".fdevguiadev").val()
	auth = $("select[id=comboempleado]").val();
	transport=$("select[id=cboguiatransp]").val();
	cond=$("select[id=cboguiaconductor]").val()
	placa=$("select[id=cboguiaplaca]").val()
	codproy=$(".lblcodproyguia").text()

	console.log(fdev)
	console.log(auth)
	console.log(transport)

	if (codguia.length!=12) {
		swal({title:'Numero de Guia INCORRECTA',timer:1500,showConfirmButton: false,type: "error"});
		return false
	};

	if (transport==null) {
		swal({title:'Seleccionar Transportista',timer:1500,showConfirmButton: false,type: "error"});
		return false
	};
	if (fdev=="") {
		swal({title:'Debe Ingresar Fecha de Devolucion',timer:1500,showConfirmButton: false,type: "error"});
		return false
	}

	if (auth==null) {
		swal({title:'Seleccionar quien autorizo',timer:1500,showConfirmButton: false,type: "error"});
		return false
	};


	console.log(lmat)
	for (var i = 0; i < lmat.length; i++) {
		var txtcant=$(".cantdev"+i).val();
		var txtcoment = $(".coment"+i).val();
		var combomotivo = $(".combomotivo"+i).val();
		var lblniple=$(".lblnip"+i).text();

		if (txtcant.trim()!='' && combomotivo!='' && lblniple=='noniple') {
			console.log(txtcant.length)
			console.log(txtcant,txtcoment,combomotivo)
			var suma = parseFloat(txtcant)
			console.log(Math.round(suma*100)/100)
			if (parseFloat(suma) > parseFloat(lmat[i]['cantguide'])) {
				swal({title:'',text:'Cantidad es Mayor a la cantidad Enviada en ITEM '+lmat[i]['item'],showConfirmButton: true,type: "error"})
				ldetdev=[]
				return false
			};

			if (!/^[0-9.]+$/.test(txtcant) || txtcant=='0') {
				swal({title:'',text:'Cantidad Erronea en ITEM '+lmat[i]['item'],timer:2500,showConfirmButton: false,type: "error"})
				ldetdev=[]
				return false
			}
			if (combomotivo=="") {
				swal({title:'',text:'Debe ingresar motivo en ITEM '+lmat[i]['item'],showConfirmButton: true,type: "error"})
				return false
			};

			ldetdev.push({
				'codmat':lmat[i]['codmat'],
				'codbr':lmat[i]['codbrand'],
				'codmod':lmat[i]['codmodel'],
				'inputcant':txtcant,
				'motivo':combomotivo,
				'comment':txtcoment,
				'numguia':lmat[i]['numguia'],
				'codped':lmat[i]['codped'],
				'codproy':lmat[i]['codproy'],
				'coddsector':lmat[i]['coddsector']
			})
		}
	}


	console.log(numrow)

	lniplefinal=[]
	for (x in numrow) {
		if (numrow[x.toString()].length!=0) {
			// console.log(numrow[x.toString()][0])
			lniplefinal.push(numrow[x.toString()][0])
			// console.log(x)
		};
 	}

 	console.log(lniplefinal)
 	console.log(lniplefinal.length)
 	console.log(ldetdev.length)

 	lniplefinal2=[]
 	for (x in lniplefinal){
 		for(y in lniplefinal[x.toString()]){
 			lniplefinal2.push(lniplefinal[x.toString()][y])
 		}
 	}

 	console.log(ldetdev)
 	console.log(lniplefinal2)

 	var cantmat=ldetdev.length+lniplefinal.length
 	console.log(cantmat)
 	if (cantmat > 10) {
 		swal({title:'ERROR DE CANTIDAD DE MATERIALES',text:'Solo se permite 10 materiales por guia',showConfirmButton: true,type: "error"})
		ldetdev=[]
		return false
 	};

	if (ldetdev.length > 0 || lniplefinal2.length>0) {

		var dat= new Object
		dat.exists=true
		dat.codguia=codguia
		dat.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
		$.post("",dat, function(exists){
			if (!exists.status) {
				delete dat.exists;
				var datos = new Object
				datos.exguiadevmat=true
				datos.codguia=codguia
				datos.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
				$.post("",datos,function(exists){
					if (!exists.status) {
						delete datos.exists;
						swal({
						    title: "Guardar Guia",
						    text: "Seguro de Guardar Guia de Devolucion?",
						    type: "warning",
						    showCancelButton: true,
						    confirmButtonColor: "#dd6b55",
						    confirmButtonText: "Si, Guardar!",
						    cancelButtonText: "No, Cancelar",
						    closeOnConfirm: false,
						    closeOnCancel: true
						  }, function(isConfirm) {
						    if (isConfirm) {

						    	var data=new Object;
						    	//cabecera
						    	data.ng=$(".nguiadev").val()
						    	data.fdev=fdev
						    	data.empdniaut=auth
						    	data.transport=transport
						    	data.cond=cond
						    	data.placa=placa
						    	data.codproy=codproy
						    	data.est='PE'
						    	data.comen=$(".comentguiadev").val()
						    	//detalle
						    	// data.ldetdev=JSON.stringify(ldetnonip);
						    	data.ldetdev=JSON.stringify(ldetdev);
						    	//detalleniple
						    	data.lniplefinal2=JSON.stringify(lniplefinal2)
						    	// data.ldetnip = JSON.stringify(ldetnip);
						    	// data.ldetni =JSON.stringify(ldetni)
						    	data.savedevmat = true
						    	data.numeroguia=codguia
					    		data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
						    	$.post("",data,function(response){
						    		if (response.status) {
						    			$(".lmaterials").modal("close");
						    			search_one=false;
						    			estguia='PE';
						    			listdevmat();
						    			swal({title:'Guia Guardada',timer:1500,showConfirmButton:false,type:'success'})
						    			ldetdev=[]
						    		};
						    	})

						    }else{
						    	ldetdev=[]

						    }

							});


					}else{
						swal({title:'Numero de Guia existe en Guias de Devolucion', showConfirmButton:true,type:'error'})
						ldetdev=[]
						return false;
					}
				})

			}else{
				swal({title:'Numero de Guia Existe en Guias de Remision', showConfirmButton:true,type:'error'})
				ldetdev=[]
				return false;
			}
		})
	}else{
		swal({title:'Debe devolver al menos un material',timer:1500,showConfirmButton: false,type: "error"})
		ldetdev=[]
		return false;
	}

	// 	};
	// })
}



viewestguiamatdev = function(){
	// console.log(this.value);
	if(document.getElementById('radiope').checked){
		search_one=false
		estguia='PE'
		listdevmat()
		document.getElementById('divtabledevpe').style.display = 'block';
		document.getElementById('divtabledevge').style.display = 'none';
	}else{
		estguia='GE'
		search_one=false
		listdevmat()
		document.getElementById('divtabledevge').style.display = 'block'
		document.getElementById('divtabledevpe').style.display = 'none';
	}
}

viewpdf = function(){
	var cod;
	cod = this.value
	swal({
		title:'Vista de Guia de Devolucion',
		html:true,
		confirmButtonText:'Con Formato',
		cancelButtonText:'Sin Formato',
		showConfirmButton:true,
		closeOnConfirm:true,
		showCancelButton:true,
		closeOnCancel:true,
		animation:'slide-from-top'
	},function(isConfirm){
		if (isConfirm) {
			console.log('con Formato')
			var data=new Object
			data.getuser=true
			$.getJSON("",data,function(response){
				if (response.status) {
					var user = response.user
					console.log(user) //USUARIO
					genpdf(cod, true)
				};
			})
		}else{
			genpdf(cod, false)
		}
	})
}



////////////////////////////////////////////////////////////////


ldetdevfin = []
ldetdevfinal = []
var randmat=''
addmat = function(){
	console.log(ldetguiaremision)
	var cantmat=ldetdevfin.length+lnippleselect.length
	console.log(ldetdevfin.length)
	console.log(lnippleselect.length)
	console.log(cantmat)
	if (cantmat>9) {
		swal({title:'ERROR DE CANTIDAD DE MATERIALES',text:'Solo se permite 10 materiales por guia',showConfirmButton: true,type: "error"})
		return false
	};
	for (var i = 0; i < ldetguiaremision.length; i++) {
		var cantd,comentario,motivodev,mat,codi_dsector;
		cantd = $(".inputcant"+i).val();
		comentario = $(".comentario"+i).val();
		motivodev = $(".cboxmotivo"+i).val();

		if (cantd.trim()!= "") {
			if(cantd != "0"){
				var cant=ldetguiaremision[i]['cantidad']
				var suma=parseFloat(ldetguiaremision[i]['cantdev'])+parseFloat(cantd)
				console.log(suma)

				if (ldetdevfin.length > 0) {
					for (var x = 0; x < ldetdevfin.length; x++) {
						if (ldetguiaremision[i]['codguiarem']==ldetdevfin[x]['codgremision'] &&
							ldetguiaremision[i]['codmat']==ldetdevfin[x]['codmat'] &&
							ldetguiaremision[i]['codbr']==ldetdevfin[x]['codbr'] &&
							ldetguiaremision[i]['codmod']==ldetdevfin[x]['codmod']) {
							swal({title:'',text:'Material del ITEM '+ldetguiaremision[i]['item']+' ya esta agregado en el detalle',timer:2000,showConfirmButton:false,type: "error"})
							return false
						};
					};
				}

				if (!/^[0-9.]+$/.test(cantd)) {
					swal({title:'',text:"Cantidad INCORRECTA en ITEM "+ldetguiaremision[i]['item'],timer:2000,showConfirmButton:false,type: "error"})
					return false
				};

				if (motivodev.trim()=="") {
					swal({title:'',text:"Debe ingresar un motivo en item "+ldetguiaremision[i]['item'],timer:2000,showConfirmButton:false,type: "error"})
					return false
				};


				if (parseFloat(suma)>parseFloat(cant)) {
					swal({title:'',text:"Cantidad + lo devuelto en ITEM "+ldetguiaremision[i]['item']+" es mayor al total",timer:2500,showConfirmButton:false,type: "error"})
					return false
				}else{
					ldetdevfin.push({
					'it':i,
					'codped':ldetguiaremision[i]['codped'],
					'nguia':$("select[id=cbolistguias] > option:selected").attr("data-codguia"),
					'codgremision':ldetguiaremision[i]['codguiarem'],
					'codmat':ldetguiaremision[i]['codmat'],
					'namemat':ldetguiaremision[i]['namemat'],
					'medmat':ldetguiaremision[i]['medmat'],
					'codbr':ldetguiaremision[i]['codbr'],
					'marca':ldetguiaremision[i]['marca'],
					'codmod':ldetguiaremision[i]['codmod'],
					'modelo':ldetguiaremision[i]['modelo'],
					'motivo':motivodev,
					'cantguia':ldetguiaremision[i]['cantidad'],
					'cantdevuel':ldetguiaremision[i]['cantdev'],
					'comentario':comentario,
					'cantidad':cantd,
					'niple':false
				})
				}
			}
		}
	}


	console.log(ldetdevfin)
	var ldetdev=JSON.stringify(ldetdevfin)

	var data=new Object
	data.exguiapemat=true
	data.ldetdev=ldetdev
	$.getJSON("",data,function(response){
		if (response.status) {
			var lexmat=response.lexmat
			if (lexmat.length==0) {
				locStorage('typemat',ldetdev)
				if (ldetdevfin.length == 0) {
					swal({title:'Debe devolver al menos un material',timer:2500,showConfirmButton:false,type: "error"})
					return false;
				};
				// lblcodproject
				var cproy=$(".lblcodproject").text()
				locStorage('typeproy',cproy)
				$(".lblcodproystorage").text(cproy)
				swal({title:'Material Agregado',timer:1500,showConfirmButton:false,type: "success"})
				listdetguiadev()
			}else{
				console.log('asds')
				swal({title:'ITEM '+lexmat[0]['coditem']+' esta en la Guia ('+lexmat[0]['docdevmat']+') "PE"',text:'Debe Generar o Anular la guia',showConfirmButton:true,type: "error"})
				return false
			}
		};
	})
}



openstorage = function(){

	var codigorand=localStorage.getItem('codrandmat')
	var codrandnip=localStorage.getItem('codrandniple')
	console.log(codigorand)
	console.log(codrandnip)

	var lparsemat = localStorage.getItem(codigorand)
	var lparseniple = localStorage.getItem(codrandnip)
	var lmatrecov=JSON.parse(lparsemat)
	var lniplerecov=JSON.parse(lparseniple)
	console.log(lmatrecov)
	console.log(lniplerecov)

	if (codigorand!=null) {
		document.getElementById('divtableddetfinal').style.display="block"
		document.getElementById('divcabguiadev').style.display="block"
		document.getElementById('divbtnsavefin').style.display="block"

		ldetdevfin = lmatrecov
		listdetguiadev()
	}
	if (codrandnip!=null) {
		document.getElementById('divtabledetniple').style.display="block"
		document.getElementById('divcabguiadev').style.display="block"
		document.getElementById('divbtnsavefin').style.display="block"
		lnippleselect = lniplerecov
		listtabniple()
	};
}


listdetguiadev=function(){
	console.log(ldetdevfin)
	if (ldetdevfin.length>0) {
		blockornonediv('divtableddetfinal','block');
		lguiadev = ldetdevfin
		$tb = $("table.tableddetfinal > tbody");
	    $tb.empty();
	    template = "<tr><td class=\"colst40\" style=\"text-align:center\">{{ item }}</td><td class=\"colst150\">{{ nguia }}</td><td class=\"colst150\">{{ codmat }}</td><td>{{ namemat }} {{ medmat }}</td><td class=\"colst100\">{{ marca }}</td><td class=\"colst100\">{{ modelo }}</td><td class=\"colst100\">{{ cantidad }}</td><td class=\"colst100\"><button style=\"border:none;\" type=\"button\" class=\"transparent btneditmatdet_mat\" data-codguiaremision=\"{{ codgremision }}\" data-cantguiarem=\"{{ cantguia }}\" data-inputcant=\"{{ cantidad }}\" data-cantdev=\"{{ cantdevuel }}\" data-item=\"{{ item }}\" data-cod_mat=\"{{ codmat }}\" data-namemat=\"{{ namemat }}\" data-medmat=\"{{ medmat }}\" data-cod_br=\"{{ codbr }}\" data-cod_mod=\"{{ codmod }}\" data-motdev=\"{{ motivo }}\" data-comentdev=\"{{ comentario }}\"><a style=\"font-size:25px;\"><i class=\"fa fa-pencil-square\"></i></a></button><button style=\"border:none;\" type=\"button\" class=\"transparent btndelmatdet_mat\" data-delcodguia=\"{{ codgremision }}\" data-cod_mat=\"{{ codmat }}\" data-cod_br=\"{{ codbr }}\" data-cod_mod=\"{{ codmod }}\"><a style=\"font-size:25px;color:#ef5350;\"><i class=\"fa fa-times-circle\"></i></a></button></td></tr>";
	    // template2 ="<tr><td class=\"colst40\" style=\"text-align:center\">{{ item }}</td><td class=\"colst150\">{{ nguia }}</td><td class=\"colst150\">{{ codmat }}</td><td>{{ namemat }} {{ medmat }}</td><td class=\"colst100\">{{ marca }}</td><td class=\"colst100\">{{ modelo }}</td><td class=\"colst100\">{{ cantidad }}</td><td class=\"colst100\"><button style=\"border:none;\" type=\"button\" class=\"transparent btndelnipdet_mat\" data-delncodped=\"{{ codped }}\" data-delncodguia=\"{{ nguia }}\" data-delncodmat=\"{{ codmat }}\" data-delncodbr=\"{{ codbr }}\" data-delncodmod=\"{{ codmod }}\"><a style=\"font-size:25px;color:#ef5350;\"><i class=\"fa fa-times-circle\"></i></a></button></td></tr>";
	    template2 ="<tr><td class=\"colst40\" style=\"text-align:center\">{{ item }}</td><td class=\"colst150\">{{ nguia }}</td><td class=\"colst150\">{{ codmat }}</td><td>{{ namemat }} {{ medmat }}</td><td class=\"colst100\">{{ marca }}</td><td class=\"colst100\">{{ modelo }}</td><td class=\"colst100\">{{ cantidad }}</td><td class=\"colst100\"></td></tr>";
	    for (x in lguiadev) {
	    	lguiadev[x].item = parseInt(x) + 1;
	    	console.log(lguiadev[x]['niple'])
		    if (lguiadev[x]['niple']==false) {
		    	$tb.append(Mustache.render(template, lguiadev[x]));
		    }else{
		    	$tb.append(Mustache.render(template2, lguiadev[x]));
		    }
		}
	}else{
		blockornonediv('divtableddetfinal','none');
	}

	if (ldetdevfin.length==0 && lnippleselect.length==0) {
		$(".lblcodproystorage").text('');
	};

}




openlmat= function(){
	var data= new Object;
	if (event.which == 13) {
		var lblcodpro,txting,stlblcodpro;
		lblcodpro=$(".lblcodproystorage").text()
		console.log(lblcodpro)
		if (lblcodpro=="") {
			stlblcodpro=false
		}else{
			stlblcodpro=true
		}

		txting=this.value
		data.matdesc = txting
		data.listmat = true
		data.lblcodpro=lblcodpro
		data.stlblcodpro = stlblcodpro
		$.getJSON("", data, function(response){
			if (response.status) {
				var listamat=response.listamat
				console.log(listamat)
				if (listamat.length>0) {
					$(".mlistmat").modal("open")
					$tb = $("table.tab-lmaterials > tbody");
				    $tb.empty();
				    template = "<tr><td>{{ item }}</td><td>{{ cmat }}</td><td>{{ namemat }} {{ medmat }}</td><td>{{ marca }}</td><td>{{ model }}</td><td>{{ unidad }}</td><td><button style=\"border:none;\" type=\"button\" class=\"transparent btnselectmat\" value=\"{{ cmat }}\"><a style=\"font-size:25px;color:#4caf50;\"><i class=\"fa fa-check-circle\"></i></a></button></td></tr>";
				    for (x in listamat) {
					    listamat[x].item = parseInt(x) + 1;
					    $tb.append(Mustache.render(template, listamat[x]));
					}
				}else{
					text=txting
					lproy()
				}
			};
		})
	};
}


lproy = function(){
    	var data,lblcodpro;
    	lblcodpro=$(".lblcodproystorage").text()
    	data = new Object;

    	if (lblcodpro=="") {
    		data.lproyectos = true;
    	}else{
    		data.lmatdetguiapro=true;
    		data.cproy=lblcodpro
    	}

	    data.txtcodmat = text;
	    $.getJSON("", data, function(response) {
	      if (response.status) {
	      	var listprojects=response.listprojects
	      	if (listprojects.length > 0){
	      		console.log(listprojects[0]['matcod'])
	      		textcodmat = text
	      		$(".lblcodmat").text(textcodmat);
	      		$(".lblnamematerial").text(listprojects[0]['matnom']+" "+listprojects[0]['matmed']);//get nombre de material
	      		blockornonediv('divtableproy','block');
	      		blockornonediv('divtitproy','none');
	      		blockornonediv('divcabguiadev','none');
	      		blockornonediv('divcbolistguia','none');
	      		blockornonediv('divtabldetguiarem','none');
	      		//
	      		blockornonediv('divdescmat','block');

			    $tb = $("table.tablelistproy > tbody");
			    $tb.empty();
			    template = "<tr><td class=\"colst50\" style=\"text-align:center\">{{ item }}</td><td class=\"colst150\">{{ codproy }}</td><td class=\"\">{{ nompro }}</td><td class=\"colst200\"><button style=\"border:none;\" type=\"button\" class=\"transparent btnopendetsector\" value=\"{{ codproy }}\" data-nompro=\"{{ nompro }}\"><a style=\"font-size:25px;color:#4caf50;\"><i class=\"fa fa-check-circle\"></i></a></button></td></tr>";
			    for (x in listprojects) {
			    listprojects[x].item = parseInt(x) + 1;
			    $tb.append(Mustache.render(template, listprojects[x]));
				  }
	      	}else{
	      		swal({
	      			title:'Error',
	      			text:'Material No existe o No pertenece al proyecto de los materiales ya agregados',
	      			showConfirmButton:true,
	      			closeOnConfirm:true,
	      			type: "error"
	      			})
	      		return false;
	      	}
	      }
	    });
}


var ldetguiaremision='',sizeniple=''
$(function(){
	$('#cbolistguias').change(function(){
	  var codguia=$("select[id=cbolistguias] > option:selected").attr("data-codguia")
	  var namesector=$("select[id=cbolistguias] > option:selected").attr("data-namesector")
	  var namegrupo=$("select[id=cbolistguias] > option:selected").attr("data-namegrupo")
	  var namearea=$("select[id=cbolistguias] > option:selected").attr("data-namearea")
	  console.log(codguia)

	  var data = new Object
	  data.ldetguiarem = true
	  data.codguiarem=codguia
	  data.codmat=$(".lblcodmat").text()
	  $.getJSON("",data,function(response){
	  	if (response.status) {
	  		ldetguiaremision = response.ldetguiaremision

	  		var dato = new Object
	  		dato.gentcantniple=true
	  		dato.ldetguiaremision=JSON.stringify(ldetguiaremision)
	  		$.getJSON("",dato,function(response){
	  			if (response.status) {
	  				document.getElementById('divdetsectors').style.display="block"
	  				$(".lblnamesector").text(namesector)
	  				$(".lblnamegrupo").text(namegrupo)
	  				$(".lblnamearea").text(namearea)
	  				$(".lbltitdetmat").text("DETALLE DE GUIA "+codguia)
	  				sizeniple = response.sizeniple
	  				console.log(sizeniple)
	  				console.log(ldetguiaremision)
			  		listadetguiarem()
	  			};
	  		})
	  	};
	  })

	});
});

listadetguiarem=function(){
	blockornonediv('divtableproy','none');
	blockornonediv('divtabldetguiarem','block');
	$tb = $("table.tab-ldetguiarem > tbody");
    $tb.empty();
    template = "<tr><td class=\"colst40\" style=\"text-align:center\">{{ item }}</td><td class=\"colst150\">{{ codmat }}</td><td>{{ namemat }} {{ medmat }} {{ marca }} - {{ modelo }}</td><td class=\"colst100\">{{ cantidad }}</td><td class=\"colst100\">{{ cantdev }}</td><td class=\"colst100\" onclick=\"detrowguiarem('{{ codped }}','{{ codmat }}','{{ codbr }}','{{ codmod }}','{{ namemat }}','{{ medmat }}','{{ marca }}','{{ modelo }}','{{ countcod }}')\"><input type=\"text\" maxlength=\"4\" id=\"inputcant{{ countcod }}\" class=\"inputcant{{ countcod }}\" style=\"width:40px;height:30px\"></td><td class=\"colst150\"><input type=\"text\" maxlength=\"55\" class=\"cboxmotivo{{ countcod }}\" style=\"height:30px\"></td><td class=\"colst40\"><button style=\"border:none;\" type=\"button\" class=\"transparent btnmataddcoment\" data-countcod=\"{{ countcod }}\"><a style=\"font-size:25px;color:#039be5;\"><i class=\"fa fa-commenting\"></i></a></button><div style=\"display:none\"><input type=\"text\" class=\"comentario{{ countcod }}\" style=\"width:40px;height:30px\"></div></td></tr>";
    template2 = "<tr><td class=\"colst40\" style=\"text-align:center\">{{ item }}</td><td class=\"colst150\">{{ codmat }}</td><td>{{ namemat }} {{ medmat }} {{ marca }} - {{ modelo }}</td><td class=\"colst100\">{{ cantidad }}</td><td class=\"colst100\">{{ cantdev }}</td><td class=\"colst100\" onclick=\"detrowguiarem('{{ codped }}','{{ codmat }}','{{ codbr }}','{{ codmod }}','{{ namemat }}','{{ medmat }}','{{ marca }}','{{ modelo }}','{{ countcod }}')\"><input type=\"text\" maxlength=\"4\" id=\"inputcant{{ countcod }}\" class=\"inputcant{{ countcod }}\" style=\"width:40px;height:30px\"></td><td class=\"colst150\"></td><td class=\"colst40\"></td></tr>";
    for (x in ldetguiaremision) {
    	console.log(ldetguiaremision[x]['cantidad'])
    	ldetguiaremision[x].item = parseInt(x) + 1;

	    if (sizeniple.length > 0){
	    	$tb.append(Mustache.render(template2, ldetguiaremision[x]));
	    	document.getElementById('divbtnadd').style.display="none"
	    }else{
	    	if (ldetguiaremision[x]['cantidad']==ldetguiaremision[x]['cantdev']) {
	    		// document.getElementById('inputcant'+x).readOnly=true;
	    	};
	    	$tb.append(Mustache.render(template, ldetguiaremision[x]));
	    	$(".inputcant"+x).val(ldetguiaremision[x]['cantidad']-ldetguiaremision[x]['cantdev'])
	    	$(".cboxmotivo"+x).val("OTROS")
	    	document.getElementById('divbtnadd').style.display="block"
	    }
	}
}


detrowguiarem = function(codped,codmat,codbr,codmod,namemat,medmat,marca,modelo,countcod){
	var data=new Object
	data.codped = codped
	data.codmat=codmat
	data.codbr=codbr
	data.codmod=codmod
	data.exniple=true
	$.getJSON("",data,function(response){
		if (response.status) {
			lnipple = response.listaniple
			console.log(lnipple)
			if (lnipple.length > 0) {
				document.getElementById('inputcant'+countcod).readOnly=true
				$(".nippcodmat").text(codmat)
				$(".nippnamemat").text(namemat)
				$(".nippmedmat").text(medmat)
				$(".nippcodbr").text(codbr)
				$(".nippcodmod").text(codmod)
				$(".nippbrand").text(marca)
				$(".nippmodel").text(modelo)
				$(".nippcodped").text(codped)
				$(".modlnippleop").modal("open")
				$tb = $("table.tab-lnippleop > tbody");
			    $tb.empty();
			    template = "<tr><td class=\"colst40\">{{ item }}</td><td class=\"colst100\">{{ cantidad }}</td><td class=\"colst100\">{{ metrado }}</td><td class=\"colst50\">{{ tipo }}</td><td class=\"colst100\">{{ cenvdevmat }}</td><td class=\"colst100\"><input type=\"text\" class=\"cantnipdev{{ count }}\" style=\"width:40px;height:30px\"></td><td class=\"colst50\"><input type=\"checkbox\" name=\"boxmatnip{{ count }}\" id=\"boxmatnip{{ count }}\" class=\"boxmatnip{{ count }}\" onclick=\"checkmatnip('{{ count }}','{{ cenvdevmat }}','{{ cantidad }}')\"/><label for=\"boxmatnip{{ count }}\"></label></td><td><input type=\"text\" maxlength=\"55\" class=\"cbonipplemotivo{{ count }}\" style=\"height:30px\"></td><td class=\"colst100\"><button style=\"border:none;\" type=\"button\" class=\"transparent btnnipaddcoment\" data-countnipcod=\"{{ count }}\"><a style=\"font-size:25px;color:#039be5;\"><i class=\"fa fa-commenting\"></i></a></button><div style=\"display:none\"><input style=\"height:30px\" class=\"comentnipple{{ count }}\"></td></div></tr>";

			    for (x in lnipple){
				    lnipple[x].item = parseInt(x) + 1;
				    $tb.append(Mustache.render(template, lnipple[x]));
				    $(".cbonipplemotivo"+x).val("OTROS");
				    document.getElementById("boxmatnip"+x).checked=true
				    $(".cantnipdev"+x).val(lnipple[x]['cantidad'])
				}
			}
		};
	})

}




blockornonediv = function(iddiv,tipo){
	document.getElementById(iddiv).style.display = tipo;
}




listasector = function(){
	var nompro;
	codproyecto = this.value;
	nomproyecto = this.getAttribute("data-nompro");
	lsector();
}

lsector = function(){
	var data,codmat,
	data = new Object;
	codpro = codproyecto;
	codmat = $(".lblcodmat").text();

	data.listsector = true;
	data.proy_id = codpro;
	data.mat_id = codmat;
	$.getJSON("", data, function(response){
		if (response.status) {
			console.log(response.lsector)
			var lgremision=response.lsector

			if (lgremision.length>0) {
				document.getElementById('divcabguiadev').style.display='block'
				document.getElementById('divcbolistguia').style.display='block'
				blockornonediv('divtitproy','block')
				blockornonediv('divtableproy','none')
				$(".lblcodproject").text(codpro);
				$(".lblnameproject").text(nomproyecto);
				$(".codproy").text(codpro);

				$("#cbolistguias").empty()
				var op= document.createElement("option")
				cbolistguias.appendChild(op)
				for (var i = 0; i < lgremision.length; i++) {
					var opttr = lgremision[i]['namesector']+' || '+
								lgremision[i]['namegrupo']+' || '+
								lgremision[i]['namedsector']+' || '+
								lgremision[i]['codguia']+' || '
					var eltr = document.createElement("option");
					eltr.setAttribute("data-codguia",lgremision[i]['codguia'])
					eltr.setAttribute("data-namesector",lgremision[i]['namesector'])
					eltr.setAttribute("data-namegrupo",lgremision[i]['namegrupo'])
					eltr.setAttribute("data-namearea",lgremision[i]['namedsector'])
					eltr.textContent = opttr;
					eltr.value = opttr;
					cbolistguias.appendChild(eltr)
				}
				$("#cbolistguias").trigger('chosen:updated');
			}else{
				swal({title:'No existe registros',showConfirmButton:false,timer:1500,type:'error'})
				return false;
			}
		};
	})

}

listagainproy = function(){
	text = $(".lblcodmat").text();
	lproy();
	blockornonediv('divtableproy','block');
	blockornonediv('divtabldetguiarem','none');
	blockornonediv('divcbolistguia','none');
	blockornonediv('divdetsectors','none');
}


