var cod = '';
var iddoc = '';
var cambest = '';
var rtotal = '';
var respstock = '';
var codguia = '';
///
var texting='';
var tipoacce=''
var urlactual=window.location.href;
var lbltipoacce=''
ltrdettras=[]
var resttotal = '';
var idtable = '';
var pkherra = '';
var estadoguiaherra=''
var tableguia=''
var txtgeneral=''
var fechfrom=''
var fechto=''
var randmat=''
var textoherra=''
var textoinvent=''
tipolist=''
ltrherra=[]
////
ltotales = [];
lflag = [];

lcdev = [];
ltotaldev = [];
lherranew=[]

$(document).ready(function() {
$('ul.tabs').tabs();
$('.modal').modal();

$('.picker').pickadate({
	selectYears:10,
	selectMonths: true,
	container : 'body',
	format: 'yyyy-mm-dd',
    min: true,
});

$('.trfecha').pickadate({
	selectYears:10,
	selectMonths: true,
	container : 'body',
	format: 'yyyy-mm-dd',
	min:true
});

$('.fecha').pickadate({
	selectYears:10,
	selectMonths: true,
	container : 'body',
	format: 'yyyy-mm-dd',
});

$('.newguia').modal({
	dismissible: false
});
$('.modnewnoting').modal({
	dismissible: false
});



//SAVE OR EDIT
$(".btnsaveherramienta").click(function() { save_or_edit_herramienta();});
$(".btnsaveguiaherra").click(function() { save_or_edit_guiaherramienta();});
$(".saveguiafin").click(function() { save_guia_fin();});
$(".edsaveherraguia").click(function() { save_edit_guia();});
$(".saveguiadev").click(function() { save_guiadev();});
$(".btnedsavehe").click(function() { saveedithe();});
$(".btnsaveguiafinedit").click(function() { saveguiafinedit();});
$(document).on("click", "button[id=btneditguia]", editguia);
$(document).on("click", ".btneditguiage", editguiagenerada);

$(document).on("click", ".btneditheguia", editheguia);
$(document).on("click", ".btneditherradev", editherradev);
$(document).on("click", ".btnviewdivstock", viewdivstock);
$(".btneditstock").click(function() { editstock();});
$(".btnngsaveherra").click(function() { ngsaveherra();});

$(document).on("click", "button[id=btngenguia]", generarguia);
$(document).on("click", ".btnsaveeditguiage", saveeditguiage);//
$(document).on("click", ".btnselgrupo", selgrupo);


// ver pdf
$(document).on("click", ".btnviewguiaherrapdf", verguiaherrapdf);
$(document).on("click", ".btnviewguiacopdf", verguiacompdf);
$(document).on("click", ".btnviewdocdevpdf", verdocherrapdf);

//EXPORTAR EXCEL
$(document).on("click", ".btnconsexport", consexport);
$(document).on("click", ".btnexportinvent", exportinvent);
$(document).on("click", ".btndescformat", descformat);



//update herra
$(document).on("click", ".btnupdlisthe", updlisthe);


//OPEN MODALS
$(".btnopennewherra").click(function() { opennewherra(); });
$(".btnopennewguia").click(function() { opennewguia(); });
$(".btnaddguiaherra").click(function() { opennewguiaherra(); });
$(".btnnewguiaherra").click(function() { openaddguiaherra(); });
$(".btnaddherraguiadev").click(function() { openherraguiadev(); });
$(".btnaddheinvent").click(function() { addheinvent(); });
$(".btnlgrcreados").click(function() { opengrcreados(); });
$(".btnopeninv").click(function() { openinv(); });
$(".btnregrcarga").click(function() { regrcarga(); });





$(document).on("click", ".btneditherramienta", openeditherra);
$(document).on("click", "button[id=btnshowherra]", openlistherraguia);
$(document).on("click",".viewherradocdev", opendetherradev);
$(document).on("click",".btndetconsul", opendetconsul);
$(document).on("click",".btndetconsulproyherra", opendetconsulproyherra);
$(document).on("click", ".btnshowdetalle", opendetguiagene);
$(document).on("click", ".btndetherracompletas", opendetherracompl);
$(document).on("click", ".btndev", opennewdev);
$(document).on("click", ".btnaddguiaherraedit", openaddguiaherraedit);
$(document).on("click",".btnselectherra", selectherramienta);
$(document).on("click", "button.btn-editherraguia", showeditherraguia);

//DELETE
$(document).on("click", "button.btndelherraguiabase", delherraguia);
$(document).on("click", "button.btndelherraguia",delherraguiapre);
$(document).on("click", "button.btndelguiape", delguiape);
$(document).on("click", "button.btndelguiage", delguiage);
$(document).on("click", "button.btndeldocdev", deldocdev);


$(document).on("click", "button.btndelheguia", deveditheguia);
$(document).on("click", "button.btndelheguiage", delheguiage);

$(document).on("click", ".btnggecoment", ggecoment);
$(document).on("click", ".btntrselherra", trselherra);


//traslado
$(".txttrherramienta").on("keyup",keyupherramienta)
$(document).on("click", ".btntrhecoment", trhecoment);
$(document).on("click", ".btntraddherra", traddherra);
$(document).on("click", ".btntredherra", tredherra);
$(document).on("click", ".btntrdelherra", trdelherra);
$(document).on("click", ".btntrsavetras", trsavetras);
$(document).on("click", ".btntrsavetrasl", trsavetrasl);
$(document).on("click", ".btntrsavefdev", trsavefdev);






//////////////////




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
$(".txttrbuscherra").on("keyup",keyuptrbuscherra)
$(document).on("click", ".btnfiltxfech", filtxfech);


//combochosen
combochosen("select")

//NOTA DE INGRESO
$(document).on("click", ".btngeningreso", geningreso);
$(document).on("click", ".btnsavenotaing", savenotaing);
$(".keyupcompra").on("keyup",keyupcompra)
$(document).on("click", ".btndetnoting", detnoting);
$(document).on("click", ".btndelnoting", delnoting);
$(document).on("click", ".btninfoconvert", infoconvert);
///////

//mostrar_ocultar combofechdev
show_hide_combestado("#idcomboestado",".fguiadevol","#divfdev");
show_hide_combestado("#comboeditestado",".editfdev","#diveditfdev");
show_hide_combestado("#cbogrupoest",".fdevgrupohe","#divgrupofdev");


////// REPORT NOTE INGRESS TOOLS
$(document).on("click", ".btnviewpdfnota", showreportnoteingress);

});


descformat=function(){
	window.open("/almacen/herramienta/cargar?descformat=true")
}

infoconvert=function(){
	$(".modinfoconvert").modal("open")
}

show_hide_combestado = function(combo,txttoclean,div_show_hide){
	$(combo).on('change', function() {
		$(txttoclean).val("");
		console.log(this.value)

		if ( this.value == 'ALQUILER'){
			$(div_show_hide).show();
		}else{
			$(div_show_hide).hide();
		}
	});
}

combochosen = function(combo){
$(combo).chosen({
	allow_single_deselect:true,
	width: '100%'});
}

viewdivstock = function(){
	$(".hercod").val(this.value);
	$(".lblinvcodbr").text(this.getAttribute("data-codbr"))
	$(".herstock").val(this.getAttribute("data-herrastock"));
	$(".ingprecio").val(this.getAttribute("data-lastprice"))
	$(".cardherra").slideDown(1000);
}


selgrupo=function(){
	var namegrupo=this.value
	$(".descripgrupo").val(namegrupo)
	$(".modlistgrupo").modal("close")
}

opengrcreados=function(){
	var codguia=$(".editnumguia").val()
	console.log(lherranew)

	if ($(".newglbltypesave").text()=='new') {
		if (lherranew.length==0) {
			swal({title:'No existe grupo',timer:1000,showConfirmButton:false,type:'error'})
			return false
		}else{
			$(".modlistgrupo").modal("open")
			listgrcreados()
		}
	}else{
		var data=new Object
		data.idherraguia=codguia,
      	data.leditguia=true,
		$.getJSON("",data,function(response){
			if (response.status) {
				lherranew=response.leditheguia
				listgrcreados()
				console.log(lherranew)
				$(".modlistgrupo").modal("open")
			};
		})
	}
}

openinv=function(){
	window.open("/almacen/herramienta/inventario","_blank")
}

regrcarga=function(){
	window.open("/almacen/herramienta/cargar","_self")
}

listgrcreados=function(){
	var ldescgeneral=[]
	const unique = [...new Set(lherranew.map(item => item.descgeneral))];
	console.log(unique)
	for (var i=0; i<unique.length;i++){
		ldescgeneral.push({
			'descgeneral':unique[i]
		})
	}
	console.log(ldescgeneral)
	$tb = $("table.tablegrupo > tbody");
	$tb.empty();
	template = "<tr><td class=\"\">{{ item }}</td><td>{{ descgeneral }}</td><td class=\"\"><button type=\"button\" style=\"border:none;font-size:20px;\" class=\"transparent btnselgrupo\" value=\"{{ descgeneral }}\"><i style=\"color:#039be5\" class=\"fa fa-check\"></i></button></td></tr>";
	for (x in ldescgeneral) {
		if (ldescgeneral[x]['descgeneral']!=null) {
			console.log(ldescgeneral[x]['descgeneral'])
			ldescgeneral[x].item = parseInt(x) + 1;
			$tb.append(Mustache.render(template, ldescgeneral[x]));
		};
	}
}

consexport=function(){
	var codproy,nameproy;
	codproy=$("select[id=combolproy]").val()
	nameproy=$("select[id=combolproy] > option:selected").attr("data-nameproy")

	if (codproy=="") {
		swal({title:'Seleccione un proyecto',timer:1500,showConfirmButton:false,type:'error'})
		return false
	};
	console.log(suma)
	console.log(codproy)
	var data=new Object
	data.lherraxproy=JSON.stringify(suma)
	data.exporthexproy=true
	data.codproy=codproy
	window.open("/almacen/herramienta/guia/consulta?exporthexproy=true&codproy="+codproy+"&tipoacce="+tipoacce+"&lbltipoacce="+lbltipoacce+"")
}

exportinvent=function(){
	window.open("/almacen/herramienta/inventario?exportinv=true&tipoacce="+tipoacce+"")
}

ngsaveherra = function(){
	var namehe,medhe,codbrand,codunid,preciohe,tvida;
	namehe=$(".ngnamehe").val()
	medhe=$(".ngmedhe").val()
	codbrand=$("select[id='ngcbomarca']").val()
	codunid=$("select[id='ngcbounidad']").val()
	tvida=$(".ngtvidahe").val()

	if (namehe.trim()=="") {
		swal({title:"Ingresar Nombre de "+lbltipoacce, showConfirmButton:false,timer:1000,type:'error'})
		return false
	};
	if (medhe.trim()=="") {
		swal({title:"Ingresar Medida de "+lbltipoacce, showConfirmButton:false,timer:1000,type:'error'})
		return false
	};
	if (codunid=="") {
		swal({title:"Ingresar Unidad de "+lbltipoacce, showConfirmButton:false,timer:1000,type:'error'})
		return false
	};

	swal({
		title:'Crear '+lbltipoacce,
		text:'Seguro de crear '+lbltipoacce+'?',
		showConfirmButton:true,
		showCancelButton:true,
		confirmButtonText:'Si, Crear',
		cancelButtonText:'No, Cancelar',
		closeOnConfirm:false,
		closeOnCancel:true,
		type:'warning'
	},function(isConfirm){
		if (isConfirm) {
			var data=new Object
			data.saveherramienta=true
			data.nameherra=namehe
			data.marcaherra=codbrand
			data.medherra=medhe
			data.tipoacce=tipoacce
			data.tvida=tvida
			data.unidherra=codunid
			data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
			$.post("/almacen/herramienta/lista",data,function(response){
				if (response.status) {
					swal({title:lbltipoacce+" Agregada", showConfirmButton:false,timer:1000,type:'success'})
					tipolist='all'
					listarinventario()
					$(".modnewherraguia").modal("close")
				};
			})
		};
	})
}


addheinvent=function(){
	$(".modnewherraguia").modal("open");
	limp_ngnewherra()
}

limp_ngnewherra=function(){
	$(".ngnamehe").val("");
	$(".ngmedhe").val("");
	$(".ngtvidahe").val("");
}


filtxfech=function(){
	console.log('d')
	var fechinicial,fechfinal;
	fechinicial=$(".fechinicial").val()
	fechfinal=$(".fechfinal").val()
	console.log(fechfrom)
	console.log(fechto)

	if (fechinicial=="" || fechfinal=="") {
		swal({title:'Fecha INCORRECTA',showConfirmButton:false,timer:1500,type:"error"})
		return false
	}else{
		tipolist='rangofecha'
		fechfrom=fechinicial
		fechto=fechfinal
		if (document.getElementById('radiope').checked) {
			estadoguiaherra='PE'
			tableguia='tabla-guia'
			listarguiaherra()

		}else if (document.getElementById('radioge').checked) {
			estadoguiaherra='GE'
			tableguia='tabla-guiagene'
			listarguiaherra()
		}else{
			listardocdev()
		}
	}


}

ggecoment=function(){
	var count=this.getAttribute("data-numrow")

	var lastcoment=$("textarea[name=coment"+count).val()
	swal({
		title:'COMENTARIO',
		text:'<textarea placeholder=\"\" name=\"txtcomdevh\" class=\"materialize-textarea txtcomdevh\" maxlength=\"200\" length=\"200\"></textarea>',
		html:true,
		showConfirmButton:true,
		closeOnConfirm:true,
		showCancelButton:true,
		closeOnCancel:true,
		animation: "slide-from-top"
	},function(isConfirm){
		if (isConfirm) {
			var txtcom=$("textarea[name=txtcomdevh]").val()
			if (txtcom=="") {
				swal.showInputError("Debe ingresar un comentario")
				return false
			}else{
				$("textarea[name=coment"+count+"]").val(txtcom)
			}
		};
	})
	$("textarea[name=txtcomdevh]").val(lastcoment)
}



saveeditguiage = function(){
	var data,pkguia,pkpro,pktrans,pkcond,pkplaca,fsali,comentario;
	data = new Object;
	pkguia = $(".editgenumguia").val();
	pkpro = $("select[id=cboeditgeproy]").val();
	pktrans = $("select[id=cboeditgetransp]").val();
	pkcond = $("select[id=cboeditgecond]").val();
	pkplaca = $("select[id=cboeditgeplaca]").val();
	fsali = $(".fsaleditge").val();
	comentario = $("textarea[name=txtcomeditge]").val();

	if (fsali == "") {
		swal({title:'Ingresar Fecha de Salida', timer:2000, showConfirmButton:false,type:'error'})
		return false;
	};

	data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
	data.savecabguiaedit = true;
	data.nguias = pkguia;
	data.edproy = pkpro;
	data.edtrans = pktrans;
	data.edcond = pkcond;
	data.edplaca = pkplaca;
	data.edfechsalida = fsali;
	data.edcomenta = comentario;

	$.post("",data,function(response){
		if (response.status) {
			swal({title:'Edicion Correcta', timer:2000, showConfirmButton:false,type:'success'})
			$(".editguiage").modal("close");
			tipolist='all'
			tableguia='tabla-guiagene'
			estadoguiaherra='GE'
			listarguiaherra()
		};
	})
}

saveguiafinedit = function(){
	var data,nguias,edproy,edtrans,edcond,edplaca,edfechsalida,edcomenta;

	nguias=$(".editnumguia").val();
	edproy=$("select[id = comboeditproyecto]").val();
	edtrans=$("select[id = comboedittransportista]").val();
	edcond=$("select[id = comboeditconductor]").val();
	edplaca=$("select[id = comboeditplaca]").val();
	edfechsalida=$(".fguiasalidaedit").val();
	edcomenta=$("textarea[name=txtcomentguiaedit]").val();

	if (edfechsalida == "") {
		swal({title:'Ingresa Fecha de Salida', timer:2000, showConfirmButton:false,type:'error'})
		return false;
	};

	data = new Object;
	data.nguias = nguias
	data.edproy = edproy
	data.edtrans = edtrans
	data.edcond = edcond
	data.edplaca = edplaca
	data.edfechsalida = edfechsalida
	data.edcomenta = edcomenta

	data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
	data.savecabguiaedit = true;

	$.post("", data , function(response){
		if (response.status) {
			swal({title:'Guia Guardada', timer:2000, showConfirmButton:false,type:'success'})
			tipolist='all'
			tableguia='tabla-guia'
		 	estadoguiaherra='PE'
			listarguiaherra()
			$(".editguia").modal("close");
		};
	},"json")
}


openaddguiaherraedit = function(){
	var data = new Object
	data.leditguia=true
	data.idherraguia=$(".editnumguia").val()
	$.getJSON("",data,function(response){
		if (response.status) {
			var leditheguia=response.leditheguia
			console.log()
			if (leditheguia.length<15) {
				listallherra()
				limp_newherraguia()
				$(".newglbltypesave").text('ednewguia')
				$(".newherramientaguia").modal("open");
			}else{
				swal({title:'Detalle con cantidad Maxima',timer:1500,showConfirmButton:false,type:'error'})
				return false
			}
		};
	})
}



saveedithe = function(){
	var data,stock,stockfinal,cantpermit,numeroguia,cantstatic,codigohe,codhe,cantidad,estado,fechdevolucion,comenta;
  	numeroguia = $(".lblnumeroguia").text();
  	stock=$(".lbleditstock").text();
  	cantstatic = $(".cantstatic").text();
	codigohe = $(".lbleditcodhe").text();
	codhe = $(".lblid").text();
	cantidad = $(".edcanthe").val();
	estado = $("select[id=comboeditestado]").val();
	fechdevolucion = $(".editfdev").val();
	comenta = $("textarea[name=txtedcomenthe]").val();

	if (cantidad.trim() == "" || parseFloat(cantidad)== 0 || !/^[0-9.]+$/.test(cantidad)) {
		swal({title:'Cantidad INCORRECTA', timer:1500, showConfirmButton:false,type:'error'})
		return false;
	}
	if (estado == 'ALQUILER' && fechdevolucion == "") {
		swal({title:'Ingresar Fecha de Devolucion', timer:1500, showConfirmButton:false,type:'error'})
		return false;
	}


	cantpermit = parseFloat(stock) + parseFloat(cantstatic);
	console.log(cantpermit)
	descuento = parseFloat(cantstatic) - parseFloat(cantidad); //3
	stockfinal = parseFloat(stock) + parseFloat(descuento);

	if (parseFloat(cantidad) > parseFloat(cantpermit)) {
		swal({title:'Cantidad es Mayor al stock Total', timer:1500, showConfirmButton:false,type:'error'})
		return false;
	};

	data = new Object;
	data.viewstock = true;
	data.herra = codigohe;
	$.getJSON("/almacen/herramienta/inventario", data, function(response) {
		if (response.status) {
			respstock = response.cantalmacen;
			console.log(respstock)

			var dato = new Object
			dato.codigohe=codigohe
			dato.codhe=codhe
			dato.cantidad=cantidad
			dato.estado=estado
			dato.fechdevolucion=fechdevolucion
			dato.comenta=comenta
			dato.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
			dato.stockfin = stockfinal;
			dato.editdetguia = true;

		    $.post("", dato, function(response) {
		        if (response.status) {
		        	swal({title:'Edicion Correcta', timer:2000, showConfirmButton:false,type:'success'})
					$(".editherraguia").modal("close");
					cod = numeroguia;
					listeditguia();
		        }
		      });
		};
  	});
}




editheguia = function(){
	var codigoherramienta,estado,nameher,medidaher,marcaher,data;
	data = new Object;
	codigoherramienta = this.getAttribute("data-codhe");

	estado = this.getAttribute("data-estado");
	if (estado == "ALQUILER") {
		document.getElementById('diveditfdev').style.display = "block";
	}else{
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
	$(".lbleditdesche").text(nameher+" "+medidaher+" "+marcaher);
	$(".edcanthe").val(this.getAttribute("data-cantidad"));
	$("select[id=comboeditestado]").val(estado);
	$(".editfdev").val(this.getAttribute("data-fechadevolucion"));
	$("textarea[id=txtedcomenthe]").val(this.getAttribute("data-coment"));

	data.viewstock = true;
	data.herra = codigoherramienta;
	$.getJSON("/almacen/herramienta/inventario",data, function(response){
		if (response.status) {
			$(".lbleditstock").text(response.cantalmacen);
			$(".editherraguia").modal("open");
		};
	})
}



editguia = function(){
	var idguia = this.value;
	var codedtrans = this.getAttribute("data-transp");
	var cboedcond = document.getElementById("comboeditconductor");
	var cboedplaca = document.getElementById("comboeditplaca")
	var cond = this.getAttribute("data-conductor");
	var plac = this.getAttribute("data-placa");

	$(".editnumguia").val(idguia);
	$("select[id=comboeditproyecto]").val(this.getAttribute("data-proy"));
	$("#comboeditproyecto").trigger('chosen:updated')
	$("select[id=comboedittransportista]").val(codedtrans);
	$("#comboedittransportista").trigger('chosen:updated')
	$("select[id=comboeditconductor]").val(cond);
	$("#comboeditconductor").trigger('chosen:updated')
	$("select[id=comboeditplaca]").val(plac);
	$("#comboeditplaca").trigger('chosen:updated')

	$(".fguiasalidaedit").val(this.getAttribute("data-fechasalida"));
	$("textarea[name=txtcomentguiaedit]").val(this.getAttribute("data-comentario"));

	cod = idguia;
	listeditguia();
}

listeditguia = function(){
	var data,id;
	id=cod;
	if (id !== "") {
    data = {
      idherraguia: id,
      leditguia: true,
    };
    $.getJSON("", data, function(response) {
        var $tb, template, x;
      if (response.status) {
      	$(".editguia").modal("open");
        $tb = $("table.table-detailsguiaherraedit > tbody");
        $tb.empty();
        template = "<tr><td class=\"colst40\">{{ item }}</td><td>{{ descgeneral }}</td><td class=\"colst150\">{{ edcodherra }}</td><td>{{ ednombherra }} {{ edmedherra }} {{ edbrandherra }}</td><td class=\"colst100\">{{ edcant }}</td><td>{{ edest }}</td><td class=\"colst150\">{{ edfdev }}</td><td class=\"colst150\"><button type=\"button\" class=\"transparent btneditheguia\" style=\"border:none;font-size:20px;\" value=\"{{ edid }}\" data-codhe=\"{{ edcodherra }}\" data-codigo=\"{{ edcodguia }}\" data-nameherramienta=\"{{ ednombherra }}\" data-medida=\"{{ edmedherra }}\" data-marca=\"{{ edbrandherra }}\" data-cantidad=\"{{ edcant }}\" data-estado=\"{{ edest }}\" data-fechadevolucion=\"{{ edfdev }}\" data-coment=\"{{ edcoment }}\"><a style=\"color:#4caf50;\"><i class=\"fa fa-pencil-square\"></i></a><span class=\"glyphicon glyphicon-edit\"></span></button><button type=\"button\" class=\"transparent btndelheguia\" style=\"border:none;margin-left:20px;font-size:20px;;\" value=\"{{ edid }}\" data-codherra =\"{{ edcodherra }}\" data-cantidad=\"{{ edcant }}\"><a style=\"color:#ef5350\"><i class=\"fa fa-trash\"></i></a></button></td></tr>";
        for (x in response.leditheguia) {
        response.leditheguia[x].item = parseInt(x) + 1;
        $tb.append(Mustache.render(template, response.leditheguia[x]));
      }
    }
    });
  }
}



editguiagenerada = function(){
	var codtran = this.getAttribute("data-transpge")
	var numg = this.value;
	var cboedgecond = document.getElementById("cboeditgecond");
	var cboedgeplaca = document.getElementById("cboeditgeplaca");
	var codeditcond = this.getAttribute("data-conductorge");
	var codeditplaca = this.getAttribute("data-placage");

	$(".editgenumguia").val(numg);
	$("#cboeditgeproy").val(this.getAttribute("data-proyge"));
	$("#cboeditgeproy").trigger('chosen:updated');
	$("#cboeditgetransp").val(codtran);
	$("#cboeditgetransp").trigger('chosen:updated');
	$("#cboeditgecond").val(codeditcond)
	$("#cboeditgecond").trigger('chosen:updated');
	$("#cboeditgeplaca").val(codeditplaca)
	$("#cboeditgeplaca").trigger('chosen:updated');

	$(".fsaleditge").val(this.getAttribute("data-fechasalidage"));
	$("textarea[name=txtcomeditge]").val(this.getAttribute("data-comentarioge"));
	cod = numg;
	listeditguiage();
}

listeditguiage = function(){
	var data,id;
	id=cod;
	if (id !== "") {
    data = {
      idherraguia: id,
      leditguia: true,
    };
    $.getJSON("", data, function(response) {
        var $tb, template, x;
      if (response.status) {
      	$(".editguiage").modal("open");
        $tb = $("table.table-detguiageedit > tbody");
        $tb.empty();

        template = "<tr><td class=\"colst40\">{{ item }}</td><td class=\"colst150\">{{ edcodherra }}</td><td>{{ ednombherra }} {{ edmedherra }} {{ edbrandherra }}</td><td class=\"colst100\">{{ restcant }}</td><td>{{ edest }}</td><td class=\"colst150\">{{ edfdev }}</td><td class=\"colst100\"><button type=\"button\" class=\"transparent btndelheguiage\" style=\"border:none;margin-left:20px;font-size:20px;;\" value=\"{{ edid }}\" data-namehe=\"{{ ednombherra }}\" data-medidahe=\"{{ edmedherra }}\" data-codheedge =\"{{ edcodherra }}\" data-cantedge=\"{{ edcant }}\" data-restcant=\"{{ restcant }}\"><a style=\"color:#ef5350\"><i class=\"fa fa-trash\"></i></a></button></td></tr>";
        for (x in response.leditheguia) {
        response.leditheguia[x].item = parseInt(x) + 1;
        $tb.append(Mustache.render(template, response.leditheguia[x]));
      }
    }
    });
  }
}



$(function(){
	$('#combolproy').change(function(){
	  var data,id,np;
	  id = this.value;
	  np = $("select[id=combolproy] > option:selected").text();
	  $(".nombreproyecto").text(np);
	  console.log(id);
	  if (id !== "") {
	    data = {
	      codigoproy: id,
	      lproyherra: true,
	      tipoacce:tipoacce
	    };
	    $.getJSON("", data, function(response) {
	        var $tb, template, x;
			if (response.status) {
				suma = []
				var dato = response.listaproyherra;
				console.log(dato);
				dato.forEach(function(o) {
				var existing = suma.filter(function(i) {
					return i.herraid === o.herraid })[0];
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
				template = "<tr><td class=\"colst40\">{{ item }}</td><td>{{ nombreherra }}</td><td>{{ medidaherra }}</td><td class=\"colst150\">{{ brand }}</td><td class=\"colst150\">{{ unidad }}</td><td class=\"colst150\">{{ cantid }}</td><td class=\"colst150\"><button type=\"button\" style=\"border:none;font-size:20px;\" class=\"transparent btndetconsulproyherra\" data-medherra=\"{{ medidaherra }}\" data-nameherra=\"{{ nombreherra }}\" value=\"{{ herraid }}\"><i class=\"fa fa-info-circle\"></i></button></td></tr>";
				for (x in suma) {
					suma[x].item = parseInt(x) + 1;
					$tb.append(Mustache.render(template, suma[x]));
				}

			}
	    });
	  }

	});
});

editherradev= function(){
	var codherra,codguia,coddoc,cantpermit,estadohe,nameherra,medherra,brand;
	codherra = this.value;
	codguia = this.getAttribute("data-coguia");
	coddoc = this.getAttribute("data-ndoc");
	cantpermit = this.getAttribute("data-cant");
	estadohe = this.getAttribute("data-est");
	nameherra = this.getAttribute("data-nherra");
	medherra = this.getAttribute("data-mherra");
	brand = this.getAttribute("data-marherra")
	console.log(estadohe)

	swal({
		title:nameherra+" "+medherra+" "+brand,
		type:'input',
		text:'<h5>Cantidad Maxima permitida: '+cantpermit+'</h5><br><h6 style=\"text-align:center;font-weight:bold\">ESTADO</h6><select id=\"comboestherradev\" class=\"browser-default\"><option val=\"BUENO\">BUENO</option><option val=\"REPARACION\">REPARACION</option><option val=\"BAJA\">BAJA</option></select>',
		html:true,
		showCancelButton:true,
		closeOnCancel:true,
		closeOnConfirm:false,
		animation: "slide-from-top"
	},function(inputValue){
		if (parseFloat(inputValue)=='0' || !/^[0-9.]+$/.test(inputValue)) {
			swal.showInputError('Cantidad INCORRECTA');
			return false;
		}
		if (parseFloat(inputValue) > parseFloat(cantpermit)) {
			swal.showInputError('Cantidad excede al permitido');
			return false;
		}

		var data=new Object
		data.viewstock=true
		data.herra=codherra
		$.getJSON("/almacen/herramienta/inventario",data,function(response){
			if (response.status) {
				var cantalmacen=response.cantalmacen
				console.log(cantalmacen)
				var cantupdinv=''
				if (estadohe=="BAJA") {
					cantupdinv=parseFloat(cantalmacen)-parseFloat(inputValue)
				}else{
					cantupdinv=parseFloat(cantalmacen)-(parseFloat(cantpermit)-parseFloat(inputValue))
				}
				console.log(cantupdinv)

				var dato=new Object
				dato.codguia=codguia
				dato.codherra=codherra
				dato.gethedetghe=true
				$.getJSON("",dato, function(response){
					if (response.status) {
						var cantdev=response.cantdev
						var idtabdetghe=response.id
						console.log(cantdev)
						console.log(idtabdetghe)
						var cantupddetghe=parseFloat(cantdev)-(parseFloat(cantpermit)-parseFloat(inputValue))
						console.log(cantupddetghe)

						var dat=new Object
						dat.updeddocdev=true
						dat.codherra=codherra
						dat.codguia=codguia
						dat.coddocdev=coddoc
						dat.updcant=inputValue
						dat.estadohe=$("select[id=comboestherradev]").val()
						dat.cantupdinv=cantupdinv
						dat.cantupddetghe=cantupddetghe
						dat.idtabdetghe=idtabdetghe
						dat.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
						$.post("",dat,function(response){
							if (response.status) {
								swal({title:'Edicion Correcta',timer:1500,showConfirmButton:false,type:'success'})
								cod=coddoc
								listherradocdev()
							};
						})

					};
				})

			};
		})
	})
	$("select[id=comboestherradev]").val(estadohe)
}


selectherramienta = function(){
	var id,h,m,data;
	id = this.value;
	h = this.getAttribute("data-name");
	m = this.getAttribute("data-medida");
	marc = this.getAttribute("data-marca");

	console.log(id);
	$(".nombreherra").text(h+" "+m+" "+marc);
	$(".lblcodhe").text(id);
	  if (id !== "") {
	    data = {
	      codigoherra: id,
	      lherraproy: true,
	    };
	    $.getJSON("", data, function(response) {
	        var $tb, template, x;
	      if (response.status) {
	      	console.log(response.listaherraproy)
	      sum = []
	      var dato = response.listaherraproy;

	      dato.forEach(function(o) {
		    var existing = sum.filter(function(i) {
		    	return i.proyc === o.proyc })[0];
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
	        template = "<tr><td class=\"colst40\">{{ item }}</td><td>{{ proyc }} {{ proynom }}</td><td class=\"colst150\">{{ cantidad }}</td><td class=\"colst150\"><button type=\"button\" style=\"border:none;font-size:20px;\" class=\"transparent btndetconsul\" id=\"\" data-nameproy=\"{{ proynom }}\" value=\"{{ proyc }}\"><i class=\"fa fa-info-circle\"></i></button></td></tr>";
	        for (x in sum) {
	        sum[x].item = parseInt(x) + 1;
	        $tb.append(Mustache.render(template, sum[x]));
	        }
	        $(".lconsherra").modal("close");
	    }
	    });
	  }
}


opendetconsulproyherra = function(){
	var herra, proyid, nameproy;
	herra = this.value;
	nh = this.getAttribute("data-nameherra");
	nm = this.getAttribute("data-medherra");
	proycod = $("select[id=combolproy]").val();
	nameproy = $("select[id=combolproy] > option:selected").text()
	cherra = herra;
	codproy = proycod;
	$(".titproyherra").text("HERRAMIENTA: "+nh+" "+nm);
	$(".titherra").text("PROYECTO: "+nameproy);
    listdetconsult();
	$(".detherraconsult").modal("open");
}

opendetconsul = function(){
	var herra, proyid, nameproy,nherra;
	nameproy = this.getAttribute("data-nameproy");
	herra = $(".lblcodhe").text();
	nherra = $(".nombreherra").text();
	proyid = this.value;
	cherra = herra;
	codproy = proyid;
	$(".titproyherra").text("PROYECTO: "+proyid+" - "+nameproy);
	$(".titherra").text("HERRAMIENTA: "+nherra);
    listdetconsult();
	$(".detherraconsult").modal("open");
}

listdetconsult = function(){
	var data,id;
	id=codproy;
	idherra = cherra;
	if (id !== "") {
		data = {
		  numproy: id,
		  ldetcons: true,
		  idherramienta : idherra,
		};
	$.getJSON("", data, function(response) {
		var $tb, template, x;
		if (response.status) {
			var fech = response.detherraxproy;
			console.log(fech)
			$tb = $("table.table-detherraconsult > tbody");
			$tb.empty();
			template = "<tr><td class=\"colst40\">{{ conta }}</td><td class=\"colst150\">{{ nguia }}</td><td class=\"colst150\">{{ regisyear }}-{{ regismonth }}-{{ regisday }}</td><td class=\"colst150\">{{ fecsalida }}</td><td>{{ nameherra }} {{ medherra }}</td><td class=\"colst150\">{{ marcahe }}</td><td class=\"colst100\">{{ cantiherra }}</td><td class=\"colst150\">{{ estado }}</td><td class=\"fechdev\">{{ fde }}</td></tr>";
			for (x in response.detherraxproy) {
				response.detherraxproy[x].item = parseInt(x) + 1;
				$tb.append(Mustache.render(template, response.detherraxproy[x]));
			}
			changecolortd('td.fechdev');
		}
	});
	}
}


editstock = function(){
	var data,codherra,codbr,canti,tipomoneda,lastprice;
	codherra = $(".hercod").val();
	codbr = $(".lblinvcodbr").text();
	canti = $("input[name=ingcant]").val();
	lastprice =$(".ingprecio").val();
	tipomoneda=$("select[id=invtipomon]").val();

	if (canti.trim()=="" || !/^[0-9.]+$/.test(canti) || canti<0) {
		swal({title:'Cantidad INCORRECTA', timer:1500, showConfirmButton:false,type:'error'})
		return false;
	}

	if (lastprice.trim()=="" || !/^[0-9.]+$/.test(lastprice) || lastprice==0) {
		swal({title:'Precio INCORRECTO', timer:1500, showConfirmButton:false,type:'error'})
		return false;
	};

	swal({
	    title: "Editar stock?",
	    text: "Seguro de editar Stock?",
	    type: "warning",
	    showCancelButton: true,
	    confirmButtonColor: "#dd6b55",
	    confirmButtonText: "Si, Editar!",
	    cancelButtonText: "No, Cancelar",
	    closeOnConfirm: true,
	    closeOnCancel: true
	  }, function(isConfirm) {
	    if (isConfirm) {
			var dato = new Object;
			dato.codherra = codherra
			dato.codbr=codbr
			dato.canti = canti
			dato.editstock = true;
			dato.tipmoneda=tipomoneda;
			dato.lastprice=lastprice;
			dato.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
			$.post("", dato, function(response) {
				if (response.status) {
					swal({title:'Stock Ingresado',timer:1500,showConfirmButton:false,type:'success'});
					tipolist='all'
					listarinventario()
				} else {
				  swal("Error", "Error al ingresar stock", "warning");
				}
			});
	    }
	  });
}

deveditheguia = function(){
	var cant,iddetguiahe,herra;
	iddetguiahe=this.value
	cant = this.getAttribute("data-cantidad")
	herra = this.getAttribute("data-codherra");

	var btn,codher;
	btn = this;
	swal({
	title: "Quitar "+lbltipoacce+"?",
	text: "Desea eliminar "+lbltipoacce+" de la guia?",
	type: "warning",
	showCancelButton: true,
	confirmButtonColor: "#dd6b55",
	confirmButtonText: "Si, Eliminar!",
	cancelButtonText: "No, Cancelar",
	closeOnConfirm: true,
	closeOnCancel: true
	}, function(isConfirm) {
		var data;
		if (isConfirm) {
			var data=new Object
			data.herra = herra;
			data.viewstock = true;
			$.getJSON("/almacen/herramienta/inventario", data, function(response) {
			if (response.status) {
				var respstock = response.cantalmacen;
				var stfinal = parseFloat(respstock) + parseFloat(cant);
				console.log(respstock);
				console.log(stfinal);

				dato = new Object;
				iddetalle = btn.value;
				dato.deleditherguia = true;
				dato.coddetalle = iddetguiahe;
				dato.devherraguia = true;
				dato.codhe = herra;
				dato.stfinal = stfinal;
				dato.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
				$.post("", dato, function(response) {
					if (response.status) {
						swal({title:'Eliminacion Correcta', timer:1500, showConfirmButton:false,type:'success'})
						cod = $(".editnumguia").val();
						listeditguia();
					}
				});
				}
			})
		}
	});
}

delheguiage = function(){
	var btn,nhe,medhe;
	btn = this;
	idtable = this.value;
	pkherra = this.getAttribute("data-codheedge");
	nhe = this.getAttribute("data-namehe");
	medhe = this.getAttribute("data-medidahe");

	canthe = this.getAttribute("data-cantedge");
	restcant = this.getAttribute("data-restcant");
	console.log(canthe,restcant)

	var description = nhe+" "+medhe;
	pkguia = $(".editgenumguia").val();


	swal({
	title: description,
	text: "Cantidad Maxima para Quitar: "+restcant,
	type: "input",
	showCancelButton: true,
	showConfirmButton:true,
	closeOnConfirm: false,
	closeOnCancel:true,
	animation: "slide-from-top",
	},
	function(inputValue){
	if (parseFloat(inputValue) > parseFloat(restcant)){
		swal.showInputError("Cantidad debe ser menor a la cantidad enviada");
		return false;
	};
	if (inputValue == "" || parseFloat(inputValue) == 0) {
		swal.showInputError("Cantidad Ingresada INCORRECTA");
		return false;
	};


	var cantfin = canthe;
	resttotal = parseFloat(cantfin) - parseFloat(inputValue);
	console.log(resttotal)

	var data;
	data = new Object;
	data.viewstock = true;
	data.herra = pkherra;
	$.getJSON("/almacen/herramienta/inventario", data, function(response) {
		if (response.status) {
			respstock = response.cantalmacen;
			console.log(respstock);
			var stkeditfin = parseFloat(respstock) + parseFloat(inputValue);
			console.log(inputValue, canthe)

			if (inputValue==canthe) {
				var stcantidades=true
			}
			console.log(stcantidades)

			var dato;
			dato = new Object;
			dato.idtable = idtable;
			dato.cantfinal = resttotal;
			dato.eddetguia = true;
			dato.stcantidades=stcantidades
			dato.codigohe = pkherra;
			dato.stockfin = stkeditfin;
			dato.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
			$.post("",dato, function(response){
				if (response.status) {
					swal({
						title:"Devolucion Correcta",
						timer:2000,
						showConfirmButton: false,
						type: "success"
					})
					cod = pkguia;
					listeditguiage();
				};
			})

		};
  	}, "json");
	})
}


delguiape = function(){
	var codguiahe=this.value
	console.log(codguiahe)
	swal({
		title:'ANULAR GUIA',
		text:'Seguro de Anular Guia de Herramienta?',
		showConfirmButton:true,
		showCancelButton:true,
		closeOnConfirm:true,
		closeOnCancel:true,
		type:'warning'

	},function(isConfirm){
		if (isConfirm) {
			var data=new Object
			data.getlistdetguiahe=true
			data.codguiahe=codguiahe
			$.getJSON("", data,function(response){
				if (response.status) {
					var listdetguiahe=response.listdetguiahe
					console.log(listdetguiahe)

					var dato=new Object
					dato.getlistinvent=true
					dato.listdetguiahe=JSON.stringify(listdetguiahe)
					$.getJSON("",dato,function(response){
						console.log('as')
						var listinvent=response.listinvent
						console.log(listinvent)

						var dat=new Object
						dat.upddelguia=true
						dat.codguiahe=codguiahe
						dat.listinvent=JSON.stringify(listinvent)
						dat.listdetguiahe=JSON.stringify(listdetguiahe)
						dat.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
						$.post("",dat,function(response){
							if (response.status) {
								swal({title:'Anulacion CORRECTA',timer:2000,showConfirmButton:false,type:'success'})
								tipolist='all'
								tableguia='tabla-guia'
								estadoguiaherra='PE'
								listarguiaherra()
							};
						})
					})
				};
			})
		};
	})
}



deldocdev = function(){
	var coddocdev=this.value
	swal({
		title:'Anular Documento',
		text:'Seguro de anular Documento de Devolucion?',
		showConfirmButton:true,
		showCancelButton:true,
		type:'warning'
	},function(isConfirm){
		if (isConfirm) {
			var data=new Object
			data.getldetdocdev=true
			data.coddocdev=coddocdev
			$.getJSON("",data,function(response){
				if (response.status) {
					var ldetdocdev=response.ldetdocdev
					console.log(ldetdocdev)

					var dato=new Object
					dato.ldetdocdev=JSON.stringify(ldetdocdev)
					dato.getldetguiahe=true
					$.getJSON("",dato,function(response){
						if (response.status) {
							var ldetguiahe=response.ldetguiahe
							console.log(ldetguiahe)

							var dat=new Object
							dat.getlinventhe=true
							dat.ldetdocdev=JSON.stringify(ldetdocdev)
							$.getJSON("",dat,function(response){
								if (response.status) {
									var linventhe=response.linventhe
									console.log(linventhe)

									var da=new Object
									da.upddeldocdev=true
									da.coddocdev=coddocdev
									da.ldetguiahe=JSON.stringify(ldetguiahe)
									da.linventhe=JSON.stringify(linventhe)
									da.ldetdocdev=JSON.stringify(ldetdocdev)
									da.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
									$.post("",da,function(response){
										if (response.status) {
											swal({title:'Anulacion de Documento Correcta',timer:2000,showConfirmButton:false,type:'success'})
											tipolist='all'
											listardocdev()
										};
									})
								};
							})
						};
					})

				};
			})
		};
	})
}

delguiage = function(){
  var btn;
  btn = this;
  codguia = this.value
  swal({
    title: "Anular Guia?",
    text: "Desea anular Guia Generada?",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dd6b55",
    confirmButtonText: "Si, Anular!",
    cancelButtonText: "No, Cancelar",
    closeOnConfirm: true,
    closeOnCancel: true
  }, function(isConfirm) {
    if (isConfirm) {

    	var data=new Object
    	data.getlistdetguiahe=true
    	data.codguiahe=codguia
    	$.getJSON("",data,function(response){
    		if (response.status) {
    			var listdetguiahe=response.listdetguiahe
    			console.log(listdetguiahe)

    			var dato=new Object
    			dato.getlistinvent=true
    			dato.listdetguiahe=JSON.stringify(listdetguiahe)
    			$.getJSON("",dato,function(response){
    				if (response.status) {
    					var listinvent=response.listinvent
    					console.log(listinvent)

    					var dat=new Object
    					dat.upddelguia=true
    					dat.listinvent=JSON.stringify(listinvent)
    					dat.listdetguiahe=JSON.stringify(listdetguiahe)
    					dat.codguiahe=codguia
    					dat.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
    					$.post("",dat,function(response){
    						if (response.status) {
    							swal({title:'Anulacion CORRECTA',timer:2000,showConfirmButton:false,type:'success'})
								tipolist='all'
								tableguia='tabla-guiagene'
								estadoguiaherra='GE'
								listarguiaherra()
    						};
    					})

    				};
    			})

    		};
    	})
    }
  });
}





delherraguiapre = function(){
	var codherra=this.value
	for (var i = 0; i < lherranew.length; i++) {
		if (lherranew[i]['codherra']==codherra) {
			lherranew.splice(i,1)
			var lherrastring=JSON.stringify(lherranew)
			locStorage(lherrastring)
		};
	}
	lguiaherra()
}

openherraguiadev = function(){
var nguia = $(".lblnumguia").text();
$(".codguia").text(nguia);
$(".newherraguiadev").modal("open");
}






save_guiadev = function(){
	console.log(listherradev)
	var transp,fretorno,codguia,codcond,codplaca,serie,numguia,tipocod;
	codguia=$(".numguiadev").text();
	transp=$("select[id=devcotrans]").val()
	codcond=$("select[id=devcoconduc]").val()
	codplaca=$("select[id=devcoplaca]").val()
	fretorno=$(".fdevret").val()
	serie=$(".devnumserie").val()
	numguia=$(".devnumguia").val()
	numguiatot=serie+numguia
	console.log(numguia)
	if (document.getElementById('rddevman').checked) {
		tipocod='manual'
		if (numguia.length != 8) {
	  		swal({title:'Numero de Guia INCORRECTA', timer:1500, showConfirmButton:false,type:'error'})
	  		return false
	  	}
	}else{
		tipocod='auto'
	}


	if (transp=="") {
		swal({title:'Seleccionar Transportista', timer:1500, showConfirmButton:false,type:'error'})
		return false;
	};

	if (fretorno=="") {
		swal({title:'Ingresar Fecha de Retorno', timer:1500, showConfirmButton:false,type:'error'})
		return false;
	};
	var lhedev=[]

	for (var i = 0; i < listherradev.length; i++) {
		var inputcant=$(".cantdev"+i).val()
		var estherra=$("select[id=comboest"+i+"]").val()
		var comentherra=$("textarea[name=coment"+i+"]").val()

		if (inputcant.trim()!="") {
			if (parseFloat(inputcant)==0 ||
				!/^[0-9.]+$/.test(inputcant)) {
				swal({title:'Cantidad INCORRECTA en ITEM: '+listherradev[i]['item'], showConfirmButton:true,type:'error'})
				return false;
			};
			var sumcant=parseFloat(inputcant)+parseFloat(listherradev[i]['cantdevuelta'])

			if (parseFloat(sumcant)>listherradev[i]['cantiherra']) {
				swal({title:'Cantidad es mayor al enviado en ITEM: '+listherradev[i]['item'], showConfirmButton:true,type:'error'})
				return false;
			};
			lhedev.push({
				'codherra':listherradev[i]['codherra'],
				'codbr':listherradev[i]['codbr'],
				'nameherra':listherradev[i]['nameherra'],
				'medherra':listherradev[i]['medherra'],
				'inputcant':inputcant,
				'estherra':estherra,
				'comentherra':comentherra
			})
		};
	};

	if (lhedev.length==0) {
		swal({title:'Devolver al menos una Herramienta', showConfirmButton:true,timer:1500,type:'error'})
		return false;
	};

	console.log(lhedev)


	var da=new Object
  	da.numguiatot=numguiatot
  	da.ex_guiadev=true
  	da.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
  	$.post("", da, function(exists) {
		if (!exists.status) {
			delete da.ex_guiadev;
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
			}, function(isConfirm) {
				if (isConfirm) {
					var data;
					data=new Object
					data.lhedev=JSON.stringify(lhedev)
					data.getlinv=true
					data.codguia=codguia
					$.getJSON("",data,function(response){
						if (response.status) {
							var linv=response.linv
							var ldetghe=response.ldetghe
							console.log(linv)
							console.log(ldetghe)//

							var dat=new Object
							dat.linv=JSON.stringify(linv)
							dat.ldetghe=JSON.stringify(ldetghe)
							dat.updcreategdev=true
							dat.transp=transp
							dat.codguia=codguia
							dat.fretorno=fretorno
							dat.numguiatot=numguiatot
							dat.estado='GE'
							dat.tipocod=tipocod
							dat.codplaca=codplaca
							dat.codcond=codcond
							dat.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
							$.post("",dat,function(response){
								if (response.status) {
									console.log('ok')
									$(".newdev").modal("close")
									tipolist='all'
									tableguia='tabla-guiagene'
									estadoguiaherra='GE'
									listarguiaherra()
									swal({title:'Guia de Devolucion Correcta',timer:1500 ,showConfirmButton:false,type:'success'})
								};
							})
						};
					})

				}
			})
		}else{
			if (!exists.estado) {
				swal({title:'Numero de Guia existe en Guia de Herramienta',timer:2000,showConfirmButton:false,type:'warning'})
				return false
			}else{
				swal({title:'Numero de Guia existe en Guia de Devolucion',timer:2000,showConfirmButton:false,type:'warning'})
				return false
			}
		}
	})
}


listherradev=[]
opennewdev = function(){
	var data,codguia;
	codguia=this.value
	data=new Object
	data.lherradev=true
	data.getlastguiama=true
	data.nguia=codguia
	$.getJSON("",data,function(response){
		if (response.status) {
			listherradev=response.listherradev
			$(".numguiadev").text(codguia);
			$(".newdev").modal("open");
			$(".devnumserie").val('002-')
			$(".devnumguia").val(response.cguia)
			$tb = $("table.table-herradev > tbody");
		    $tb.empty();
		    template = "<tr><td class=\"colst40\">{{ item }}</td><td class=\"colst150\">{{ codherra }}</td><td>{{ nameherra }} {{ medherra }} </td><td class=\"colst150\">{{ marcherra }}</td><td class=\"colst100\">{{ cantiherra }}</td><td class=\"colst100\">{{ cantdevuelta }}</td><td class=\"colst100\"><input type=\"text\" maxlength=\"4\" style=\"margin:0;height:30px\" class=\"cantdev{{ conta }}\"></td><td class=\"colst100\"><select id=\"comboest{{ conta }}\" style=\"height:25px;font-size:12px\" class=\"colst100 browser-default devcotrans\"><option value=\"BUENO\">Bueno</option><option value=\"REPARACION\">Reparacion</option><option value=\"BAJA\">De Baja</option></select><td><button style=\"border:none;\" type=\"button\" class=\"transparent btnggecoment\" data-numrow=\"{{ conta }}\"><a style=\"font-size:25px;color:#4caf50;\"><i class=\"fa fa-commenting\"></i></a></button><div style=\"display:none\"><textarea class=\"colst40 materialize-textarea\" length=\"200\" name=\"coment{{ conta }}\"></textarea></div></td></td></tr>";
			for (x in listherradev) {
			    listherradev[x].item = parseFloat(x) + 1;
			    $tb.append(Mustache.render(template,listherradev[x]));
		  	}
		};
	})
}


opendetherradev = function(){
	var docid = this.value;
	cod = docid;
	listherradocdev();
	$(".ldetherradev").modal("open");
}



listherradocdev = function(){
	var data,id;
	id=cod;
	data=new Object
	data.numerodoc=id
	data.lherradoc=true
	$.getJSON("/almacen/herramienta/guia/devolucion", data, function(response) {
		var $tb, template, x;
		if (response.status) {
			$tb = $("table.table-detherradev > tbody");
			$tb.empty();
			template = "<tr><td class=\"colst40\">{{ item }}</td><td class=\"colst150\">{{ he_id }}</td><td>{{ he_name }} {{ he_medida }}</td><td class=\"colst150\">{{ he_marca }}</td><td class=\"colst100\">{{ he_cant }}</td><td class=\"colst150\">{{ he_est }}</td><td class=\"colst150\"><button type=\"button\" class=\"transparent btneditherradev\" style=\"border:none;\" value=\"{{ he_id }}\" data-coguia=\"{{ coguia }}\" data-ndoc=\"{{ docdev }}\" data-cant=\"{{ he_cant }}\" data-est=\"{{ he_est }}\" data-nherra=\"{{ he_name }}\" data-mherra=\"{{ he_medida }}\" data-marherra=\"{{ he_marca }}\"><a style=\"font-size:25px;\"><i class=\"fa fa-pencil-square\"></a></i><span class=\"glyphicon glyphicon-edit\"></span></button></td></tr>";
			for (x in response.lherradoc) {
				response.lherradoc[x].item = parseInt(x) + 1;
				$tb.append(Mustache.render(template, response.lherradoc[x]));
			}
		}
	});
}

viewcodguia=function(){
	var estado=''
	var serial=''
	if (document.getElementById('radauto').checked) {
		serial=''
		estado='none'
	}else{
		estado='block'
		serial='002-'
	}
	document.getElementById('divnumserie').style.display=estado;
	document.getElementById('divnumguia').style.display=estado;
	$(".numserie").val(serial)
}

viewguiahedev= function(){
	var estado=''
	var serial=''
	if (document.getElementById('rddevauto').checked) {
		serial=''
		estado='none'
	}else{
		estado='block'
		serial='002-'
	}

	document.getElementById('divdevnumserie').style.display=estado;
	document.getElementById('divdevnumguia').style.display=estado;
	$(".devnumserie").val(serial)
}




viewestgrupo=function(){
	var estgrupo=''
	if (document.getElementById('switchgroup').checked) {
		$("#divdescgrupo").slideDown(500);
		estgrupo='block'
	}else{
		estgrupo='none'
		$(".descripgrupo").val('')
		$("#divdescgrupo").slideUp(500);
	}
	document.getElementById("divlgrcreado").style.display=estgrupo
}

opendetherracompl = function(){
	var coddet = $(".numguiadev").text();
	cod = coddet;
	listdetherracompl();

	$(".detherracompl").modal("open");
}

listdetherracompl = function(){
  var data,id;
  id=cod;
  if (id !== "") {
    data = {
      idherraguia: id,
      listaherraguia: true,
    };
    $.getJSON("", data, function(response) {
		var $tb, template, x;
		if (response.status) {
			$tb = $("table.table-detherrac > tbody");
			$tb.empty();
			template = "<tr><td class=\"colst40\">{{ count }}</td><td>{{ nombherra }} {{ medherra }} {{ brandherra }}</td><td class=\"colst100\">{{ cant }}</td></tr>";
			for (x in response.lherraguia) {
				response.lherraguia[x].item = parseInt(x) + 1;
				$tb.append(Mustache.render(template, response.lherraguia[x]));
			}
		}
    });
  }
}


opendetguiagene = function(){
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


listdetguiagene = function(){
  var data,id;
  id=cod;
  if (id !== "") {
    data = {
      idherraguia: id,
      ldetherraguia: true
    };
    $.getJSON("", data, function(response) {
		var $tb, template, x;
		if (response.status) {
			console.log(response.lcod)
			$tb = $("table.table-dguiagene > tbody");
			$tb.empty();
			template = "<tr><td class=\"colst40\">{{ item }}</td><td class=\"colst150\">{{ descgeneral }}</td><td>{{ codherra }}</td><td>{{ nombherra }} {{ medherra }} {{ brandherra }}</td><td class=\"cols100\">{{ cant }}</td><td>{{ est }}</td><td class=\"colst150\">{{ fdev }}</td></tr>";
			for (x in response.lherraguia) {
				response.lherraguia[x].item = parseInt(x) + 1;
				$tb.append(Mustache.render(template, response.lherraguia[x]));
			}
		}
    });
  }
}


delherraguia = function(event){
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
  }, function(isConfirm) {
    var data;
    if (isConfirm) {
      data = new Object;
      data.delherguia = true;
      data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
      data.tablepk = btn.value;
      data.guia = btn.getAttribute("data-delherraguia");
      $.post("", data, function(response) {
        if (response.status) {
          listherraguia();
          swal({title:'Herramienta Eliminada de la guia', timer:2000, showConfirmButton:false,type:'error'})
        } else {
          swal("Error", "Error al eliminar la herramienta", "warning");
        }
      });
    }
  });
}

showeditherraguia = function(){
	$(".accionguia").val("");
	if (this.getAttribute("data-est") == 'ALQUILER') {
		document.getElementById('divfdev').style.display = 'block';
	}else{
		document.getElementById('divfdev').style.display = 'none';
	}
	$(".iddetguia").text(this.getAttribute("data-iddetguiaherra"));
	$(".codguia").text(this.getAttribute("data-codguia"));
	$("select[id=comboherra]").val(this.value);
	$(".guiaherracant").val(this.getAttribute("data-cantidad"));
	$(".fguiadevol").val(this.getAttribute("data-fdevolucion"));
	$(".txtcomentguiah").val(this.getAttribute("data-coment"));
	$(".newherramientaguia").modal("open");
}

openeditherra = function(){
	var codherra,namehe,medhe,codbr,codunid,tvida;
	codherra=this.value
	namehe=this.getAttribute("data-namehe")
	medhe=this.getAttribute("data-medida")
	codbr=this.getAttribute("data-marca")
	codunid=this.getAttribute("data-unidad")
	tvida=this.getAttribute("data-tvida")
	$(".accionherra").val("");
	$(".newherramienta").modal("open");

	$(".codherra").text(codherra)
	$(".nameherra").val(namehe);
    $(".medida").val(medhe);
    $("select[id=combomarca]").val(codbr);
    $('#combomarca').trigger('chosen:updated')
    $("select[id=combounid]").val(codunid);
    $('#combounid').trigger('chosen:updated')
    $(".tvida").val(tvida);
    $(".newherramienta").modal("open");
}

openaddguiaherra = function(){
$(".newherramientaguia").modal("open");
limp_newherraguia();
}

opennewguiaherra = function(){
	console.log(lherranew)
	console.log(lherranew.length)
	if (lherranew.length<15) {
		$(".newglbltypesave").text('new')
		$(".newherramientaguia").modal("open");
		$(".textstock").text("")
		$("select[id=comboherra]").val("")
		$("#comboherra").trigger('chosen:updated')
		limp_newherraguia();
		listallherra()
	}else{
		swal({title:'Detalle con Cantidad Maxima',timer:1500,showConfirmButton:false,type:'error'})
		return false
	}
}


updlisthe=function(){
	listallherra()
}

listallherra=function(){
	var data=new Object
	data.listallherra=true
	console.log(tipoacce)
	data.tipoacce=tipoacce
	$.getJSON("",data,function(response){
		if (response.status) {
			$("#comboherra").empty();
			var lallherra=response.lallherra
			console.log(lallherra)
			almcbo(lallherra,'descherra','codherra',comboherra,'#comboherra')
		};
	})
}

opennewguia = function(){
//openstorage
	var codigorand=localStorage.getItem('codrandhe')
	console.log(codigorand)
	if (codigorand!=null) {
		var lparseherra = localStorage.getItem(codigorand)
		console.log(lparseherra)
		var lherrarecov=JSON.parse(lparseherra)
		console.log(lherrarecov)
		lherranew = lherrarecov
		lguiaherra()
	}

//
	getlastguiama()
}

getlastguiama = function(){
	var data=new Object
	data.getlastguiama=true
	$.getJSON("", data,function(response){
		if (response.status) {
			var cguia=response.cguia
			$(".newguia").modal("open");
			$(".numguia").val(cguia)
			datanewguia();
		};
	})
}

datanewguia=function(){
	document.getElementById('radmanual').checked=true
	document.getElementById('divnumserie').style.display='block'
	document.getElementById('divnumguia').style.display='block'
	$(".numserie").val("002-")
	$(".fguiasalida").val("");
	$(".txtcomentguia").val("");
}




opennewherra = function(){
$(".newherramienta").modal("open");
limp_herramienta();
}

sendata_newherra = function(){
var a = $(".ednumguia").val()
$(".codguia").text(a);
$(".accionguia").val(this.getAttribute("data-newguiaherra"));
}

sendata_codguia = function(){
var a = $(".numguia").val();
$(".codguia").text(a);
$(".accionguia").val(this.getAttribute("data-guiaherra"))
}

sendata_herramienta = function(){
$(".accionherra").val(this.getAttribute("data-herra"));
}

save_edit_guia = function(){
  var data,fecha;
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
  $.post("", data, function(response) {
	  if (response.status) {
		  location.reload();
		  $(".lherraguia").modal("close");
		  swal({title:'Edicion de la Guia Correcta', timer:2000, showConfirmButton:false,type:'success'})
	  }
  }, "json");
}

save_guia_fin = function(){
	var numserie,codguia,numguiatot,codproy,codtrans,codcond,codplaca,fsalid,coment,tipocod;

	numserie=$(".numserie").val()
	codguia=$("input[name=numguia]").val();
	codproy=$("select[id=comboproyecto]").val();
	codtrans=$("select[id=combotransportista]").val();
	codcond=$("select[id=comboconductor]").val();
	codplaca=$("select[id=comboplaca]").val();
	fsalid=$(".fguiasalida").val();
	coment=$("textarea[name=txtcomentguia]").val();
	numguiatot=numserie+codguia

	if (document.getElementById('radmanual').checked) {
		tipocod='manual'
		if (codguia.length != 8) {
	  		swal({title:'Numero de Guia INCORRECTA', timer:1500, showConfirmButton:false,type:'error'})
	  		return false
	  	}
	}else{
		tipocod='auto'
	}

  	if (codtrans == "") {
	  	swal({title:'Seleccionar Transportista', timer:1500, showConfirmButton:false,type:'error'})
	  	return false;
  	}

  	if (fsalid == "") {
  		swal({title:'Ingresar Fecha de Salida', timer:1500, showConfirmButton:false,type:'error'})
  		return false
  	}

  	console.log(lherranew)
  	if (lherranew.length==0) {
  		swal({title:'Ingresar al menos una Herramienta', timer:1500, showConfirmButton:false,type:'error'})
		return false;
  	};

  	var data=new Object
  	data.numguia=numguiatot
  	data.exists=true
  	data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
  	$.post("", data, function(exists) {
		if (!exists.status) {
			delete data.exists;
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
		  	},function(isConfirm){
		  		if (isConfirm) {
		  			var dato=new Object
		  			dato.getlinventrest=true
		  			dato.lherranew=JSON.stringify(lherranew)
		  			$.getJSON("", dato,function(response){
		  				if (response.status) {
		  					var linventrest=response.linventrest
		  					console.log(linventrest)

		  					var dat=new Object
		  					dat.linventrest=JSON.stringify(linventrest)
		  					dat.savecabguia=true
		  					dat.codguia=numguiatot
		  					dat.codproy=codproy
		  					dat.codtrans=codtrans
		  					dat.codcond=codcond
		  					dat.codplaca=codplaca
		  					dat.estado='PE'
		  					dat.tipoacce=tipoacce
		  					dat.tipocod=tipocod
		  					dat.fsalid=fsalid
		  					dat.coment=coment
		  					dat.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
		  					$.post("",dat,function(response){
		  						if (response.status) {
		  							localStorage.clear()
		  							lherranew=[]
		  							$("#table-detailsguiaherra > tbody").empty()
		  							swal({title:'Guia Guardada',timer:1500, showConfirmButton:false,type:'success'})
		  							$(".newguia").modal("close")
		  							tableguia='tabla-guia'
								 	estadoguiaherra='PE'
									listarguiaherra()
		  						};
		  					})
		  				};
		  			})

		  		};
		  	})
		}else{
			swal({title:'Numero de Guia ya existe', showConfirmButton:true,type:'error'})
			return false;
		}
	})
}

listarguiaherra=function(){
	console.log('as')
	var data=new Object
	data.listarguiaherra=true
	data.tipolist=tipolist
	data.fechfrom=fechfrom
	data.fechto=fechto
	data.tipoacce=tipoacce
	data.texto=txtgeneral
	data.estadoguiaherra=estadoguiaherra
	$.getJSON("", data, function(response){
		if (response.status){

			var lguiasherra=response.lguiasherra
			$tb = $("table."+tableguia+" > tbody");
		    $tb.empty();
		    template = "<tr class=\"{{ codproy }}\"><td class=\"colst40\">{{ item }}</td><td><strong>{{ codproy }}</strong>  {{ nameproy }}</td><td class=\"colst150\">{{ numguiaherra }}</td><td>{{ apesuperv }} {{ namesuperv }}</td><td class=\"colst150\">{{ fsalida }}</td><td class=\"colst250\"><ul id=\"drop\" style=\"width:10px;\"><li><a><i class=\"fa fa-list\"></i></a><ul><li class=\"litguia\"><button style=\"border:none;\" type=\"button\" class=\"transparent btngenguia\" id=\"btngenguia\" value=\"{{ numguiaherra }}\"><a class=\"title\"><i class=\"fa fa-check-square-o\"></i>Generar Guia</a></button></li><li class=\"litguia\"><button style=\"border:none;\" type=\"button\" class=\"transparent btneditguia\" id=\"btneditguia\" value=\"{{ numguiaherra }}\" data-proy=\"{{ codproy }}\" data-transp=\"{{ codtransporte }}\" data-conductor=\"{{ codconductor }}\" data-placa=\"{{ codplaca }}\" data-fechasalida=\"{{ fsalida }}\" data-comentario=\"{{ comentario }}\"><a class=\"title\"><i class=\"fa fa-pencil-square\"></i>Editar Guia</a></button></li><li class=\"litdet\"><button style=\"border:none;\" type=\"button\" class=\"transparent btnshowdetalle\" id=\"btnshowdetalle\" data-dsuperv=\"{{ apesuperv }} {{ namesuperv }}\" data-dllega=\"{{ direcproy }}\" data-ddest=\"{{ rzcliente }}\" data-dnomproy=\"{{ codproy }} {{ nameproy }}\" data-dnumguia=\"{{ numguiaherra }}\" data-dproyid=\"{{ codproy }}\" data-dtrans=\"{{ transporte }}\" data-dcond=\"{{ conductor }}\" data-dplaca=\"{{ codplaca }} {{ marcatransporte }}\" data-dfsalid=\"{{ fsalida }}\" data-dcoment=\"{{ comentario }}\" value=\"{{ numguiaherra }}\"><a class=\"title\"><i class=\"fa fa-info-circle\"></i>Detalle</a></button></li><li class=\"litanul\"><button style=\"border:none;\" type=\"button\" class=\"transparent btndelguiape\" value=\"{{ numguiaherra }}\" data-idproy=\"{{ codproy }}\"><a class=\"title\"><i class=\"fa fa-times-circle\"></i>Anular</a></button></li></ul></li></ul></td></tr>";
		    template2= "<tr class=\"{{ codproy }}\"><td class=\"colst40\">{{ item }}</td><td><strong>{{ codproy }}</strong>  {{ nameproy }}</td><td class=\"colst150\">{{ numguiaherra }}</td><td>{{ apesuperv }} {{ namesuperv }}</td><td class=\"colst150\">{{ fsalida }}</td><td class=\"colst50\"><div style=\"width:100%;float:left\"><div style=\"width:20%;float:left\"><button type=\"button\" style=\"border:none;font-size:20px;margin-top:7px\" class=\"transparent btnviewguiaherrapdf\" value=\"{{ numguiaherra }}\"><a><i class=\"fa fa-file-pdf-o\"></i></a></button></div><div style=\"width:50%;float:left\"><ul id=\"drop\" style=\"width:10px;\"><li><a><i class=\"fa fa-list\"></i></a><ul><li class=\"litguia\"><button style=\"border:none;\" type=\"button\" class=\"transparent btneditguiage\" value=\"{{ numguiaherra }}\" data-proyge=\"{{ codproy }}\" data-transpge=\"{{ codtransporte }}\" data-conductorge=\"{{ codconductor }}\" data-placage=\"{{ codplaca }}\" data-fechasalidage=\"{{ fsalida }}\" data-comentarioge=\"{{ comentario }}\"><a class=\"title\"><i class=\"fa fa-pencil-square\"></i>Editar</a></button></li><li class=\"litguia\"><button type=\"button\" style=\"border:none;\" class=\"transparent btnshowdetalle\" id=\"btnshowdetalle\" data-dsuperv=\"{{ apesuperv }} {{ namesuperv }}\" data-dllega=\"{{ direcproy }}\" data-ddest=\"{{ rzcliente }}\" data-dnomproy=\"{{ codproy }} {{ nameproy }}\" data-dnumguia=\"{{ numguiaherra }}\" data-dproyid=\"{{ codproy }}\" data-dtrans=\"{{ transporte }}\" data-dcond=\"{{ conductor }}\" data-dplaca=\"{{ codplaca }} {{ marcatransporte }}\" data-dfsalid=\"{{ fsalida }}\" data-dcoment=\"{{ comentario }}\" value=\"{{ numguiaherra }}\"><a class=\"title\"><i class=\"fa fa-info-circle\"></i>Detalle</a></button></li><li class=\"litanul\"><button style=\"border:none;\" type=\"button\" class=\"transparent btndelguiage\" value=\"{{ numguiaherra }}\" data-geidproy=\"{{ codproy }}\"><a class=\"title\"><i class=\"fa fa-times-circle\"></i>Anular</a></button></li></ul></li></ul></div></div></td><td><button type=\"button\" style=\"border:none;font-weight:bold;\" class=\"transparent btndev\" id=\"btndev\" value=\"{{ numguiaherra }}\"><small>devolucion</small></button></td></tr>";
		    if (estadoguiaherra=='PE') {
		    	for (x in lguiasherra) {
				    lguiasherra[x].item = parseInt(x) + 1;
				    $tb.append(Mustache.render(template, lguiasherra[x]));
				}
		    }else{
		    	for (x in lguiasherra) {
				    lguiasherra[x].item = parseInt(x) + 1;
				    $tb.append(Mustache.render(template2, lguiasherra[x]));
				}
		    }

		}
	});
}


listardocdev=function(){
	var data=new Object
	data.tipolist=tipolist
	data.fechfrom=fechfrom
	data.fechto=fechto
	data.tipoacce=tipoacce
	data.listardocdev=true
	data.texto=txtgeneral
	$.getJSON("",data,function(response){
		if (response.status) {
			var ldocdev=response.ldocdev
			$tb=$("table.tabla-listdev > tbody");
			$tb.empty();
			template="<tr><td class=\"colst40\">{{ item }}</td><td class=\"colst150\">{{ coddocdev }}</td><td class=\"colst150\">{{ numguiaherra }}</td><td>{{ transporte }}</td><td class=\"colst150\">{{ fretorno }}</td><td>{{ conductor }}</td><td class=\"colst150\"><button type=\"button\" style=\"border:none;font-weight:bold;\" class=\"transparent btnviewdocdevpdf\" value=\"{{ coddocdev }}\"><a style=\"font-size:20px;\"><i class=\"fa fa-file-pdf-o\"></i></a></button><button type=\"button\" style=\"border:none;font-weight:bold;font-size:20px;\" class=\"transparent viewherradocdev\" value=\"{{ coddocdev }}\"><a><i class=\"fa fa-list-alt\"></i></a></button><button type=\"button\" style=\"border:none;font-weight:bold;font-size:20px;\" class=\"transparent btndeldocdev\" value=\"{{ coddocdev }}\"><a style=\"color:#ef5350;\"><i class=\"fa fa-trash-o\"></i></a></button></td>";
			for (x in ldocdev) {
			    ldocdev[x].item = parseInt(x) + 1;
				$tb.append(Mustache.render(template, ldocdev[x]));
			}
		};
	})
}


save_or_edit_herramienta = function(){
	var valor,codherra,nameherra,medherra,marcaherra,unidherra,tvida;
	valor =document.getElementById('accionherra').value;

	codherra=$(".codherra").text();
	nameherra = $("input[name=nameherra]").val();
	medherra = $("input[name=medida]").val();
	marcaherra = $("select[id=combomarca]").val();
	unidherra = $("select[id=combounid]").val();
	tvida = $("input[name=tvida]").val();

	if (nameherra.trim() == "") {
		swal({title:"Error",text:"Debe Ingresar un NOMBRE",timer:2000,type:"error", showConfirmButton:false});
		return false;
	};

	if (medherra == ""){
		swal({title:"Error",text:"Debe Ingresar una MEDIDA",timer:2000,type:"error", showConfirmButton:false});
		return false;
	}

	if (unidherra == ""){
		swal({title:"Error",text:"Debe Ingresar una UNIDAD",timer:2000,type:"error", showConfirmButton:false});
		return false;
	}

	if (tipoacce=="EP") {
		tipoacce="EP"
		desc="EPPS"
	}else{
		tipoacce="TL"
		desc="HERRAMIENTA"
	}

	swal({
		title:'Guardar '+desc,
		text:'Seguro de guardar '+desc+'?',
		showConfirmButton:true,
		showCancelButton:true,
		confirmButtonText:'Si, Guardar',
		cancelButtonText:'No, Cancelar',
		closeOnCancel:true,
		closeOnConfirm:false,
		type:'warning',
	},function(isConfirm){
		if (isConfirm) {
			var data= new Object
			data.nameherra=nameherra
			data.medherra=medherra
			data.marcaherra=marcaherra
			data.unidherra=unidherra
			data.tvida=tvida
			data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
			data.tipoacce=tipoacce

			if (valor == "btnnewherra") {
				data.saveherramienta = true;
				$.post("", data, function(response) {
			        if (response.status) {
				     	swal({title:desc+' Agregado',timer:1500,showConfirmButton: false,type: "success"})
				        $(".newherramienta").modal('close');
				        tipolist='all'
				        listarherramienta()
			        }
			  	});
			}else{
				console.log(nameherra,medherra,marcaherra,unidherra,tvida)
				data.editherra = true;
				data.codherra=codherra;
				$.post("", data, function(response) {
				    if (response.status) {
				    	swal({title:'Edicion de la '+desc+' correcta',timer:1500,showConfirmButton: false,type: "success"})
						$(".newherramienta").modal("close");
						tipolist='all'
				        listarherramienta()
				    }
				});
			}
		};
	})
}

stockfromcombo = function(combo,txt_to_stock){
	$(function(){
		$(combo).change(function(){
			var data;
			data = new Object;
			data.herra = this.value;
			data.viewstock = true;
			$.getJSON("/almacen/herramienta/inventario", data, function(response) {
				var stk,codherra,nameherra,medherra,codbrherra,brherra;
				stk = response.cantalmacen;
				codherra=response.herramienta__materiales_id
				nameherra=response.herramienta__matnom
				medherra=response.herramienta__matmed
				codbrherra=response.marca__brand_id
				brherra=response.marca__brand


				$(txt_to_stock).text(stk)
				$('.newglblcodhe').text(codherra)
				$('.newglblnamehe').text(nameherra)
				$('.newglblmedhe').text(medherra)
				$('.newglblcodbrhe').text(codbrherra)
				$('.newglblbrhe').text(brherra)

			}, "json");
		});
	});
}
stockfromcombo('#comboherra',".textstock");
stockfromcombo('#cbogrupohe',".lblgrstock");

locStorage=function(list){
	var ldetherra=list
	randmat = Math.random().toString(36).substr(2, 5);
	localStorage.setItem(randmat, ldetherra);
	localStorage.setItem('codrandhe',randmat)
	console.log(randmat)
}

save_or_edit_guiaherramienta = function(){
	var descripgrupo,codherra,stockhe,inputcant,estado,fdev,coment,namehe,medhe,codbrhe,brhe;
	descripgrupo=$(".descripgrupo").val()
	codherra=$("select[id=comboherra]").val()
	namehe=$(".newglblnamehe").text()
	medhe=$(".newglblmedhe").text()
	codbrhe=$(".newglblcodbrhe").text()
	brhe=$(".newglblbrhe").text()
	stockhe=$(".textstock").text();
	inputcant=$(".guiaherracant").val()
	estado=$("select[id=idcomboestado]").val()
	fdev=$(".fguiadevol").val()
	coment=$("textarea[name=txtcomentguiah]").val()


	if (document.getElementById('switchgroup').checked) {
		if (descripgrupo.trim()=="") {
			swal({title:'Error',text:'Ingrese Descripcion de Grupo', timer:1500, showConfirmButton:false,type:'error'})
			return false
		};
	}


	console.log(codherra)
	if (namehe=='') {
		swal({title:'Error',text:'Seleccione '+lbltipoacce, timer:1500, showConfirmButton:false,type:'error'})
		return false
	};

	if (inputcant.trim()=="" || inputcant==0 || !/^[0-9.]+$/.test(inputcant)) {
		swal({title:'Error',text:'Cantidad INCORRECTA', timer:1500, showConfirmButton:false,type:'error'})
		return false
	};

	if (parseFloat(inputcant)>parseFloat(stockhe)) {
		swal({title:'Error',text:'Cantidad es mayor al stock', timer:1500, showConfirmButton:false,type:'error'})
		return false
	};

	if (estado=='ALQUILER') {
		if (fdev=="") {
			swal({title:'Error',text:'Ingresar Fecha de Devolucion', timer:1500, showConfirmButton:false,type:'error'})
			return false
		};
	};
	console.log(lherranew)
	if ($(".newglbltypesave").text()=='new') {
		if (lherranew.length>0) {
			for (var i = 0; i < lherranew.length; i++) {
				if (codherra==lherranew[i]['codherra']) {
					swal({title:'Error',text:lbltipoacce+' ya esta agregado al detalle', timer:1500, showConfirmButton:false,type:'error'})
					return false
				};
			};
		};

		lherranew.push({
			'descgeneral':descripgrupo,
			'codherra':codherra,
			'nameherra':namehe,
			'medherra':medhe,
			'codbrherra':codbrhe,
			'brandherra':brhe,
			'cantidad':inputcant,
			'estado':estado,
			'fdev':fdev,
			'coment':coment
		})
		console.log(lherranew)

		//storage
		var lherrastring=JSON.stringify(lherranew)
		locStorage(lherrastring)
		//
		lguiaherra();
		$(".newherramientaguia").modal("close")
		swal({title:lbltipoacce+' Agregado', timer:1000, showConfirmButton:false,type:'success'})

	}else{
		var data,codguia;
		codguia=$(".editnumguia").val()
		data=new Object
		data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
		data.exists_detherra = true;
		data.codguia=codguia
		data.codherra=codherra
		data.codbrhe=codbrhe
		data.estado=estado
		data.descripgrupo=descripgrupo
		data.fdev=fdev
		data.inputcant=inputcant
		data.coment=coment
		$.post("", data, function(exists) {
		  	if (!exists.status) {
		  		var updst;
		  		updst=parseFloat(stockhe)-parseFloat(inputcant)
			  	delete data.exists_detherra;
			  	data.updst=parseFloat(updst)
			  	data.savenewherra = true;
				$.post("", data, function(response) {
					if (response.status) {
						$(".newherramientaguia").modal("close");
						swal({title:lbltipoacce+' AGREGADA', timer:1500, showConfirmButton:false,type:'success'})
						cod = codguia;
						listeditguia();
					}
				});
		    } else {
		     	swal({title:lbltipoacce+' ya esta agregado a la guia', timer:1500, showConfirmButton:false,type:'error'})
				return false;
		    }
	     });
	}
}







lguiaherra=function(){
	console.log(lherranew)
	$tb = $("table.table-detailsguiaherra > tbody");
    $tb.empty();
    template = "<tr><td class=\"colst40\">{{ item }}</td><td class=\"colst200\">{{ descgeneral }}</td><td class=\"colst150\">{{ codherra }}</td><td>{{ nameherra }} {{ medherra }}</td><td class=\"colst150\">{{ brandherra }}</td><td class=\"colst150\">{{ cantidad }}</td><td class=\"colst200\">{{ estado }}</td><td class=\"colst150\">{{ fdev }}</td><td class=\"colst150\"><button type=\"button\" class=\"transparent btndelherraguia\" style=\"border:none;font-size:20px;;\" value=\"{{ codherra }}\"><a style=\"color:#ef5350\"><i class=\"fa fa-trash-o\"></i></a></button></td></tr>";
    for (x in lherranew) {
	    lherranew[x].item = parseInt(x) + 1;
	    $tb.append(Mustache.render(template, lherranew[x]));
	}
}


openlistherraguia = function(){
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


listherraguia = function(){
  var data,id;
  id=cod;
  console.log(id);
  if (id !== "") {
    data = {
      idherraguia: id,
      listaherraguia: true,
    };
    $.getJSON("", data, function(response) {
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

verdocherrapdf = function(){
	var est=''
	var codgdev=this.value
	getemple()
	swal({
	title:'',
	text:'<h5 style=\"color:#039be5;font-weight:bold\">VISTA DE GUIA DE DEVOLUCION</h5>',
	showConfirmButton:true,
	showCancelButton:true,
	confirmButtonText:'Con Formato',
	cancelButtonText:'Sin Formato',
	closeOnConfirm:true,
	closeOnCancel:true,
	confirmButtonColor:'#ef5350',
	html:true
	},function(isConfirm){
		if (isConfirm) {
			est='SI'
		}else{
			est='NO'
		}
		var hreport = $("[name=hreport]").val();
		var ruc = $("[name=ruc]").val();
		window.open(hreport+'guide/toolsreturn?iddoc='+codgdev+'&ruc='+ruc+'&emple='+emple,'_blank');

	})



}

var emple=''
getemple=function(){
	var data=new Object
	data.getemple=true
	$.getJSON("/almacen/herramienta/guia",data,function(response){
		if (response.status) {
			emple=response.emple
		};
	})
}

verguiaherrapdf = function(){
	var est=''
	var codguia=this.value
	swal({
	title:'',
	text:'<h5 style=\"color:#039be5;font-weight:bold\">VISTA DE GUIA DE '+lbltipoacce+'</h5>',
	showConfirmButton:true,
	showCancelButton:true,
	confirmButtonText:'Con Formato',
	cancelButtonText:'Sin Formato',
	closeOnConfirm:true,
	closeOnCancel:true,
	confirmButtonColor:'#ef5350',
	html:true
	},function(isConfirm){
		var hreport = $("[name=hreport]").val();
		var ruc = $("[name=ruc]").val();
		if (isConfirm) {
			window.open(hreport + 'guide/tools?ng='+codguia+'&ruc='+ruc+'&format='+est+'&emple='+emple,'_blank');
		}else{
			window.open(hreport + 'guide/tools?ng='+codguia+'&ruc='+ruc+'&emple='+emple,'_blank');
		}
	})
}


verguiacompdf = function(){
	var hreport = $("[name=hreport]").val();
	var ruc = $("[name=ruc]").val();
	var codguia=this.value
	window.open(hreport + 'guide/tools?ng='+codguia+'&ruc='+ruc+'&format=true&emple='+emple,'_blank');
}

generarguia = function(){
  nguia = this.value;
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
  }, function(isConfirm) {
    var data;
    if (isConfirm) {
      data = new Object;
      data.genguia = true;
      data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
      data.numguia = btn.value;
      data.gener = 'GE';
      $.post("", data, function(response) {
        if (response.status) {
        	getemple()
        	var hreport = $("[name=hreport]").val();
			var ruc = $("[name=ruc]").val();
			window.open(hreport + 'guide/tools?ng='+data.numguia+'&ruc='+ruc+'&format=true&emple='+emple,'_blank');
			tipolist='all'
			estadoguiaherra='PE'
			tableguia='tabla-guia'
			listarguiaherra()
			swal({title:'Guia de Herramienta Generada', timer:2000, showConfirmButton:false,type:'success'})
        } else {
          swal("Error", "Error al generar la guia herramienta", "warning");
          return false
        }
      });
    }
  });
}


busc2colherra = function(idtxtsearch,idtable,col1,col2){
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

buscheedit = function(){
	busc2colherra("txtbuscarheedit","table-detailsguiaherraedit",1,2);
}

buscarherra = function(event){
	if (event.which == 13) {
		textoherra=this.value
		tipolist='unit'
		listarherramienta()

	}
}

listarherramienta=function(){
	var data=new Object
	data.texto=textoherra
	data.tipolist=tipolist
	data.getherra=true
	if (tipoacce=="TL") {
		data.tipoacce="TL"
	}else{
		data.tipoacce="EP"
	}
	$.getJSON("",data,function(response){
		if (response.status) {
			var lherra=response.lherra
			console.log(lherra)
			$tb = $("table.tabla-herra > tbody");
		    $tb.empty();
		    template = "<tr><td class=\"colst40\">{{ item }}</td><td class=\"colst150\">{{ codherra }}</td><td>{{ nameherra }}</td><td>{{ medherra }}</td><td class=\"colst150\">{{ brand }}</td><td class=\"colst150\">{{ unid }}</td><td class=\"colst150\"><button type=\"button\" style=\"border:none;font-size:20px;\" class=\"transparent btneditherramienta\" value=\"{{ codherra }}\" data-namehe=\"{{ nameherra }}\" data-medida=\"{{ medherra }}\" data-marca=\"{{ codbr }}\" data-unidad=\"{{ codunid }}\" data-tvida=\"{{ tvida }}\" ><a style=\"color:#26a69a\"><i class=\"fa fa-pencil\"></i></a><span class=\"glyphicon glyphicon-edit\"></span></button></td></tr>";
		    for (x in lherra) {
			    lherra[x].item = parseInt(x) + 1;
			    $tb.append(Mustache.render(template, lherra[x]));
			}
		};
	})
}

listarinventario=function(){
	var data=new Object
	data.texto=textoinvent
	data.tipolist=tipolist
	console.log(tipolist)
	data.getinvent=true
	console.log(tipoacce)
	data.tipoacce=tipoacce
	$.getJSON("",data,function(response){
		if (response.status) {
			var linvent=response.linvent
			console.log(linvent)
			$tb = $("table.tabla-invent > tbody");
		    $tb.empty();
		    template = "<tr><td class=\"colst40\">{{ item }}</td><td class=\"colst150\">{{ codherra }}</td><td>{{ nameherra }}</td><td>{{ medherra }}</td><td class=\"colst150\">{{ brand }}</td><td class=\"colst100\">{{ unid }}</td><td class=\"colst100\">{{ cantalmacen }}</td><td class=\"colst100\">{{#areaemple}}<button value=\"{{ codherra }}\" data-codbr=\"{{ codbr }}\" data-lastprice=\"{{ lastprice }}\" data-herrastock=\"{{ nameherra }} {{ medherra }} {{ brand }}\" type=\"button\" class=\"transparent btnviewdivstock\" style=\"border:none;\"><a style=\"font-size:25px;\"><i class=\"fa fa-pencil-square\"></i></a></button>{{/areaemple}}</td></tr>";
		    for (x in linvent) {
			    linvent[x].item = parseInt(x) + 1;
			    $tb.append(Mustache.render(template, linvent[x]));
			}
		};
	})
}



buscarherramienta = function(){
	if (event.which == 13) {
		textoinvent=this.value
		tipolist='unit'
		listarinventario()
	}
}


buscardoc = function(){
	busc2colherra("txtbuscardoc","tabla-guiaco",1,2);
}


buscarguia = function(event){
	var texto=this.value
	if (event.which==13) {
			txtgeneral=texto
			tipolist='unit'
		if (document.getElementById('radiope').checked) {
			estadoguiaherra='PE'
			listarguiaherra()
		}else if(document.getElementById('radioge').checked){
			estadoguiaherra='GE'
			listarguiaherra()
		}else{
			tipolist='unid'
			txtgeneral=texto
			listardocdev()
		}

	};
}

buscarhxproy = function(event){
    if (event.which == 13) {
    	var data,text;
    	text = this.value;
	    data = new Object;
	    data.buscarh = true;
	    data.tipoacce=tipoacce
	    data.textoing = text;
	    $.getJSON("", data, function(response) {
	      if (response.status) {
	      	var stsizehe = response.namehesize;
	      	console.log(stsizehe);
	      	if (stsizehe == true) {
			    $(".lconsherra").modal("open");
			    $tb = $("table.table-lconsherra > tbody");
			    $tb.empty();
			    template = "<tr><td class=\"colst40\">{{ count }}</td><td>{{ name }}</td><td class=\"colst150\">{{ medida }}</td><td class=\"colst150\">{{ marcah }}</td><td class=\"colst100\"><button type=\"button\" style=\"border:none;font-weight:bold;\" class=\"transparent btnselectherra\"  value=\"{{ codh }}\" data-name=\"{{ name }}\" data-medida=\"{{ medida }}\" data-marca=\"{{ marcah }}\"><i class=\"fa fa-check\"></i></button></td></tr>";
			    for (x in response.namehe) {
				    response.namehe[x].item = parseInt(x) + 1;
				    $tb.append(Mustache.render(template, response.namehe[x]));
				}
	      	}else{
	      		swal({title:lbltipoacce+' ingresado no se encuentra en ninguna Obra', timer:1500, showConfirmButton:false,type:'error'})
	      		return false;
	      	}
	      }
	    });
     }
}



viewestguia = function(){

	if(document.getElementById('radiope').checked){
		tipolist='all'
		tableguia='tabla-guia'
		estadoguiaherra='PE'
		listarguiaherra()
		document.getElementById('divtableguiape').style.display = 'block';
		document.getElementById('divtableguiagene').style.display = 'none';
		document.getElementById('divtablelistdev').style.display = 'none';
	}else if(document.getElementById('radioge').checked){
		tipolist='all'
		tableguia='tabla-guiagene'
		estadoguiaherra='GE'
		listarguiaherra()
		document.getElementById('divtableguiagene').style.display = 'block';
		document.getElementById('divtableguiape').style.display = 'none';
		document.getElementById('divtablelistdev').style.display = 'none';

	}else if(document.getElementById('radioco').checked){
		tipolist='all'
		listardocdev()
		document.getElementById('divtablelistdev').style.display = 'block';
		document.getElementById('divtableguiagene').style.display = 'none';
		document.getElementById('divtableguiape').style.display = 'none';
	}
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






//filtro combo por proyecto
$(function(){

	$('#cboproyectos').change(function(){
		var codproy;
		codproy=this.value
		console.log(codproy)
		if (codproy!='') {
			txtgeneral=codproy
			tipolist='unit'
			listarguiaherra()
		}else{
			viewestguia()
		}
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

limp_herramienta = function(){
	$(".idherra").val("");
	$(".nameherra").val("");
	$(".medida").val("");
	$(".tvida").val("");
}
limp_newherraguia = function(){
	document.getElementById('divlgrcreado').style.display="none"
	document.getElementById('switchgroup').checked=false
	$("#divdescgrupo").slideUp(1)
	$(".descripgrupo").val("")


	$(".newglblnamehe").text("");
	$(".newglblmedhe").text("");
	$(".newglblcodbrhe").text("");
	$(".newglblbrhe").text("");

	$(".guiaherracant").val("");
	$(".fguiadevol").val("");
	$(".txtcomentguiah").val("");
}


almcbo = function(lista,contenido,id,combo,idcombo){
	console.log(lista)
	for(var i = 0; i < lista.length; i++) {
	    var el = document.createElement("option");
	    el.textContent = lista[i][contenido];
	    el.setAttribute("data-pro","ol")
	    el.value = lista[i][id];
	    combo.appendChild(el)
	}
	$(idcombo).trigger('chosen:updated')
}

cabalmcbo = function(cbovalue,cbocond,cboplaca){
	$(function(){
		$(cbovalue).change(function(){
			$("#"+cbocond).empty();
			$("#"+cboplaca).empty();
			console.log(this.value);
			var data;
			data = new Object;
			data.codtransp = this.value;
			data.listconductor = true;
			$.getJSON("", data, function(response) {
				var lcond = response.lcond;
				var cboconductor = document.getElementById(cbocond);
				var ltransp = response.ltransp;
				var cbotransp = document.getElementById(cboplaca);
				console.log(lcond)
				// almacena combo conductores
				almcbo(lcond,'name_cond','cod_cond',cboconductor,'#'+cbocond);
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

cabalmcbo("#combotransportista","comboconductor","comboplaca");
cabalmcbo("#comboedittransportista","comboeditconductor","comboeditplaca");
cabalmcbo("#cboeditgetransp","cboeditgecond","cboeditgeplaca");
cabalmcbo("#devcotrans","devcoconduc","devcoplaca");

cabalmcbo("#trcbotransp","trcbocond","trcboplaca");

///////////PARTE TRASLADO DE HERRAMIENTAS

var txtkeyup=''
keyupherramienta=function(){
	if (event.which==13) {
		txtkeyup=this.value
		console.log(txtkeyup)
		ltrherraxcod()
	};
}

keyuptrbuscherra=function(){
	busc2colherra('txttrbuscherra','tab-trlherra',1,2)
}


ltrherraxcod=function(){
	var data=new Object
	data.getltrherraxcod=true
	data.txtcodherra=txtkeyup
	$.getJSON("",data,function(response){
		if (response.status) {
			ltrherra=response.ltrherra
			if (ltrherra.length>0) {
				$('ul.tabs').tabs('select_tab', 'divtab-trldetgherra');
				document.getElementById('divcontent').style.display="block"
				$(".tittrcodhe").text()
				$(".tittrdeshe").text(ltrherra[0]['codherra']+" "+ltrherra[0]['nameherra']+" "+ltrherra[0]['medherra']+" "+ltrherra[0]['brandherra'])
				$tb = $("table.tab-trldetgherra > tbody");
		        $tb.empty();
		        template = "<tr><td class=\"colst40\">{{ item }}</td><td>{{ codproy }} {{ nameproy }}</td><td class=\"colst150\">{{ codguia }}</td><td class=\"colst150\">{{ cantidad }}</td><td class=\"colst150\">{{ cantdev }}</td><td class=\"colst50\"><input type=\"text\" maxlength=\"4\" style=\"margin:0;height:30px\" class=\"canttrasl{{ conta }}\"></td><td class=\"colst50\" style=\"text-align:center\"><input type=\"checkbox\" value=\"{{ codguia }}\" id=\"checktrdethe{{ conta }}\" onclick=\"checktrhe('{{ conta }}','{{ cantidad }}','{{ cantdev }}')\"/><label for=\"checktrdethe{{ conta }}\"></label></td><td class=\"colst150\"><select id=\"trcboestadohe{{ conta }}\" class=\"browser-default trcboestadohe\" style=\"height:25px;font-size:12px\"><option value=\"ALMACEN\">ALMACEN</option><option data-trcontahe=\"{{ conta }}\" value=\"{{ conta }}\">ALQUILER</option></select><div style=\"display:none\"><input type=\"text\" class=\"trfdevherra{{ conta }}\"></div></td><td class=\"colst150\"><button style=\"border:none;\" type=\"button\" class=\"transparent btntrhecoment\" data-trnumrow=\"{{ conta }}\"><a style=\"font-size:25px;color:#4caf50;\"><i class=\"fa fa-commenting\"></i></a></button><div style=\"display:none\"><input type=\"text\" style=\"margin:0;height:30px\" class=\"txttrcoment{{ conta }}\"></div></td></tr>";
		        for (x in ltrherra) {
		        	console.log(x)
			        ltrherra[x].item = parseInt(x) + 1;
			        $tb.append(Mustache.render(template, ltrherra[x]));

			        $('#trcboestadohe'+x).on('change', function() {
						console.log(this.value)
						if (this.value!="ALMACEN") {
							$(".lbltrnumrow").text(this.value)
							$(".trfdevhe").val($(".trfdevherra"+this.value).val())
							$(".trmodfdev").modal("open")
						}
					});
		      	}

		      	trselradio()
			}else{
				ltrherraxdes()
			}
		};
	})
}

ltrherraxdes=function(){
	var data=new Object
	data.txtdesherra=txtkeyup
	data.tipoacce=tipoacce
	data.getltrherraxdes=true
	$.getJSON("",data,function(response){
		if (response.status) {
			if (response.ltrherrades.length>0){
				$(".modtrlherra").modal("open")
				$tb=$(".table.tab-trlherra > tbody");
				$tb.empty();
				template="<tr><td class=\"colst40\">{{ item }}</td><td class=\"colst150\">{{ codherra }}</td><td>{{ nameherra }} {{ medherra }}</td><td class=\"colst150\">{{ brandherra }}</td><td class=\"colst150\">{{ unidherra }}</td><td class=\"colst150\"><button style=\"border:none;\" type=\"button\" class=\"transparent btntrselherra\" value=\"{{ codherra }}\"><a style=\"font-size:25px;color:#4caf50;\"><i class=\"fa fa-check-circle\"></i></a></button></td></tr>";
				for (x in response.ltrherrades) {
			        response.ltrherrades[x].item = parseInt(x) + 1;
			        $tb.append(Mustache.render(template, response.ltrherrades[x]));
		      	}
			}else{
				swal({title:'Descripcion no existe en ninguna Guia Generada',showConfirmButton:true,type:'error'})
				return false
			}
		};
	})
}

trselherra=function(){
	var codherra=this.value
	$(".modtrlherra").modal("close")
	txtkeyup=codherra
	ltrherraxcod()
}

traddherra=function(){
	console.log(ltrherra)

	for (var i = 0; i < ltrherra.length; i++) {
		var canttrasl=$(".canttrasl"+i).val()
		var estadohe=$("select[id=trcboestadohe"+i+"]").val()
		var trfdevherra=$(".trfdevherra"+i).val()
		var txttrcoment=$(".txttrcoment"+i).val()
		console.log(trfdevherra)
		if (canttrasl.trim()!="") {
			if (!/^[0-9.]+$/.test(canttrasl) || parseFloat(canttrasl)==0) {
				swal({title:'Cantidad INCORRECTA en ITEM '+ltrherra[i]['item'],showConfirmButton:false,timer:1500,type:'error'})
				return false;
			}
			var cantpermit=parseFloat(ltrherra[i]['cantidad'])-parseFloat(ltrherra[i]['cantdev'])
			console.log(cantpermit)
			if (parseFloat(canttrasl)>parseFloat(cantpermit)){
				swal({title:'Cantidad supera a lo permitido en ITEM '+ltrherra[i]['item'],showConfirmButton:false,timer:1500,type:'error'})
				return false;
			}
			if (ltrdettras.length>0) {
				for (var x = 0; x < ltrdettras.length; x++) {
					if (ltrherra[i]['codguia']==ltrdettras[x]['codguia'] &&
						ltrherra[i]['codherra']==ltrdettras[x]['codherra']) {
						swal({title:'Herramienta del ITEM '+ltrherra[i]['item']+" ya esta agregado al detalle",showConfirmButton:false,timer:2000,type:'error'})
						return false;
					};
				};
			};

			if (estadohe!="ALMACEN") {
				if (trfdevherra=="") {
					swal({title:'Ingresar Fecha de Devolucion en ITEM '+ltrherra[i]['item'],showConfirmButton:false,timer:1500,type:'error'})
					return false;
				};
			};
		}
	};

	swal({
		title:'Agregar al detalle',
		text:'Seguro de Agregar al detalle de traslado?',
		type:"error",
		showCancelButton:true,
		closeOnConfirm:false,
		closeOnCancel:true,
		confirmButtonText:'Si, Agregar',
		cancelButtonText:'No, Cancelar',
		type:'warning',

	},function(isConfirm){
		if (isConfirm) {
			for (var i = 0; i < ltrherra.length; i++) {
				var canttrasl,txttrcoment,trfdevherra,estadohe,changest='',changefdev='';
				canttrasl=$(".canttrasl"+i).val()
				txttrcoment=$(".txttrcoment"+i).val()
				trfdevherra=$(".trfdevherra"+i).val()
				estadohe=$("select[id=trcboestadohe"+i+"]").val()
				if (estadohe!='ALMACEN') {
					changefdev=trfdevherra
					changest='ALQUILER';
				}else{
					changefdev=''
					changest='ALMACEN';
				}

				var canttotpermit=parseFloat(ltrherra[i]['cantidad'])-parseFloat(ltrherra[i]['cantdev'])
				if (canttrasl.trim()!="") {
					ltrdettras.push({
					'codproy':ltrherra[i]['codproy'],
					'nameproy':ltrherra[i]['nameproy'],
					'codguia':ltrherra[i]['codguia'],
					'codherra':ltrherra[i]['codherra'],
					'nameherra':ltrherra[i]['nameherra'],
					'medherra':ltrherra[i]['medherra'],
					'codbr':ltrherra[i]['codbrand'],
					'brand':ltrherra[i]['brandherra'],
					'fdev':changefdev,
					'cantidad':parseFloat(canttrasl),
					'estadohe':changest,
					'comenthe':txttrcoment,
					'canttotpermit':canttotpermit
					})
					$(".canttrasl"+i).val("");
				};
			}
			$('ul.tabs').tabs('select_tab', 'divtab-trldetalle');
			swal({title:'Material(es) Agregado al detalle',timer:1000,showConfirmButton:false,type:'success'})
			console.log(ltrdettras)
			document.getElementById('radtrall').checked=false
			trselradio()
			ldettras()
		};
	})
}

ldettras=function(){
	var ldetalle=ltrdettras
	$tb=$(".table.tab-trldetalle > tbody");
	$tb.empty();
	template="<tr><td class=\"colst40\">{{ item }}</td><td class=\"colst150\">{{ codproy }}</td><td class=\"colst150\">{{ codguia }}</td><td class=\"colst150\">{{ codherra }}</td><td>{{ nameherra }} {{ medherra }}</td><td class=\"colst150\">{{ brand }}</td><td>{{ cantidad }}</td><td class=\"colst150\"><button style=\"border:none;\" type=\"button\" class=\"transparent btntredherra\" value=\"{{ codherra }}\" data-tredcodguia=\"{{ codguia }}\" data-cantmax=\"{{ canttotpermit }}\"><a style=\"font-size:25px;color:#4caf50;\"><i class=\"fa fa-pencil-square\"></i></a></button><button style=\"border:none;\" type=\"button\" class=\"transparent btntrdelherra\" value=\"{{ codherra }}\" data-trdelcodguia=\"{{ codguia }}\"><a style=\"font-size:25px;color:#ef5350;\"><i class=\"fa fa-trash-o\"></i></a></button></td></tr>";
	for (x in ldetalle) {
        ldetalle[x].item = parseInt(x) + 1;
        $tb.append(Mustache.render(template, ldetalle[x]));
  	}
}

trhecoment=function(){
	var trcomenthe,numrow,lastcoment;
	numrow=this.getAttribute("data-trnumrow")
	lastcoment=$(".txttrcoment"+numrow).val()
	swal({
		title:'Comentario',
		text:'<textarea placeholder=\"\" name=\"trcomenthe\" class=\"materialize-textarea trcomenthe\" maxlength=\"200\" length=\"200\"></textarea>',
		html:true,
		showConfirmButton:true,
		showCancelButton:true,
		closeOnConfirm:true,
		closeOnCancel:true,
		animation:'slide-from-top'
	},function(isConfirm){
		if (isConfirm) {
			var coment=$("textarea[name=trcomenthe]").val()
			$(".txttrcoment"+numrow).val(coment)
		};
	})
	$("textarea[name=trcomenthe]").val(lastcoment)
}

tredherra=function(){
	var codguia,codherra,cantmax;

	codguia=this.getAttribute("data-tredcodguia")
	codherra=this.value
	cantmax=this.getAttribute("data-cantmax")

	swal({
		title:'',
		text:'<h5 style=\"font-weight:bold\">Cantidad Maxima de Items: '+cantmax+'</h5><br>',
		type:'input',
		showConfirmButton:true,
		showCancelButton:true,
		closeOnCancel:true,
		closeOnConfirm:false,
		html:true,
		animation:'slide-from-top'
	},function(inputValue){
		if (parseFloat(inputValue)>parseFloat(cantmax)) {
			swal.showInputError("Cantidad es mayor al permitido");
			return false
		};
		if (inputValue=="" || inputValue=="0" || (!/^[0-9]+$/.test(inputValue))) {
			swal.showInputError("Cantidad INCORRECTA");
			return false;
		}else{
			for (var i = 0; i < ltrdettras.length; i++) {
				if (ltrdettras[i]['codguia']==codguia &&
					ltrdettras[i]['codherra']==codherra){
					ltrdettras[i]['cantidad']=inputValue
				};
			};
		}
		swal({title:'Edicion Correcta',timer:1500,showConfirmButton:false,type:'success'})
		console.log(ltrdettras)
		ldettras()
	})
}

trdelherra=function(){
	var codherra,codguia;
	codguia=this.getAttribute("data-trdelcodguia")
	codherra=this.value

	for (var i = 0; i < ltrdettras.length; i++) {
		if (ltrdettras[i]['codguia']==codguia &&
			ltrdettras[i]['codherra']==codherra){
			ltrdettras.splice(i,1)
		};
	};
	ldettras()
	console.log(ltrdettras)
}

trsavetras=function(){
	$('select[id=trcboproyecto]').val("")
	$("#trcboproyecto").trigger('chosen:updated')
	$('select[id=trcboautoriz]').val("")
	$("#trcboautoriz").trigger('chosen:updated')
	$('select[id=trcbotransp]').val("")
	$("#trcbotransp").trigger('chosen:updated')
	$('select[id=trcbocond]').val("")
	$("#trcbocond").trigger('chosen:updated')
	$('select[id=trcboplaca]').val("")
	$("#trcboplaca").trigger('chosen:updated')
	$(".modcabfintras").modal("open")
	document.getElementById('radiomanual').checked='true'
	document.getElementById('divtrserieguia').style.display='block'
	document.getElementById('divtrcodguia').style.display='block'
	$(".trserieguia").val("002-")
	$('.trfechtrasl').val("")
	$("textarea[name=trcoment]").val("")
	datatrnewguia()
}

datatrnewguia=function(){
	var data=new Object
	data.getlastguiama=true
	$.getJSON("/almacen/herramienta/guia",data,function(response){
		if (response.status) {
			var cguia=response.cguia
			$(".trcodguia").val(cguia)
		};
	})
}



ltrproyectos=function(){
	var data=new Object
	data.getltrproyectos=true
	$.getJSON("",data,function(response){
		if (response.status) {
	        var ltrproyectos=response.ltrproyectos
	        console.log(ltrproyectos)
		};
	})
}

trselradio = function(){
	var estcheck=''
	var cantidad=''
	for (var i = 0; i < ltrherra.length; i++) {
		if (document.getElementById('radtrall').checked) {
			estcheck=true
			cantidad=parseFloat(ltrherra[i]['cantidad'])-parseFloat(ltrherra[i]['cantdev'])
		}else{
			cantidad=''
			estcheck=false
		}
		document.getElementById('checktrdethe'+i).checked=estcheck
		$(".canttrasl"+i).val(cantidad)
	}
}

checktrhe=function(numrow,cantidad,cantdev){
	var input=''
	var cantpermit=parseFloat(cantidad)-parseFloat(cantdev)
	if ($("#checktrdethe"+numrow).is(':checked')) {
		input=cantpermit
	}else{
		input=''
	}
	$(".canttrasl"+numrow).val(input)
}

trsavetrasl=function(){
	var numguiatr,serialtr,numguiatot,codproydest,empleauth,transp,cond,placa,ftraslado,comentario,dettraslado;

	codproydest=$("select[id=trcboproyecto]").val()
	empleauth=$("select[id=trcboautoriz]").val()
	transp=$("select[id=trcbotransp]").val()
	cond=$("select[id=trcbocond]").val()
	placa=$("select[id=trcboplaca]").val()
	ftraslado=$(".trfechtrasl").val()
	comentario=$("textarea[name=trcoment]").val()
	numguiatr=$(".trcodguia").val()
	serialtr=$(".trserieguia").val()
	numguiatot=serialtr+numguiatr

	if (document.getElementById('radiomanual').checked) {
		if (numguiatr.length!=8) {
			swal({title:'Numero de Guia INCORRECTO',timer:1500,showConfirmButton:false,type:'error'})
			return false
		};
	}

	if (codproydest=="") {
		swal({title:'Seleccionar Proyecto de destino',timer:1500,showConfirmButton:false,type:'error'})
		return false
	};

	if (empleauth=="") {
		swal({title:'Seleccionar quien Autorizo',timer:1500,showConfirmButton:false,type:'error'})
		return false
	};


	if (transp=="") {
		swal({title:'Seleccionar Transportista',timer:1500,showConfirmButton:false,type:'error'})
		return false
	};

	if (ftraslado=="") {
		swal({title:'Ingresar Fecha de traslado',timer:1500,showConfirmButton:false,type:'error'})
		return false
	};
	dettraslado=ltrdettras
	console.log(ltrdettras)
	console.log(dettraslado)

	var dat=new Object
  	dat.numguia=numguiatot
  	dat.exists=true
  	dat.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
  	$.post("/almacen/herramienta/guia", dat, function(exists) {
		if (!exists.status) {
			delete dat.exists;
			swal({
				title:'Guardar Guia de Traslado',
				text:'Seguro de Guardar la guia de Traslado?',
				showConfirmButton:true,
				showCancelButton:true,
				confirmButtonText:'Si, Guardar',
				cancelButtonText:'No, Cancelar',
				closeOnCancel:true,
				type:'warning',
			},function(isConfirm){
				if (isConfirm) {

					var dato=new Object
					dato.getltrdetghe=true
					dato.dettraslado=JSON.stringify(dettraslado)
					$.getJSON("",dato,function(response){
						if (response.status) {
							var listsum=ltrdettras
							var sumdettras=[]

							listsum.forEach(function(o) {
						    var existing = sumdettras.filter(function(i) {
						    	return i.codherra === o.codherra })[0];
						    if (!existing)
						        sumdettras.push(o);
						    else
						        existing.cantidad += parseFloat(o.cantidad);
							});
							console.log(sumdettras)


							var ltrdghe= response.ltrdghe
							console.log(ltrdghe)


							var codauto=''
							if (document.getElementById('radioauto').checked) {
								codauto=true
							}else{
								codauto=false
							}

							var data=new Object
							data.savetraslado=true
							data.codproydest=codproydest
							data.empleauth=empleauth
							data.transp=transp
							data.codauto=codauto
							data.cond=cond
							data.tipoacce=tipoacce
							data.numguiatr=numguiatot
							data.placa=placa
							data.ftraslado=ftraslado
							data.comentario=comentario
							data.estado='PE'
							data.sumdettras=JSON.stringify(sumdettras)
							data.ltrdghe=JSON.stringify(ltrdghe)
							data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
							$.post("",data,function(response){
								if (response.status) {
									console.log('dwdfw')
									swal({title:'Guia de Traslado Guardado',timer:1500,showConfirmButton:false,type:'success'})
									$(".modcabfintras").modal("close")
									location.reload()
								};
							})
						};
					})
				};
			})
		}else{
			swal({title:'Numero de Guia ya existe', showConfirmButton:true,type:'error'})
			return false;
		}
	});

}

viewtrcodguia=function(){
	var estado=''
	var serial=''
	if (document.getElementById('radioauto').checked) {
		serial=''
		estado='none'
	}else{
		estado='block'
		serial='002-'
		datatrnewguia()
	}
	document.getElementById('divtrcodguia').style.display=estado
	document.getElementById('divtrserieguia').style.display=estado
	$(".trserieguia").val(serial)
}

trsavefdev=function(){
	var numrow=$(".lbltrnumrow").text()
	var fdev=$(".trfdevhe").val()
	console.log(fdev)
	if (fdev=="") {
		swal({title:'Ingresa Fecha de Devolucion',timer:1500,showConfirmButton:false,type:'error'});
		return false;
	};

	$(".trfdevherra"+numrow).val(fdev)
	swal({title:'Fecha de Devolucion Agregada',showConfirmButton:false,timer:1000,type:'success'})
	$(".trmodfdev").modal("close")
}

///////EPPS

switchgeneral=function(){
	var rutabase='http://'+location.hostname+(location.port != ''? ':'+location.port:'')+'/almacen/herramienta/'
	getemple()
	if (document.getElementById('switchepps').checked) {
		tipoacce='EP'
		lbltipoacce='EPPS'
	}else{
		tipoacce='TL'
		lbltipoacce='HERRAMIENTA'
	}
	$(".lbltipoacce").text(lbltipoacce)

	if (urlactual==rutabase+'lista') {
		document.getElementById('divherramienta').style.display="block"
		tipolist='all'
		listarherramienta()
	}else if(urlactual==rutabase+'guia'){
		tableguia='tabla-guia'
		tipolist='all'
		estadoguiaherra='PE'
		listarguiaherra()
		lproyguia()
		document.getElementById('divguia').style.display="block"
	}else if(urlactual==rutabase+'inventario'){
		tipolist='all'
		listarinventario()
		document.getElementById('divinventario').style.display="block"
	}else if (urlactual==rutabase+'guia/devolucion') {
		document.getElementById('divdevolucion').style.display="block"
		lguiacomp()
	}else if (urlactual==rutabase+'guia/consulta') {
		document.getElementById('divconsulta').style.display="block"
		lproyconsult()
	}else if (urlactual==rutabase+'trasladohe') {
		document.getElementById('divtrasladohe').style.display="block"
	}else if (urlactual==rutabase+'notaingreso'){
		document.getElementById('divnotaingreso').style.display="block"
		texting=''
		lordcompra()
		lnoting()
	}else{
		document.getElementById('divcargarhe').style.display="block"
	}
}

lordcompra=function(){
	var data=new Object
	data.lordcompra=true
	data.tipoacce=tipoacce
	data.texting=texting
	$.getJSON("",data,function(response){
		if (response.status) {
			var listcomp=response.listcomp
			console.log(listcomp)
			$tb = $("table.tabcompra > tbody");
			$tb.empty();
			template = "<tr><td class=\"colst40\">{{ item }}</td><td class=\"colst150\">{{ codorden }}</td><td>{{ proveedor }}</td><td class=\"colst150\">{{ projects }}</td><td class=\"colst150\">{{ documento }}</td><td class=\"colst150\">{{ ftraslado }}</td><td class=\"colst150\"><button type=\"button\" style=\"border:none;font-size:20px;\" class=\"transparent btngeningreso\" value=\"{{ codorden }}\"><i style=\"color:#039be5\" class=\"fa fa-external-link-square\"></i></button></td></tr>";
			for (x in listcomp) {
				listcomp[x].item = parseInt(x) + 1;
				$tb.append(Mustache.render(template, listcomp[x]));
			}
		};
	})
}

lnoting=function(){
	var data=new Object
	data.lnoting=true
	data.texting=texting
	data.tipoacce=tipoacce
	$.getJSON("",data,function(response){
		if (response.status) {
			var listingr=response.listingr
			console.log(listingr)
			$tb = $("table.tabnoting > tbody");
			$tb.empty();

			template = "<tr><td class=\"colst40\">{{ item }}</td><td class=\"colst150\">{{ codnoting }}</td><td>{{ almacen }}</td><td class=\"colst150\">{{ codcompra }}</td><td class=\"colst150\">{{ factura }}</td><td>{{ motivo }}</td><td class=\"colst150\">{{ estado }}</td><td class=\"colst150\"><button type=\"button\" style=\"border:none;font-size:20px;\" class=\"transparent btnviewpdfnota\" value=\"{{ codnoting }}\"><i style=\"color:#039be5\" class=\"fa fa-file-pdf-o\"></i></button><button type=\"button\" style=\"border:none;font-size:20px;\" class=\"transparent btndetnoting\" value=\"{{ codnoting }}\" ><i style=\"color:#039be5\" class=\"fa fa-list\"></i></button><button type=\"button\" style=\"border:none;font-size:20px;\" class=\"transparent btndelnoting\" value=\"{{ codnoting }}\"><i style=\"color:#ef5350\" class=\"fa fa-trash\"></i></button></td></tr>";
			for (x in listingr) {
				listingr[x].item = parseInt(x) + 1;
				$tb.append(Mustache.render(template, listingr[x]));
			}
		};
	})
}


lproyconsult=function(){
	var data=new Object
	data.lproyconsult=true
	data.tipoacce=tipoacce
	$.getJSON("",data,function(response){
		if (response.status) {
			var lprocons=response.lprocons
			console.log(lprocons)
			almcboproy(lprocons,'nameproy','codproy',combolproy,'#combolproy')
		};
	})
}

lguiacomp=function(){
	var data=new Object
	data.listgcomp=true
	data.tipoacce=tipoacce
	$.getJSON("",data,function(response){
		if (response.status) {
			var lgcomp=response.lgcomp
			$tb = $("table.tabla-guiaco > tbody");
			$tb.empty();
			template = "<tr><td class=\"colst40\">{{ item }}</td><td>{{ codproy }} {{ nameproy }}</td><td class=\"colst150\">{{ codguia }}</td><td class=\"colst150\">{{ fsalida }}</td><td>{{ lastnamesusp }} {{ firstnamesusp }}</td><td class=\"colst150\"><button type=\"button\" style=\"border:none;font-size:20px;\" class=\"transparent btnviewguiacopdf\" value=\"{{ codguia }}\"><i style=\"color:#039be5\" class=\"fa fa-file-pdf-o\"></i></button></td></tr>";
			for (x in lgcomp) {
				lgcomp[x].item = parseInt(x) + 1;
				$tb.append(Mustache.render(template, lgcomp[x]));
			}
		};
	})
}

lproyguia=function(){
	var data=new Object
	data.lproyguia=true
	data.tipoacce=tipoacce
	$.getJSON("",data,function(response){
		if (response.status) {
			var listproyguia=response.listproyguia
			console.log(listproyguia)
			almcboproy(listproyguia,'nameproy','codproy',cboproyectos,'#cboproyectos')
		};
	})
}

almcboproy = function(lista,contenido,id,combo,idcombo){
	console.log(lista)
	$(idcombo).empty()
	var op= document.createElement("option")
	op.value = ""
	op.textContent = "Todos los Proyectos";
	combo.appendChild(op)
	for(var i = 0; i < lista.length; i++) {
	    var el = document.createElement("option");
	    el.textContent = lista[i][id]+' '+lista[i][contenido];
	    el.value = lista[i][id];
	    combo.appendChild(el)
	}
	$(idcombo).trigger('chosen:updated')
}
var ldetcomp=''
var codcompra=''
geningreso=function(){
	codcompra=this.value
	$(".lblingcodcompra").text(codcompra)
	$(".modnewnoting").modal("open")
	ldetcompra()
}

ldetcompra=function(){
	var data=new Object
	data.ldetcompra=true
	data.codcompra=codcompra
	$.getJSON("",data,function(response){
		if (response.status) {
			ldetcomp=response.ldetcomp
			console.log(ldetcomp)
			$tb = $("table.tabdetcompra > tbody");
			$tb.empty();
			template = "<tr {{#printrow}}style=\"background-color:#ffcdd2\"{{/printrow}}><td class=\"colst40\">{{ item }}</td><td class=\"colst150\">{{ codmat }}</td><td>{{ namemat }}</td><td class=\"colst150\">{{ medmat }}</td><td class=\"colst150\">{{ unidad }}</td><td class=\"colst150\">{{ brand }}</td><td class=\"colst40\">{{ cantidad }}</td><td class=\"colst40\">{{ cantpend }}</td><td><input type=\"text\" maxlength=\"4\" style=\"height:30px;text-align:center\" class=\"inputcant{{ conta }}\" value=\"{{ cantpend }}\"></td><td><input type=\"checkbox\" style=\"font-size:5px\" checked=\"true\" value=\"{{ codmat }}\" id=\"checkingdet{{ conta }}\" onclick=\"checkingmat('{{ conta }}','{{ cantpend }}')\"/><label for=\"checkingdet{{ conta }}\"></label></td><td class=\"colst40\"><input type=\"text\" {{#sameunit}}readOnly{{/sameunit}} maxlength=\"4\" length=\"4\" value=\"1\" class=\"form-control convert{{ conta }}\" style=\"text-align:center;height:30px\" /></td><td class=\"colst40\"><label {{#sameunit}}style=\"display:none;\"{{/sameunit}} style=\"font-weight:bold;color:#ef5350\">{{ uninomhe }}*{{ unidad }}</label></td></tr>";
			for (x in ldetcomp) {
				ldetcomp[x].item = parseInt(x) + 1;
				$tb.append(Mustache.render(template, ldetcomp[x]));
			}
		};
	})
}

checkingmat=function(conta,cantpend){
	var valor=''
	if (document.getElementById('checkingdet'+conta).checked) {
		valor=cantpend
	}else{
		valor=''
	}
	$(".inputcant"+conta).val(valor)
}


keyupcompra=function(event){
	if (event.which==13) {
		texting=this.value
		lordcompra()
		lnoting()
	}
}

savenotaing=function(){
	console.log(ldetcomp)
	var ncompra,cguia,nfactura,motingreso,coment,almacen,recib,inspecc,aprob;
	ncompra=$(".lblingcodcompra").text()
	cguia=$(".ingguiarem").val()
	nfactura=$(".ingfactura").val()
	motingreso=$(".ingmoting").val()
	coment=$("textarea[name=ingcomentario]").val()
	almacen=$("select[id=cboingalmacen]").val()
	recib=$("select[id=cboingrecibido]").val()
	console.log(recib)
	inspecc=$("select[id=cboinginspecc]").val()
	aprob=$("select[id=cboingaprobado]").val()

	var ldetingreso=[]
	for (var i = 0; i < ldetcomp.length; i++) {
		var inputcant=$(".inputcant"+i).val()
		var convert=$(".convert"+i).val()

		if (inputcant.trim()!="" && inputcant!=0) {
			if (!/^[0-9.]+$/.test(inputcant)) {
				swal({title:'Cantidad INCORRECTA en Item '+ldetcomp[i]['item'],timer:1500,showConfirmButton:false,type:'error'})
				return false
			}
			if (parseFloat(inputcant)>parseFloat(ldetcomp[i]['cantpend'])) {
				swal({title:'Cantidad es Mayor al pendiente en Item '+ldetcomp[i]['item'],timer:1500,showConfirmButton:false,type:'error'})
				return false
			}
			if (!/^[0-9.]+$/.test(convert)) {
				swal({title:'Cantidad de Conversion INCORRECTA en Item'+ldetcomp[i]['item'],timer:1500,showConfirmButton:false,type:'error'})
				return false
			};

			var cantconvert=parseFloat(inputcant)*parseFloat(convert)
			ldetingreso.push({
				'idtabdetcomp':ldetcomp[i]['idtabdetcompra'],
				'codmat':ldetcomp[i]['codmat'],
				'codbr':ldetcomp[i]['codbrand'],
				'cantidad':ldetcomp[i]['cantidad'],
				'cantpend':ldetcomp[i]['cantpend'],
				'inputcant':inputcant,
				'convertto':parseFloat(convert),
				'updcantdetcomp':parseFloat(ldetcomp[i]['cantpend'])-parseFloat(cantconvert),
				'inpcanttotal':parseFloat(cantconvert)
			})
		};
	}

	console.log(ldetingreso)
	if (ldetingreso.length==0) {
		swal({title:'Devolver al menos un ITEM',timer:1500, showConfirmButton:true,type:'error'})
		return false;
	};


	swal({
		title:'Guardar Nota de Ingreso',
		text:'Desea Guardar Nota de Ingreso?',
		showConfirmButton:true,
		showCancelButton:true,
		confirmButtonColor:'#dd6b55',
		confirmButtonText:'Si, Guardar',
		cancelButtonText:'No, Cancelar',
		closeOnConfirm:false,
		closeOnCancel:true,
		type:'warning'
	},function(isConfirm){
		if (isConfirm) {
			var dato=new Object
			dato.ldetingreso=JSON.stringify(ldetingreso)
			dato.savenoting=true
			dato.cguia=cguia
			dato.ncompra=ncompra
			dato.nfactura=nfactura
			dato.motingreso=motingreso
			dato.coment=coment
			dato.almacen=almacen
			dato.recib=recib
			dato.inspecc=inspecc
			dato.aprob=aprob
			dato.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
			$.post("",dato,function(response){
				if (response.status) {
					swal({title:'Nota de Ingreso Generada',showConfirmButton:false,timer:1500,type:'success'})
					$(".modnewnoting").modal('close')
					texting=''
					lordcompra()
					lnoting()
				};
			})
		};
	})
}

checkingselect=function(){
	console.log(ldetcomp)
	for (var i = 0; i < ldetcomp.length; i++) {
		var cantpend=''
		var estado=''
		if (document.getElementById('radingall').checked) {
			cantpend=ldetcomp[i]['cantpend']
			estado=true
		}else{
			cantpend=''
			estado=false
		}
		$(".inputcant"+i).val(cantpend)
		document.getElementById('checkingdet'+i).checked=estado
	};
}
var codnoting=''
detnoting=function(){
	codnoting=this.value
	$(".lbllistnoting").text("Detalle de Nota de Ingreso "+codnoting)
	$(".modlistnoting").modal("open")
	ldetnoting()
}

ldetnoting=function(){
	var data=new Object
	data.ldetnoting=true
	data.codnoting=codnoting
	$.getJSON("",data,function(response){
		if (response.status) {
			var listdeting=response.listdeting
			console.log(listdeting)
			$tb = $("table.tabdetnoting > tbody");
			$tb.empty();
			template = "<tr><td class=\"colst40\">{{ item }}</td><td class=\"colst150\">{{ codhe }}</td><td>{{ namehe }}</td><td class=\"colst150\">{{ medhe }}</td><td class=\"colst150\">{{ unidad }}</td><td class=\"colst150\">{{ brand }}</td><td class=\"colst40\">{{ cantidad }}</td></tr>";
			for (x in listdeting) {
				listdeting[x].item = parseInt(x) + 1;
				$tb.append(Mustache.render(template, listdeting[x]));
			}
		};
	})
}

delnoting=function(){
	var codnoting=this.value
	console.log(codnoting)
	swal({
		title:'Anular Nota de Ingreso',
		text:'Seguro de Anular Nota de Ingreso?',
		showConfirmButton:true,
		showCancelButton:true,
		confirmButtonText:'SI,Anular',
		confirmButtonColor:'#dd6b55',
		cancelButtonText:'NO,Cancelar',
		closeOnConfirm:false,
		closeOnCancel:true,
		type:'warning'
	},function(isConfirm){
		if (isConfirm) {
			var dat=new Object
			dat.anulnoting=true
			dat.codnoting=codnoting
			dat.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
			$.post("",dat,function(response){
				if (response.status) {
					swal({title:'Nota de Ingreso Anulada',showConfirmButton:false,timer:1500,type:'success'})
					texting=''
					lnoting()
					lordcompra()
				};
			})
		};
	})
}
// @cvaldezch 2017-07-26 11:15:18 - add event function show report note ingress
showreportnoteingress = function() {
	var code = this.value;
	var hreport = $('[name=hreport]').val();
	var ruc = $('[name=ruc]').val();
	window.open(hreport+'tools/note/ingress?idnota='+code+'&ruc='+ruc, '_blank');
}