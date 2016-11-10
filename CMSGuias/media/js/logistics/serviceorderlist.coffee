do ->

    app = ($rootScope, $scope, $state, $log) ->

        vm = this

        vm.main = ->
            $log.info 'main app...'
            return

        vm.main()

        ## app
        return

    'use strict'
    angular.module('').controller 'app', app
    return
