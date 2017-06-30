app = angular.module 'dsApp', ['ngCookies']
      .config ($httpProvider) ->
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
        $httpProvider.defaults.xsrfCookieName = 'csrftoken'
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken'
app.directive 'stringToNumber', ->
  require: 'ngModel'
  link: (scope, element, attrs, ngModel) ->
    ngModel.$parsers.push (value) ->
      return '' + value
    ngModel.$formatters.push (value) ->
      return parseFloat value, 10
    return

app.directive 'file', ($parse) ->
  restrict: 'A'
  scope:
    file: '='
  link: (scope, element, attrs) ->
    model = $parse attrs.file
    modelSetter = model.assign
    element.bind 'change', (event) ->
      file = event.target.files[0]
      scope.file = if file then file else undefined
      scope.$apply()

app.directive 'minandmax', valMinandMax

app.factory 'Factory', ($http, $cookies) ->
  $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken
  $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
  obj = new Object()
  frm = (options={}) ->
    f = new FormData()
    for k, v of options
      f.append k, v
    return f
  obj.post = (options={}) ->
    $http.post "",
      frm(options),
      transformRequest: angular.identity,
      headers: 'Content-Type': undefined
  obj.get = (options={}) ->
    $http.get "", params: options
  return obj

app.controller 'DSCtrl', ($scope, $http, $cookies, $compile, $timeout, $sce, $q, Factory) ->
  $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken
  $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
  $scope.perarea = ""
  $scope.percharge = ""
  $scope.perdni = ""
  $scope.dataOrders = new Array()
  $scope.snip = []
  $scope.nip = []
  $scope.orders = []
  $scope.ordersm = []
  $scope.qon = []
  $scope.radioO = []
  $scope.sdnip = []
  $scope.lplanes = []
  $scope.meditindex = -1
  $scope.objedit = []
  $scope.editm =
    'brand': ''
    'model': ''
    'quantity': 0
  $scope.status = false
  $scope.sldm = [[0, 0], [0, 0]]
  $scope.pnp = 0
  ## order to storage
  $scope.preorders = []
  $scope.selectedniple = []
  ## modify
  $scope.mchks = []
  angular.element(document).ready ->
    $scope.mdstatus = false
    angular.element('.modal').modal dismissible: false
    angular.element('ul.tabs').tabs 'onShow': -> window.scrollTo 0, 680
    angular.element('.collapsible').collapsible()
    $table = $(".floatThead")
    $table.floatThead
      position: 'absolute'
      top: 65
      scrollContainer: ($table) ->
        return $table.closest('.wrapper')
    if $scope.modify > 0
      $scope.modifyList()
      for x in new Array('n', 'm', 'd')
        $scope.listTemps(x.toUpperCase())
      $http.get '/brand/list/', params: 'brandandmodel': true
        .success (response) ->
          if response.status
            $scope.lbrand = response.brand
            $scope.lmodel = response.model
            setTimeout (->
              angular.element("select").material_select()
              return
              ), 1200
            return
    else
      $scope.getListAreaMaterials()
      $scope.getProject()
      $scope.listTypeNip()
    $('textarea#textarea1').characterCounter()
    $('.datepicker').pickadate
      container: "body"
      closeOnSelect: true
      min: new Date()
      selectMonths: true
      selectYears: 15
      format: "yyyy-mm-dd"
    $scope.perarea = angular.element("#perarea")[0].value
    $scope.percharge = angular.element("#percharge")[0].value
    $scope.perdni = angular.element("#perdni")[0].value
    $scope.listPlanes()
    angular.element('.materialboxed').materialbox()
    # setTimeout ->
    #   console.log $scope.modify
    #   return
    # , 100
    return

  # return other function test
  $scope.run = ->
    mailing.Mailing()
    mailing.geturls()
    .success (response) ->
      console.info response
    return
  #end block

  $scope.getListAreaMaterials = ->
    $scope.dsmaterials = []
    data =
      dslist: true
    $(".table-withoutApproved > thead").append """<tr class="white"><td colspan="13" class="center-align"><div class="preloader-wrapper big active"><div class="spinner-layer spinner-blue-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div></td></tr>"""
    $http.get "", params: data
    .success (response) ->
      if response.status
        $(".table-withoutApproved > thead > tr").eq(1).remove()
        $scope.dsmaterials = response.list
        $(".floatThead").floatThead 'reflow'
        $scope.inDropdownTable ".table-withoutApproved"
        $('.dropdown-button').dropdown()
        return
      else
        swal "Error!", "al obtener la lista de materiales del área", "error"
        return
    return
  $scope.inDropdownTable = (table) ->
    # console.log $("#{table} > tbody > tr").length
    if $("#{table} > tbody > tr").length > 0
      $('.dropdown-button').dropdown()
      return false
    else
      setTimeout ->
        $scope.inDropdownTable table
        return
      , 1400
    return
  $scope.saveMateial = ->
    data = $scope.mat
    data.savepmat = true
    data.ppurchase = $("[name=precio]").val()
    data.psales = $("[name=sales]").val()
    data.brand = $("[name=brand]").val()
    data.model = $("[name=model]").val()
    data.code = $(".id-mat").text()
    if data.quantity <= 0
      swal "Alerta!", "Debe de ingresar una cantidad!", "warning"
      data.savepmat = false
    if data.ppurchase <= 0
      swal "Alerta!", "Debe de ingresar un precio de Compra!", "warning"
      data.savepmat = false
    if data.psales <= 0
      swal "Alerta!", "Debe de ingresar un precio de Venta!", "warning"
      data.savepmat = false
    if data.savepmat
      if Boolean $("#modify").length
        delete data['savepmat']
        data.savemmat = true
      if $scope.mat.hasOwnProperty("obrand")
        if $scope.mat.obrand
          data.editmat = true
      $http
        url: ""
        data: $.param data
        method: "post"
      .success (response) ->
        if response.status
          Materialize.toast "Material Agregado", 2600
          # $scope.calcApproved()
          if Boolean $("#modify").length
            $scope.modifyList()
          else
            $scope.getListAreaMaterials()
            if $scope.mat.hasOwnProperty("obrand")
              $scope.mat.obrand = null
              $scope.mat.omodel = null
          $scope.gui.smat = !$scope.gui.smat
          return
        else
          swal "Error", " No se guardado los datos", "error"
          return
    return
  $scope.deleteDMaterial = ($event) ->
    swal
      title: "Eliminar material?"
      text: "realmente dese eliminar el material."
      type: "warning"
      showCancelButton: true
      confirmButtonColor: "#dd6b55"
      confirmButtonText: "Si!, eliminar"
      closeOnConfirm: true
      closeOnCancel: true
    , (isConfirm) ->
      if isConfirm
        data = $event.currentTarget.dataset
        data.delmat = true
        $http
          url: ''
          method: 'post'
          data: $.param data
        .success (response) ->
          if response.status
            $scope.getListAreaMaterials()
            # $scope.calcApproved()
            return
        return
    return
  $scope.editDMaterial = ($event) ->
    $scope.mat.code = $event.currentTarget.dataset.materials
    $timeout (->
      e = $.Event 'keypress', keyCode: 13
      $("[name=code]").trigger e
      return
    ), 100
    $timeout (->
      quantity = parseFloat $event.currentTarget.dataset.quantity
      $scope.gui.smat = true
      $("[name=brand]").val $event.currentTarget.dataset.brand
      $("[name=model]").val $event.currentTarget.dataset.model
      $scope.mat =
        quantity: parseFloat quantity
        # brand: $event.currentTarget.dataset.brand
        # model: $event.currentTarget.dataset.model
        obrand: $event.currentTarget.dataset.brand
        omodel: $event.currentTarget.dataset.model
      return
    ), 300
    return
  $scope.getProject = ->
    $http.get "/sales/projects/",
    params: 'ascAllProjects': true
    .success (response) ->
      if response.status
        $scope.ascprojects = response.projects
        return
      else
        swal "Error", "No se a cargado los proyectos", "error"
        return
    return
  $scope.getsector = (project) ->
    $http.get "/sales/projects/sectors/crud/",
    params: 'pro': project, 'sub': ''
    .success (response) ->
      if response.status
        $scope.ascsector = response.list
        return
      else
        swal "Error", "No se pudo cargar los datos del sector", "error"
        return
    return
  $scope.ccopyps = (sector) ->
    swal
      title: 'Copiar lista de Sector?'
      text: 'Realmente desea realizar la copia.'
      type: 'warning'
      showCancelButton: true
      confirmButtonColor: '#dd6b55'
      confirmButtonText: 'Si, Copiar'
      cancelButtonText: 'No, Cancelar'
      closeOnConfirm: true
      closeOnCancel: true
    , (isConfirm) ->
      if isConfirm
        if sector
          data =
            project: sector.substring(0, 7)
            sector: sector
            copysector: true
          $http
            url: ""
            method: "post"
            data: $.param data
          .success (response) ->
            if response.status
              location.reload()
              return
            else
              swal "Error", "No se a guardado los datos.", "error"
              return
          return
        else
          swal "Alerta!", "El código de sector no es valido.", "warning"
          return
    return
  $scope.delAreaMA = ->
    swal
      title: 'Realmente desea eliminar?'
      text: 'toda la lista de materiales de esta area.'
      type: 'warning'
      showCancelButton: true
      confirmButtonColor: '#dd6b55'
      confirmButtonText: 'Si, Eliminar'
      cancelButtonText: 'No, Cancelar'
    , (isConfirm) ->
      if isConfirm
        $http
          url: ""
          data: $.param 'delAreaMA': true
          method: 'post'
        .success (response) ->
          if response.status
            location.reload()
            return
          else
            swal "Alerta", "no se elimino los materiales del área", "warning"
            return
        return
    return
  $scope.availableNipple = ->
    mat = this
    swal
      title: "Desea generar Niples para este material?"
      text: "#{mat.$parent.x.fields.materials.fields.matnom} #{mat.$parent.x.fields.materials.fields.matmed}"
      type: "warning"
      showCancelButton: true
      confirmButtonColor: "#dd6b55"
      confirmButtonText: "Si, habilitar Niple"
      cancelButtonText: "No"
      timer: 2000
      (isConfirm) ->
        if isConfirm
          $http
            url: ""
            data:
              $.param
                'availableNipple': true
                'materials': mat.$parent.x.fields.materials.pk
                'brand': mat.$parent.x.fields.brand.pk
                'model': mat.$parent.x.fields.model.pk
            method: "post"
          .success (response) ->
            if response.status
              swal "Información", "Nipple habilitado para el material", "info"
              return
          return
    return
  $scope.listNipple = ->
    # console.log this
    data =
      'lstnipp': true
      'materials': this.$parent.x.fields.materials.pk
    $http.get "", params: data
    .success (response) ->
      if response.status
        count = 1
        response.desc = ->
          return (type, render) ->
            for k, v of response.dnip
              if k is this.fields.tipo
                return render v
        response.index = -> return count++
        script = """{{#nip}}<tr class="text-12"><td class="center-align">{{index}}</td><td class="center-align">{{fields.cantidad}}</td><td class="center-align">{{fields.cantshop}}</td><td class="center-align">{{fields.tipo}}</td><td>Niple {{#desc}}{{>fields.tipo}}{{/desc}}</td><td>{{fields.materiales.fields.matmed}}</td><td>x</td><td>{{fields.metrado}} cm</td><td>{{fields.comment}}</td><td><a href="#" ng-click="nedit($event)" data-pk="{{pk}}" data-materials="{{fields.materiales.pk}}" ng-if="perarea == 'administrator' || perarea == 'ventas' || perarea == 'operaciones' || percharge == 'jefe de almacen'"><i class="fa fa-edit"></i></a></td><td><a href="#" ng-click="ndel($event)" data-pk="{{pk}}" data-materials="{{fields.materiales.pk}}" class="red-text text-darken-1" ng-if="perarea == 'administrator' || perarea == 'ventas' || perarea == 'operaciones' || percharge == 'jefe de almacen'"><i class="fa fa-trash"></i></a></td></tr>{{/nip}}"""
        $det = $(".nip#{data.materials}")
        $det.empty()
        tbs = Mustache.render script, response
        el = $compile(tbs)($scope)
        $det.html el
        $ori = $("#typenip > option").clone()
        $dest = $(".t#{data.materials}")
        $dest.empty()
        $dest.append $ori
        $scope.calNipple data.materials
        $edit = $("#nipple#{data.materials}edit")
        $edit.val ""
        $edit.removeAttr "data-materials"
        $edit.removeAttr "data-meter"
        $edit.removeAttr "data-quantity"
        return
      else
        console.log "nothing data"
        return
    return
  $scope.calNipple = (materials) ->
    tot = parseFloat($(".to#{materials}").text() * 100)
    ing = 0
    $(".nip#{materials} > tr").each ->
      $td = $(this).find("td")
      ing += (parseFloat($td.eq(1).text()) * parseFloat($td.eq(7).text().split(" cm")))
      return
    dis = (tot - ing)
    console.log tot
    console.log ing
    console.log dis
    $(".co#{materials}").html ing
    $(".dis#{materials}").html dis
    return
  $scope.ndel = ($event) ->
    swal
      title: "Eliminar Niple?"
      text: "#{$event.target.offsetParent.parentElement.childNodes[1].innerText} #{$event.target.offsetParent.parentElement.childNodes[4].innerText} #{$event.target.offsetParent.parentElement.childNodes[7].innerText}"
      type: "warning"
      showCancelButton: true
      confirmButtonColor: "#dd6b55"
      confirmButtonText: "Si, eliminar!"
      cancelButtonText: "No!"
      closeOnCancel: true
      closeOnConfirm: true
    , (isConfirm) ->
      if isConfirm
        data =
          delnipp: true
          id: $event.currentTarget.dataset.pk
          materials: $event.currentTarget.dataset.materials
        $http
          url: ""
          method: "post"
          data: $.param data
        .success (response) ->
          if response.status
            $edit = $("#nipple#{data.materials}edit")
            $edit.val ""
            $edit.removeAttr "data-materials"
            $edit.removeAttr "data-meter"
            $edit.removeAttr "data-quantity"
            setTimeout ->
              # console.log $(".rf#{data.materials}")
              $(".rf#{data.materials}").trigger 'click'
              return
            , 100
            return
          else
            swal "Error", "No se a eliminado el niple", "error"
            return
        return
    return
  $scope.nedit = ($event) ->
    materials = $event.currentTarget.dataset.materials
    $("#nipple#{materials}measure").val $event.target.offsetParent.parentElement.childNodes[7].innerText.split(" cm")[0]
    $("#nipple#{materials}type").val $event.target.offsetParent.parentElement.childNodes[3].innerText
    $("#nipple#{materials}quantity").val $event.target.offsetParent.parentElement.childNodes[1].innerText
    $("#nipple#{materials}observation").val $event.target.offsetParent.parentElement.childNodes[8].innerText
    $("#nipple#{materials}edit").val $event.currentTarget.dataset.pk
      .attr "data-materials", materials
      .attr "data-quantity", $event.target.offsetParent.parentElement.childNodes[1].innerText
      .attr "data-meter", $event.target.offsetParent.parentElement.childNodes[7].innerText.split(" cm")[0]
    setTimeout ->
      $(".sdnip#{materials}").click()
      return
    , 100
    return
  $scope.listTypeNip = ->
    $http.get "", params: 'typeNipple': true
    .success (response) ->
      if response.status
        $scope.tnipple = response.type
        return
    return
  $scope.saveNipple = ->
    row = this
    data =
      metrado: $("#nipple#{row.$parent.x.fields.materials.pk}measure").val()
      tipo: $("#nipple#{row.$parent.x.fields.materials.pk}type").val()
      cantidad: $("#nipple#{row.$parent.x.fields.materials.pk}quantity").val()
      cantshop: $("#nipple#{row.$parent.x.fields.materials.pk}quantity").val()
      comment: $("#nipple#{row.$parent.x.fields.materials.pk}observation").val()
      materiales: row.$parent.x.fields.materials.pk
      nipplesav: true
    if data.measure is ""
      swal "Alerta!", "No se ha ingresado una medida para este niple.", "warning"
      data.nipplesav = false
    if data.quantity is ""
      swal "Alerta!", "No se ha ingresado una cantidad para este niple.", "warning"
      data.nipplesav = false
    $edit = $("#nipple#{data.materiales}edit")
    dis = parseFloat $(".dis#{data.materiales}").text()
    nw = (parseFloat(data.cantidad) * parseFloat(data.metrado))
    if $edit.val() isnt ""
      data.edit = true
      data.id = $edit.val()
      data.materiales = $edit.attr "data-materials"
      meter = parseFloat $edit.attr "data-meter"
      quantity = parseFloat $edit.attr "data-quantity"
      if (nw < (meter * quantity)) or nw > ((meter * quantity))
        dis += Math.abs ((meter * quantity) - nw)
      else if (nw == (meter * quantity))
        dis += (meter * quantity)
    console.log dis
    console.log nw
    cl = (dis - nw)
    console.log cl
    if cl < 0
      swal "Alerta!", "La cantidad ingresada es mayor a la cantidad disponible de la tuberia.", "warning"
      data.nipplesav = false
    if data.nipplesav
      $http
        url: ""
        method: "post"
        data: $.param data
      .success (response) ->
        if response.status
          $edit.val ""
          .removeAttr "data-materials", ""
          .removeAttr "data-quantity", ""
          .removeAttr "data-meter", ""
          $("#nipple#{data.materiales}measure").val ""
          $("#nipple#{data.materiales}type").val ""
          $("#nipple#{data.materiales}quantity").val ""
          $("#nipple#{data.materiales}quantity").val ""
          $("#nipple#{data.materiales}observation").val ""
          setTimeout ->
            $(".rf#{data.materiales}").trigger "click"
            $("#nipple#{data.materiales}measure").focus()
            return
          , 100
          return
        else
          swal "Error", "No se a guardado el niple.", "error"
          $("#nipple#{data.materiales}measure").focus()
          return
    return
  $scope.showModify = ->
    $scope.btnmodify = true
    data =
      modifyArea: true
    $http
      url: ''
      method: 'post'
      data: $.param data
    .success (response) ->
      if response.status
        location.reload()
        return
      else
        swal "Error", "No se a podido iniciar la modificación.", "error"
        return
    return
  $scope.modifyList = ->
    data =
      modifyList: true
    $http.get '', params: data
    .success (response) ->
      if response.status
        $scope.lmodify = response.modify
        $scope.calcMM()
        return
      else
        swal 'Error', 'no se a encontrado datos', 'error'
        return
    return
  $scope.showEditM = ($event) ->
    # get brand and model
    elem = this
    $http.get '/brand/list/', params: 'brandandmodel': true
    .success (response) ->
      if response.status
        $scope.brand = response
        $scope.model = response
        response.ifbrand = ->
          if this.pk == elem.$parent.x.fields.brand.pk
            return "selected"
          return
        response.ifmodel = ->
          if this.pk == elem.$parent.x.fields.model.pk
            return "selected"
          return
        btmp = """<select class="browser-default" ng-blur="saveEditM($event)" name="brand" data-old="#{elem.$parent.x.fields.brand.pk}">{{#brand}}<option value="{{pk}}" {{ifbrand}}>{{fields.brand}}</option>{{/brand}}</select>"""
        mtmp = """<select class="browser-default" ng-blur="saveEditM($event)" name="model" data-old="#{elem.$parent.x.fields.model.pk}">{{#model}}<option value="{{pk}}" {{ifmodel}}>{{fields.model}}</option>{{/model}}</select>"""
        bel = Mustache.render btmp, response
        mel = Mustache.render mtmp, response
        $($event.currentTarget.children[3]).html $compile(bel)($scope)
        $($event.currentTarget.children[4]).html $compile(mel)($scope)
        $($event.currentTarget.children[7]).html $compile("""<input type="number" ng-blur="saveEditM($event)" name="quantity" min="1" value="#{elem.$parent.x.fields.quantity}" data-old="#{elem.$parent.x.fields.quantity}" class="right-align">""")($scope)
        $($event.currentTarget.children[8]).html $compile("""<input type="number" ng-blur="saveEditM($event)" name="ppurchase" min="0" value="#{elem.$parent.x.fields.ppurchase}" data-old="#{elem.$parent.x.fields.ppurchase}" class="right-align">""")($scope)
        $($event.currentTarget.children[9]).html $compile("""<input type="number" ng-blur="saveEditM($event)" name="psales" min="0" value="#{elem.$parent.x.fields.psales}" data-old="#{elem.$parent.x.fields.psales}" class="right-align">""")($scope)
        return
    return
  $scope.saveEditM = ($event) ->
    data =
      materials: $event.currentTarget.parentElement.parentElement.children[1].innerText
      name: $event.currentTarget.name
      value: $event.currentTarget.value
    if data.name is "brand"
      data.brand = $event.currentTarget.dataset.old
      if data.value is data.brand
        return false
    else
      data.brand = $event.currentTarget.parentElement.parentElement.children[3].children[0].value
    if data.name is "model"
      data.model = $event.currentTarget.dataset.old
      if data.value is data.model
        return false
    else
      data.model = $event.currentTarget.parentElement.parentElement.children[4].children[0].value
    if data.name is 'quantity' or data.name is 'ppurchase' or data.name is 'psales'
      if parseFloat(data.value) is parseFloat ($event.currentTarget.dataset.old)
        return false
    data.editMM = true
    $http
      url: ''
      method: 'post'
      data: $.param data
    .success (response) ->
      if response.status
        $scope.calcMM()
        for x of $scope.lmodify
          if $scope.lmodify[x].fields.materials.pk is $event.currentTarget.parentElement.parentElement.children[1].innerText and $scope.lmodify[x].fields.brand.pk is data.brand and $scope.lmodify[x].fields.model.pk is data.model
            if data.name is "brand"
              $scope.lmodify[x].fields.brand.pk = $event.currentTarget.parentElement.parentElement.children[3].children[0].selectedOptions[0].value
              $scope.lmodify[x].fields.brand.fields.brand = $event.currentTarget.parentElement.parentElement.children[3].children[0].selectedOptions[0].innerText
              $event.currentTarget.dataset.old = $scope.lmodify[x].fields.brand.pk
            if data.name is "model"
              $scope.lmodify[x].fields.brand.pk = $event.currentTarget.parentElement.parentElement.children[4].children[0].selectedOptions[0].value
              $scope.lmodify[x].fields.brand.fields.brand = $event.currentTarget.parentElement.parentElement.children[4].children[0].selectedOptions[0].innerText
              $event.currentTarget.dataset.old = $scope.lmodify[x].fields.model.pk
            if data.name is "quantity"
               $scope.lmodify[x].fields.quantity = data.value
               $event.currentTarget.dataset.old = $scope.lmodify[x].fields.quantity
            if data.name is "ppurchase"
              $scope.lmodify[x].fields.ppurchase = data.value
              $event.currentTarget.dataset.old = $scope.lmodify[x].fields.ppurchase
            if data.name is "psales"
              $scope.lmodify[x].fields.psales = data.value
              $event.currentTarget.dataset.old = $scope.lmodify[x].fields.psales
            break
        Materialize.toast 'Guardado OK', 1500, 'rounded'
        return
      else
        Materialize.toast "Error, no se guardo, #{response.raise}", 1500
        return
    return
  $scope.closeEditM = ($event) ->
    for x of $scope.lmodify
      if $scope.lmodify[x].fields.materials.pk is $event.currentTarget.parentElement.parentElement.children[1].innerText and $scope.lmodify[x].fields.brand.pk is $event.currentTarget.parentElement.parentElement.children[3].children[0].selectedOptions[0].value and $scope.lmodify[x].fields.model.pk is $event.currentTarget.parentElement.parentElement.children[4].children[0].selectedOptions[0].value
        $event.currentTarget.parentElement.parentElement.children[3].innerHTML = $scope.lmodify[x].fields.brand.fields.brand
        $event.currentTarget.parentElement.parentElement.children[4].innerHTML = $scope.lmodify[x].fields.model.fields.model
        $event.currentTarget.parentElement.parentElement.children[7].innerHTML = $scope.lmodify[x].fields.quantity
        $event.currentTarget.parentElement.parentElement.children[8].innerHTML = $scope.lmodify[x].fields.ppurchase
        $event.currentTarget.parentElement.parentElement.children[9].innerHTML = $scope.lmodify[x].fields.psales
        break
    return
  $scope.delEditM = ($event) ->
    swal
      title: "Eliminar Material?"
      text: """#{$event.currentTarget.parentElement.parentElement.children[2].innerText}"""
      type: "warning"
      showCancelButton: true
      confirmButtonText: "Si!, eliminar"
      confirmButtonColor: "#dd6b55"
      cancelButtonText: "No!"
      closeOnConfirm: true
    , (isConfirm) ->
      if isConfirm
        data =
          materials: $event.currentTarget.parentElement.parentElement.children[1].innerText
          brand: $event.currentTarget.dataset.brand
          model:$event.currentTarget.dataset.model
          delMM: true
        $http
          url: ""
          method: "post"
          data: $.param data
        .success (response) ->
          if response.status
            Materialize.toast "Se elimino correctamente", 1500
            $scope.modifyList()
            return
          else
            swal "Error", "No se a podido eliminar el material, intentelo otra vez.", "error"
            return
    return
  $scope.calcMM = ->
    $http.get "", params: samountp: true
    .success (response) ->
      # console.log response
      $scope.amnp = response.maarea.tpurchase
      $scope.amns = response.maarea.tsales
      $scope.ammp = response.mmodify.apurchase
      $scope.amms = response.mmodify.asale
      $scope.amsecp = response.sec[0].fields.amount
      $scope.amsecs = response.sec[0].fields.amountsales
      $scope.amstp = response.msector.tpurchase
      $scope.amsts = response.msector.tsales
    return
  $scope.delAllModifyArea = ($event) ->
    swal
      title: 'Anular Modificación?'
      text: 'se eliminara cualquier modificación realizada.'
      type: 'warning'
      showCancelButton: true
      confirmButtonColor: '#dd6b55'
      confirmButtonText: 'Anular Modificación'
      cancelButtonText: 'No!'
    , (isConfirm) ->
      if isConfirm
        data =
          'annModify': true
        $http
          url: ''
          method: 'post'
          data: $.param data
        .success (response) ->
          if response.status
            $timeout (->
              location.reload()
              return
            ), 2600
            return
          else
            swal "Alerta!", "No se a realizado la acción. #{response.raise}", "error"
            return
        return
    return
  $scope.approvedModify = ($event) ->
    validPrice = ->
      defer = $q.defer()
      prm =
        consultingprice: true
      Factory.get(prm)
      .success (response) ->
        if response.status
          if response.lst.length > 0
            $scope.withoutprices = response.lst
            Materialize.toast "Warning #{response.raise}"
            angular.element("#mwithout").modal("open")
            defer.resolve false
            return
          else
            defer.resolve true
            return
        else
          defer.resolve false
          return
      return defer.promise
    validPrice().then (result) ->
      if result
        swal
          title: "Aprobar modificación?"
          text: "Desea aprobar las modificaciones del área?"
          type: "warning"
          showCancelButton: true
          confirmButtonColor: "#dd6b55"
          confirmButtonText: "Si!, Aprobar"
          closeOnConfirm: true
          closeOnCancel: true
        , (isConfirm) ->
          if isConfirm
            Materialize.toast """<i class="fa fa-cog fa-spin fa-fw"></i>
              _Procesando...""", "infinity", "toast-kill"
            $event.currentTarget.disabled = true
            $event.currentTarget.innerHTML = """
            <i class="fa fa-spinner fa-pulse"></i> Procesando"""
            data =
              approvedModify: true
            $http
              url: ""
              method: "post"
              data: $.param data
            .success (response) ->
              if response.status
                Materialize.toast "Se Aprobó!"
                $timeout (->
                  location.reload()
                  return
                ), 800
                return
              else
                $event.currentTarget.className = "btn red grey-text text-darken-1"
                $event.currentTarget.innerHTML = """<i class="fa fa-timescircle"></i> Error!"""
                return
            return
        return
      else
        Materialize.toast "Existen item sin precio", 12000
        return
    return
  $scope.updatePrice = (index) ->
    param = $scope.wout[index]
    param['updprice'] = true
    Factory.post(param)
    .success (response) ->
      if !response.status
        Materialize.toast "No se ha podido actualizar los precios.", 2400
      return
    return
  $scope.showCommentMat = ->
    $("#commentm").modal('open')
    # console.log this
    $("#mcs").val this.$parent.x.fields.materials.pk
      .attr "data-brand", this.$parent.x.fields.brand.pk
      .attr "data-model", this.$parent.x.fields.model.pk
    $scope.mmc = this.$parent.x.fields.comment
    console.log this.$parent.x.fields.comment
    $scope.lblmcomment = "#{this.$parent.x.fields.materials.fields.matnom} #{this.$parent.x.fields.materials.fields.matmed}"
    return
  $scope.saveComment = ($event) ->
    $d = $("#mcs")
    data =
      materials: $d.val()
      brand: $d.attr "data-brand"
      model: $d.attr "data-model"
      comment: $scope.mmc
      saveComment: true
    $event.currentTarget.disabled = true
    $event.currentTarget.innerHTML = """<i class="fa fa-spinner fa-pulse"></i> Procesando"""
    $http
      url: ""
      method: "post"
      data: $.param data
    .success (response) ->
      $event.currentTarget.disabled = false
      $event.currentTarget.innerHTML = """<i class="fa fa-floppy-o"></i> GUARDAR"""
      if response.status
        $scope.mmc = ''
        $("#commentm").modal('close')
        return
    return
  # part perform orders to storage
  # this funciton open modal for preview order
  $scope.pOrders = ($event) ->
    counter = 0
    for x in $scope.preorders
      if x.status
        counter++
    if counter > 0
      $("#morders").modal('open')
      return
  $scope.changeSelOrder = ($event) ->
    for x in $scope.preorders
      if x.tag != '2'
        x.status = Boolean parseInt $event.currentTarget.value
    return
  #
  # set observation for item materials
  $scope.addobservation = ($index) ->
    $scope.sitem = {}
    if $scope.preorders[$index].hasOwnProperty('observation')
      $scope.sitem.observation = $scope.preorders[$index]['observation']
    else
      $scope.preorders[$index].observation = ''
      $scope.sitem.observation = ''
    $scope.sitem.index = $index
    $scope.sitem.materials = $scope.preorders[$index]['materials']
    angular.element("#editor").trumbowyg()
    angular.element("#editor").trumbowyg('html', $scope.sitem.observation)
    angular.element("#mobservation").modal 'open'
    return
  $scope.saveobservation = ->
    $scope.preorders[$scope.sitem.index]['observation'] = angular.element("#editor").trumbowyg 'html'
    $scope.sitem = {}
    angular.element("#editor").trumbowyg 'html', ''
    angular.element("#mobservation").modal 'close'
    return
  # manage preorder with niples
  #
  $scope.deleteItemOrders = ($index) ->
    console.log $index
    $scope.preorders[$index].status = false
    removeItem = ->
      defer = $q.defer()
      counter = 0
      for x in $scope.preorders
        if x.status is true
          counter++
      defer.resolve counter
      return defer.promise
    removeItem().then (response) ->
      if response <= 0
        angular.element("#morders").modal('close')
      return
    return

  $scope.getNippleMaterials = ($index) ->
    $scope.setToastStatic "Obteniendo Niples, espere!", "cog"
    getniples = ->
      defer = $q.defer()
      data =
        nippleOrders: true
        materials: $scope.preorders[$index].materials.pk
        brand: $scope.preorders[$index].brand.pk
        model: $scope.preorders[$index].model.pk
      $http.get "", params: data
        .success (response) ->
          console.log response
          defer.resolve response
          return
      return defer.promise
    getniples().then (response) ->
      $scope.removeToastStatic()
      # if not $scope.preorders[$index].hasOwnProperty("selected")
      $scope.preorders[$index]['selected'] = response['nipple']
      $scope.selectedniple['details'] = $scope.preorders[$index].selected
      $scope.selectedniple['materials'] = $scope.preorders[$index].materials
      $scope.selectedniple['index'] = $index
      angular.element("#mselectedniple").modal 'open'
      return
    return
  $scope.selectedmodalniples = ($event) ->
    for x in $scope.selectedniple.details
      x.status = Boolean parseInt($event.currentTarget.value)
    return

  $scope.sumSelectedNiple = ->
    $scope.setToastStatic "Procesando!", "cog"
    getAmountMeter = ->
      amount = 0
      defer = $q.defer()
      for x in $scope.selectedniple.details
        if x.status
          amount += (x.fields.metrado * x.qorder)
      defer.resolve parseFloat(parseFloat(amount/100).toFixed(3))
      return defer.promise
    getAmountMeter().then (response) ->
      $index = $scope.selectedniple['index']
      $scope.preorders[$index]['selected'] = $scope.selectedniple['details']
      $scope.preorders[$index]['qorder'] = response
      angular.element("#mselectedniple").modal 'close'
      $scope.selectedniple = {}
      $scope.removeToastStatic()
      return
    return

  # next step valid items with quantity
  $scope.nextStepOrder = ->
    statusQOrder = ->
      defer = $q.defer()
      for x in $scope.preorders
        if x.status and x.qorder <= 0
          defer.resolve false
          return defer.promise
      defer.resolve true
      return defer.promise
    statusQOrder().then (status) ->
      if status
        $scope.ordersp1=true
        $scope.ordersp2=true
      else
        $scope.setToastStatic "Existen cantidades en 0.", "remove", 2200, false
    return
  # save orders
  $scope.saveOrdersStorage = ($event) ->
    swal
      title: "Desea generar la orden?"
      text: ''
      type: "warning"
      showCancelButton: true
      confirmButtonText: 'Si!, Generar!'
      confirmButtonColor: '#dd6b55'
      cancelButtonText: 'No'
      closeOnConfirm: true
      closeOnCancel: true
    , (isConfirm) ->
      if isConfirm
        $scope.setToastStatic "Procesando!", "cog", 0
        data = new FormData()
        if not $scope.orders.hasOwnProperty "storage"
          swal "", "Seleccione un almacén para el pedido", "warning"
          return false
        if not $scope.orders.hasOwnProperty "transfer"
          swal "", "Debe de seleccionar una fecha para la envio.", "warning"
          return false
        if $scope.orders.transfer is ""
          swal "", "Debe de seleccionar una fecha para la envio.", "warning"
          return false
        if !$scope.orders.hasOwnProperty "storage"
          swal "", "Debe de seleccionar un almacén.", "warning"
          return false
        # data.transfer = "#{data.transfer.getFullYear()}-#{data.transfer.getMonth()+1}-#{data.transfer.getDate()}"
        $file = $("#ordersfiles")[0]
        if $file.files.length
          data.append "ordersf", $file.files[0]
        for k,v of $scope.orders
          data.append k, v
        data.append "saveOrders", true
        $scope.setToastStatic "Enviado datos al servidor", "upload", 1200, false
        # if nipples.length
        #   data.append "nipples", JSON.stringify nipples
        # console.log $event
        data.append "csrfmiddlewaretoken", $("[name=csrfmiddlewaretoken]").val()
        # save bedside por order
        sendbedside = ->
          defer = $q.defer()
          $.ajax
            url: ""
            data: data
            type: "post"
            dataType: "json"
            processData: false
            contentType: false
            cache: false
            sendBefore: (object, result) ->
              $event.target.disabled = true
              $event.target.innerHTML = """<i class="fa fa-cog fa-spin"></i>"""
              return
            success: (response) ->
              if response.status
                $scope.setToastStatic "Datos almancenados", "tasks", 1200, false
                defer.resolve response.orders
                return
              else
                defer.resolve false
                swal "Error", "al procesar. #{response.raise}", "error"
                $event.target.disabled = false
                $event.target.className = "btn red grey-text text-darken-1"
                $event.target.innerHTML = """<i class="fa fa-timescircle"></i> Error!"""
                return
          return defer.promise
        senddetails = (order) ->
          defer = $q.defer()
          details = []
          for x in $scope.preorders
            if x.status is true
              details.push x
          data =
            'dordersave': true
            'bedside': order
            'details': JSON.stringify details
            'csrfmiddlewaretoken': angular.element("[name=csrfmiddlewaretoken]").val()
          Factory.post data
          .success (response) ->
            if response.status
              defer.resolve response
              return
            else
              $scope.setToastStatic "Error #{response.raise}", "remove"
              defer.resolve false
              return
          return defer.promise
        sendbedside().then (bedside) ->
          if bedside isnt false
            angular.element("#morders").modal 'close'
            # prepare details orders
            senddetails(bedside).then (response) ->
              console.log response
              if typeof response is "object"
                # construct mail for storage
                $scope.setToastStatic "Enviado correo...!", "envelope-o", 3000, false
                mailer =
                  to: "almacen@icrperusa.com" #"cvaldezch@outlook.com" #
                  cc: response.cc
                  subject: "Pedido #{bedside}"
                  body: """<p><strong><strong>#{response.company} |
                  </strong></strong> Operaciones Frecuentes</p>
                  <p>Pedido Generado Número <strong>#{bedside}</strong> |
                  <strong>#{new Date().toString()}</strong></p>
                  <p><strong>Proyecto:&nbsp;#{response.project} #{response.projectname}</strong></p>"""
                mailing.Mailing()
                mailing.geturls().success (rurl) ->
                  if rurl.status
                    mailer['server'] = rurl['servermail']
                    sender = mailing.send(mailer)
                    sender.success (res) ->
                      if res.status
                        $scope.removeToastStatic()
                        return
                        # return
                      else
                        $scope.setToastStatic "Correo no enviado #{res.raise}", "times", 0, false
                        # return
                    # return
                    # show message for user with number of order
                  swal
                    title: "Pedido Generado #{bedside}"
                    text: ''
                    type: 'success'
                    confirmButtonColor: '#039be5'
                    closeOnConfirm: true
                  , (isConfirm) ->
                    location.reload()
                    return
                  return
              else
                setTimeout( ->
                  angular.element("#morders").modal('open');
                  return
                , 600)
              return
            return
        return
    return

    ##
    # end functions for orders
    # end block
    ##

  $scope.validUrl = (file) ->
    uri = "/media/#{file}"
    return uri

  $scope.listPlanes = ->
    $http.get '', params: 'lplanes': true
    .success (response) ->
      console.log response
      if response.status
        $scope.lplanes = response.lplane
        return
      else
        console.error "No se ha podido lista los planos #{response.raise}"
        return
    return

  $scope.uploadPlane = ->
    data =
      'uploadPlane': true
      'plane': $scope.file
      'note': $scope.note
      # 'csrfmiddlewaretoken': angular.element("[name=csrfmiddlewaretoken]").val()
    form = new FormData
    angular.forEach data, (value, key) ->
      form.append key, value
      return
    $http.post "", form, transformRequest: angular.identity, headers: 'Content-Type': undefined
    .success (response, status, headers, config) ->
      if response.status
        angular.element("#mdplane").modal('close')
        $scope.listPlanes()
        return
      else
        swal "Alerta!", "No se a podido subir el archivo.", "error"
        return
    .error (response, status, headers, config) ->
      console.log response
      return
    return

  $scope.showFull = (file) ->
    angular.element("#sPlane > div > iframe").attr("src", $scope.validUrl(file))
    # $scope.sfplane = $sce.trustAsResourceUrl($scope.validUrl(file))
    angular.element("#sPlane").modal('open')
    # console.info $sce.($scope.validUrl(file))
    return

  $scope.delPlane = (plane) ->
    swal
      title: "Realmente desea eliminar el plano?"
      text: ""
      type: "warning"
      showCancelButton: true
      confirmButtonText: 'Si!, Eliminar!'
      confirmButtonColor: '#dd6b55'
      cancelButtonText: 'No'
      closeOnConfirm: true
      closeOnCancel: true
      , (isConfirm) ->
        if isConfirm
          data = new FormData
          data.append 'delplane', true
          data.append 'plane', plane
          $http.post "", data, transformRequest: angular.identity, headers: 'Content-Type': undefined
          .success (response) ->
            if response.status
              $scope.listPlanes()
              return
            else
              swal "Error", "No se a eliminado el plano seleccionado", "error"
              return
          return
    return
  # 2016-11-28 08:54:50 add new modify
  # block modify
  $scope.listTemps = (tp) ->
    Factory.get('lsttemp': true, 'type': tp).
    success (response) ->
      if response.status
        $scope["lst#{tp}"] = response.listtmp
    return

  $scope.enableModify = (index, obj) ->
    $scope.meditindex = index
    $scope.objedit = obj
    $scope.editm['materials'] = $scope.objedit.fields.materials.pk
    $scope.editm['quantity'] = $scope.objedit.fields.quantity
    $scope.editm['brand'] = $scope.objedit.fields.brand.pk
    $scope.editm['model'] = $scope.objedit.fields.model.pk
    $scope.editm['obrand'] = $scope.objedit.fields.brand.pk
    $scope.editm['omodel'] = $scope.objedit.fields.model.pk
    $scope.editm['missingsend'] = $scope.objedit.fields.qorder
    $scope.editm['ppurchase'] = $scope.objedit.fields.ppurchase
    $scope.editm['psales'] = $scope.objedit.fields.psales
    return

  $scope.showEdit = () ->
    if Object.keys($scope.objedit).length > 0
      # $scope.editm['quantity'] = $scope.objedit.fields.quantity
      # $scope.editm['brand'] = $scope.objedit.fields.brand.pk
      # $scope.editm['model'] = $scope.objedit.fields.model.pk
      # $scope.editm['obrand'] = $scope.objedit.fields.brand.pk
      # $scope.editm['omodel'] = $scope.objedit.fields.model.pk
      # $scope.editm['missingsend'] = $scope.objedit.fields.qorder
      angular.element("#msedit").modal 'open'
      setTimeout (->
        angular.element("#edbrand,#edmodel").material_select()
        return
        ), 600
      console.log $scope.objedit
    else
      Materialize.toast "<i class='fa fa-exclamation-circle amber-text'></i>
        &nbsp; Debe de elegir un material para modifcar.", 4400
    return

  $scope.saveModify = ->
    $scope.status = true
    param = $scope.editm
    param['saveModify'] = true
    console.log param
    # f = new FormData()
    # for k, v of param
    #   f.append k, v
    Factory.post(param)
    .success (response) ->
      $scope.status = false
      angular.element("#msedit").modal('close')
      if response.status
        $scope.status = false
        console.log response
        $scope.disableModify()
        $scope.listTemps 'M'
        # $scope.calcApproved()
        return
      else
        Materialize.toast "Error #{response.raise}", 16000
        console.error "Error ", response
    return

  $scope.enableDel = () ->
    if Object.keys($scope.objedit).length > 0
      swal
        title: "Realmente desea eliminar?"
        text: """#{$scope.objedit.fields.materials.fields.matnom}
              #{$scope.objedit.fields.materials.fields.matmed}
               #{$scope.objedit.fields.brand.fields.brand}
               #{$scope.objedit.fields.model.fields.model}
              <br><small>Nota: si se ha realizado pedidos no
              se eliminara por completo quedara registrado
              la cantidad pedida.</small>"""
        type: "warning"
        showCancelButton: true
        confirmButtonColor: "#DD6B55"
        confirmButtonText: "Si!, eliminar"
        closeOnCancel: true
        closeOnConfirm: true
        html: true
      , (isConfirm) ->
        if isConfirm
          console.log "Inside confirm delete material", isConfirm
          param = $scope.editm
          param['deleteReg'] = true
          Factory.post param
          .success (response) ->
            if response.status
              Materialize.toast """<i class="fa fa-check text-red"></i>
                &nbsp;Item registrado para eliminar""", 4000
              $scope.listTemps('D')
              # $scope.calcApproved()
              return
            else
              Materialize.toast "Error: #{response.raise}", 16000
              return
          return
    else
      Materialize.toast "<i class='fa fa-exclamation-circle amber-text'></i>
        &nbsp; Debe de elegir un material para eliminar.", 4400
    return
  # delete by selected items 2017-05-11 17:23:41
  $scope.schkallmodify = ->
    for k, obj of $scope.mchks
      obj['status'] = $scope.schkm
    return
  $scope.checkedDelete = ->
    preload = ->
      defer = $q.defer()
      param = {'param': []}
      for k, obj of $scope.mchks
        if obj['status']
          param['param'].push
            'materials': obj.materials.fields.materials.pk
            'obrand': obj.materials.fields.brand.pk
            'omodel': obj.materials.fields.model.pk
            'quantity': obj.materials.fields.quantity
            'psales': obj.materials.fields.psales
            'ppurchase': obj.materials.fields.ppurchase

      param['status'] = if param['param'].length > 0 then true else false
      defer.resolve param
      return defer.promise
    delchecked = (params) ->
      defer = $q.defer()
      param = {}
      if params.length > 0
        param = params[0]
        params.splice 0, 1
      next = if params.length > 0 then true else false
      param['deleteReg'] = true
      Factory.post param
      .success (response) ->
        if response.status
          defer.resolve {'next': next, 'status': true, 'params': params}
          return
        else
          defer.resolve {'next': next, 'status':false, 'raise': response.raise, 'objerr': param, 'params': params}
          return
      return defer.promise
    execDel = (param) ->
      delchecked(param).then (result) ->
        if result['status']
          if result['next']
            execDel(result['params'])
            return
          else
            $scope.setToastStatic "Items Eliminados", "check", 1800
            $scope.listTemps('D')
            $scope.removeToastStatic()
            return
        else
          $scope.setToastStatic "#{result['raise']} #{result['objerr']}", "ban", 2600
          $scope.removeToastStatic()
          return
      return
    preload().then (param) ->
      if param['status']
        swal
            title: "Realmente desea eliminar los items seleccionados?"
            text: ""
            type: "warning"
            showCancelButton: true
            confirmButtonColor: "#DD6B55"
            confirmButtonText: "Si!, eliminar"
            closeOnCancel: true
            closeOnConfirm: true
            html: true
          , (isConfirm) ->
            if isConfirm
              $scope.setToastStatic "Procesando...!", "cog", "undefined", true
              console.log param
              execDel(param['param'])
            return
          return
      else
        $scope.setToastStatic "No se han seleccionado items", "exclamation", 2800
        return
    return
  $scope.delModifiedNMD = (type) ->
    valid = ->
      defer = $q.defer()
      promises = []
      angular.forEach $scope["lst#{type}"], (obj, index) ->
        if obj.selected
          promises.push 'pk':obj.pk
          return
      $q.all(promises).then (result) ->
        console.log result
        defer.resolve result
        return
      defer.promise
    valid().then (result) ->
      console.info result
      if result.length > 0
        swal
          title: 'Realmente desea eliminar?'
          text: 'Todos los items seleccionados'
          showCancelButton: true
          confirmButtonColor: "#DD6B55"
          confirmButtonText:"Si! eliminar"
          closeOnCancel: true
          closeOnConfirm: true
        , (isConfirm) ->
          if isConfirm
            Materialize.toast """<i class="fa fa-cog fa-spin fa-fw"></i>
               Procesando Transacción...""", "forever", "toast-kill"
            param =
              'delregdel': true
              'data': JSON.stringify result
            Factory.post(param)
            .success (response) ->
              angular.element('.toast-kill').remove()
              if response.status
                $scope.disableModify()
                $scope.listTemps type
                $scope.calcApproved()
                Materialize.toast """<i class='fa fa-trash fa-lg red-text'></i>
                  \ items eliminados!""", 4000
                return
              else
                console.error "Error ", response
                return
            return
        return
      else
        Materialize.toast """<i class="fa fa-exclamation-circle
           fa-lg amber-text"></i>
           Se debe de seleccionar al menos un item""", 4000
        return
    return


  $scope.calcApproved = ->
    # calc amount global
    $scope.pnp = parseFloat($scope.amnp)
    $scope.pns = parseFloat($scope.amns)
    #if type is 'N'
    $scope.pnp += $scope.tmlstN[0]
    $scope.pns += $scope.tmlstN[1]
    #if type is 'M'
    $scope.pnp += $scope.sldm[0][0]
    $scope.pnp -= $scope.sldm[0][1]
    $scope.pns += $scope.sldm[1][0]
    $scope.pns -= $scope.sldm[1][1]
    #if type is 'D'
    $scope.pnp -= $scope.tmlstD[0]
    $scope.pns -= $scope.tmlstD[1]
    $scope.pnp = $scope.pnp
    $scope.pns = $scope.pns
    # difference area current - area new
    rdap = (($scope.amstp - $scope.amnp) + $scope.pnp)
    totalp = ($scope.amsecp - rdap)
    $scope.pgaa = totalp
    rdas = (($scope.amsts - $scope.amns) + $scope.pns)
    totals = ($scope.amsecs - rdas)
    $scope.pgpa = totalp
    $scope.pgsa = totals
    if totalp >= 0
      $scope.mdstatus = true
    else
      $scope.mdstatus = false
    return
  $scope.disableModify = ->
    $scope.meditindex = -1
    $scope.objedit = {}
    $scope.editm = {}
    return

  # other functions
  $scope.toRound = (number) ->
    return ((Math.round(number * 100)) / 100)

  $scope.addfocusNiple = (mid) ->
    $scope.sdnip[mid]=!$scope.sdnip[mid];
    console.log "#nipple#{mid}measure"
    setTimeout ->
      $("#nipple#{mid}measure").focus()
    , 800
    return

  $scope.$watch 'ascsector', ->
    if $scope.ascsector
      $scope.fsl = true
      $scope.fpl = true
      return
  $scope.setToastStatic = (message="", icon="", duration=0, spin=true) ->
    if duration is 0
      duration = "undefined"
    textspin = (spin) ? "fa-spin fa-fw" : ""
    Materialize.toast "<i class='fa fa-#{icon} #{textspin} fa-2x'></i>&nbsp; #{message}", duration, "toast-remove"
    return
  $scope.removeToastStatic = ->
    angular.element ".toast-remove"
      .remove()
    return
  # end block
  calcSumTemp = (arr, type) ->
    if arr isnt undefined
      $scope["tmlst#{type}"] = [0, 0]
      $scope["tmlst#{type}"][0] = arr.reduce((sum, obj) ->
        return sum + (obj.fields.ppurchase * obj.fields.quantity)
      , 0)
      $scope["tmlst#{type}"][1] = arr.reduce((sum, obj) ->
        return sum + (obj.fields.psales * obj.fields.quantity)
      , 0)
      if type == 'M'
        $scope.sldm = [[0, 0], [0, 0]]
        $scope.sldm[0][0] = arr.reduce((sum, obj) ->
          if obj.fields.symbol == '+'
            sum + (obj.fields.ppurchase * obj.fields.quantity)
          else
            sum + 0
        , 0)
        $scope.sldm[0][1] = arr.reduce((sum, obj) ->
          if obj.fields.symbol == '-'
            sum + (obj.fields.ppurchase * obj.fields.quantity)
          else
            sum + 0
        , 0)
        $scope.sldm[1][0] = arr.reduce((sum, obj) ->
          if obj.fields.symbol == '+'
            sum + (obj.fields.psales * obj.fields.quantity)
          else
            sum + 0
        , 0)
        $scope.sldm[1][1] = arr.reduce((sum, obj) ->
          if obj.fields.symbol == '-'
            sum + (obj.fields.psales * obj.fields.quantity)
          else
            sum + 0
        , 0)
      setTimeout (->
        $scope.calcApproved()
        return
        ), 1200
    return
  $scope.$watch 'lstN', (nw, old)->
    if nw isnt undefined
      calcSumTemp nw, 'N'
    return
  $scope.$watch 'lstM', (nw, old)->
    if nw isnt undefined
      calcSumTemp nw, 'M'
    return
  $scope.$watch 'lstD', (nw, old)->
    if nw isnt undefined
      calcSumTemp nw, 'D'
    return
  $scope.$watch 'dsmaterials', (nw, old) ->
    if nw
      count = 0
      for k of $scope.dsmaterials
        if $scope.dsmaterials[k].fields.nipple
          count++
      if count
        $scope.snipple = true
        setTimeout ->
          $('.collapsible').collapsible()
          return
        , 800
    return
  $scope.$watch 'gui.smat', ->
    $(".floatThead").floatThead 'reflow'
    return
  return
