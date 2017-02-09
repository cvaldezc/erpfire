do ->

  cpFactory = ($http, $cookies) ->
    $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-urlencoded'
    {
      get:(options={}) ->
        return $http.get "", params: options

      post: (options={}) ->
        fd = ->
          form = new FormData()
          for k, v of options
            form.append k, v
          return form
        $http.post "", fd(), transformRequest: angular.identity, headers: 'Content-Type': undefined
    }

  ctrlList = ($scope, $log, $q, cpFactory) ->
    vm = this
    vm.order = 'fields.lastname'
    vm.lprojects = []
    vm.assistance =
      project: null
      type: ''
    angular.element(document).ready ->
      $log.warn new Date()
      console.log vm
      vm.listtype()
      vm.listEmployee()
      vm.listProject()
      angular.element(".modal").modal dismissible: false
      angular.element(".datepicker").pickadate
        container: 'body'
        format: "yyyy-mm-dd"
        max: new Date()
        selectMonths: true
        onStart: ->
          date = new Date()
          this.set('select',
            [date.getFullYear(), date.getMonth(), date.getDate()])
          return
      return

    vm.listtype = ->
      cpFactory.get gettypes: true
      .success (response) ->
        if response.status
          vm.ltypes = response.types
          return
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

    vm.listProject = ->
      cpFactory.get gproject: true
      .success (response) ->
        if response.status
          vm.lprojects = response.projects
          setTimeout (->
            angular.element(".chosen-select").chosen width: "100%"
            return
            ), 800
        else
          Materialize.toast "No se cargados los datos #{response.raise}", 2600
          return
      return

    vm.openAssistance = (obj) ->
      vm.assistance.name = "#{obj.fields.lastname} #{obj.fields.firstname}"
      vm.assistance.dni = obj.pk
      angular.element("#modal1").modal 'open'
      return
    vm.saveAssistance = ->
      if vm.assistance.type is null
        Materialize.toast "<i class='fa fa-exclamation-circle amber-text fa-lg'></i>&nbsp;Debe seleccionar un tipo de asistencia", 4000
        return false
      if vm.assistance.hasOwnProperty('hin')
        switch vm.assistance.hin
          when '00:00', null, ''
            Materialize.toast "<i class='fa fa-exclamation-circle amber-text fa-lg'></i>&nbsp;Debe de Ingresar hora de entrada!", 4000
            return false
      else
        Materialize.toast "<i class='fa fa-exclamation-circle amber-text fa-lg'></i>&nbsp;Debe de Ingresar hora de entrada!", 4000
        return false
      if vm.assistance.hasOwnProperty('hout')
        switch vm.assistance.hout
          when '00:00', null, ''
            Materialize.toast "<i class='fa fa-exclamation-circle amber-text fa-lg'></i>&nbsp;Debe de Ingresar hora de Salida!", 4000
            return false
      else
        Materialize.toast "<i class='fa fa-exclamation-circle amber-text fa-lg'></i>&nbsp;Debe de Ingresar hora de Salida!", 4000
        return false
      if not vm.assistance.hasOwnProperty 'hinb'
        vm.assistance.hinb = '00:00'
      if not vm.assistance.hasOwnProperty 'houtb'
        vm.assistance.houtb = '00:00'
      if not vm.assistance.hasOwnProperty 'viatical'
        vm.assistance.viatical = 0
      else
        switch vm.assistance.viatical
          when '', undefined, null
            vm.assistance.viatical = 0
      prms = vm.assistance
      prms['saveAssistance'] = true
      console.info prms
      cpFactory.post prms
      .success (response) ->
        if response.status
          Materialize.toast "<i class='fa fa-check fa-lg green-text'></i>&nbsp;Asistencia Registrada!", 2600
          vm.assistance.dni = ''
          vm.assistance.name = ''
          vm.assistance.hin = ''
          vm.assistance.hout = ''
          angular.element("#modal1").modal 'close'
          return
        else
          Materialize.toast "<i class='fa fa-times fa-lg red-text'></i>&nbsp;Error: #{response.raise}", 8000
          return
      return
    ## ctrlList
    ## 
    $scope.$watch 'vm.assistance.project', (nw, old) ->
      tp = angular.element("#types")[0]
      if nw is '-' or nw is null
        tp.removeAttribute 'disabled'
        vm.assistance.type = null
        return
      else
        vm.assistance.type = 'TY01'
        tp.setAttribute 'disabled', 'disabled'
        return
    $scope.$watch 'vm.assistance.type', (nw, old) ->
      if nw is 'TY02' and vm.assistance.project is null
        vm.assistance.type = null
        return
    return

  'use strict'
  app = angular.module('appList', ['ngCookies'])
  app.config ($httpProvider) ->
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
    $httpProvider.defaults.xsrfCookieName = 'csrftoken'
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken'
    return

  app.directive 'formattime', valFormatTime
  app.directive 'valminandmax', valMinandMax

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
