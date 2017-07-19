var MProxy = (function () {
    function MProxy($http, $cookies) {
        this.$http = $http;
        this.$cookies = $cookies;
        this.$http.defaults.headers.post['X-CSRFToken'] = $cookies['csrftoken'];
        this.$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    MProxy.prototype.get = function (uri, options) {
        return this.$http.get(uri, { params: options });
    };
    MProxy.prototype.post = function (uri, options) {
        return this.$http.post(uri, this.transformData(options), { transformRequest: angular.identity, headers: { 'Content-Type': undefined } });
    };
    MProxy.prototype.transformData = function (data) {
        var form = new FormData();
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var element = data[key];
                form.append(key, element);
            }
        }
        return form;
    };
    MProxy.$inject = ['$http', '$cookies'];
    return MProxy;
}());
var ControllerMaterials = (function () {
    function ControllerMaterials(proxy) {
        this.proxy = proxy;
        this.blockmaterials = false;
        console.log("ready!!!");
    }
    ControllerMaterials.$inject = ['sproxy'];
    return ControllerMaterials;
}());
var app = angular.module('app', ['ngCookies']);
app.service('sproxy', MProxy);
app.controller('ControllerMaterials', ControllerMaterials);
// app.directive('smaterials', Directivies.ComponentSearchMaterials.instance);
// app.directive('esdesc', Directivies.EventDescription.instance);
// app.directive('esmc', Directivies.EventKeyCode.instance);
// app.directive('esmmeasure', Directivies.EventMeasure.instance);
var httpConfig = function ($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
};
app.config(httpConfig);
