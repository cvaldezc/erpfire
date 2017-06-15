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
        private brands: Array<object>;
        private models: Array<object>;
        private units: Array<object>;
        private igv: number;
        private descriptions: object = {};
        private measures: object = {};
        private smat: string;
        private summary: object = {code: '', name: '', unit: ''};

        constructor(private $log: angular.ILogService, private proxy: Service.Proxy, public purchase: object) {
            this.$log.info("controller ready!");
            this.name = 'Christian';
            this.getProjects();
            this.getSuppliers();
            this.getDocumentPayment();
            this.getMethodPayment();
            this.getCurrency();
            this.getBrand();
            this.getModel();
            this.getUnits();
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
                angular.element(".brands").trigger("chosen:updated");
                angular.element(".models").trigger("chosen:updated");
                angular.element(".units").trigger("chosen:updated");
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

        getBrand(): void {
            this.proxy.get('/json/brand/list/option/', {}).then(
                (response: object) => {
                    if (response['data']['status']) {
                        this.brands = response['data']['brand'];
                        setTimeout(() => {
                            angular.element('.brands').trigger('chosen:updated');
                        }, 800);
                    }
                }
            );
        }

        getModel(): void {
            this.proxy.get('/json/model/list/option/', {}).then(
                (response: object) => {
                    if (response['data']['status']) {
                        this.models = response['data']['model'];
                        setTimeout(() => {
                            angular.element('.models').trigger('chosen:updated');
                        }, 800);
                    }
                }
            );
        }

        getUnits(): void {
            this.proxy.get('/unit/list/', {}).then(
                (response: object) => {
                    if (response['data']['status']) {
                        this.units = response['data']['lunit'];
                        setTimeout(() => {
                            angular.element('.units').trigger('chosen:updated');
                        }, 800);
                    }
                }
            );
        }
    }
}

module Directivies {

    export class ComponentSearchMaterials implements ng.IDirective {

        static $inject: Array<string> = [''];

        static instance(): ng.IDirective {
            return new ComponentSearchMaterials();
        }

        private _storedsc: string = '';

        constructor() {}
        scope = {
            smat: '=',
            smeasure: '=',
            sid: '='
         };
        restrict = 'AE';
        template: string = `<div>
            <div class="col s12 m6 l6 input-field">
                <label for="mdescription">Descripción</label>
                <select esdesc id="mdescription" class="browser-default chosen-select" data-placeholder="Ingrese una descripción" ng-model="smat">
                <option value=""></option>
                <option value="{{x.name}}" ng-repeat="x in descriptions">{{x.name}}</option>
                </select>
            </div>
            <div class="col s12 m2 l2 input-field">
                <input type="text" id="mid" placeholder="000000000000000" maxlength="15" ng-model="sid" esmc>
                <label for="mid">Código de Material</label></div>
            <div class="col s12 m4 l4 input-field">
                <label for="mmeasure">Medida</label>
                <select id="mmeasure" class="browser-default chosen-select" ng-model="smeasure" data-placeholder="Seleccione un medida" ng-options="msr.pk as msr.measure for msr in measures" esmmeasure>

                </select></div></div>`;
        replace = true;
        // private _filter: ng.IFilterDate;
        // require = 'ngModel';
        link(scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ctrl: any) {
            console.log("Directive is called!");
            setInterval( () => {
                let valdesc: string = angular.element('#mdescription + div > div input.chosen-search-input').val();
                valdesc = valdesc.trim();
                if (angular.element('#mdescription + div > div ul.chosen-results li').length == 1){
                    if (valdesc != '' && valdesc != this._storedsc) {
                        this._storedsc = valdesc;
                        this.getDescription(valdesc).then((response) => {
                            console.log('Load Response in select');
                            scope['descriptions'] = response;
                            scope.$apply();
                            angular.element('#mdescription').trigger('chosen:updated');
                            setTimeout( () => {
                                angular.element('#mdescription').trigger('chosen:updated');
                            }, 800);
                        });
                    }
                }
            }, 1000);
        }

        getDescription(descany: string): Promise<Array<object>> {
            return new Promise((resolve) => {
                angular.element.getJSON('/json/get/materials/name/', {'nom': descany}, (response, textStatus, xhr) => {
                    if (response['status']) {
                        resolve(response['names']);
                    }else{
                        resolve([]);
                    }
                });
            });
        }
    }

    export class EventKeyCode implements ng.IDirective {
        static $inject: Array<string> = [''];
        static instance(): ng.IDirective {
            return new EventKeyCode();
        }
        constructor() {}
        link(scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ctrl: any) {
            element.bind('keyup', (event) => {
                if (event.keyCode == 13) {
                    console.log(event.keyCode);
                    console.log( 'Materials code by search ' + scope.$parent['vm']['sid']);
                    this.getSummary(scope.$parent['vm']['sid']).then( (resolve) => {
                        let data = resolve[0];
                        scope.$parent['vm']['summary']['code'] = data['materialesid'];
                        scope.$parent['vm']['summary']['name'] = `${data['matnom']} ${data['matmed']}`;
                        scope.$parent['vm']['summary']['unit'] = data['unidad'];
                        scope.$apply();
                    });
                }
            });
        }

        getSummary(mid: string): Promise<Array<object>> {
            return new Promise( (resolve) => {
                angular.element.getJSON('/json/get/resumen/details/materiales/', {'matid': mid}, (response: object) => {
                    if (response['status']) {
                        resolve(response['list']);
                    }else{
                        resolve([]);
                    }
                });
            });
        }
    }

    export class EventDescription implements ng.IDirective {
        static $inject: Array<string> = [];
        static instance(): ng.IDirective {
            return new EventDescription();
        }
        constructor() {}
        link(scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ctrl: any) {
            element.bind('change', () => {
                console.log(element.val());
                console.log(scope['smat']);
                this.getMeasure(element.val()).then( (resolve) => {
                    angular.element('#mmeasure option').remove();
                    scope['measures'] = resolve;
                    scope.$apply();
                    this.setUpdateMeasure(angular.element('#mmeasure option').length - 1, resolve.length);
                });
            });
        }

        setUpdateMeasure(len: number, obj: number): void {
            setTimeout(() => {
                console.log('call set trigger chosen measure');
                if (len == obj) {
                    angular.element('#mmeasure').trigger('chosen:updated');
                }else{
                    console.log('this called new other');
                    this.setUpdateMeasure(angular.element('#mmeasure option').length - 1, obj);
                }
            }, 800);
            angular.element('#mmeasure').trigger('chosen:updated');
        }

        getMeasure(description: string): Promise<Array<object>> {
            return new Promise( (resolve) => {
                angular.element.getJSON('/json/get/meter/materials/', {'matnom': description}, (response) => {
                    if (response['status']) {
                        resolve(response['list'])
                    }else{
                        resolve([])
                    }
                } );
            });
        }
    }

    export class EventMeasure implements ng.IDirective {
        static $inject: Array<string> = [];
        static instance(): ng.IDirective {
            return new EventMeasure();
        }
        constructor() {}
        link(scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ctrl: any) {
            element.bind('change', () => {
                console.log('Execute when select measure change');
                this.getSummary(scope.$parent['vm']['smeasure']).then( (resolve) => {
                    let data = resolve[0];
                    scope.$parent['vm']['summary']['code'] = data['materialesid'];
                    scope.$parent['vm']['summary']['name'] = `${data['matnom']} ${data['matmed']}`;
                    scope.$parent['vm']['summary']['unit'] = data['unidad'];
                    scope.$apply();
                    angular.element('#mmeasure').trigger('chosen:updated');
                });
            });
        }

        getSummary(mid: string): Promise<Array<object>> {
            return new Promise( (resolve) => {
                angular.element.getJSON('/json/get/resumen/details/materiales/', {'matid': mid}, (response: object) => {
                    if (response['status']) {
                        resolve(response['list']);
                    }else{
                        resolve([]);
                    }
                });
            });
        }
    }
}

let app = angular.module('app', ['ngCookies']);
app.service('sproxy', Service.Proxy);
app.controller('ctrlpurchase', Controller.PurchaseController);
app.directive('smaterials', Directivies.ComponentSearchMaterials.instance);

app.directive('esdesc', Directivies.EventDescription.instance);
app.directive('esmc', Directivies.EventKeyCode.instance);
app.directive('esmmeasure', Directivies.EventMeasure.instance);
let httpConfig = ($httpProvider: ng.IHttpProvider) => {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
};
app.config(httpConfig);