var Service;
(function (Service) {
    var Proxy = (function () {
        function Proxy($http, $cookies) {
            this.$http = $http;
            this.$cookies = $cookies;
            this.$http.defaults.headers.post['X-CSRFToken'] = $cookies['csrftoken'];
            this.$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        }
        Proxy.prototype.get = function (uri, options) {
            return this.$http.get(uri, { params: options });
        };
        return Proxy;
    }());
    Proxy.$inject = ['$http', '$cookies'];
    Service.Proxy = Proxy;
})(Service || (Service = {}));
var Controller;
(function (Controller) {
    var PurchaseController = (function () {
        function PurchaseController($log, proxy, purchase) {
            this.$log = $log;
            this.proxy = proxy;
            this.purchase = purchase;
            this.$log.info("controller ready!");
            this.name = 'Christian';
            this.getDocumentPayment();
            this.getMethodPayment();
            this.getCurrency();
            angular.element("select").chosen({ width: "100%" });
        }
        PurchaseController.prototype.getDocumentPayment = function () {
            var _this = this;
            this.proxy.get("/keep/document/payment/", { 'list': true }).then(function (response) {
                if (response['data']['status']) {
                    _this.docpayment = response['data']['list'];
                    angular.element(".documentpayment").trigger("chosen:updated");
                }
            });
        };
        PurchaseController.prototype.getMethodPayment = function () {
            var _this = this;
            this.proxy.get("/keep/method/payment/", { 'list': true }).then(function (response) {
                if (response['data']['status']) {
                    _this.methodpayment = response['data']['list'];
                    angular.element(".methodpyment").trigger("chosen:updated");
                }
            });
        };
        PurchaseController.prototype.getCurrency = function () {
            var _this = this;
            this.proxy.get("/keep/currency/", { 'list': true }).then(function (response) {
                if (response['data']['status']) {
                    _this.currency = response['data']['list'];
                    angular.element(".currency").trigger("chosen:updated");
                }
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
var httpConfig = function ($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
};
app.config(httpConfig);
