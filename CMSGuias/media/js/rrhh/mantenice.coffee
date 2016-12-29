do ->
  
  cpFactory = ($http, $cookies) ->
    $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-urlencoded'
    {
      get: (options={}) ->
        $http.get "", params: options

      post: (options={}) ->
        fd = ->
          form = new FormData()
          for k, v of options
            form.append k, v
          return form
        $http.post "", fd(), transformRequest: angular.identity, headers: 'Content-Type': undefined
    }

  ctrl = ($scope, cpFactory) ->

    vm = this
    vm.settings = {}
    angular.element(document).ready ->
      vm.getdata()
      console.info "Yes! load data."
      return
    vm.getdata = ->
      prms =
        'getsettings': true
      cpFactory.get(prms)
      .success (response) ->
        if response.status
          vm.settings = response.settings[0].fields
          return
        else
          console.log "Error: #{response.raise}"
          return
      return
    vm.saveSettings = ->
      prms = vm.settings
      prms['savesettings'] = true
      cpFactory.post(prms)
      .success (response) ->
        if response.status
          location.reload()
          return
        else
          Materialize.toast "Error: #{response.raise}", 4000
          return
      return
    # vm.main()
    ## ctrl
    return

  'use strict'
  app = angular.module('manApp', ['ngCookies'])
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

  app.controller 'ctrl', ctrl
  ctrl.inject = [
    '$scope'
    'cpFactory'
  ]
  return
