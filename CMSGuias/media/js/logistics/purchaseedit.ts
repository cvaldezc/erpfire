module Service {
    export interface IProxy {
        get: (uri: string, options: object) => ng.IHttpPromise<any>;
    }

    export class Proxy implements IProxy {

        static $inject = ['$http', '$cookies'];
        constructor(private $http: ng.IHttpService, private $cookies: ng.cookies.ICookiesService) {
            this.$http.defaults.headers.post['X-CSRFToken'] = $cookies['csrftoken'];
            this.$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        }

        get(uri: string, options: object) {
            return this.$http.get(uri, {params: options});
        }

    }
}

module Controller {

    interface IPurchase {
        purchase: object;
    }

    export class PurchaseController implements IPurchase {

        static $inject = ['$log', 'sproxy'];
        private name: string;
        private docpayments: object;
        private methodpayments: object;
        private currencies: object;
        private suppliers: object;
        private projects: object;
        private igv: number;

        constructor(private $log: angular.ILogService, private proxy: Service.Proxy, public purchase: object) {
            this.$log.info("controller ready!");
            this.name = 'Christian';
            this.getProjects();
            this.getSuppliers();
            this.getDocumentPayment();
            this.getMethodPayment();
            this.getCurrency();
            angular.element("select").chosen({width: "100%"});
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
            this.proxy.get("", {'purchase': true}).then((response: object) => {
                if (response['data']['status']) {
                    this.purchase['fields'] = response['data']['purchase']['fields'];
                    this.purchase['details'] = response['data']['purchase']['details'];
                    this.igv = response['data']['igv']
                    this.initialize();
                }
            });
        }

        getProjects() {
            this.proxy.get("/sales/projects/", {'projects': true, 'status': 'AC'}).then((response: object) => {
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
            this.proxy.get("/keep/supplier/", {'list': true}).then((response: object) => {
                if (response['data']['status']){
                    this.suppliers = response['data']['list'];
                    setTimeout(() => {
                        angular.element(".suppliers").trigger("chosen:updated");
                    }, 800);
                }
            });
        }

        getDocumentPayment() {
            this.proxy.get("/keep/document/payment/", {'list': true}).then((response: object) => {
                if (response['data']['status']){
                    this.docpayments = response['data']['list'];
                    setTimeout(() => {
                        angular.element(".documentpayment").trigger("chosen:updated");
                    }, 800);
                }
            });
        }

        getMethodPayment() {
            this.proxy.get("/keep/method/payment/", {'list': true}).then(
                (response: object) => {
                    if (response['data']['status']) {
                        this.methodpayments = response['data']['list'];
                        setTimeout(() => {
                            angular.element(".methodpayment").trigger("chosen:updated");
                        }, 800);
                    }
                });
        }

        getCurrency() {
            this.proxy.get("/keep/currency/", {'list': true}).then(
                (response: object) => {
                    if (response['data']['status']) {
                        this.currencies = response['data']['list'];
                        setTimeout(() => {
                            angular.element(".currency").trigger("chosen:updated");
                        }, 800);
                    }
                });
        }

    }

}

module Directivies {

    export class ComponentSearchMaterials implements ng.IDirective {

        static $inject: Array<string> = [''];

        static instance(): ng.IDirective {
            return new ComponentSearchMaterials();
        }

        constructor() {}
        restrict = 'E';
        template: string = "<select><option value=''>nothing template</option></select>";
        scope = { item : '=' };
        replace = true;
        // private _filter: ng.IFilterDate;
        // require = 'ngModel';
        link(scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ctrl: any) {
            console.log("Directive is called!");
        }

    }
}

let app = angular.module('app', ['ngCookies']);
app.service('sproxy', Service.Proxy);
app.controller('ctrlpurchase', Controller.PurchaseController);
app.directive('smaterials', Directivies.ComponentSearchMaterials.instance);
let httpConfig = ($httpProvider: ng.IHttpProvider) => {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
};
app.config(httpConfig);