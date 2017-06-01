"use strict";
exports.__esModule = true;
var viewpurchase_1 = require("../viewpurchase");
var Proxy = (function () {
    function Proxy($http) {
        this.$http = $http;
    }
    Proxy.prototype.get = function (params) {
        return this.$http.get('/json/', params);
    };
    return Proxy;
}());
Proxy.$inject = ['$http'];
exports.Proxy = Proxy;
viewpurchase_1.app.service('proxy', Proxy);
