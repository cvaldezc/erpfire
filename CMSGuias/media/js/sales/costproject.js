// import * as angular from "angular";
var SProxy = /** @class */ (function () {
    function SProxy($http, $cookies) {
        this.$http = $http;
        this.$cookies = $cookies;
        this.$http.defaults.headers.post['X-CSRFToken'] = $cookies['csrftoken'];
        this.$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    SProxy.prototype.get = function (uri, options) {
        return this.$http.get(uri, { params: options });
    };
    SProxy.prototype.post = function (uri, options) {
        return this.$http.post(uri, this.transformData(options), { transformRequest: angular.identity, headers: { 'Content-Type': undefined } });
    };
    SProxy.prototype.transformData = function (data) {
        var form = new FormData();
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var element = data[key];
                form.append(key, element);
            }
        }
        return form;
    };
    SProxy.$inject = ['$http', '$cookies'];
    return SProxy;
}());
var ControllerServiceProject = /** @class */ (function () {
    function ControllerServiceProject(proxy) {
        this.proxy = proxy;
        this.assignament = 0;
        this.spent = 0;
        console.log("hi! hello world!!!");
        angular.element('.modal').modal();
        this.getItemizer();
    }
    ControllerServiceProject.prototype.getItemizer = function () {
        var _this = this;
        Materialize.toast('<i class="fa fa-cog"></i> Procesando...!', parseInt(undefined), 'toast-remove');
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
        Materialize.toast('<i class="fa fa-cog"></i> Procesando...!', parseInt(undefined), 'toast-remove');
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
                        this.itemizers[key]['services'][dt]['total'] = total;
                        sum += (total);
                    }
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
            confirmButtonColor: '#fe6969',
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                var params = {
                    delitemizer: true,
                    itemizer: item['pk']
                };
                _this.proxy.post('', params).then(function (response) {
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
    ControllerServiceProject.$inject = ['sproxy'];
    return ControllerServiceProject;
}());
var apps = angular.module('app', ['ngCookies']);
apps.service('sproxy', SProxy);
apps.controller('controller', ControllerServiceProject);
var httpConfigs = function ($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
};
apps.config(httpConfigs);
// Materialize.toast('hi!', 6000); 
