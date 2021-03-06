$(document).ready ->
    $(".btn-erase-fields,.btn-generate,.panel-new,.btn-list").hide()
    $("input[name=start],input[name=execution]").datepicker
        changeMonth: true
        changeYear: true
        closeText: "Cerrar"
        dateFormat: "yy-mm-dd"
        showAnim: "slide"
        showButtonPanel: true
    $("select[name=project]").on "change", selectProject
    $("button.btn-add-item").on "click", addItem
    $("button.btn-refresh").on "click", getListTmp
    $("input[name=dsct]").on "change keyup", changeDsct
    $("input[name=sel]").on "change", changeRadio
    $("button.btn-del").on "click", selectDel
    $(document).on "click", "button.btn-edit", loadEdit
    $("button.btn-new").on "click", showNew
    $("button.btn-list").on "click", showList
    $("button.btn-generate").on "click", saveServiceOrder
    $("textarea[name=desc]").trumbowyg()
    $(".trumbowyg-box,.trumbowyg-editor").css(minHeight:"250px !important")
    $(".chosen-select").chosen
        no_results_next: "Oops, nada encontrado!"
        width: "100%"
    showNew()
    $(".vigv").text "0"
    $("#sigv").on "click", changeSelIGV
    return

changeSelIGV = (event) ->
    if $("#sigv").is(":checked")
        $(".vigv").text($("#igv").val())
        calcamount()
    else
        $(".vigv").text "0"
        calcamount()
    return

showNew = (event) ->
    $("div.panel-list, button.btn-new").fadeOut 150
    $("div.panel-new, button.btn-list, button.btn-generate").fadeIn 1200
    # getListTmp()
    return

showList = (event) ->
    $("div.panel-new, button.btn-list, button.btn-generate").fadeOut 150
    $("div.panel-list, button.btn-new").fadeIn 1200
    return

selectProject = (event) ->
    $pro = $(@)
    if $pro.val()
        getItemizerByProject()
        data = new Object
        data.pro = $pro.val()
        data.changeProject = true
        $.getJSON "", data, (response) ->
            if response.status
                $sub = $("[name=subproject]")
                $sub.empty()
                if response.subprojects
                    tmp = "<option value=\"{{ id }}\">{{ x.subproject }}</option>"
                    for x of response.subprojects
                        $sub.append Mustache.render tmp, response.subprojects[x]
                $("input[name=arrival]").val response.address
                return
            else
                $().toastmessage "showErrorToast", "No se a encontrado Proyectos. #{response.raise}"
                return
    return

addItem = (event) ->
    data = new Object
    $("div.modal-body").find("input, select, textarea").each (index, element) ->
        if element.value is ""
            $().toastmessage "showWarningToast", "Campo vacio. #{element.name}"
            return false
        else
            data[element.name] = element.value
            return

    if Object.keys(data).length
        data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val()
        data.additem = true
        if $("input[name=edit-item]").val()
            data.pk = parseInt $("input[name=edit-item]").val()
        $.post "", data, (response) ->
            if response.status
                listDetails response
                $("input[name=edit-item]").val ""
                return
            else
                $().toastmessage "showErrorToast", "No se a podido agregar el Item"
                return
        return

listDetails = (response) ->
    if Object.keys(response).length
        temp = "<tr>
                <td class=\"text-center\">
                    <input type=\"checkbox\" name=\"items\" value=\"{{ item }}\">
                </td>
                <td class=\"text-center\">{{ item }}</td>
                <td>{{{ description }}}</td>
                <td class=\"text-right\">{{ quantity }}</td>
                <td class=\"text-center\">{{ unit }}</td>
                <td class=\"text-right\">{{ price }}</td>
                <td class=\"text-right\">{{ amount }}</td>
                <td class=\"text-center\">
                    <button class=\"btn btn-xs text-green btn-link btn-edit\" data-item=\"{{ item }}\" data-desc=\"{{ description }}\" data-quantity=\"{{ quantity }}\" data-unit=\"{{ unit }}\" data-price=\"{{ price }}\">
                        <span class=\"fa fa-edit\"></span>
                    </button>
                </td>
            </tr>"
        $tb = $("table.table-details > tbody")
        $tb.empty()
        for x of response.list
            response.list[x].description =
            $tb.append Mustache.to_html temp, response.list[x]
        calcamount()
    return

getListTmp = (event) ->
    $("button > span.fa-refresh").addClass "fa-spin"
    data = new Object
    data.list = true
    data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val()
    $.post "", data, (response) ->
        if response.status
            #setTimeout ->
            listDetails response
            $("button > span.fa-refresh").removeClass "fa-spin"
            #, 1500
            return
        else
            $().toastmessage "showErrorToast", "No se a realizado la lista."
            return
    return

calcamount = (event) ->
    amount = 0
    $("table.table-details > tbody > tr").each (index, element) ->
        $td = $(element).find "td"
        amount += parseFloat $td.eq(6).text()
        return
    if $("#sigv").is(":checked")
        igv = (parseFloat($("#igv").val()) / 100)
    else
        igv = 0
    dsct = (parseFloat($(".vdsct").text() or 0) / 100)
    $(".rdsct").text (amount * dsct).toFixed 2
    $(".ramount").text amount.toFixed 2
    amount = (amount - (amount * dsct))
    igv = (amount * igv)
    $(".rigv").text igv.toFixed 2
    $(".rtotal").text (amount + igv).toFixed 2
    return

changeDsct = (event) ->
    $(".vdsct").text @value
    calcamount()
    return

changeRadio = (event) ->
    $(@).each (index, element) ->
        if element.checked
            $("input[name=items]").each (index, chk) ->
                chk.checked = Boolean parseInt element.value
                return
            return
    return

selectDel = (event) ->
    del = new Array
    $("input[name=items]").each (index, chk) ->
        if chk.checked
            del.push chk.value
            return
    if del.length
        $().toastmessage "showToast",
            text: "Realmente desea eliminar los items seleccionados?"
            type: "confirm"
            sticky: true
            buttons: [{value: "Si"},{value:"No"}]
            success: (result) ->
                if result is "Si"
                    data = new Object
                    data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val()
                    data.items = JSON.stringify del
                    data.del = true
                    $.post "", data, (response) ->
                        if response.status
                            listDetails response
                        else
                            $().toastmessage "showErrorToast", "No se eliminado los Items. #{response.raise}"
        return
    else
        $().toastmessage "showWarningToast", "Debe de seleccionar por lo menos un item."
        return
    return

loadEdit = (event) ->
    $("input[name=edit-item]").val @getAttribute "data-item"
    $("textarea[name=desc]").trumbowyg 'html', @getAttribute("data-desc")
    $("select[name=unit]").val @getAttribute "data-unit"
    $("input[name=quantity]").val @getAttribute "data-quantity"
    $("input[name=price]").val @getAttribute "data-price"
    $("div#mdetails").modal "show"
    return

saveServiceOrder = (event) ->
    data = new Object
    data.project = $("select[name=project]").val() or ''
    # data.project = if data.project is '' then '' else data.project
    data.subproject = $("select[name=subproject]").val() or ''
    data.supplier = $("select[name=supplier]").val()
    data.quotation = $("input[name=quotation]").val() or ''
    data.arrival = $("input[name=arrival]").val()
    data.document = $("select[name=document]").val()
    data.method = $("select[name=method]").val()
    data.currency = $("select[name=currency]").val()
    data.start = $("input[name=start]").val()
    data.term = $("input[name=execution]").val()
    data.dsct = $("input[name=dsct]").val()
    data.authorized = $("select[name=authorized]").val()
    data.sigv = $("#sigv").is(":checked")
    data.itemizer = $("#itemizer").val() or ''
    # data.itemizer = if data.itemizer is '' then '' else data.itemizer
    for x in Object.keys(data)
        if data[x] is "" and (x isnt 'quotation' and x isnt 'project' and x isnt 'itemizer' and x isnt 'subproject')
            valid = false
            break
        else
            valid = true
    if valid
        data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val()
        data.generateService = true
        prm = new FormData()
        for x of data
            prm.append x, data[x]
            #console.log "#{x} , #{data[x]}"
        if $("input[name=deposit]").get(0).files.length
            prm.append "deposit", $("input[name=deposit]").get(0).files[0]
        $.ajax
            url: ""
            data: prm
            type: "POST"
            dataType: "json"
            cache: false
            processData: false
            contentType: false
            success: (response) ->
                if response.status
                    $().toastmessage "showSuccessToast", "Se a generado Orden de Servicio: #{response.service}"
                    setTimeout ->
                        location.href = '/logistics/services/orders/'
                        return
                    , 2600
                    return
                else
                    $().toastmessage "showErrorToast", "No se a generado Orden de Servicio. #{response.status}"
                    return
    else
        $().toastmessage "showWarningToast", "Se a encontrado un campo vacio."
    return

# @cvaldezch 2017-07-11 10:34:38
# add function for get itemizer for each project
getItemizerByProject = ->
    project = $("select[name=project]").val()
    if project isnt ''
        params = {
            itemizer: true
            project: project
        }
        $.getJSON('', params, (response) ->
            if response['status']
                temporal = """
                {{#itemizer}}
                <option value="{{pk}}">{{fields.name}}</option>
                {{/itemizer}}
                """
                $select = $("#itemizer")
                $select.empty()
                $select.html Mustache.render temporal, response
                setTimeout (->
                    $("#itemizer").trigger("chosen:updated")
                    return
                    ), 800
                return
            else
                $().toastmessage "showErrorToast", "#{response['raise']}"
                return
        )
    return
# endblock