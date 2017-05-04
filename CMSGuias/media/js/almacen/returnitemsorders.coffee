app = angular.module 'rioApp', ['ngCookies']
app.config ($httpProvider) ->
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
    $httpProvider.defaults.xsrfCookieName = 'csrftoken'
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken'
    return

app.directive 'minandmax', ($parse) ->
    restrict: 'A'
    require: 'ngModel'
    scope: '@'
    link: (scope, element, attrs, ctrl) ->
        element.bind 'change', (event) ->
            # console.log ctrl
            if parseFloat(attrs.$$element[0].value) < parseFloat(attrs.min) or parseFloat(attrs.$$element[0].value) > parseFloat(attrs.max)
                # console.log "inside if"
                Materialize.toast 'El valor no es valido!', 4000
                scope.valid = false
                # element.val("value = " + attrs.max)
                ctrl.$setViewValue parseFloat(attrs.max)
                #scope.model[attrs.ngModel] = parseFloat attrs.max;
                # scope.$apply(->
                # 	ctrl.setViewValue = attrs.max
                # 	return
                # )
                ctrl.$render()
                scope.$apply()
                console.log scope
                # console.log ctrl
            else
                scope.valid = true
            return
        return

app.directive 'status', ($parse) ->
    #restrict: 'A'
    require: 'ngModel'
    #scope: '@'
    link: (scope, element, attrs, ngModel) ->
        # attrs.$observe 'ngModel', (value) -> # Got ng-model bind path here
        # 	scope.$watch value, (newValue) -> # Watch given path for changes
        # 		if newValue is true
        # 			console.log angular.element(document.querySelector("[name='#{attrs.id}']"))
        # 			angular.element(document.querySelector("[name='#{attrs.id}']")).context.value = attrs.max
        # 		else
        # 			angular.element(document.querySelector("[name='#{attrs.id}']")).context.value = 0
        # 		console.log(newValue)
        # 		return
        # 	return
        scope.$watch ->
            # console.log ngModel
            return ngModel.$modelValue
        , (newValue) ->
            el = document.getElementsByName "#{attrs.id}"
            if newValue is true
                angular.forEach el, (val) ->
                    # console.log  val
                    val.value = val.attributes.max.value
                console.log "change data"
            else
                angular.forEach el, (val) ->
                    val.value = 0
                    return
            console.log(newValue)
        return
        # scope.$watch attrs.ngModel, (nw, old) ->
        # 	console.log old
        # 	return
        # return

app.directive 'tmandm', ($parse) ->
    link: (scope, element, attrs, ngModel) ->
        element.bind 'change, click', (event) ->
            console.log element
            val = parseFloat element.context.value
            max = parseFloat attrs.max
            min = parseFloat attrs.min
            if val > max
                element.context.value = max
                return
                # console.log element.change()
            if val < min
                element.context.value = min
                return
            # angular.element(element).change()
        return

app.factory 'rioF', ($http, $cookies) ->
    obj = new Object
    convertForm = (options = {}) ->
        form = new FormData
        angular.forEach options, (val, key) ->
            form.append key, val
            return
        return form
    obj.getDetails = (options = {}) ->
        $http.get "", params: options
    obj.returnList = (options = {}) ->
        $http.post "", convertForm(options), transformRequest: angular.identity, headers: 'Content-Type': undefined
    obj.getNiples = (options = {}) ->
        $http.get '', params: options

    return obj

app.controller 'rioC', ($scope, $q, rioF) ->
    $scope.materials = []
    $scope.tniples = []
    $scope.valid = true
    $scope.showNipple = false
    $scope.vnip = false
    $scope.np = []
    $scope.dnp = []
    $scope.types = {};
    angular.element(document).ready ->
        angular.element('.modal').modal
            dismissible: false
        $scope.getDetails()
        return

    $scope.checkall = ->
        # console.info $scope.materials
        for k, v of $scope.materials
            v.status = $scope.selAll.chk
            # return
        return

    $scope.checkTNiple = ->
        for x in $scope.tniples.niples
            x.status = $scope.stnip
        return

    $scope.showNiple = ($index) ->
        if $scope.materials[$index].nstatus
            $scope.tniples = $scope.materials[$index]
            angular.element("#mniple").modal("open")
        return

    $scope.getDetails = ->
        prm =
            'getorder': true
        rioF.getDetails(prm)
        .success (response) ->
            if response.status
                $scope.details = response.details
                $scope.types = response.nametypes
                return
            else
                swal "Error", "#{response.raise}", "error"
                return
        return

    $scope.returnItems = ->
        validQ = ->
            defer = $q.defer()
            counter = 0
            zeros = 0
            for k, x of $scope.materials
                if x.status
                    counter++
                    if x.qreturn > 0
                        zeros++
            defer.resolve "#{counter},#{zeros}"
            return defer.promise
        validQ().then (response) ->
            arrays = response.split(',')
            if arrays[0] == arrays[1] and arrays[0] isnt "0"
                angular.element("#mview").modal('open')
                return
            else
                Materialize.toast "Debe seleccionar y/o ingresar cantidades mayor a 0.", 2600
                return
        return



    $scope.getNipples = ->
        # valid niples selected
        if Object.keys($scope.tniples).length
            getamount = ->
                defer = $q.defer()
                amount = 0
                for x in $scope.tniples.niples
                    if x.status
                        ntmp = 0
                        ntmp = x.qorder * x.fields.metrado
                        amount += ((Math.round((ntmp/100) * 100))/100)
                defer.resolve amount
                return defer.promise
            getamount().then (response) ->
                $scope.materials[$scope.tniples.index].qreturn = response
                $scope.materials[$scope.tniples.index].niples = $scope.tniples.niples
                $scope.tniples = {}
                $scope.stnip = false
                return
        return

    $scope.removeSelected = ($index) ->
        $scope.materials[$index].status = false
        validselected = ->
            defer = $q.defer()
            count = 0
            for k, x of $scope.materials
                if x.status
                    count++
            defer.resolve count
            return defer.promise
        validselected().then (response) ->
            if response <= 0
                angular.element("#mview").modal('close')
                return
        return

    $scope.sendReturnList = ->
        swal
            title: "Esta seguro de Regresar los materiales?"
            text: "Ingrese el movito por se que retorna los materiales."
            type: "input"
            showCancelButton: true
            cancelButtonText: 'No!'
            confirmButtonColor: '#e82a37'
            confirmButtonText: 'Si!, Retornar'
            showLoaderOnConfirm: true
            closeOnConfirm: false
            animation: "slide-from-top"
            inputPlaceholder: "Observación"
        , (inputValue) ->
            if inputValue is false
                return false
            if inputValue is ""
                swal.showInputError "Nesecitas ingresar una Observación."
                return false
            if inputValue isnt ""
                valid = ->
                    defer = $q.defer()
                    params = []
                    for k, x of $scope.materials
                        if x.status and x.qreturn > 0
                            params.push x
                    defer.resolve params
                    return defer.promise
                valid().then (params) ->
                    if response.length
                        prm =
                            'details': params
                            'saveReturn': true
                            'observation': inputValue
                        rioF.returnList(prm)
                        .success (response) ->
                            if response.status
                                Materialize.toast "Se ha devuelto los materiales seleccionados.", 2800
                                setTimeout ->
                                    location.reload()
                                    return
                                , 2800
                                return
                            else
                                swal "Error!", "#{response.raise}", "error"
                                return
                        return
                return
            else
                swal.showInputError "Nesecitas ingresar una Observación."
                $scope.sendReturnList()
                return false
        return

    return
