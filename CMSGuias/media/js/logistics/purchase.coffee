$(document).ready ->
    # block search materials
    $(".panel-add,input[name=read],.step-second").hide()
    ###$("input[name=description]").on "keyup", keyDescription
    $("input[name=description]").on "keypress", keyUpDescription
    $("select[name=meter]").on "click", getSummaryMaterials
    $("input[name=code]").on "keypress", keyCode###
    # endblock
    $("input[name=traslado]").datepicker minDate: "0", showAnim: "slide", dateFormat: "yy-mm-dd"
    $(".btn-show-materials").on "click", showMaterials
    $(".btn-search").on "click", searchMaterial
    $(".btn-list").on "click", listTmpBuy
    $(".btn-add").on "click", addTmpPurchase
    $(document).on "click", "[name=btn-edit]", showEdit
    $("button[name=esave]").on "click", editMaterial
    $(document).on "click", "[name=btn-del]", deleteMaterial
    $(".btn-trash").on "click", deleteAll
    $(".btn-read").on "click", -> $(".mfile").modal "show"
    $(".show-input-file-temp").click ->
        $("input[name=read]").click()
    $("[name=btn-upload]").on "click", uploadReadFile
    $(".show-bedside").on "click", showBedside
    $("input[name=discount],input[name=edist]").on "blur", blurRange
    $(".btn-deposito").on "click", toggleDeposito
    $(".btn-purchase").on "click", saveOrderPurchase
    $("input[name=pdiscount]").on "keyup", calcTotal
    .on "keypress", numberOnly
    $("[name=selproject]").chosen({width: "100%"})

    $("#saveComment").on "click", saveComment
    $(document).on "click", "[name=btn-comment]", showObservation
    listTmpBuy()
    $.get "/unit/list/?list=true", (response) ->
      if response.status
        template = "{{#lunit}}<option value=\"{{ unidad_id }}\">{{ uninom }}</option>{{/lunit}}"
        $unit = $("select[name=eunit]")
        $unit.empty()
        console.log response
        $unit.html Mustache.render template, response
        return
    $("table.table-list").floatThead
        useAbsolutePositioning: true
        scrollingTop: 50
    tinymce.init
        selector: "textarea[name=observation]"
        menubar: false
        toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify"
        toolbar_items_size: 'small'
    return

showMaterials = (event) ->
    item = @
    $(".panel-add").toggle ->
        if $(@).is(":hidden")
            $(item).find("span").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down")
        else
            $(item).find("span").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up")
    return

###keyDescription = (event) ->
    key = `window.Event ? event.keyCode : event.which`
    if key isnt 13 and key isnt 40 and key isnt 38 and key isnt 39 and key isnt 37
        getDescription @value.toLowerCase()
    if key is 40 or key is 38 or key is 39 or key is 37
        moveTopBottom key
    return

keyCode = (event) ->
    key = if window.Event then event.keyCode else event.which
    if key is 13
        searchMaterialCode @value
    return###

###searchMaterial = (event) ->
    desc = $("input[name=description]").val()
    code = $("input[name=code]").val()
    if code.length is 15
        searchMaterialCode code
    else
        getDescription $.trim(desc).toLowerCase()###

addTmpPurchase = (event) ->
    data = new Object()
    code = $(".id-mat").html()
    quantity = $("input[name=cantidad]").val()
    price = $("input[name=precio]").val()
    discount = parseInt $("input[name=discount]").val()
    if code isnt ""
        if quantity isnt ""
            if price isnt ""
                data.materiales = code
                data.cantidad = quantity
                data.precio = price
                data.brand = $("select[name=brand]").val()
                data.model = $("select[name=model]").val()
                data.unit = $("select[name=unit]").val()
                data.perception = if $("[name=perception]").is(":checked") then 1 else 0
                data.discount = discount
                data.type = "add"
                data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val()
                $.post "", data, (response) ->
                    if response.status
                        listTmpBuy()
                    else
                        $().toastmessage "showWarningToast", "El servidor no a podido agregar el material, #{response.raise}."
                , "json"
            else
                $().toastmessage "showWarningToast", "Agregar materiales Falló. Precio Null."
        else
            $().toastmessage "showWarningToast", "Agregar materiales Falló. Cantidad Null."
        return
    else
        $().toastmessage "showWarningToast", "Agregar materiales Falló. Código Null."
    return

listTmpBuy = (event) ->
    $.getJSON "", "type":"list", (response) ->
        if response.status
            template = """<tr name="{{id}}">
                    <td style="width: 20px;" class="text-center">{{item}}</td><td>{{materials_id}}</td>
                    <td>{{matname}} - {{matmeasure}}</td>
                    <td>{{unit}}</td>
                    <td>{{brand}}</td>
                    <td>{{model}}</td>
                    <td class="text-right">{{quantity}}</td>
                    <td class="text-right">{{price}}</td>
                    <td class="text-right">{{discount}}%</td>
                    <td class="text-right">{{perception}}%</td>
                    <td class="text-right">{{amount}}</td>
                    <td class="text-center"><button class="btn btn-xs btn-link" name="btn-edit" value="{{quantity}}" data-price="{{price}}" data-brand="{{brand}}" data-model="{{model}}" data-nombre="{{matname}} {{matmeasure}}" data-id="{{id}}" data-mat="{{materials_id}}" data-discount="{{discount}}" data-unit="{{unit}}" data-perception="{{perception}}"><span class="glyphicon glyphicon-pencil"></span></button></td>
                    <td class="text-center"><button class="btn btn-xs btn-link text-red" name="btn-del" value="{{id}}" data-mat="{{materials_id}}"><span class="glyphicon glyphicon-trash"></span></button></td>
                    <td class="text-center">
                        <button type="button" class="btn btn-sm btn-link black-text" name="btn-comment" value="{{id}}" data-materrials="{{materials_id}}" data-desc="{{matname}} - {{matmeasure}}" data-brand="{{brand}}" data-model="{{model}}" data-unit="{{unit}}" data-obs="{{observation}}">
                            <i class="fa fa-font fa-lg text-black"></i>
                        </button>
                    </td>
                    </tr>"""
            $tb = $("table.table-list > tbody")
            $tb.empty()
            for x of response.list
                response.list[x].item = parseInt(x) + 1
                $tb.append Mustache.render template, response.list[x]
            $(".discount").html response.discount.toFixed 2
            $(".sub").html response.subtotal.toFixed 2
            if $("[name=sigv]").is(":checked")
                $(".igv").html response.igv.toFixed 2
                $(".total").html response.total.toFixed 2
            else
                $(".igv").html 0
                $(".total").html (response.total - response.igv).toFixed 2
            return
        else
            $().toastmessage "showWarningToast", "No se a encontrado resultados. #{response.raise}"
    return

showObservation = ->
    console.log $(this).a
    $(".odesc").text "#{$(this).attr "data-desc"} #{$(this).attr "data-brand"} #{$(this).attr "data-model"}"
    $("#obs").html "#{$(this).attr "data-obs"}"
    $("#saveComment").val $(this).val()
    $("#mobservation").modal "show"
    return

showEdit = (event) ->
    btn = @
    getDataBrand()
    getDataModel()
    opb = "<option value=\"{{brand_id}}\" {{!se}}>{{ brand }}</option>"
    opm = "<option value=\"{{ model_id }}\" {{!se}}>{{ model }}</option>"
    $("input[name=ematid]").val $(@).attr "data-mat"
    $("input[name=eidtmp]").val $(@).attr "data-id"
    $("input[name=equantity]").val @value
    $("input[name=eprice]").val $(@).attr "data-price"
    $("input[name=edist]").val $(@).attr "data-discount"
    setTimeout  ->
        $bra = $("select[name=ebrand]")
        $bra.empty()
        for x of globalDataBrand
            tb = opb
            if globalDataBrand[x].brand is btn.getAttribute "data-brand"
                tb = tb.replace "{{!se}}", "selected"
            $bra.append Mustache.render tb, globalDataBrand[x]
        $mo = $("select[name=emodel]")
        $mo.empty()
        for x of globalDataModel
            tm = opm
            if globalDataModel[x].model is btn.getAttribute "data-model"
                tm = tm.replace "{{!se}}", "selected"
            $mo.append Mustache.render tm, globalDataModel[x]
        $("[name=eunit]").val btn.getAttribute "data-unit"
        $("[name=eperception]").prop "checked", Boolean parseInt btn.getAttribute "data-perception"
        $("#descedit").html btn.getAttribute "data-nombre"
        $(".medit").modal "show"
    , 1000
    return

editMaterial = (event) ->
    event.preventDefault()
    $id = $("input[name=eidtmp]")
    $mat = $("input[name=ematid]")
    $quantity = $("input[name=equantity]")
    $price = $("input[name=eprice]")
    $discount = $("input[name=edist]").val()
    if $quantity.val() isnt 0 and $quantity.val() > 0 and $price.val() isnt 0 and $price.val() > 0
        data = new Object()
        data.id = $id.val()
        data.materials_id = $mat.val()
        data.quantity = parseFloat $quantity.val()
        data.price = parseFloat $price.val()
        data.brand = $("select[name=ebrand]").val()
        data.model = $("select[name=emodel]").val()
        data.type = "edit"
        data.unit = $("select[name=eunit]").val()
        data.perception = if $("[name=eperception]").is(":checked") then 1 else 0
        data.discount = parseFloat $discount
        data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val()
        $.post "", data, (response) ->
            if response.status
                ###$edit = $("table.table-list > tbody > tr[name=#{$id.val()}] > td")
                $edit.eq(5).html $quantity.val()
                $edit.eq(6).html $price.val()
                $edit.eq(7).html "#{$discount}%"
                $edit.eq(8).html (((data.price * data.discount) / 100) * data.quantity)
                $edit.eq(9).find("button").val $quantity.val()
                $edit.eq(9).find("button").attr "data-price", $price.val()
                $("input[name=ematid],input[name=eidtmp],input[name=equantity],input[name=eprice]").val ""
                ###
                $(".medit").modal "hide"
                listTmpBuy()
                return
            else
                $().toastmessage "showWarningToast","No se a podido editar el material #{response.raise}"
        return
    else
        $().toastmessage "showWarningToast", "Error campo vacio: cantidad, precio.  "
    return

deleteMaterial = (event) ->
    event.preventDefault()
    item = @
    $().toastmessage "showToast",
        sticky: true,
        text: "Desea eliminar el material #{$(@).attr "data-mat"}",
        type: "confirm",
        buttons: [{value:"Si"},{value:"No"}],
        success: (result) ->
            if result is "Si"
                data = new Object()
                data.id = item.value
                data.materials_id = $(item).attr "data-mat"
                data.type = "del"
                data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val()
                $.post "", data, (response) ->
                    if response.status
                        $("table.table-list > tbody > tr[name=#{item.value}]").remove()
                    else
                        $().toastmessage "showWarningToast", "Error al eliminar material #{response.raise}"
                , "json"
                return

deleteAll = (event) ->
    event.preventDefault()
    $().toastmessage "showToast",
        sticky: true,
        text: "Desea eliminar todo el temporal?",
        type: "confirm",
        buttons: [{value:"Si"},{value:"No"}],
        success: (result) ->
            if result is "Si"
                $.post "", type: "delall", "csrfmiddlewaretoken": $("input[name=csrfmiddlewaretoken]").val(), (response) ->
                    if response.status
                        $().toastmessage "showNoticeToast", "Correcto se a eliminado todo el temporal.";
                        setTimeout ->
                            location.reload()
                        , 2600
                    else
                        $().toastmessage "showWarningToast", "No se a podido eliminar todo el temporal. #{response.raise}"
                , "json"
                return
    return

uploadReadFile = (event) ->
    event.preventDefault()
    btn = @
    inputfile = document.getElementsByName("read")
    file = inputfile[0].files[0]
    if file?
        data = new FormData()
        data.append "type", "read"
        data.append "archivo", file
        data.append "csrfmiddlewaretoken", $("[name=csrfmiddlewaretoken]").val()
        $.ajax
            url : ""
            type : "POST"
            data: data
            contentType : false
            processData : false
            cache : false
            beforeSend : ->
                $(btn).button "loading"
            success : (response) ->
                if response.status
                    listTmpBuy()
                    $(btn).button "reset"
                    if response.list.length > 0
                        template = "<tr><td>{{ item }}</td><td>{{ name }}</td><td>{{ measure }}</td><td>{{ unit }}</td><td>{{ quantity }}</td><td>{{ price }}</td></tr>"
                        $tb = $("table.table-nothing > tbody")
                        $tb.empty()
                        for x of response.list
                            response.list[x].item = (parseInt(x) + 1)
                            $tb.append Mustache.render template, response.list[x]

                        $(".mlist").modal "show"
                    $(".mfile").modal "hide"
                    return
                else
                    $().toastmessage "showWarningToast", "No se ha podido completar la transacción. #{response.raise}"
    else
        $().toastmessage "showWarningToast", "Seleccione un archivo para subir y ser leido."
    return

blurRange = ->
    # event.preventDefault()
    console.info "value #{@value}"
    console.info "max #{@getAttribute("max")}"
    if parseInt(@value) > parseInt(@getAttribute("max"))
        @value = parseInt @getAttribute "max"
    else if parseInt(@value) < parseInt(@getAttribute("min"))
        @value = parseInt @getAttribute "min"
    return

toggleDeposito = ->
    $("input[name=deposito]").click()
    return

showBedside = ->
    $tb = $("table.table-list > tbody > tr")
    if $tb.length
        $(".mpurchase").modal "toggle"
        calcTotal()
    else
        $().toastmessage "showWarningToast", "Debe de ingresar por lo menos un material."
    return

saveOrderPurchase = ->
    valid = false
    data = new Object()
    $("div.mpurchase > .modal-dialog > .modal-content > .modal-body > .row").find("select,input").each (index, elements) ->
        if elements.type is "file" or elements.type is "select" or elements.type is "text"
            data[elements.name] = elements.value
            return true
        if elements.value isnt ""
            valid = true
            data[elements.name] = elements.value
        else
            valid = false
            data.element = elements.name
            return valid
    if valid
        $().toastmessage "showToast",
            text : "Desea generar la <q>Orden de Compra</q>?"
            type : "confirm"
            sticky : true
            buttons : [{value:'Si'},{value:'No'}]
            success : (result) ->
                if result is "Si"
                    # arr = new Array()
                    # $("table.table-list > tbody > tr").each (index, elements) ->
                    #     $td = $(elements).find("td")
                    #     discount = parseInt $td.eq(7).text().split("%")[0]
                    #     arr.push
                    #         "materials": $td.eq(1).text()
                    #         "quantity": parseFloat($td.eq(5).text())
                    #         "price": parseFloat($td.eq(6).text())
                    #         "discount": discount
                    #     return
                    discount = $("input[name=pdiscount]").val()
                    if discount is ""
                        discount = 0
                    prm = new FormData()
                    prm.append "proveedor", data.proveedor
                    prm.append "lugent", data.lugent
                    prm.append "documento", data.documento
                    prm.append "pagos", data.pagos
                    prm.append "moneda", data.moneda
                    prm.append "traslado", data.traslado
                    prm.append "contacto", data.contacto
                    prm.append "discount", discount
                    prm.append "sigv", if $("[name=sigv]").is(":checked") then 1 else 0
                    prm.append "projects", $("select[name=selproject]").val().toString()
                    prm.append "savePurchase", true
                    prm.append 'quotation', $("[name=quotation]").val()
                    prm.append 'observation', $("#observation_ifr").contents().find('body').html()
                    # prm.append "details", JSON.stringify arr
                    if $("input[name=deposito]").get(0).files.length
                        prm.append "deposito", $("input[name=deposito]").get(0).files[1]
                    prm.append "csrfmiddlewaretoken", $("input[name=csrfmiddlewaretoken]").val()
                    $.ajax
                        url : "",
                        type : "POST",
                        data : prm,
                        dataType : "json",
                        contentType : false,
                        processData : false,
                        cache : false,
                        success : (response) ->
                            if response.status
                                $().toastmessage "showNoticeToast", "Correco se a generar <q>Orden de Compra Nro #{response.nro}</q>"
                                setTimeout ->
                                    location.reload()
                                , 2600
                                return
                            else
                                $().toastmessage "showWarningToast", "No se a podido generar la <q>Orden de Compra</q>. #{response.raise}"
                                return
                    return
    else
        $().toastmessage "showWarningToast", "Alerta!<br>Campo vacio, #{data.element}"
    return

saveComment = ->
    data =
        comment: $("#obs").val()
        saveComment: true
        id: $(this).val()
        'csrfmiddlewaretoken': $("[name=csrfmiddlewaretoken]").val()
    $.post "", data, (response) ->
        console.log response
        if response.status
            $("#obs").val()
            listTmpBuy()
            $("#mobservation").modal "hide"
            return
        else
            $().toastmessage "showWarningToast", "No se a podido guardar los datos temporales. #{response.raise}"
            return
    , "json"
    return

calcTotal = (event) ->
    sub = convertNumber $(".sub").text()
    igv = convertNumber $(".igv").text()
    igv = ((igv * 100) / sub)
    discount = convertNumber $("input[name=pdiscount]").val()
    $("label[name=vamount]").text sub
    discount = ((sub * discount) / 100)
    $("label[name=vdsct]").text discount
    if $("[name=sigv]").is(":checked")
        igv = (((sub - discount) * igv) / 100)
        $("[name=vigv]").val igv.toFixed 2
        total = (sub - discount + igv)
    else
        $("[name=vigv]").val 0
        total = (sub - discount)
    $("label[name=vtotal]").text total.toFixed 2
    return

openBrand = ->
    url = "/brand/new/"
    win = window.open url, "Popup", "toolbar=no, scrollbars=yes, resizable=no, width=400, height=600"
    interval = window.setInterval ->
        if win == null or win.closed
            window.clearInterval interval
            $.getJSON "/json/brand/list/option/", (response) ->
            if response.status
                template = "{{#brand}}<option value=\"{{ brand_id }}\">{{ brand }}</option>{{/brand}}"
                $brand = $("select[name=ebrand]")
                $brand.empty()
                $brand.html Mustache.render template, response
            return
    , 1000
    return win;

openModel = ->
    url = "/model/new/"
    win = window.open url, "Popup", "toolbar=no, scrollbars=yes, resizable=no, width=400, height=600"
    interval = window.setInterval ->
        if win == null or win.closed
            window.clearInterval interval
            brand = $("select[name=brand]").val()
            data =
                brand: brand
            $.getJSON "/json/model/list/option/", data, (response) ->
              if response.status
                template = "{{#model}}<option value=\"{{ model_id }}\">{{ model }}</option>{{/model}}"
                $model = $("select[name=emodel]")
                $model.empty()
                $model.html Mustache.render template, response
            return
    , 1000
    return win;

openUnit = ->
    url = "/unit/add"
    win = window.open url, "Popup", "toolbar=no, scrollbars=yes, resizable=no, width=400, height=600"
    interval = window.setInterval ->
        if win == null or win.closed
            window.clearInterval interval
            $.get "/unit/list/?list=true", (response) ->
              if response.status
                template = "{{#lunit}}<option value=\"{{ unidad_id }}\">{{ uninom }}</option>{{/lunit}}"
                $unit = $("select[name=unit],select[name=eunit]")
                $unit.empty()
                $unit.html Mustache.render template, response
            return
    , 1000
    return win;
