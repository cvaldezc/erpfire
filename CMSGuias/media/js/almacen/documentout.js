$(document).ready(function(){$("#guide,#note").hide(),$("input[name=traslado]").datepicker({minDate:"0",maxDate:"+1M",showAnim:"slide",dateFormat:"yy-mm-dd"}),$(".btn-guide-show").click(function(e){e.preventDefault(),$("#note").hide("blind",600),$("#guide").show("blind",600)}),$(".btn-note-show").click(function(e){e.preventDefault(),$("#guide").hide("blind",600),$("#note").show("blind",600)}),$("select[name=traruc]").click(function(n){n.preventDefault(),e(this.value),t(this.value)}),$(".btn-change").click(function(e){$("[name="+this.name+"]").removeAttr("readonly")}),$(".btn-save-guide").click(function(e){var t=!1,n=this;return $("select").each(function(){return t=""!=this.value}),t?void $().toastmessage("showToast",{type:"confirm",sticky:!0,text:"Desea Generar Guia de Remisión?",buttons:[{value:"No"},{value:"Si"}],success:function(e){if("Si"===e){$(n).button("loading");var t=new FormData($("[name=formguide]").get(0));$.ajax({url:"",type:"POST",dataType:"json",data:t,cache:!1,contentType:!1,processData:!1,success:function(e){e.status&&($(n).button("complete"),console.log(e),$(".nro-guide").html(e.guide),$(".btn-gv").val(e.guide),$(".mguide").modal("show"))}})}}}):($().toastmessage("showWarningToast","Existe un campo vacio."),t)}),$(".btn-gv").click(function(e){e.preventDefault(),window.open("/reports/guidereferral/"+this.value+"/"+this.name+"/","_blank")});var e=function(e){$.getJSON("/json/get/list/transport/"+e+"/",function(e){if(e.status){var t="<option value='{{nropla_id}}'>{{nropla_id}} - {{marca}}</option>",n=$("select[name=nropla]");n.empty();for(var i in e.list)n.append(Mustache.render(t,e.list[i]))}})},t=function(e){$.getJSON("/json/get/list/conductor/"+e+"/",function(e){if(e.status){var t="<option value='{{condni_id}}'>{{conlic}} - {{connom}}</option>",n=$("select[name=condni]");n.empty();for(var i in e.list)n.append(Mustache.render(t,e.list[i]))}})}});