"use strict";
exports.__esModule = true;
var Service;
(function (Service) {
    var SProxy = (function () {
        function SProxy($http, $cookies) {
            this.$http = $http;
            this.$cookies = $cookies;
            this.$http.defaults.headers.post['X-CSRFToken'] = $cookies['csrftoken'];
            this.$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        }
        SProxy.prototype.get = function (uri, options) {
            return this.$http.get(uri, { params: options });
        };
        SProxy.prototype.post = function (uri, options) {
            return this.$http.post(uri, this.transformData(options), { transformRequest: angular.identity, headers: { 'Content-Type': undefined } });
        };
        SProxy.prototype.transformData = function (data) {
            var form = new FormData();
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    var element = data[key];
                    form.append(key, element);
                }
            }
            return form;
        };
        return SProxy;
    }());
    SProxy.$inject = ['$http', '$cookies'];
    Service.SProxy = SProxy;
})(Service = exports.Service || (exports.Service = {}));
