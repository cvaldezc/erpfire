
$(document).ready(function() {

	$(".txtformpago").on("keyup", formpago);
	$(".txtdocument").on("keyup",tdocument);
	$(".txtmoneda").on("keyup",tmoneda);
	$(".txtcargo").on("keyup",cargo);
	$(".txtarea").on("keyup",area);
	$(".txtbuschome").on("keyup",bushome);
	
	$('.tooltipped').tooltip({delay: 50});
	combochosen("select")

});


$(function(){
	var $tabla = $('#table-listcruds');
	
	$('#cbocruds').change(function(){
		var value = $(this).val();
		console.log(value)
		if (value){
			$('tbody tr.' + value, $tabla).show();
			$('tbody tr:not(.' + value + ')', $tabla).hide();
		}
		else{
			$('tbody tr', $tabla).show();
		}
	});
});

bushome = function(event) {
	buscador("txtbuschome","table-listcruds");
}

combochosen = function(combo){
$(combo).chosen({
	allow_single_deselect:true,
	width: '100%'});
}

formpago = function(event) {
	buscador("txtformpago","table-formpago");
}

tdocument = function(event){
	buscador("txtdocument","table-documents");
}

tmoneda = function(event){
	buscador("txtmoneda","table-moneda");
}

cargo = function(event){
	buscador("txtcargo","table-cargoemp")
}

area = function(event){
	buscador("txtarea","table-area")
}

$('.msgarea').attr('title', 'text to show');


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

