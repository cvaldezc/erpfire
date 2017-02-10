do ->

  ctrlType = ($scope, cpFactory) ->
    vm = this
    vm.bdata = []
    vm.settings = {}
    vm.order = 'name'
    angular.element(document).ready ->
        console.info "I am ready!"
        angular.element(".modal").modal()
        angular.element(".datepick").pickadate
            selectMonths: true
            selectYears: 5
            container: 'body'
            format: 'yyyy-mm-dd'
        vm.gettypes()
        return

    vm.changerange = ->
        dt = new Date(vm.search.fi)
        dt.setDate(dt.getDate() + 7)
        month = dt.getMonth() + 1
        day = dt.getDate()
        vm.search.ff = "#{dt.getFullYear()}-#{if month<10 then '0' + month else month}-#{if day < 10 then '0' + day else day}"
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
    vm.showEdit = (obj) ->
        console.info obj
        angular.element("#medit").modal('open')
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
