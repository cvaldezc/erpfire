do ->

  cpFactory = ($http, $cookies)->
    {
      get: (options) ->
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

  ctrl = ($scope, cpFactory) ->

    vm = this
    angular.element(document).ready ->
      angular.element(".modal").modal()
      vm.loadList()
      return

    vm.addStatus = ->
      vm.status =
        'description': ''
        'pk': ''
        'payment': false
      angular.element("#mstatus").modal "open"
      return

    vm.loadList = ->
      Materialize.toast "<i class='fa fa-circle-o-notch fa-spin fa-fw fa-2x'></i>", "infinity", "toast-remove transparent grey-text text-darken-3"
      cpFactory.get 'getstatus': true
      .success (response) ->
        angular.element(".toast-remove").remove()
        if response.status
          vm.lstatus = response.lstatus
          return
        else
          Materialize.toast "Error: #{response.raise}", 4000
          return
      return

    vm.loadmodify = (obj)->
      vm.status =
        'description': obj.fields.description
        'pk': obj.pk
        'payment': obj.fields.payment
      angular.element("#mstatus").modal "open"
      return
    
    vm.saveStatus = ->
      Materialize.toast "<i class='fa fa-cogs fa-fw fa-spin fa-2x'></i> Procesando...", "infinity", "toast-remove"
      params =
        'description': vm.status.description
        'payment': vm.status.payment
      if vm.status.pk isnt ''
        params['pk'] = vm.status.pk
      params['savestatus'] = true
      cpFactory.post params
      .success (response) ->
        angular.element(".toast-remove").remove()
        if response.status
          vm.loadList()
          angular.element("#mstatus").modal "close"
          return
        else
          Materialize.toast "Error: #{response.raise}", 4000
          return
      return

    vm.deleteStatus = (pk) ->
      swal
        title: 'Realmente desea eliminar el Estado?'
        text: ''
        showCancelButton: true
        confirmButtonColor: "#dd6b55"
        cancelButtonColor: "#616161"
        closeOnConfirm: true
        closeOnCancel: true
      , (isConfirm) ->
        if isConfirm
          prm =
            'pk': pk
            'delete': true
          cpFactory.post prm
          .success (response) ->
            if response.status
              if response.hasOwnProperty('msg')
                Materialize.toast "#{response.msg}", 12000
              vm.loadList()
              return
            else
              Materialize.toast "Error: al eliminar. #{response.raise}", 4000
              return
          return
      return

    ## ctrl
    return

  'use strict'
  app = angular.module('statusapp', ['ngCookies'])
  app.config ($httpProvider) ->
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
    $httpProvider.defaults.xsrfCookieName = 'csrftoken'
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken'
    return

  app.factory 'cpFactory', cpFactory 
  cpFactory.inject = [
    '$http'
    '$cookies']
  
  app.controller 'ctrl', ctrl
  ctrl.inject = [
    '$scope'
    'cpFactory']
  return
