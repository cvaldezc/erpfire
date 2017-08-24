'use strict';
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
        Proxy.prototype.post = function (uri, options) {
            return this.$http.post(uri, this.transformData(options), { transformRequest: angular.identity, headers: { 'Content-Type': undefined } });
        };
        Proxy.prototype.transformData = function (data) {
            var form = new FormData();
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    var element = data[key];
                    form.append(key, element);
                }
            }
            return form;
        };
        Proxy.$inject = ['$http', '$cookies'];
        return Proxy;
    }());
    Service.Proxy = Proxy;
})(Service || (Service = {}));
var Controller;
(function (Controller) {
    var PurchaseController = (function () {
        function PurchaseController($log, proxy) {
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
        PurchaseController.prototype.initialize = function () {
            this.getProjects();
            this.getSuppliers();
            this.getDocumentPayment();
            this.getMethodPayment();
            this.getCurrency();
            this.getBrand();
            this.getModel();
            this.getUnits();
        };
        PurchaseController.prototype.parseSelect = function () {
            this.purchase['fields']['projects'] = this.purchase['fields']['projects'].split(',');
            angular.element("#observation").trumbowyg("html", this.purchase['fields']['observation']);
            setTimeout(function () {
                angular.element(".projects").trigger("chosen:updated");
                angular.element(".suppliers").trigger("chosen:updated");
                angular.element(".documentpayment").trigger("chosen:updated");
                angular.element(".methodpayment").trigger("chosen:updated");
                angular.element(".currency").trigger("chosen:updated");
                angular.element(".brands").trigger("chosen:updated");
                angular.element(".models").trigger("chosen:updated");
                angular.element(".units").trigger("chosen:updated");
            }, 400);
        };
        PurchaseController.prototype.getPurchase = function () {
            var _this = this;
            this.proxy.get("", { 'purchase': true }).then(function (response) {
                if (response['data']['status']) {
                    _this.purchase['fields'] = response['data']['purchase']['fields'];
                    // this.purchase['details'] = response['data']['purchase']['details'];
                    _this.igv = response['data']['igv'];
                    _this.getPurchaseDetails();
                    _this.parseSelect();
                }
            });
        };
        PurchaseController.prototype.getPurchaseDetails = function () {
            var _this = this;
            this.proxy.get("", { 'details': true }).then(function (response) {
                if (response['data']['status']) {
                    _this.purchase['samount'] = 0;
                    _this.purchase['details'] = response['data']['details'];
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
        PurchaseController.prototype.getBrand = function () {
            var _this = this;
            this.proxy.get('/json/brand/list/option/', {}).then(function (response) {
                if (response['data']['status']) {
                    _this.brands = response['data']['brand'];
                    setTimeout(function () {
                        angular.element('.brands').trigger('chosen:updated');
                    }, 800);
                }
            });
        };
        PurchaseController.prototype.getModel = function () {
            var _this = this;
            this.proxy.get('/json/model/list/option/', {}).then(function (response) {
                if (response['data']['status']) {
                    _this.models = response['data']['model'];
                    setTimeout(function () {
                        angular.element('.models').trigger('chosen:updated');
                    }, 800);
                }
            });
        };
        PurchaseController.prototype.getUnits = function () {
            var _this = this;
            this.proxy.get('/unit/list/', {}).then(function (response) {
                if (response['data']['status']) {
                    _this.units = response['data']['lunit'];
                    setTimeout(function () {
                        angular.element('.units').trigger('chosen:updated');
                    }, 800);
                }
            });
        };
        // 2017-06-16 10:44:58
        // @Christian
        PurchaseController.prototype.saveMaterial = function () {
            // collection data for save
            var data = this.purchase['fields'];
            // data['']
        };
        PurchaseController.prototype.saveDetails = function () {
            var _this = this;
            // launch toast
            Materialize.toast('<b>Procesando...!<b>', parseInt('undefined'), 'toast-remove');
            // get object data for send
            var save = this.uc;
            save['materials'] = this.summary['code'];
            save['ucpurchase'] = true;
            this.proxy.post('', save).then(function (response) {
                angular.element('.toast-remove').remove();
                if (response['data']['status']) {
                    Materialize.toast('<i class="fa fa-check fa-2x"></i> Guardado!', 2600);
                    _this.getPurchaseDetails();
                    // clean data
                    _this.summary['code'] = '';
                    _this.summary['name'] = '';
                    _this.summary['unit'] = '';
                    // data for form
                    // this.uc['brand'] = edit['brand']['pk'];
                    // this.uc['model'] = edit['model']['pk'];
                    // this.uc['oldbrand'] = edit['brand']['pk'];
                    // this.uc['oldmodel'] = edit['model']['pk'];
                    // this.uc['unit'] = (edit['unit'] == '') ? edit['materiales']['fields']['unidad'] : edit['unit'];
                    _this.uc['price'] = 0;
                    _this.uc['quantity'] = 0;
                    _this.uc['discount'] = 0;
                    _this.uc['perception'] = 0;
                }
                else {
                    // ${response['data']['raise']}
                    Materialize.toast("<i class=\"fa fa-times fa-2x\"></i> &nbsp;Error " + response['data']['raise'], 6000);
                }
            }, function (error) {
                Materialize.toast(error, 8000);
            });
        };
        PurchaseController.prototype.checkedItems = function () {
            for (var key in this.purchase['modify']) {
                this.purchase['modify'][key]['status'] = this.chkdetails;
            }
        };
        PurchaseController.prototype.delDetails = function () {
            var _this = this;
            this.odel().then(function (result) {
                console.log(result);
                if (result.length > 0) {
                    _this.$log.log(result);
                    swal({
                        title: 'Desea eliminar los materiales seleccionados?',
                        type: 'warning',
                        closeOnConfirm: true,
                        closeOnCancel: true,
                        showCancelButton: true,
                        confirmButtonText: 'Si!',
                        confirmButtonColor: '#fe6969',
                        cancelButtonText: 'No!',
                    }, function (answer) {
                        if (answer) {
                            // send data for delete
                            Materialize.toast("<i class=\"fa fa-cog fa-2x fa-spin\"></i>&nbsp;Procesando...!", parseInt(undefined), 'toast-remove');
                            var param = {
                                delitems: true,
                                data: JSON.stringify(result)
                            };
                            _this.proxy.post('', param).then(function (response) {
                                angular.element('.toast-remove').remove();
                                if (response['data']['status']) {
                                    _this.getPurchaseDetails();
                                    Materialize.toast('<i class="fa fa-check fa-2x"></i>&nbsp;Materiales eliminados!', 2600);
                                }
                            });
                        }
                    });
                }
            });
        };
        PurchaseController.prototype.showComment = function (id, text) {
            this.comments = { pk: id, text: text };
            angular.element('.itemobservation').trumbowyg('html', text);
            angular.element('#mcomment').modal('open');
        };
        PurchaseController.prototype.saveComment = function () {
            var _this = this;
            var params = {
                pk: this.comments['pk'],
                savecomment: true,
                comment: angular.element('.itemobservation').trumbowyg('html')
            };
            this.proxy.post('', params).then(function (response) {
                if (response['data']['status']) {
                    _this.getPurchaseDetails();
                }
            });
        };
        PurchaseController.prototype.showDataModify = function (edit) {
            // add view summary materials
            this.summary['code'] = edit['materiales']['pk'];
            this.summary['name'] = edit['materiales']['fields']['matnom'] + " " + edit['materiales']['fields']['matmed'];
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
            setTimeout(function () {
                angular.element(".brands").trigger("chosen:updated");
                angular.element(".models").trigger("chosen:updated");
                angular.element(".units").trigger("chosen:updated");
            }, 800);
            // show block and position
            window.scrollTo(0, angular.element('.block-details').position().top);
        };
        PurchaseController.prototype.saveHeadPurchase = function () {
            Materialize.toast("<i class=\"fa fa-cog fa-spin fa-2x\"></i>&nbsp;Procesando...!", parseInt(undefined), 'toast-remove');
            // collect all data and generating params
            var params = this.purchase['fields'];
            params['observation'] = angular.element("#observation").trumbowyg('html');
            params['projects'] = params['projects'].join();
            var deposit = angular.element("#deposit")[0];
            if (deposit.files.length) {
                params['deposit'] = deposit.files[0];
            }
            params['savebedside'] = true;
            this.proxy.post('', params).then(function (response) {
                angular.element('.toast-remove').remove();
                if (response['data']['status']) {
                    location.href = '/logistics/purchase/list/';
                }
                else {
                    Materialize.toast("<i class=\"fa fa-times fa-2x\"></i>&nbsp;" + response['data']['raise'], 8000);
                }
            });
        };
        /**
         * Block function privates or auxiliars
         */
        PurchaseController.prototype.odel = function () {
            var _this = this;
            return new Promise(function (resolve) {
                var promises = [];
                for (var key in _this.purchase['modify']) {
                    if (_this.purchase['modify'].hasOwnProperty(key)) {
                        var element = _this.purchase['modify'][key];
                        if (element['status']) {
                            promises.push(key);
                        }
                    }
                }
                resolve(promises);
            });
        };
        PurchaseController.$inject = ['$log', 'sproxy'];
        return PurchaseController;
    }());
    Controller.PurchaseController = PurchaseController;
})(Controller || (Controller = {}));
var Directivies;
(function (Directivies) {
    var ComponentSearchMaterials = (function () {
        function ComponentSearchMaterials() {
            this._storedsc = '';
            this.scope = {
                smat: '=',
                smeasure: '=',
                sid: '='
            };
            this.restrict = 'AE';
            this.template = "<div>\n\t\t\t<div class=\"col s12 m6 l6 input-field\">\n\t\t\t\t<label for=\"mdescription\">Descripci\u00F3n</label>\n\t\t\t\t<select esdesc id=\"mdescription\" class=\"browser-default chosen-select\" data-placeholder=\"Ingrese una descripci\u00F3n\" ng-model=\"smat\">\n\t\t\t\t<option value=\"\"></option>\n\t\t\t\t<option value=\"{{x.name}}\" ng-repeat=\"x in descriptions\">{{x.name}}</option>\n\t\t\t\t</select>\n\t\t\t</div>\n\t\t\t<div class=\"col s12 m2 l2 input-field\">\n\t\t\t\t<input type=\"text\" id=\"mid\" placeholder=\"000000000000000\" maxlength=\"15\" ng-model=\"sid\" esmc>\n\t\t\t\t<label for=\"mid\">C\u00F3digo de Material</label></div>\n\t\t\t<div class=\"col s12 m4 l4 input-field\">\n\t\t\t\t<label for=\"mmeasure\">Medida</label>\n\t\t\t\t<select id=\"mmeasure\" class=\"browser-default chosen-select\" ng-model=\"smeasure\" data-placeholder=\"Seleccione un medida\" ng-options=\"msr.pk as msr.measure for msr in measures\" esmmeasure>\n\t\t\t\t</select></div></div>";
            this.replace = true;
        }
        ComponentSearchMaterials.instance = function () {
            return new ComponentSearchMaterials();
        };
        // private _filter: ng.IFilterDate;
        // require = 'ngModel';
        ComponentSearchMaterials.prototype.link = function (scope, element, attrs, ctrl) {
            var _this = this;
            console.log("Directive is called!");
            setInterval(function () {
                var valdesc = angular.element('#mdescription + div > div input.chosen-search-input').val();
                valdesc = valdesc.trim();
                if (angular.element('#mdescription + div > div ul.chosen-results li').length == 1) {
                    if (valdesc != '' && valdesc != _this._storedsc) {
                        _this._storedsc = valdesc;
                        _this.getDescription(valdesc).then(function (response) {
                            console.log('Load Response in select');
                            scope['descriptions'] = response;
                            scope.$apply();
                            angular.element('#mdescription').trigger('chosen:updated');
                            setTimeout(function () {
                                angular.element('#mdescription').trigger('chosen:updated');
                            }, 800);
                        });
                    }
                }
            }, 1000);
        };
        ComponentSearchMaterials.prototype.getDescription = function (descany) {
            return new Promise(function (resolve) {
                angular.element.getJSON('/json/get/materials/name/', { 'nom': descany }, function (response, textStatus, xhr) {
                    if (response['status']) {
                        resolve(response['name']);
                    }
                    else {
                        resolve([]);
                    }
                });
            });
        };
        ComponentSearchMaterials.$inject = [''];
        return ComponentSearchMaterials;
    }());
    Directivies.ComponentSearchMaterials = ComponentSearchMaterials;
    var EventKeyCode = (function () {
        function EventKeyCode() {
        }
        EventKeyCode.instance = function () {
            return new EventKeyCode();
        };
        EventKeyCode.prototype.link = function (scope, element, attrs, ctrl) {
            var _this = this;
            element.bind('keyup', function (event) {
                if (event.keyCode == 13) {
                    console.log(event.keyCode);
                    console.log('Materials code by search ' + scope.$parent['vm']['sid']);
                    _this.getSummary(scope.$parent['vm']['sid']).then(function (resolve) {
                        var data = resolve[0];
                        scope.$parent['vm']['summary']['code'] = data['materialesid'];
                        scope.$parent['vm']['summary']['name'] = data['matnom'] + " " + data['matmed'];
                        scope.$parent['vm']['summary']['unit'] = data['unidad'];
                        scope.$apply();
                    });
                }
            });
        };
        EventKeyCode.prototype.getSummary = function (mid) {
            return new Promise(function (resolve) {
                angular.element.getJSON('/json/get/resumen/details/materiales/', { 'matid': mid }, function (response) {
                    if (response['status']) {
                        resolve(response['list']);
                    }
                    else {
                        resolve([]);
                    }
                });
            });
        };
        EventKeyCode.$inject = [''];
        return EventKeyCode;
    }());
    Directivies.EventKeyCode = EventKeyCode;
    var EventDescription = (function () {
        function EventDescription() {
        }
        EventDescription.instance = function () {
            return new EventDescription();
        };
        EventDescription.prototype.link = function (scope, element, attrs, ctrl) {
            var _this = this;
            element.bind('change', function () {
                console.log(element.val());
                console.log(scope['smat']);
                _this.getMeasure(element.val()).then(function (resolve) {
                    angular.element('#mmeasure option').remove();
                    scope['measures'] = resolve;
                    scope.$apply();
                    _this.setUpdateMeasure(angular.element('#mmeasure option').length - 1, resolve.length);
                });
            });
        };
        EventDescription.prototype.setUpdateMeasure = function (len, obj) {
            var _this = this;
            setTimeout(function () {
                console.log('call set trigger chosen measure');
                if (len == obj) {
                    angular.element('#mmeasure').trigger('chosen:updated');
                }
                else {
                    console.log('this called new other');
                    _this.setUpdateMeasure(angular.element('#mmeasure option').length - 1, obj);
                }
            }, 800);
            angular.element('#mmeasure').trigger('chosen:updated');
        };
        EventDescription.prototype.getMeasure = function (description) {
            return new Promise(function (resolve) {
                angular.element.getJSON('/json/get/meter/materials/', { 'matnom': description }, function (response) {
                    if (response['status']) {
                        resolve(response['list']);
                    }
                    else {
                        resolve([]);
                    }
                });
            });
        };
        EventDescription.$inject = [];
        return EventDescription;
    }());
    Directivies.EventDescription = EventDescription;
    var EventMeasure = (function () {
        function EventMeasure() {
        }
        EventMeasure.instance = function () {
            return new EventMeasure();
        };
        EventMeasure.prototype.link = function (scope, element, attrs, ctrl) {
            var _this = this;
            element.bind('change', function () {
                console.log('Execute when select measure change');
                _this.getSummary(scope.$parent['vm']['smeasure']).then(function (resolve) {
                    var data = resolve[0];
                    scope.$parent['vm']['summary']['code'] = data['materialesid'];
                    scope.$parent['vm']['summary']['name'] = data['matnom'] + " " + data['matmed'];
                    scope.$parent['vm']['summary']['unit'] = data['unidad'];
                    scope.$apply();
                    angular.element('#mmeasure').trigger('chosen:updated');
                });
            });
        };
        EventMeasure.prototype.getSummary = function (mid) {
            return new Promise(function (resolve) {
                angular.element.getJSON('/json/get/resumen/details/materiales/', { 'matid': mid }, function (response) {
                    if (response['status']) {
                        resolve(response['list']);
                    }
                    else {
                        resolve([]);
                    }
                });
            });
        };
        EventMeasure.$inject = [];
        return EventMeasure;
    }());
    Directivies.EventMeasure = EventMeasure;
})(Directivies || (Directivies = {}));
var app = angular.module('app', ['ngCookies']);
app.service('sproxy', Service.Proxy);
app.controller('ctrlpurchase', Controller.PurchaseController);
app.directive('smaterials', Directivies.ComponentSearchMaterials.instance);
app.directive('esdesc', Directivies.EventDescription.instance);
app.directive('esmc', Directivies.EventKeyCode.instance);
app.directive('esmmeasure', Directivies.EventMeasure.instance);
var httpConfig = function ($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
};
app.config(httpConfig);
