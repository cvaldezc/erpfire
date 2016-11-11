do ->
    app = angular.module('soApp', ['ngCookies'])

    app.config ($httpProvider) ->
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
        $httpProvider.defaults.xrsfCookieName = 'csrftoken'
        $httpProvider.defaults.xrsfHeaderName = 'X-CSRFToken'
        return

    factory = ($rootScope, $log, $http, $cookies) ->
        # $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken
        # $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
        obj = new Object
        obj.get = (options={})->
            $http.get "", params: options
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
        return

    app.controller 'soCtrl', ctrl
    return
