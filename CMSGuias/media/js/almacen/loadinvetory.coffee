app = angular.module 'inventoryApp', ['ngCookies']

app.config ($httpProvider) ->
  $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
  $httpProvider.defaults.xsrfCookieName = 'csrftoken'
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken'
  return

app.directive 'fileModel', ($parse) ->
  restrict: 'A'
  link: (scope, element, attrs) ->
    model = $parse(attrs.fileModel)
    modelSetter = model.assign
    element.bind 'change', ->
      scope.$apply ->
        modelSetter(scope, element[0].files[0])
        return
      return
    return

factories = ($http, $cookies) ->
  $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken
  $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
  obj = new Object
  formd = (options = {}) ->
    form = new FormData()
    for k, v of options
      form.append k, v
    return form
  obj.getMaterials = (options = {}) ->
    $http.get "", params: options
  obj.getDetails = (options = {}) ->
    $http.get "", params: options
  obj.loadInventory = (options = {}) ->
    obj.post(options)
  obj.delInventory = (options = {}) ->
    obj.post(options)
  obj.sendOrder = (options = {}) ->
    obj.post(options)
  obj.post = (options = {}) ->
    $http.post "", formd(options), transformRequest: angular.identity, headers: 'content-Type': undefined

  obj

app.factory 'inventoryFactory', factories

controller = ($scope, $timeout, $q, inventoryFactory) ->

  $scope.lstinv = []
  $scope.parea = ''
  $scope.pcargo = ''
  $scope.ginit = false
  $scope.adjust = {}

  angular.element(document).ready ->
    prms =
      getmat: true
      desc: ''
    inventoryFactory.getMaterials prms
    .success (response) ->
      if response.status
        console.log response
        $scope.lstinv = response.materials
        $scope.ginit = true
        return
    angular.element('.modal').modal()
    #, 'open'
    #   dismissible: false
    return

  $scope.getMaterials = ($event) ->
    if $event.keyCode == 13
      $scope.getdescription()
      return

  $scope.getdescription = ->
    prms =
        'getmat': true
        'desc': $scope.desc
      $scope.ginit = false
      inventoryFactory.getMaterials prms
      .success (response) ->
        if response.status
          console.log response
          $scope.lstinv = response.materials
          console.info $scope.lstinv
          $scope.ginit = true

        else
          console.error "Error #{response.raise}"
        return
      return

  $scope.getDetails = (matid) ->
    prms =
      details: true
      materials: matid
    inventoryFactory.getDetails prms
    .success (response) ->
      if response.status
        $scope.details = response.materials
        $scope.amount = response.amount
        angular.element("#mdetails").modal 'open',
          dismissible: false
        return
      else
        console.error "Error #{response.raise}"
        return
    return

  $scope.delInventory = ->
    swal
      title: 'Eliminar todo el Inventario?'
      text: ''
      type: 'warning'
      confirmButtonColor: "#dd6b55"
      confirmButtonText: "Si!, eliminar"
      showCancelButton: true
      closeOnConfirm: true
      closeOnCancel: true
    , (isConfirm) ->
      console.log isConfirm
      if isConfirm
        $scope.bdel = !$scope.bdel
        prms =
          'delInventory': true
        inventoryFactory.delInventory(prms)
        .success (response) ->
          console.info response
          if response.status and typeof(response.raise) == 'boolean'
            Materialize.toast "<i class='fa fa-check fa-2x green-text'></i>&nbsp;&nbsp;Eliminación Completa!", 4000
            $timeout ->
              location.reload()
              return
            , 4000
            return
          else
            $scope.bdel = false
            Materialize.toast "<i class='fa fa-times fa-2x red-text'></i>&nbsp;&nbsp;Eliminación abortada!&nbsp;<p>#{response.raise}</p>", 4000
            return
        console.log "Inventory Delete"
      return
    return

  $scope.loadInventory = ->
    swal
      title: 'Desea cargar al Inventario?'
      text: ''
      type: 'warning'
      confirmButtonColor: "#dd6b55"
      confirmButtonText: "Si!, cargar"
      showCancelButton: true
      closeOnConfirm: true
      closeOnCancel: true
    , (isConfirm) ->
      $scope.bload = !$scope.bload
      # console.log isConfirm
      if isConfirm
        if $scope.fload is `undefined`
          Materialize.toast "<i class='fa fa-exclamation amber-text fa-2x'></i>&nbsp;Seleccione un Archivo!", 5000
          return false
        prms =
          loadInventory: true
          fload: $scope.fload
        inventoryFactory.loadInventory prms
        .success (response) ->
          if response.status
            Materialize.toast "<i class='fa fa-check green-text'></i>&nbsp; Archivo Cargado!", 4000
            $timeout ->
              angular.element("#mupload").modal('close')
              $scope.bload = !$scope.bload
              return
            , 4000
            return
          else
            $scope.bload = !$scope.bload
            Materialize.toast "<i class='fa fa-times red-text'></i>&nbsp;Error al Cargar los datos. #{response.raise}", 4000
            return
        return
    return

  $scope.loadOrderStk = ->
    swal
      title: "Ingrese Nro de Pedido:"
      type: "input"
      showCancelButton: true
      closeOnConfirm: true
      animation: 'slide-from-top'
      inputPlaceholder: "PEAA000000"
    , (inputval) ->
      if inputval is false
        return false
      if inputval is ""
        Materialize.toast "No puede estar Vacio!", 3600
        return false
      if inputval.length < 10
        Materialize.toast "Formato Incorrencto!", 3600
        return false
      prms =
        putorder: true
        order: inputval
      inventoryFactory.sendOrder(prms)
      .success (response) ->
        if response.status
          Materialize.toast "Tarea Finalizada!", 3600
          $timeout ->
            location.reload()
          , 3600
          return
        else
          Materialize.toast "Error! #{response.raise}", 3600
          return
    return
  #
  # @Christian 2017-06-30 17:55:04
  # add function for adjust stock in inventoryBrand
  $scope.openAdjustQuantity = (obj) ->
    angular.element("#madjust").modal('open')
    $scope.adjust = obj
    return

  $scope.adjustStock = ->
    Materialize.toast 'Procesando...!', undefined, 'toast-remove'
    param =
      adjustStk: true
      stk: $scope.adjust.fields.stock
      materials: $scope.adjust.fields.materials.pk
      brand: $scope.adjust.fields.brand.pk
      model: $scope.adjust.fields.model.pk
    inventoryFactory.post(param).then (
      (response) ->
        angular.element('.toast-remove').remove()
        if response['data']['status'] and response.status == 200
          Materialize.toast 'Transacción Correcta!', 2600
          $scope.desc = $scope.adjust.fields.materials.fields.matnom
          angular.element("#madjust").modal('close')
          $scope.adjust = {}
          $scope.getdescription()
          # console.info(response)
          return
    )
    .catch(
      (err) ->
        console.error("ERROR post ", err)
        return
    )
    return
  # 2017-06-30 17:55:38
  #end block

  return

app.controller 'inventoryCtrl', controller
