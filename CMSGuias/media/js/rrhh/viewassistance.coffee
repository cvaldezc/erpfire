do ->

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

  ctrlType = ($scope, cpFactory) ->
    vm = this
    vm.bdata = []
    vm.settings = {}
    vm.order = 'name'
    vm.assistance =
        'type': null
        'project': null
    angular.element(document).ready ->
        console.info "I am ready!"
        angular.element(".modal").modal dismissible: false
        angular.element(".datepick").pickadate
            selectMonths: true
            selectYears: 5
            container: 'body'
            format: 'yyyy-mm-dd'
        vm.gettypes()
        vm.getrltypes()
        vm.getProjects()
        return

    vm.changerange = ->
        dt = new Date(vm.search.fi)
        dt.setDate(dt.getDate() + 7)
        month = dt.getMonth() + 1
        day = dt.getDate()
        vm.search.ff = "#{dt.getFullYear()}-#{if month<10 then '0' + month else month}-#{if day < 10 then '0' + day else day}"
        return

    vm.getrltypes = ->
        cpFactory.get 'lrtypes': true
        .success (response) ->
            if response.status
                vm.rltypes = response.ltypes
                return
            else
                Materialize.toast "Error: #{response.raise}", 4000
                return
        return

    vm.getProjects = ->
        cpFactory.get 'projects': true
        .success (response) ->
            if response.status
                vm.projects = response.projects
                return
            else
                Materialize.toast "Error: #{response.raise}", 4000
                return
        return

    vm.gettypes = ->
        cpFactory.get 'gtypes': true
        .success (response) ->
            if response.status
                vm.ltypes = response.types
                setTimeout (->
                    angular.element(".make_select").material_select('update')
                    return
                    ), 800
                return
            else
                Materialize.toast "Error: #{response.raise}", 4000
                return
        return

    vm.getAssistance = ->
        params =
            'filterAssistance': true
            weekstart: vm.search.fi
            weekend: vm.search.ff
            type: vm.search.types
        cpFactory.get params
        .success (response) ->
            if response.status
                vm.bdata = response.week
                vm.dnames = response.names
                vm.settings.tth = response.thour
                return
            else
                Materialize.toast "Error: #{response.raise}"
                return
        return

    vm.getRegisterAssistance = (dni, day) ->
        params =
            'getday': true
            'day': day
            'dni': dni
        cpFactory.get params
        .success (response) ->
            if response.status
                vm.hoursload = response.hours
                return
            else
                Materialize.toast "Error: #{response.raise}"
                return
        return

    vm.showEdit = (obj, nob) ->
        # console.info obj
        vm.showlist = obj
        vm.showlist['nameday'] = nob.nmo
        dt = if obj['days'][nob.nmo]['day'] isnt null then obj['days'][nob.nmo]['day'] else nob.date
        vm.showlist['date'] = dt
        vm.getRegisterAssistance(obj.dni, dt)
        angular.element("#medit").modal('open')
        return
    # delete assistance
    vm.deleteAssistance = (obj) ->
      swal
        title: "Realmente desea quitar la asistencia?"
        text: "#{obj.fields.assistance}"
        confirmButtonText: "Si!, eliminar"
        cancelButtonText: "No!"
        confirmButtonColor: "#dd5b66"
        closeOnConfirm: true
        closeOnCancel: true
      , (isConfirm) ->
        if isConfirm
          params =
            deleteAssistance: true
            pk: obj.pk
            dni: obj.fields.employee
            date: obj.fields.assistance
          cpFactory.post params
          .success (response) ->
            if response.status
              vm.getRegisterAssistance(obj.fields.employee, obj.fields.assistance)
              vm.getAssistance()
              return
            else
              Materialize.toast "Error: #{response.raise}", 4000
              return
      return
    # open controls
    vm.openControls = (obj={}) ->
        vm.assistance.date = vm.showlist.date
        vm.assistance.dni = vm.showlist.dni
        if (vm.showlist.days[vm.showlist.nameday].day isnt null and obj.hasOwnProperty('hin'))
            console.info "Show object for modify"
            vm.assistance.hin = obj.fields.hourin
            vm.assistance.hout = obj.fields.hourout
            vm.assistance.hinb = obj.fields.hourinbreak
            vm.assistance.houtb = obj.fields.houroutbreak
            vm.assistance.viatical = parseFloat(obj.fields.viatical)
            vm.assistance.project = if obj.fields.project isnt null then obj.fields.project.pk else null
            vm.assistance.type = obj.fields.types.pk
            vm.assistance.modifyassistance = true
            vm.assistance.pkassistance = obj.pk
        angular.element("#mcontrols").modal "open"
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
      if not vm.assistance.hasOwnProperty 'discount'
        vm.assistance.discount = 0
      prms = vm.assistance
      prms['saveAssistance'] = true
      console.info prms
      cpFactory.post prms
      .success (response) ->
        if response.status
          vm.getRegisterAssistance(vm.assistance.dni, vm.assistance.date)
          vm.getAssistance()
          Materialize.toast "<i class='fa fa-check fa-lg green-text'></i>&nbsp;Asistencia Registrada!", 2600
          vm.assistance.dni = ''
          vm.assistance.name = ''
          vm.assistance.hin = ''
          vm.assistance.hout = ''
          angular.element("#mcontrols").modal 'close'
          return
        else
          Materialize.toast "<i class='fa fa-times fa-lg red-text'></i>&nbsp;Error: #{response.raise}", 8000
          return
      return
    $scope.$watch 'vm.assistance.project', (nw, old) ->
      tp = angular.element("#types")[0]
      if nw is '-' or nw is null
        tp.removeAttribute 'disabled'
        vm.assistance.type = null
        return
      else
        vm.assistance.type = 'TY02'
        tp.setAttribute 'disabled', 'disabled'
        return
    $scope.$watch 'vm.assistance.type', (nw, old) ->
      if nw is 'TY02' and vm.assistance.project is null
        vm.assistance.type = null
        return
    return
    ## ctrlType
    return

  'use strict'
  app = angular.module('assApp', ['ngCookies'])
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
  app.controller 'assCtrl', ctrlType
  ctrlType.inject = [
    '$scope'
    'cpFactory'
  ]
  return
