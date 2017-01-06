do ->

  cpFactory = ($http, $cookies, $log) ->
    {
      get: (options) ->
        $http.get "", params: options
    }

  ctrload = ($scope, $log, cpFactory) ->

    vm = this
    vm.files = []
    angular.element(document).ready ->
      vm.main()
      return

    vm.main = ->
      $log.info 'main ctrload...'
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

  app.directive 'loadFiles', loadFiles

  app.factory 'cpFactory', cpFactory
  cpFactory.inject = [
    '$http'
    '$cookies'
    '$log'
  ]

  app.controller 'ctrload', ctrload
  ctrload.inject = [
    '$scope'
    '$log'
    'cpFactory']
  return
