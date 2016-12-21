do ->
  
  ctrlType = ($scope, cpFactory) ->
    vm = this

    angular.element(document).ready ->
      angular.element('.modal').modal dismissible: false
      vm.getTypes()
      return

    vm.getTypes = ->
      cpFactory.get ltypes: true
      .success (response) ->
        if response.status
          vm.ltypes = response.types
          return
        else
          Materialize.toast "No se han encontrado datos #{response.raise}", 2600
          return
      return

    vm.showNew = ->
      vm.types =
        desc: ''
        pk: ''
      angular.element("#mtypes").modal 'open'
      return
    
    vm.saveType = ->
      prms = new Object()
      if Object.keys(vm.types).indexOf('pk') isnt -1
        if vm.types.pk isnt undefined and vm.types.pk isnt ""
          prms['new'] = true
      if vm.types.desc is "" or vm.types.desc is undefined
        Materialize.toast """<i class="fa fa-warning-circle"></i>
        La descripción no debe estar vacia!""", 4000
        return false
      prms['desc'] = vm.types.desc
      if not prms.hasOwnProperty 'new'
        prms['modify'] = true
      cpFactory.post prms
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
