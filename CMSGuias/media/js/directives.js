var valFormatTime, valMinandMax;

valMinandMax = function() {
  return {
    restrict: 'AE',
    require: '?ngModel',
    scope: '@',
    link: function(scope, element, attrs, ngModel) {
      element.bind('blur', function(event) {
        var max, min, result, valid, vcurrent;
        console.log("inside event");
        result = 0;
        valid = true;
        vcurrent = element.val();
        if (vcurrent === '' || vcurrent === void 0) {
          valid = false;
        }
        console.log(valid, vcurrent);
        if (valid) {
          vcurrent = parseFloat(vcurrent);
          min = parseFloat(attrs.min);
          max = parseFloat(attrs.max);
          switch (false) {
            case !(vcurrent > max):
              result = max;
              break;
            case !(vcurrent < min):
              result = min;
              break;
            default:
              result = vcurrent;
          }
          if (attrs.hasOwnProperty('ngModel')) {
            ngModel.$setViewValue(result);
            ngModel.$render();
            scope.$apply();
            console.log("change model");
          } else {
            element.val(result);
            console.log("change attr");
          }
        } else {
          if (attrs.hasOwnProperty('ngModel')) {
            ngModel.$setViewValue(result);
            ngModel.$render();
            scope.$apply();
            console.log("change model");
          } else {
            element.val(result);
            console.log("change attr");
          }
        }
      });
    }
  };
};

valFormatTime = function() {
  return {
    restrict: 'AE',
    require: '?ngModel',
    scope: '@',
    link: function(scope, element, attrs, ngModel) {
      element.bind('keypress', function(event) {
        var key;
        key = event.which || event.keyCode;
        console.info(key);
        if (key < 48 || key > 58 && key !== 8 || key !== 45) {
          event.preventDefault();
          return false;
        }
      });
      element.bind('blur', function(event) {
        var pattern;
        pattern = new RegExp(/^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/);
        if (!pattern.test(element.val())) {
          Materialize.toast('<i class="fa fa-exclamation-circle amber-text">' + '</i>&nbsp;Formato incorrecto!', 3000);
          ngModel.$setViewValue('00:00');
          ngModel.$render();
        }
      });
    }
  };
};
