$(document).ready(function(){$("ul.lst-orders").sortable({cursor:"move",connectWith:"ul",receive:function(t,a){name=$(this).attr("name"),"supply"==name?vecOrders.push(a.item[0].id):"order"==name&&vecOrders.splice(vecOrders.indexOf(a.item[0].id),1),$("#"+a.item[0].id).removeClass("supply"==name?"list-group-item-info":"list-group-item-success").addClass("supply"==name?"list-group-item-success":"list-group-item-info"),getlistMaterials(vecOrders)}}),$(".lst-orders").disableSelection(),$(document).on("click",".btn-addsu",showAddSupply),$(".btn-add-commit").on("click",saveMatSupply),$(".maddsupply").draggable({cursor:"move"})});var saveMatSupply=function(t){t.preventDefault();var a=!1,s=new Object;$("[name=id-add],[name=cant-add]").each(function(){""==this.value?($().toastmessage("showWarningToast","Se a encontrado un campo vacio."),a=!1):(s[this.name]=this.value,a=!0)}),a&&(s.csrfmiddlewaretoken=$("[name=csrfmiddlewaretoken]").val(),s["add-ori"]="PE",s.orders=JSON.stringify(vecOrders),console.log(s),$.post("",s,function(t){console.log(t),t.status&&($("[name="+s["id-add"]+"]").attr("disabled",!0),$(".maddsupply").modal("hide"))}))},showAddSupply=function(t){t.preventDefault(),$("[name=id-add]").val(this.name),$("[name=cant-add]").val(this.value).attr("min",this.value),$(".maddsupply").modal("show")},vecOrders=new Array,getlistMaterials=function(t){t.length>=0?$.getJSON("/json/get/list/orders/details/",{orders:JSON.stringify(t)},function(t){if(t.status){var a=$(".data-mats > tbody");a.empty();var s="<tr class='{{ status }}'><td>{{ item }}</td><td>{{ materiales_id }}</td><td>{{ matnom }}</td><td>{{ matmed }}</td><td>{{ unidad }}</td><td>{{ cantidad }}</td><td>{{ stock }}</td><td><button value='{{ cantidad }}' name='{{ materiales_id }}' class='btn btn-addsu btn-sx btn-block text-black btn-{{status}}'><span class='glyphicon glyphicon-shopping-cart'></span></button></td></tr>";for(var e in t.list)t.list[e].item=parseInt(e)+1,t.list[e].status=t.list[e].stock<=0?"danger":t.list[e].stock<=t.list[e].cantidad&&t.list[e].stock>0?"warning":"success",a.append(Mustache.render(s,t.list[e])),!!t.list[e].tag&&$("button[name="+t.list[e].materiales_id+"]").attr("disabled",t.list[e].tag)}}):$().toastmessage("showWarningToast","No hay pedidos para suministrar")};