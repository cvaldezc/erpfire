var Service;
(function (Service) {
    var Proxy = (function () {
        function Proxy($http) {
            this.$http = $http;
        }
        Proxy.prototype.get = function (uri, options) {
            return this.$http.get(uri, { params: options });
        };
        return Proxy;
    }());
    Proxy.$inject = ['$http'];
    Service.Proxy = Proxy;
})(Service || (Service = {}));
var Controller;
(function (Controller) {
    var PurchaseController = (function () {
        function PurchaseController($log, proxy, purchase) {
            this.$log = $log;
            this.proxy = proxy;
            this.purchase = purchase;
            // this.$scope.purchaseid = this._purchaseid;
            // this.purchase = "OC1700000";
            this.$log.info("controller ready!");
            this.name = 'Christian';
        }
        PurchaseController.prototype.getBedside = function (id) {
            this.$log.log("This click here!");
            this.$log.info(this.purchase);
            this.setrequest();
        };
        PurchaseController.prototype.setrequest = function () {
            var _this = this;
            this.proxy.get("", {}).then(function (response) {
                _this.$log.info("Response if api ", response);
            });
        };
        return PurchaseController;
    }());
    PurchaseController.$inject = ['$log', 'sproxy'];
    Controller.PurchaseController = PurchaseController;
})(Controller || (Controller = {}));
var app = angular.module('app', ['ngCookies']);
app.service('sproxy', Service.Proxy);
app.controller('ctrlpurchase', Controller.PurchaseController);
