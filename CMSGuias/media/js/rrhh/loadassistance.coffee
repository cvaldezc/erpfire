do ->
  cpFactory = ($http, $cookies) ->
    $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-urlencoded'
    {
      get: (options) ->
        $http.get "", params: options
      post: (options) ->
        frm = () ->
          form = new FormData()
          for k, v of options
            form.append k, v
          return form
        $http.post "", frm(), transformRequest: angular.identity, 'headers': 'Content-Type': undefined
    }

  ctrload = ($scope, cpFactory) ->
    vm = this
    vm.files = []
    vm.lock = false
    vm.btnlock = false
    vm.loadfiles = ->
      swal
        title: 'Realmente desea cargar el/los Tareo(s)?'
        text: ''
        # type: 'warning'
        showCancelButton: true
        confirmButtonColor: "#f44336"
        cancelButtonColor: "#616161"
        confirmButtonText: "Si!"
        closeOnCancel: true
        closeOnConfirm: true
      , (isConfirm) ->
        if isConfirm
          vm.lock = true
          Materialize.toast "<i class='fa fa-circle-o-notch fa-2x fa-spin fa-fw'></i> Cargando archivos", "infinity", "toast-remove"
          prm =
            'loadfiles': true
            'files': angular.element("#tareo")[0].files[0]
          cpFactory.post(prm)
          .success (response) ->
            vm.lock = false
            angular.element(".toast-remove").remove()
            if response.status
              Materialize.toast "<i class='fa fa-check fa-2x green-text'></i> Los Datos han sido cargados!", 6000
              vm.log = response
              return
            else
              Materialize.toast("Error: #{response.raise}", 4000)
              return
          return
          # console.log " ", isConfirm
      return

    ## ctrload
    return

  'use strict'
  app = angular.module('lapp', ['ngCookies'])
  app.config ($httpProvider) ->
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
    $httpProvider.defaults.xsrfCookieName = 'csrftoken'
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken'
    return
  app.directive 'availablefile', ->
    link: (scope, element, attrs) ->
      element.bind 'change', ->
        if element.files.length
          element.attr('disabled', true)
          return
        else
          element.removeAttr 'disabled'
          return
      return
  # app.directive 'loadFiles', loadFiles
  app.factory 'cpFactory', cpFactory
  cpFactory.inject = [
    '$http'
    '$cookies'
  ]
  app.controller 'ctrload', ctrload
  ctrload.inject = [
    '$scope'
    'cpFactory']
  return
