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
    angular.element(document).ready ->
        angular.element(".datepick").pickadate
            selectMonths: true
            selectYears: 5
            container: 'body'
            format: 'yyyy-mm-dd'
        vm.getTypes()
        vm.getPayment()
        return
    # Types
    vm.getTypes = ->
        cpFactory.get gettypes: true
        .success (response) ->
            if response.status
                vm.types = response.types
                setTimeout (->
                    angular.element(".make_select").material_select('destroy')
                    angular.element(".make_select").material_select()
                    return
                    ), 800
                return
            else
                Materialize.toast "Error: #{response.raise}", 4000
                return
        return
    # payment
    vm.getPayment = ->
        cpFactory.get getpayment: true
        .success (response) ->
            if response.status
                vm.payment = response.payment
                return
            else
                Materialize.toast "Error: #{response.raise}", 4000
                return
        return
    # change
    vm.changeSelected = ->
        if vm.assistance.payment is null
            Materialize.toast "Seleccione Tipo de Pago", 4000
            return false
        dt = new Date(vm.assistance.din)
        dt.setDate(dt.getDate() + vm.assistance.payment)
        month = dt.getMonth() + 1
        day = dt.getDate()
        vm.assistance.dout = "#{dt.getFullYear()}-#{if month<10 then '0' + month else month}-#{if day < 10 then '0' + day else day}"
        return
    # export
    vm.saveExportData = (type) ->
        params = vm.assistance
        params['tfile'] = type
        params['exportdata'] = true
        window.open "?#{angular.element.param(params)}", "_blank"
        # Materialize.toast "<i class='fa fa-circle-o-notch fa-fw fa-spin fa-2x'>", 'infity', 'toast-remove'
        # cpFactory.post params
        # .success (response) ->
        #     angular.element(".toast-remove").remove()
        #     if response
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
