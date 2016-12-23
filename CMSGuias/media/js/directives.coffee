# 'use strict'

# directive validate number min and max
valMinandMax = ->
  restrict: 'AE'
  require: '?ngModel'
  scope: '@'
  link: (scope, element, attrs, ngModel) ->
    element.bind 'blur', (event) ->
      console.log "inside event"
      result = 0
      valid = true
      vcurrent = element.val()
      if vcurrent is '' or vcurrent is undefined
        valid = false
      console.log valid, vcurrent
      if valid
        vcurrent = parseFloat vcurrent
        min = parseFloat attrs.min
        max = parseFloat attrs.max
        switch
          when vcurrent > max then result = max
          when vcurrent < min then result = min
          else result = vcurrent
        if attrs.hasOwnProperty 'ngModel'
          ngModel.$setViewValue result
          ngModel.$render()
          scope.$apply()
          console.log "change model"
          return
        else
          element.val result
          console.log "change attr"
          return
      else
        if attrs.hasOwnProperty 'ngModel'
          ngModel.$setViewValue result
          ngModel.$render()
          scope.$apply()
          console.log "change model"
          return
        else
          element.val result
          console.log "change attr"
          return
    return

valFormatTime = ->
  restrict: 'AE'
  require: '?ngModel'
  scope: '@'
  link: (scope, element, attrs, ngModel) ->
    element.bind 'keypress', (event) ->
      key = event.which or event.keyCode
      if (key < 48 or key > 58) and key != 8 and key != 45
        # console.info key
        event.preventDefault()
        return false
    element.bind 'blur', (event) ->
      pattern = new RegExp /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/
      if not pattern.test element.val()
        Materialize.toast '<i class="fa fa-exclamation-circle amber-text">' +
          '</i>&nbsp;Formato incorrecto!', 3000
        ngModel.$setViewValue '00:00'
        ngModel.$render()
      # console.info scope
      return
    return
