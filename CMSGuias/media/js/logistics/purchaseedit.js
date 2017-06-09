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
            this.getProjects();
            this.getSuppliers();
            this.getDocumentPayment();
            this.getMethodPayment();
            this.getCurrency();
            angular.element("select").chosen({ width: "100%" });
            angular.element("#observation").trumbowyg({
                btns: [
                    ['viewHTML'],
                    ['formatting'],
                    'btnGrp-semantic',
                    ['superscript', 'subscript'],
                    ['link'],
                    'btnGrp-justify',
                    'btnGrp-lists',
                    ['horizontalRule'],
                    ['removeformat'],
                    ['fullscreen']
                ]
            });
        }
        PurchaseController.prototype.initialize = function () {
            this.purchase['fields']['projects'] = this.purchase['fields']['projects'].split(',');
            angular.element("#observation").trumbowyg("html", this.purchase['fields']['observation']);
            setTimeout(function () {
                angular.element(".projects").trigger("chosen:updated");
                angular.element(".suppliers").trigger("chosen:updated");
                angular.element(".documentpayment").trigger("chosen:updated");
                angular.element(".methodpayment").trigger("chosen:updated");
                angular.element(".currency").trigger("chosen:updated");
            }, 400);
        };
        PurchaseController.prototype.getPurchase = function () {
            var _this = this;
            this.proxy.get("", { 'purchase': true }).then(function (response) {
                if (response['data']['status']) {
                    _this.purchase['fields'] = response['data']['purchase']['fields'];
                    _this.purchase['details'] = response['data']['purchase']['details'];
                    _this.igv = response['data']['igv'];
                    _this.initialize();
                }
            });
        };
        PurchaseController.prototype.getProjects = function () {
            var _this = this;
            this.proxy.get("/sales/projects/", { 'projects': true, 'status': 'AC' }).then(function (response) {
                if (response['data']['status']) {
                    _this.projects = response['data']['list'];
                    setTimeout(function () {
                        angular.element(".projects").trigger("chosen:updated");
                        _this.getPurchase();
                    }, 900);
                }
            });
        };
        PurchaseController.prototype.getSuppliers = function () {
            var _this = this;
            this.proxy.get("/keep/supplier/", { 'list': true }).then(function (response) {
                if (response['data']['status']) {
                    _this.suppliers = response['data']['list'];
                    setTimeout(function () {
                        angular.element(".suppliers").trigger("chosen:updated");
                    }, 800);
                }
            });
        };
        PurchaseController.prototype.getDocumentPayment = function () {
            var _this = this;
            this.proxy.get("/keep/document/payment/", { 'list': true }).then(function (response) {
                if (response['data']['status']) {
                    _this.docpayments = response['data']['list'];
                    setTimeout(function () {
                        angular.element(".documentpayment").trigger("chosen:updated");
                    }, 800);
                }
            });
        };
        PurchaseController.prototype.getMethodPayment = function () {
            var _this = this;
            this.proxy.get("/keep/method/payment/", { 'list': true }).then(function (response) {
                if (response['data']['status']) {
                    _this.methodpayments = response['data']['list'];
                    setTimeout(function () {
                        angular.element(".methodpayment").trigger("chosen:updated");
                    }, 800);
                }
            });
        };
        PurchaseController.prototype.getCurrency = function () {
            var _this = this;
            this.proxy.get("/keep/currency/", { 'list': true }).then(function (response) {
                if (response['data']['status']) {
                    _this.currencies = response['data']['list'];
                    setTimeout(function () {
                        angular.element(".currency").trigger("chosen:updated");
                    }, 800);
                }
            });
        };
        return PurchaseController;
    }());
    PurchaseController.$inject = ['$log', 'sproxy'];
    Controller.PurchaseController = PurchaseController;
})(Controller || (Controller = {}));
var Directivies;
(function (Directivies) {
    var ComponentSearchMaterials = (function () {
        function ComponentSearchMaterials() {
            this.restrict = 'E';
            this.template = "<select><option value=''>nothing template</option></select>";
            this.scope = { item: '=' };
            this.replace = true;
        }
        ComponentSearchMaterials.instance = function () {
            return new ComponentSearchMaterials();
        };
        // private _filter: ng.IFilterDate;
        // require = 'ngModel';
        ComponentSearchMaterials.prototype.link = function (scope, element, attrs, ctrl) {
            console.log("Directive is called!");
        };
        return ComponentSearchMaterials;
    }());
    ComponentSearchMaterials.$inject = [''];
    Directivies.ComponentSearchMaterials = ComponentSearchMaterials;
})(Directivies || (Directivies = {}));
var app = angular.module('app', ['ngCookies']);
app.service('sproxy', Service.Proxy);
app.controller('ctrlpurchase', Controller.PurchaseController);
app.directive('smaterials', Directivies.ComponentSearchMaterials.instance);
var httpConfig = function ($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
};
app.config(httpConfig);
