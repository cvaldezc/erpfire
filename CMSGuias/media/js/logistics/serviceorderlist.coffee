do ->
    app = angular.module('soApp', ['ngCookies'])

    app.config ($httpProvider) ->
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
        $httpProvider.defaults.xsrfCookieName = 'csrftoken'
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken'
        return

    factory = ($rootScope, $log, $http, $cookies) ->
        $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken
        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
        obj = new Object()
        fd = (options={}) ->
            form = new FormData()
            for k,v of options
                form.append k, v
            return form
        obj.get = (options={}) ->
            $http.get "", params: options
        obj.post = (options={}) ->
            $http.post "", fd(options), transformRequest: angular.identity, headers: 'Content-Type': undefined 
        return obj

    app.factory 'soFactory', factory
    factory.$inject = [
        '$rootScope'
        '$log'
        '$http'
        '$cookies'
    ]

    ctrl = ($rootScope, $scope, $log, soFactory) ->

        $scope.status = []
        $scope.sel = "PE"

        angular.element(document).ready ->
            $log.info 'main app...'
            $scope.gstatus()
            $scope.listall()
            angular.element('select').material_select()
            return

        $scope.listall = ->
            params =
                'getall': true
                'sel': $scope.sel
            soFactory.get(params)
            .success (response) ->
                if response.status
                    $scope.list = response.data
                    return
                else
                    Materialize.toast "#{response.raise} ", 3000
                    return
            return

        $scope.gstatus = ->
            params =
                'gstatus': true
            soFactory.get(params)
            .success (response) ->
                if response.status
                    $scope.status = response.sts
                    setTimeout (->
                        angular.element('select').material_select('update')
                        return
                        ), 600
                    return
                else
                    Materialize.toast "#{response.raise} ", 3000
                    return
            return
        $scope.listStatus = ->
            $scope.list = []
            params =
                'sel': $scope.sel
                'bystatus': true
            soFactory.get(params)
            .success (response) ->
                if response.status
                    $scope.list = response.data
                else
                    Materialize.toast "#{response.raise} ", 3000
                    return
            return
        $scope.annularSo = (os) ->
            swal
                title: "Realmente desea Anular la Orden de Servicio #{os}"
                text: ""
                type: "warning"
                showCancelButton: true
                confirmButtonText: 'Si! anular.'
                confirmButtonColor: '#fb3c4a'
                closeOnConfirm: true
                closeOnCancel: true
            , (isConfirm) ->
                if isConfirm
                    params =
                        'annular': true
                        'os': os
                    soFactory.post(params)
                    .success (response) ->
                        if response.status
                            location.reload()
                            return
                        else
                            Materialize.toast "#{response.raise}", 3000
                            return
                    console.log isConfirm
            return
        return

    app.controller 'soCtrl', ctrl
    return
