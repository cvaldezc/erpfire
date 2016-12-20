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
      if Objet
      return
    ## ctrlType
    return
  
  cpFactory = ($http, $cookies) ->
    {
      get: (options={}) ->
        $http.get "", params: options
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
