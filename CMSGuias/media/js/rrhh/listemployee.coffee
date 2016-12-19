do ->
  ctrlList = ($scope, $log, $q, cpFactory) ->
    vm = this
    vm.order = 'fields.lastname'
    angular.element(document).ready ->
      $log.warn new Date()
      console.log vm
      vm.listEmployee()
      return
    
    vm.orderlist = (order) ->
      switch order
        when 'lastname'
          vm.order = if vm.order is 'fields.lastname' then '-fields.lastname' else 'fields.lastname'
        when 'id'
          vm.order = if vm.order is 'pk' then '-pk' else 'pk'
        when 'cargo'
          vm.order = if vm.order is 'fields.charge.fields.cargos' then '-fields.charge.fields.cargos' else 'fields.charge.fields.cargos'
      return

    vm.listEmployee = ->
      cpFactory.get glist: true
      .success (response) ->
        if response.status
          vm.list = response.employee
          return
        else
          Materialize.tosat "No hay datos para mostrar!", 3000
          return
      return

    vm.main = ->
      $log.info 'main ctrlList...'
      $log.info new Date()
      return

    # vm.main()
    ## ctrlList
    return

  cpFactory = ($http, $cookies) ->
    # $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken
    # $http.defaults.headers.post['Content-Type'] =
    # 'application/x-www-urlencoded'
    {
      get:(options={}) ->
        return $http.get "", params: options
    }

  'use strict'
  app = angular.module('appList', ['ngCookies'])
  app.config ($httpProvider) ->
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
    $httpProvider.defaults.xsrfCookieName = 'csrftoken'
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken'
    return

  app.factory 'cpFactory', cpFactory
  cpFactory.inject = [
    '$http'
    '$cookies'
  ]
  app.controller 'ctrlList', ctrlList
  ctrlList.inject = [
    '$scope'
    '$log'
    '$q'
    'cpFactory'
  ]
  return
