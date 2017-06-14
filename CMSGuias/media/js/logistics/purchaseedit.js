'use strict';
var Service;
(function (Service) {
    class Proxy {
        constructor($http, $cookies) {
            this.$http = $http;
            this.$cookies = $cookies;
            this.$http.defaults.headers.post['X-CSRFToken'] = $cookies['csrftoken'];
            this.$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        }
        get(uri, options) {
            return this.$http.get(uri, { params: options });
        }
    }
    Proxy.$inject = ['$http', '$cookies'];
    Service.Proxy = Proxy;
})(Service || (Service = {}));
var Controller;
(function (Controller) {
    class PurchaseController {
        constructor($log, proxy, purchase) {
            this.$log = $log;
            this.proxy = proxy;
            this.purchase = purchase;
            this.descriptions = {};
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
        initialize() {
            this.purchase['fields']['projects'] = this.purchase['fields']['projects'].split(',');
            angular.element("#observation").trumbowyg("html", this.purchase['fields']['observation']);
            setTimeout(() => {
                angular.element(".projects").trigger("chosen:updated");
                angular.element(".suppliers").trigger("chosen:updated");
                angular.element(".documentpayment").trigger("chosen:updated");
                angular.element(".methodpayment").trigger("chosen:updated");
                angular.element(".currency").trigger("chosen:updated");
            }, 400);
        }
        getPurchase() {
            this.proxy.get("", { 'purchase': true }).then((response) => {
                if (response['data']['status']) {
                    this.purchase['fields'] = response['data']['purchase']['fields'];
                    this.purchase['details'] = response['data']['purchase']['details'];
                    this.igv = response['data']['igv'];
                    this.initialize();
                }
            });
        }
        getProjects() {
            this.proxy.get("/sales/projects/", { 'projects': true, 'status': 'AC' }).then((response) => {
                if (response['data']['status']) {
                    this.projects = response['data']['list'];
                    setTimeout(() => {
                        angular.element(".projects").trigger("chosen:updated");
                        this.getPurchase();
                    }, 900);
                }
            });
        }
        getSuppliers() {
            this.proxy.get("/keep/supplier/", { 'list': true }).then((response) => {
                if (response['data']['status']) {
                    this.suppliers = response['data']['list'];
                    setTimeout(() => {
                        angular.element(".suppliers").trigger("chosen:updated");
                    }, 800);
                }
            });
        }
        getDocumentPayment() {
            this.proxy.get("/keep/document/payment/", { 'list': true }).then((response) => {
                if (response['data']['status']) {
                    this.docpayments = response['data']['list'];
                    setTimeout(() => {
                        angular.element(".documentpayment").trigger("chosen:updated");
                    }, 800);
                }
            });
        }
        getMethodPayment() {
            this.proxy.get("/keep/method/payment/", { 'list': true }).then((response) => {
                if (response['data']['status']) {
                    this.methodpayments = response['data']['list'];
                    setTimeout(() => {
                        angular.element(".methodpayment").trigger("chosen:updated");
                    }, 800);
                }
            });
        }
        getCurrency() {
            this.proxy.get("/keep/currency/", { 'list': true }).then((response) => {
                if (response['data']['status']) {
                    this.currencies = response['data']['list'];
                    setTimeout(() => {
                        angular.element(".currency").trigger("chosen:updated");
                    }, 800);
                }
            });
        }
    }
    PurchaseController.$inject = ['$log', 'sproxy'];
    Controller.PurchaseController = PurchaseController;
})(Controller || (Controller = {}));
var Directivies;
(function (Directivies) {
    class ComponentSearchMaterials {
        constructor() {
            this._storedsc = '';
            this.scope = {
                smat: '='
            };
            this.restrict = 'AE';
            this.template = `<div class="row">
            <div class="col s12 m6 l6">
                <label for="mdescription">Descripción</label>
                <select esdesc id="mdescription" class="browser-default chosen-select" data-placeholder="Ingrese una descripción" ng-model="smat">
                <option value=""></option>
                <option value="{{x.name}}" ng-repeat="x in descriptions">{{x.name}}</option>
                </select>
            </div>
            <div class="col s12 m2 l2 input-field">
                <input type="text" id="mid" placeholder="000000000000000" maxlength="15" esmc>
                <label for="mid">Código de Material</label></div>
            <div class="col s12 m4 l4">
                <label for="mmeasure">Medida</label>
                <select id="mmeasure" class="browser-default chosen-select" data-placeholder="Seleccione un medida"></select></div></div>`;
            this.replace = true;
        }
        static instance() {
            return new ComponentSearchMaterials();
        }
        // private _filter: ng.IFilterDate;
        // require = 'ngModel';
        link(scope, element, attrs, ctrl) {
            console.log("Directive is called!");
            setInterval(() => {
                let valdesc = angular.element('#mdescription + div > div input.chosen-search-input').val();
                valdesc = valdesc.trim();
                if (angular.element('#mdescription + div > div ul.chosen-results li').length == 1) {
                    if (valdesc != '' && valdesc != this._storedsc) {
                        //scope.$apply(() => {
                        this._storedsc = valdesc;
                        this.getDescription(valdesc).then((response) => {
                            console.log('Load Response in select');
                            // console.info([{name: 'a'}, {name: 'b'},{name: 'c'}]);
                            scope['descriptions'] = response;
                            scope.$apply();
                            angular.element('#mdescription').trigger('chosen:updated');
                        });
                        // scope['descriptions'] = [{name: 'a'}, {name: 'b'},{name: 'c'}]; //response;
                        //});
                    }
                }
                // console.log(scope);
                // scope['vm']['descriptions'] = {}
            }, 2000);
        }
        getDescription(descany) {
            return new Promise((resolve) => {
                angular.element.getJSON('/json/get/materials/name/', { 'nom': descany }, (response, textStatus, xhr) => {
                    console.log(response);
                    resolve(response['names']);
                });
            });
        }
    }
    ComponentSearchMaterials.$inject = [''];
    Directivies.ComponentSearchMaterials = ComponentSearchMaterials;
    class EventKeyCode {
        constructor() {
            this.scope = { item: '=' };
        }
        static instance() {
            return new EventKeyCode();
        }
        link(scope, element, attrs, ctrl) {
            element.bind('click', () => {
                console.log('this click in element');
            });
        }
    }
    EventKeyCode.$inject = [''];
    Directivies.EventKeyCode = EventKeyCode;
    // export class EventDescription implements ng.IDirective {
    //     private _storedsc: string = '';
    //     static $inject: Array<string> = [];
    //     static instance(): ng.IDirective {
    //         return new EventDescription();
    //     }
    //     constructor() {}
    //     scope = { descriptions: '=' }
    //     link(scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ctrl: any) {
    //         // load directive
    //         console.log("load tag");
    //         setInterval(() => {
    //         }, 2000);
    //         element.bind('change', () => {
    //             console.log(element.value);
    //             console.log('Execute when select description change');
    //         });
    //     }
    // }
})(Directivies || (Directivies = {}));
let app = angular.module('app', ['ngCookies']);
app.service('sproxy', Service.Proxy);
app.controller('ctrlpurchase', Controller.PurchaseController);
app.directive('esmc', Directivies.EventKeyCode.instance);
// app.directive('esdesc', Directivies.EventDescription.instance);
app.directive('smaterials', Directivies.ComponentSearchMaterials.instance);
let httpConfig = ($httpProvider) => {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
};
app.config(httpConfig);
