'use strict'

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
        restrict = 'AE';
        template: string = `<div class="row">
            <div class="col s12 m6 l6">
                <label for="mdescription">Descripción</label>
                <select esdesc id="mdescription" class="browser-default chosen-select" data-placeholder="Ingrese una descripción">
                <option value=""></option>
                <option value="{{x.description}}" ng-repeat="x in descriptions">{{x.description}}</option>
                </select>
            </div>
            <div class="col s12 m2 l2 input-field">
                <input type="text" id="mid" placeholder="000000000000000" maxlength="15" esmc>
                <label for="mid">Código de Material</label></div>
            <div class="col s12 m4 l4">
                <label for="mmeasure">Medida</label>
                <select id="mmeasure" class="browser-default chosen-select" data-placeholder="Seleccione un medida"></select></div></div>`;
        scope = { descriptions: '=' };
        replace = true;
        // private _filter: ng.IFilterDate;
        // require = 'ngModel';
        link(scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ctrl: any) {
            console.log("Directive is called!");
        }

    }

    export class EventKeyCode implements ng.IDirective {
        static $inject: Array<string> = [''];
        static instance(): ng.IDirective {
            return new EventKeyCode();
        }
        constructor() {}
        scope = { item: '=' }
        link(scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ctrl: any){
            element.bind('click', () => {
                console.log('this click in element');
            });
        }
    }

    export class EventDescription implements ng.IDirective {
        private _storedsc: string = '';
        static $inject: Array<string> = ['sproxy'];
        static instance(): ng.IDirective {
            return new EventDescription();
        }

        constructor(private http: Service.Proxy) {}

        scope = { descriptions: '=' }
        link(scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ctrl: any) {
            // load directive
            setInterval(() => {
                this.getDescription(angular.element('#mdescription + div > div input.chosen-search-input').val());
            }, 2000);

            element.bind('change', () => {
                console.log(element.value);
                console.log('Execute when select description change');
            });
        }

        getDescription(description: string) {
            console.info(description);
            description = description.trim();
            if (description != '' && description != this._storedsc){
                this._storedsc = description;
                this.http.get('', {}).then( (response: object) => {
                    if (response['data']['status']) {

                    }
                });
            }
        }
    }
}

let app = angular.module('app', ['ngCookies']);
app.service('sproxy', Service.Proxy);
app.controller('ctrlpurchase', Controller.PurchaseController);
app.directive('smaterials', Directivies.ComponentSearchMaterials.instance);
app.directive('esmc', Directivies.EventKeyCode.instance);
app.directive('esdesc', Directivies.EventDescription.instance);
let httpConfig = ($httpProvider: ng.IHttpProvider) => {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
};
app.config(httpConfig);