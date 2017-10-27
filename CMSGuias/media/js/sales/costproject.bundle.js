/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var angular = __webpack_require__(1);
var ServiceFactory = /** @class */ (function () {
    function ServiceFactory($http, $cookies) {
        this.$http = $http;
        this.$cookies = $cookies;
        // this.$http.defaults.headers['post'][''] = ''
        $http.defaults.headers.post['X-CSRFToken'] = $cookies.get('csrftoken');
        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    ServiceFactory.prototype.get = function (uri, options) {
        return this.$http.get(uri, { params: options });
    };
    ServiceFactory.prototype.post = function (uri, options) {
        return this.$http.post(uri, this.transformData(options), { transformRequest: angular.identity, headers: { 'Content-Type': undefined } });
    };
    ServiceFactory.prototype.transformData = function (data) {
        var form = new FormData();
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var element = data[key];
                form.append(key, element);
            }
        }
        return form;
    };
    ServiceFactory.$inject = ['$http', '$cookies'];
    return ServiceFactory;
}());
exports.ServiceFactory = ServiceFactory;
exports.httpConfigs = function ($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
};


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = angular;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var angular = __webpack_require__(1);
var serviceFactory_1 = __webpack_require__(0);
var ControllerServiceProject = /** @class */ (function () {
    function ControllerServiceProject(proxy) {
        var _this = this;
        this.proxy = proxy;
        this.itemizers = {};
        this.assignament = 0;
        this.spent = 0;
        this.prcurrency = {
            'pk': null,
            'symbol': null
        };
        this.sbworkforce = false;
        this.wf = 0;
        this.wfu = 0;
        this.tworkforce = 0;
        this.project = { pk: '', symbol: '' };
        this.accbudget = 0;
        this.accoperations = 0;
        this.accguides = 0;
        this.chart_indeterminate = [];
        this.chart_progress = [];
        console.log("hi! hello world!!!");
        angular.element('.modal').modal();
        this.getItemizer();
        this.workforceData();
        setTimeout(function () {
            // this.getCurve()
            _this.costBudget();
            _this.costOperations();
            _this.costGuides();
            google.charts.load("visualization", "1", { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(function () { return _this.getCurve(); });
        }, 800);
        window.addEventListener('resize', function () { _this.drawCharts(); }, false);
    }
    ControllerServiceProject.prototype.getItemizer = function () {
        var _this = this;
        Materialize.toast('<i class="fa fa-cog"></i> Procesando...!', parseInt('undefined'), 'toast-remove');
        this.proxy.get('', { itemizer: true }).then(function (response) {
            if (response['data']['status']) {
                _this.itemizers = response['data']['itemizers'];
                angular.element('.toast-remove').remove();
                _this.assignament = 0;
                _this.spent = 0;
                _this.calcAmounts();
            }
            else {
                angular.element('.toast-remove').remove();
                Materialize.toast("Error: " + response['data']['raise'], 2600);
            }
        });
    };
    ControllerServiceProject.prototype.setItemizerSalesAmount = function () {
        // console.log(this.itemizer['purchase'] * 1.10);
        this.itemizer['sales'] = (Math.round(this.itemizer['purchase'] * 1.10) * 100) / 100;
        // console.log(this.itemizer);
    };
    ControllerServiceProject.prototype.saveItemizer = function () {
        var _this = this;
        Materialize.toast('<i class="fa fa-cog"></i> Procesando...!', parseInt('undefined'), 'toast-remove');
        var params = this.itemizer;
        params['saveitemizer'] = true;
        this.proxy.post('', params).then(function (response) {
            if (response['data']['status']) {
                angular.element('.toast-remove').remove();
                _this.getItemizer();
                Materialize.toast('Guardado!', 2600);
                _this.itemizer = {
                    name: '',
                    purchase: 0,
                    sales: 0
                };
                angular.element('#mitemizer').modal('close');
            }
            else {
                Materialize.toast("" + response['data']['raise'], 6600);
            }
        });
    };
    ControllerServiceProject.prototype.calcAmounts = function () {
        // import itemizers
        for (var key in this.itemizers) {
            if (this.itemizers.hasOwnProperty(key)) {
                var element = this.itemizers[key];
                var sum = 0;
                for (var dt in element['services']) {
                    if (element['services'].hasOwnProperty(dt)) {
                        var services = element['services'][dt];
                        var dsct = (this.itemizers[key]['services'][dt].amounts * (this.itemizers[key]['services'][dt].fields.dsct / 100));
                        dsct = (this.itemizers[key]['services'][dt].amounts - dsct);
                        // let igv: number = ((this.itemizers[key]['services'][dt].fields.sigv ? this.itemizers[key]['services'][dt].configure.fields.igv : 0)/100)
                        var total = dsct;
                        // igv = (igv > 0) ? (dsct * (igv)) : 0;
                        // let total: number = ((dsct) + (igv));
                        // total = ((this.itemizers[key]['services'][dt].fields.currency.pk == this.itemizers[key]['services'][dt].configure.fields.moneda.pk) ? total : (total / this.itemizers[key]['services'][dt]['exchange']));
                        if (this.prcurrency.pk !== this.itemizers[key]['services'][dt].fields.currency.pk) {
                            if (this.itemizers[key]['services'][dt].exchange > 1) {
                                total = (total / this.itemizers[key]['services'][dt].exchange);
                            }
                            else {
                                total = (total * this.itemizers[key]['services'][dt].exchange);
                            }
                        }
                        this.itemizers[key]['services'][dt]['total'] = total;
                        sum += (total);
                    }
                    // here change amount
                }
                this.itemizers[key]['sum'] = sum;
                this.spent += sum;
            }
        }
    };
    ControllerServiceProject.prototype.showEdit = function (item) {
        this.itemizer = {
            name: item['fields']['name'],
            purchase: parseFloat(item['fields']['purchase']),
            sales: parseFloat(item['fields']['sales']),
            itemizer: item['pk']
        };
        angular.element('#mitemizer').modal('open');
    };
    ControllerServiceProject.prototype.delItem = function (item) {
        var _this = this;
        swal({
            title: "Realmente desea eliminar el item " + item['fields']['name'] + "?",
            text: 'Nota: El item no se eliminara si tiene ordenes asociadas.',
            showCancelButton: true,
            confirmButtonText: 'Si! eliminar',
            cancelButtonText: 'No',
            confirmButtonColor: '#d33',
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                var params = {
                    delitemizer: true,
                    itemizer: item['pk']
                };
                _this.proxy.post('', params)
                    .then(function (response) {
                    if (response['data']['status']) {
                        _this.getItemizer();
                        Materialize.toast('Eliminado!', 2600);
                    }
                    else {
                        Materialize.toast("Error: " + response['data']['raise'], 10600);
                    }
                });
            }
        });
    };
    /**
     * block workforce
     */
    ControllerServiceProject.prototype.workforce = function () {
        var gworkforce = document.getElementById("workforce");
        var gworkforceUsed = document.getElementById("workforceused");
        var wdiv = document.createElement('div'), winput = document.createElement('input');
        var wudiv = document.createElement('div'), wuinput = document.createElement('input'), wf = 0, wfu = 0;
        // set data if content
        wf = parseFloat(gworkforce.innerText.trim()) || 0;
        wfu = parseFloat(gworkforceUsed.innerText.trim()) || 0;
        // clean content before insert controls
        gworkforce.innerHTML = '';
        gworkforceUsed.innerHTML = '';
        wdiv.setAttribute('class', 'input-field');
        winput.type = 'number';
        winput.step = '0.10';
        winput.id = 'iworkforce';
        winput.setAttribute('class', 'right-align');
        winput.value = "" + wf;
        wdiv.appendChild(winput);
        gworkforce.appendChild(wdiv);
        winput.focus();
        wudiv.setAttribute('class', 'input-field');
        wuinput.type = 'number';
        wuinput.step = '0.10';
        wuinput.id = 'iworkforceused';
        wuinput.setAttribute('class', 'right-align');
        wuinput.value = "" + wfu;
        wudiv.appendChild(wuinput);
        gworkforceUsed.appendChild(wudiv);
        this.sbworkforce = true;
    };
    ControllerServiceProject.prototype.saveWorkforce = function () {
        var _this = this;
        var iwf = document.getElementById('iworkforce'), iwfu = document.getElementById('iworkforceused');
        if (iwf != undefined && iwfu != undefined) {
            var params_1 = {
                workforce: iwf.value,
                workforceused: iwfu.value,
            };
            this.proxy.post('', params_1)
                .then(function (response) {
                if (!response['data'].hasOwnProperty('raise') && response['data']) {
                    var cwf = document.getElementById('workforce'), cwfu = document.getElementById("workforceused");
                    cwf.innerText = params_1.workforce;
                    cwfu.innerText = params_1.workforceused;
                    _this.wf = parseFloat(params_1['workforce']);
                    _this.wfu = parseFloat(params_1['workforceused']);
                    _this.tworkforce = (params_1.workforce - params_1.workforceused);
                    _this.sbworkforce = false;
                }
                else {
                    Materialize.toast("Error " + response['data']['raise'], 3600);
                }
            });
        }
    };
    ControllerServiceProject.prototype.workforceData = function () {
        var _this = this;
        this.proxy.get('', { 'listworkforce': true })
            .then(function (response) {
            if (!response['data'].hasOwnProperty('raise')) {
                var cwf = document.getElementById('workforce'), cwfu = document.getElementById("workforceused");
                cwf.innerText = response['data'].workforce;
                cwfu.innerText = response['data'].workforceused;
                _this.wf = parseFloat(response['data']['workforce']);
                _this.wfu = parseFloat(response['data']['workforceused']);
                _this.tworkforce = (response['data'].workforce - response['data'].workforceused);
            }
            else {
                Materialize.toast("Error " + response['data']['raise'], 3600);
            }
        });
    };
    /* enblock */
    /**
     * block cost
     */
    ControllerServiceProject.prototype.costBudget = function () {
        var _this = this;
        this.proxy.get("/sales/projects/manager/" + this.project.pk + "/", { 'budget': true, 'cost': true })
            .then(function (response) {
            if (!response.data.hasOwnProperty('raise')) {
                _this.accbudget = response['data']['purchase'];
            }
            else {
                Materialize.toast("Error " + response['data']['raise'], 3600);
            }
        });
    };
    ControllerServiceProject.prototype.costOperations = function () {
        var _this = this;
        this.proxy.get("/sales/projects/manager/" + this.project.pk + "/", { 'cost': true, 'operations': true })
            .then(function (response) {
            if (!response.data.hasOwnProperty('raise')) {
                _this.accoperations = parseFloat(response['data']['purchase']);
            }
            else {
                Materialize.toast("Error " + response['data']['raise'], 3600);
            }
        });
    };
    ControllerServiceProject.prototype.costGuides = function () {
        var _this = this;
        this.proxy.get("/sales/projects/manager/" + this.project.pk, { 'cost': true, 'guides': true })
            .then(function (response) {
            if (!response.data.hasOwnProperty('raise')) {
                _this.accguides = parseFloat(response['data']['purchase']);
            }
            else {
                Materialize.toast("Error: " + response['data']['raise'], 3600);
            }
        });
    };
    ControllerServiceProject.prototype.getCurve = function () {
        var _this = this;
        this.proxy.get("/sales/projects/manager/" + this.project.pk, { 'cost': true, 'curves': true })
            .then(function (response) {
            // console.log(response['data'])
            if (!response['data'].hasOwnProperty('raise')) {
                _this.chart_indeterminate = response['data']['indeterminate'];
                _this.chart_indeterminate.unshift(['Dates', 'Compra', 'Ventas']);
                _this.chart_progress = response['data']['progress'];
                _this.chart_progress.unshift(['Dates', 'Compra', 'Ventas']);
                _this.drawCharts();
            }
        });
    };
    /** endblock */
    ControllerServiceProject.prototype.drawCharts = function () {
        var data = google.visualization.arrayToDataTable(this.chart_indeterminate);
        var options = {
            title: 'Costo del Proyecto en el Tiempo',
            hAxis: { title: 'Fechas', titleTextStyle: { color: '#333' } },
            vAxis: { minValue: 0, title: 'Costo' },
            curveType: 'none',
            explorer: { axis: 'horizontal', keepInBounds: false },
            width: (window.innerWidth < 780) ? 1024 : (window.innerWidth - 80),
            height: 500
        };
        var chart = new google.visualization.AreaChart(document.getElementById('chart_view_indeterminate'));
        chart.draw(data, options);
        // block chart progess
        var dprogess = google.visualization.arrayToDataTable(this.chart_progress);
        var chart_progres = new google.visualization.LineChart(document.getElementById('chart_view_progress'));
        options['curveType'] = 'function';
        chart_progres.draw(dprogess, options);
    };
    ControllerServiceProject.$inject = ['ServiceFactory'];
    return ControllerServiceProject;
}());
var apps = angular.module('app', ['ngCookies']);
apps.service('ServiceFactory', serviceFactory_1.ServiceFactory);
apps.controller('controller', ControllerServiceProject);
apps.config(serviceFactory_1.httpConfigs);


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(0);
module.exports = __webpack_require__(2);


/***/ })
/******/ ]);