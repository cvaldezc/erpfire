do ->

  ctrlType = ($scope, cpFactory) ->
    vm = this
    vm.processsave = false
    angular.element(document).ready ->
      angular.element('.modal').modal dismissible: false
      vm.getTypes()
      return

    vm.getTypes = ->
      cpFactory.get ltypes: true
      .success (response) ->
        if response.status
          vm.ltypes = response.types
          setTimeout (->
            drop = angular.element('.dropdown-activates')
            angular.forEach drop, (elem, index) ->
              # console.log elem
              elem.setAttribute('data-activates', "dropdown#{index}")
              return
            drop.dropdown
              constrain_width: false
            return
            ), 800
          return
        else
          Materialize.toast "No se han encontrado datos #{response.raise}", 2600
          return
      return

    vm.showNew = ->
      vm.types =
        desc: ''
        starthour: ''
        pk: ''
      angular.element("#mtypes").modal 'open'
      return

    vm.showModify = (obj) ->
      vm.types =
        desc: obj.fields.description
        pk: obj.pk
        starthour: obj.fields.starthour
      angular.element("#mtypes").modal 'open'
      # $scope.$render()
      return

    vm.saveType = ->
      prms = new Object()
      if Object.keys(vm.types).indexOf('pk') isnt -1
        if vm.types.pk is ""
          prms['new'] = true
      if vm.types.desc is "" or vm.types.desc is undefined
        Materialize.toast """<i class="
          fa fa-exclamation-circle fa-2x amber-text"></i>
          \ La descripción no debe estar vacia!""", 4000
        return false
      prms['desc'] = vm.types.desc
      prms['starthour'] = vm.types.starthour
      if not prms.hasOwnProperty 'new'
        prms['modify'] = true
        prms['pk'] = vm.types.pk
      vm.processsave = true
      cpFactory.post prms
      .success (response) ->
        vm.processsave = false
        if response.status
          vm.getTypes()
          angular.element("#mtypes").modal 'close'
          return
        else
          Materialize.toast "Error: #{response.raise}", 4000
          return
      return
    
    vm.deleteType = (obj) ->
      swal
        title: "Realmente desea eliminar?"
        text: "#{obj.pk} #{obj.fields.description}"
        showCancelButton: true
        confirmButtonColor: "#dd6d55"
        confirmButtonText: "Si!, eliminar"
        cancelButtonText: "No"
        closeOnConfirm: true
        closeOnCancel: true
      , (isConfirm) ->
        if (isConfirm)
          prms = obj
          prms['delete'] = true
          cpFactory.post(prms)
          .success (response) ->
            if response.status
              vm.getTypes()
              return
            else
              Materialize.toast "Error: #{response.raise}", 4000
              return
          return
      return
    ## ctrlType
    return

  cpFactory = ($http, $cookies) ->
    {
      get: (options={}) ->
        $http.get "", params: options

      post: (options={}) ->
        $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken
        $http.defaults.headers
        .post['Content-Type'] = 'application/x-www-form-urlencoded'
        fd = (options={}) ->
          form = new FormData()
          for k, v of options
            form.append k, v
          return form
        $http.post "", fd(options),
          transformRequest: angular.identity, headers: 'Content-Type': undefined
    }

  'use strict'
  app = angular.module('appType', ['ngCookies'])
  app.config ($httpProvider) ->
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
    $httpProvider.defaults.xsrfCookieName = 'csrftoken'
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken'
    return

  app.factory 'cpFactory', cpFactory
  cpFactory.inject =[
    '$http'
    '$cookies'
  ]
  app.controller 'ctrlType', ctrlType
  ctrlType.inject = [
    '$scope'
    'cpFactory'
  ]
  return
