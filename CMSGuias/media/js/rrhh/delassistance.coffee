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

    delctrl = ($scope, cpFactory) ->

        vm = this
        vm.delete = {}
        angular.element(document).ready ->
            angular.element(".datepicka").pickadate
                selectMonths: true
                selectYears: 15
                container: 'body'
                format: 'yyyy-mm-dd'
            angular.element(".make_select").material_select()
            vm.main()
            return

        vm.main = ->
            console.info 'main delctrl...'
            return

        vm.deleteAssistance = ->
            swal
                title: "Realamente Desea eliminar los datos registrados en el rango ingresado"
                text: ''
                type: 'warning'
                showCancelButton: true
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Si, eliminar!",
                cancelButtonText: "No",
                closeOnConfirm: true,
                closeOnCancel: true
            , (isConfirm) ->
                if isConfirm
                    Materialize.toast '<i class="fa fa-circle-o-notch fa-spin fa-fw fa-2x"></i>&nbsp;Procesando...', 'infinity', 'removetoast'
                    param = vm.delete
                    param['deleteAssistance'] = true
                    cpFactory.post param
                    .success (response) ->
                        angular.element('.removetoast').remove()
                        if response.status
                            Materialize.toast '<i class="fa fa-check fa-2x green-text"></i>&nbsp;Se elimino', 1200
                            setTimeout (->
                                location.reload()
                                return
                                ), 1200
                        else
                            Materialize.toast "Error: #{response.raise}", 4000
                            return
            return
        ## delctrl
        return

    'use strict'
    app = angular.module('delApp', ['ngCookies'])
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
    app.controller 'delctrl', delctrl
    delctrl.inject = [
        '$scope'
        'cpFactory'
    ]
    return
