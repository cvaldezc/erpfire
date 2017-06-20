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
        post(uri, options) {
            return this.$http.post(uri, this.transformData(options), { transformRequest: angular.identity, headers: { 'Content-Type': undefined } });
        }
        transformData(data) {
            let form = new FormData();
            for (let key in data) {
                if (data.hasOwnProperty(key)) {
                    let element = data[key];
                    form.append(key, element);
                }
            }
            return form;
        }
    }
    Proxy.$inject = ['$http', '$cookies'];
    Service.Proxy = Proxy;
})(Service || (Service = {}));
var Controller;
(function (Controller) {
    class PurchaseController {
        constructor($log, proxy) {
            this.$log = $log;
            this.proxy = proxy;
            this.badd = false;
            this.comments = { pk: '', text: '' };
            this.summary = { code: '', name: '', unit: '' };
            this.modifyMaterial = false;
            this.$log.info("controller ready!");
            this.initialize();
            this.name = 'Christian';
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
            angular.element("#transfer").pickadate({
                container: "#bedside",
                closeOnSelect: true,
                min: new Date(),
                selectMonths: true,
                selectYears: 15,
                format: 'yyyy-mm-dd'
            });
            angular.element('.modal').modal({ dismissible: false });
            angular.element('.itemobservation').trumbowyg({
                btns: [['viewHTML'],
                    ['formatting'],
                    'btnGrp-semantic',
                    ['superscript', 'subscript'],
                    ['link'],
                    'btnGrp-justify',
                    'btnGrp-lists',
                    ['horizontalRule'],
                    ['removeformat'],
                    ['fullscreen']]
            });
            // angular.element('.chips').material_chip();
        }
        initialize() {
            this.getProjects();
            this.getSuppliers();
            this.getDocumentPayment();
            this.getMethodPayment();
            this.getCurrency();
            this.getBrand();
            this.getModel();
            this.getUnits();
        }
        parseSelect() {
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
            this.proxy.get("", { 'purchase': true }).then((response) => {
                if (response['data']['status']) {
                    this.purchase['fields'] = response['data']['purchase']['fields'];
                    // this.purchase['details'] = response['data']['purchase']['details'];
                    this.igv = response['data']['igv'];
                    this.getPurchaseDetails();
                    this.parseSelect();
                }
            });
        }
        getPurchaseDetails() {
            this.proxy.get("", { 'details': true }).then((response) => {
                if (response['data']['status']) {
                    this.purchase['samount'] = 0;
                    this.purchase['details'] = response['data']['details'];
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
        getBrand() {
            this.proxy.get('/json/brand/list/option/', {}).then((response) => {
                if (response['data']['status']) {
                    this.brands = response['data']['brand'];
                    setTimeout(() => {
                        angular.element('.brands').trigger('chosen:updated');
                    }, 800);
                }
            });
        }
        getModel() {
            this.proxy.get('/json/model/list/option/', {}).then((response) => {
                if (response['data']['status']) {
                    this.models = response['data']['model'];
                    setTimeout(() => {
                        angular.element('.models').trigger('chosen:updated');
                    }, 800);
                }
            });
        }
        getUnits() {
            this.proxy.get('/unit/list/', {}).then((response) => {
                if (response['data']['status']) {
                    this.units = response['data']['lunit'];
                    setTimeout(() => {
                        angular.element('.units').trigger('chosen:updated');
                    }, 800);
                }
            });
        }
        // 2017-06-16 10:44:58
        // @Christian
        saveMaterial() {
            // collection data for save
            let data = this.purchase['fields'];
            // data['']
        }
        saveDetails() {
            // launch toast
            Materialize.toast('<b>Procesando...!<b>', parseInt('undefined'), 'toast-remove');
            // get object data for send
            let save = this.uc;
            save['materials'] = this.summary['code'];
            save['ucpurchase'] = true;
            this.proxy.post('', save).then((response) => {
                angular.element('.toast-remove').remove();
                if (response['data']['status']) {
                    Materialize.toast('<i class="fa fa-check fa-2x"></i> Guardado!', 2600);
                    this.getPurchaseDetails();
                    // clean data
                    this.summary['code'] = '';
                    this.summary['name'] = '';
                    this.summary['unit'] = '';
                    // data for form
                    // this.uc['brand'] = edit['brand']['pk'];
                    // this.uc['model'] = edit['model']['pk'];
                    // this.uc['oldbrand'] = edit['brand']['pk'];
                    // this.uc['oldmodel'] = edit['model']['pk'];
                    // this.uc['unit'] = (edit['unit'] == '') ? edit['materiales']['fields']['unidad'] : edit['unit'];
                    this.uc['price'] = 0;
                    this.uc['quantity'] = 0;
                    this.uc['discount'] = 0;
                    this.uc['perception'] = 0;
                }
                else {
                    // ${response['data']['raise']}
                    Materialize.toast(`<i class="fa fa-times fa-2x"></i> &nbsp;Error ${response['data']['raise']}`, 6000);
                }
            }, (error) => {
                Materialize.toast(error, 8000);
            });
        }
        checkedItems() {
            for (var key in this.purchase['modify']) {
                this.purchase['modify'][key]['status'] = this.chkdetails;
            }
        }
        delDetails() {
            this.odel().then((result) => {
                console.log(result);
                if (result.length > 0) {
                    this.$log.log(result);
                    swal({
                        title: 'Desea eliminar los materiales seleccionados?',
                        type: 'warning',
                        closeOnConfirm: true,
                        closeOnCancel: true,
                        showCancelButton: true,
                        confirmButtonText: 'Si!',
                        confirmButtonColor: '#fe6969',
                        cancelButtonText: 'No!',
                    }, (answer) => {
                        if (answer) {
                            // send data for delete
                            Materialize.toast(`<i class="fa fa-cog fa-2x fa-spin"></i>&nbsp;Procesando...!`, parseInt(undefined), 'toast-remove');
                            let param = {
                                delitems: true,
                                data: JSON.stringify(result)
                            };
                            this.proxy.post('', param).then((response) => {
                                angular.element('.toast-remove').remove();
                                if (response['data']['status']) {
                                    this.getPurchaseDetails();
                                    Materialize.toast('<i class="fa fa-check fa-2x"></i>&nbsp;Materiales eliminados!', 2600);
                                }
                            });
                        }
                    });
                }
            });
        }
        showComment(id, text) {
            this.comments = { pk: id, text: text };
            angular.element('.itemobservation').trumbowyg('html', text);
            angular.element('#mcomment').modal('open');
        }
        saveComment(pk) {
            let params = {
                pk: pk,
                savecomment: true,
                comment: angular.element('.itemobservation').trumbowyg('html')
            };
            this.proxy.post('', params).then((response) => {
                if (response['data']['status']) {
                    this.getPurchaseDetails();
                }
            });
        }
        showDataModify(edit) {
            // add view summary materials
            this.summary['code'] = edit['materiales']['pk'];
            this.summary['name'] = `${edit['materiales']['fields']['matnom']} ${edit['materiales']['fields']['matmed']}`;
            this.summary['unit'] = edit['materiales']['fields']['unidad'];
            // data for form
            this.uc['brand'] = edit['brand']['pk'];
            this.uc['model'] = edit['model']['pk'];
            this.uc['oldbrand'] = edit['brand']['pk'];
            this.uc['oldmodel'] = edit['model']['pk'];
            this.uc['unit'] = (edit['unit'] == '') ? edit['materiales']['fields']['unidad'] : edit['unit'];
            this.uc['price'] = edit['precio'];
            this.uc['quantity'] = edit['cantstatic'];
            this.uc['discount'] = edit['discount'];
            this.uc['perception'] = edit['perception'];
            this.badd = true;
            setTimeout(() => {
                angular.element(".brands").trigger("chosen:updated");
                angular.element(".models").trigger("chosen:updated");
                angular.element(".units").trigger("chosen:updated");
            }, 800);
            // show block and position
            window.scrollTo(0, angular.element('.block-details').position().top);
        }
        /**
         * Block function privates or auxiliars
         */
        odel() {
            return new Promise((resolve) => {
                let promises = [];
                for (var key in this.purchase['modify']) {
                    if (this.purchase['modify'].hasOwnProperty(key)) {
                        let element = this.purchase['modify'][key];
                        if (element['status']) {
                            promises.push(key);
                        }
                    }
                }
                resolve(promises);
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
                smat: '=',
                smeasure: '=',
                sid: '='
            };
            this.restrict = 'AE';
            this.template = `<div>
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
                        this._storedsc = valdesc;
                        this.getDescription(valdesc).then((response) => {
                            console.log('Load Response in select');
                            scope['descriptions'] = response;
                            scope.$apply();
                            angular.element('#mdescription').trigger('chosen:updated');
                            setTimeout(() => {
                                angular.element('#mdescription').trigger('chosen:updated');
                            }, 800);
                        });
                    }
                }
            }, 1000);
        }
        getDescription(descany) {
            return new Promise((resolve) => {
                angular.element.getJSON('/json/get/materials/name/', { 'nom': descany }, (response, textStatus, xhr) => {
                    if (response['status']) {
                        resolve(response['names']);
                    }
                    else {
                        resolve([]);
                    }
                });
            });
        }
    }
    ComponentSearchMaterials.$inject = [''];
    Directivies.ComponentSearchMaterials = ComponentSearchMaterials;
    class EventKeyCode {
        constructor() { }
        static instance() {
            return new EventKeyCode();
        }
        link(scope, element, attrs, ctrl) {
            element.bind('keyup', (event) => {
                if (event.keyCode == 13) {
                    console.log(event.keyCode);
                    console.log('Materials code by search ' + scope.$parent['vm']['sid']);
                    this.getSummary(scope.$parent['vm']['sid']).then((resolve) => {
                        let data = resolve[0];
                        scope.$parent['vm']['summary']['code'] = data['materialesid'];
                        scope.$parent['vm']['summary']['name'] = `${data['matnom']} ${data['matmed']}`;
                        scope.$parent['vm']['summary']['unit'] = data['unidad'];
                        scope.$apply();
                    });
                }
            });
        }
        getSummary(mid) {
            return new Promise((resolve) => {
                angular.element.getJSON('/json/get/resumen/details/materiales/', { 'matid': mid }, (response) => {
                    if (response['status']) {
                        resolve(response['list']);
                    }
                    else {
                        resolve([]);
                    }
                });
            });
        }
    }
    EventKeyCode.$inject = [''];
    Directivies.EventKeyCode = EventKeyCode;
    class EventDescription {
        constructor() { }
        static instance() {
            return new EventDescription();
        }
        link(scope, element, attrs, ctrl) {
            element.bind('change', () => {
                console.log(element.val());
                console.log(scope['smat']);
                this.getMeasure(element.val()).then((resolve) => {
                    angular.element('#mmeasure option').remove();
                    scope['measures'] = resolve;
                    scope.$apply();
                    this.setUpdateMeasure(angular.element('#mmeasure option').length - 1, resolve.length);
                });
            });
        }
        setUpdateMeasure(len, obj) {
            setTimeout(() => {
                console.log('call set trigger chosen measure');
                if (len == obj) {
                    angular.element('#mmeasure').trigger('chosen:updated');
                }
                else {
                    console.log('this called new other');
                    this.setUpdateMeasure(angular.element('#mmeasure option').length - 1, obj);
                }
            }, 800);
            angular.element('#mmeasure').trigger('chosen:updated');
        }
        getMeasure(description) {
            return new Promise((resolve) => {
                angular.element.getJSON('/json/get/meter/materials/', { 'matnom': description }, (response) => {
                    if (response['status']) {
                        resolve(response['list']);
                    }
                    else {
                        resolve([]);
                    }
                });
            });
        }
    }
    EventDescription.$inject = [];
    Directivies.EventDescription = EventDescription;
    class EventMeasure {
        constructor() { }
        static instance() {
            return new EventMeasure();
        }
        link(scope, element, attrs, ctrl) {
            element.bind('change', () => {
                console.log('Execute when select measure change');
                this.getSummary(scope.$parent['vm']['smeasure']).then((resolve) => {
                    let data = resolve[0];
                    scope.$parent['vm']['summary']['code'] = data['materialesid'];
                    scope.$parent['vm']['summary']['name'] = `${data['matnom']} ${data['matmed']}`;
                    scope.$parent['vm']['summary']['unit'] = data['unidad'];
                    scope.$apply();
                    angular.element('#mmeasure').trigger('chosen:updated');
                });
            });
        }
        getSummary(mid) {
            return new Promise((resolve) => {
                angular.element.getJSON('/json/get/resumen/details/materiales/', { 'matid': mid }, (response) => {
                    if (response['status']) {
                        resolve(response['list']);
                    }
                    else {
                        resolve([]);
                    }
                });
            });
        }
    }
    EventMeasure.$inject = [];
    Directivies.EventMeasure = EventMeasure;
})(Directivies || (Directivies = {}));
let app = angular.module('app', ['ngCookies']);
app.service('sproxy', Service.Proxy);
app.controller('ctrlpurchase', Controller.PurchaseController);
app.directive('smaterials', Directivies.ComponentSearchMaterials.instance);
app.directive('esdesc', Directivies.EventDescription.instance);
app.directive('esmc', Directivies.EventKeyCode.instance);
app.directive('esmmeasure', Directivies.EventMeasure.instance);
let httpConfig = ($httpProvider) => {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
};
app.config(httpConfig);
