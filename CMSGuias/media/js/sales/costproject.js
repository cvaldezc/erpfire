// import * as angular from "angular";
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
var ControllerServiceProject = (function () {
    function ControllerServiceProject(proxy) {
        this.proxy = proxy;
        console.log("hi! hello world!!!");
        angular.element('.modal').modal();
        this.getItemizer();
    }
    ControllerServiceProject.prototype.getItemizer = function () {
        console.log('get itemizer');
    };
    ControllerServiceProject.prototype.setItemizerSalesAmount = function () {
        // console.log(this.itemizer['purchase'] * 1.10);
        this.itemizer['sales'] = (Math.round(this.itemizer['purchase'] * 1.10) * 100) / 100;
        // console.log(this.itemizer);
    };
    return ControllerServiceProject;
}());
ControllerServiceProject.$inject = ['sproxy'];
var apps = angular.module('app', ['ngCookies']);
apps.service('sproxy', SProxy);
apps.controller('controller', ControllerServiceProject);
var httpConfigs = function ($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
};
apps.config(httpConfigs);
// Materialize.toast('hi!', 6000); 
