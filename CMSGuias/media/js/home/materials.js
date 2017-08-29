var MProxy = (function () {
    function MProxy($http, $cookies) {
        this.$http = $http;
        this.$cookies = $cookies;
        this.$http.defaults.headers.post['X-CSRFToken'] = $cookies['csrftoken'];
        this.$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    MProxy.prototype.get = function (uri, options) {
        return this.$http.get(uri, { params: options });
    };
    MProxy.prototype.post = function (uri, options) {
        return this.$http.post(uri, this.transformData(options), { transformRequest: angular.identity, headers: { 'Content-Type': undefined } });
    };
    MProxy.prototype.transformData = function (data) {
        var form = new FormData();
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var element = data[key];
                form.append(key, element);
            }
        }
        return form;
    };
    MProxy.$inject = ['$http', '$cookies'];
    return MProxy;
}());
var ControllerMasterItem = (function () {
    function ControllerMasterItem(proxy) {
        this.proxy = proxy;
        this.categories = [];
        this.masters = [];
        this.master = {};
        this.delselected = {};
        this.search = {};
        this.blocknew = false;
        this.permissionarea = '';
        this.selected = false;
        console.log("ready!!!");
        this.initialize('all');
    }
    ControllerMasterItem.prototype.initialize = function (type) {
        setTimeout(function () {
            angular.element('.select-chosen').chosen({ width: '100%' });
        }, 800);
        this.listCategories();
        this.listMaster({ 'startlist': true , 'filt': type});
    };
    ControllerMasterItem.prototype.listMaster = function (params) {
        var _this = this;
        if (params === void 0) { params = {}; }
        Materialize.toast('Procesando, espere!', parseInt('undefined'), 'toast-remove');
        this.masters = [];
        this.delselected = {};
        this.proxy.get('', params).then(function (response) {
            angular.element('.toast-remove').remove();
            if (response['data']['status']) {
                _this.masters = response['data']['masters'];
            }
            else {
                Materialize.toast("Error: " + response['data']['raise'], 4000);
            }
        });
    };
    ControllerMasterItem.prototype.listCategories = function () {
        var _this = this;
        this.proxy.get('', { 'catergories': true }).then(function (response) {
            if (response['data']['status']) {
                _this.categories = response['data']['mastertypes'];
            }
            else {
                Materialize.toast("Error: " + response['data']['raise'], 4000);
            }
        });
    };
    ControllerMasterItem.prototype.changeSelected = function () {
        for (var x in this.delselected) {
            this.delselected[x]['status'] = this.selected;
        }
    };
    ControllerMasterItem.prototype.searchMaster = function (event, value) {
        if (event.keyCode == 13) {
            var params = {};
            params[value] = this.search[value];
            var cbofilttipo = this.master['cbofilttipo']
            console.log(cbofilttipo)
            if (cbofilttipo== undefined) {
                cbofilttipo = ''
            };
            params['tipocat']= cbofilttipo
            this.listMaster(params);
        }
    };
    ControllerMasterItem.prototype.showEditing = function (obj) {
        this.master['materiales_id'] = obj['pk'];
        this.master['matnom'] = obj['fields']['matnom'];
        this.master['matmed'] = obj['fields']['matmed'];
        this.master['matacb'] = obj['fields']['matacb'];
        this.master['matare'] = obj['fields']['matare'];
        this.master['unidad'] = obj['fields']['unidad'];
        this.master['weight'] = obj['fields']['weight'];
        this.master['tipo'] = obj['fields']['tipo'];
        this.master['edit'] = true;
        setTimeout(function () {
            angular.element('.select-chosen').trigger('chosen:updated');
        }, 400);
        this.blocknew = true;
    };
    ControllerMasterItem.prototype.saveMaster = function () {
        var _this = this;
        Materialize.toast('Procesando, espere!', parseInt('undefined'), 'toast-remove');
        var params = this.master;
        params['saveMaterial'] = true;
        this.proxy.post('', params).then(function (response) {
            angular.element('.toast-remove').remove();
            if (response['data']['status']) {
                _this.listMaster({ 'desc': params['matnom'] });
                _this.master['materiales_id'] = '';
                _this.master['matnom'] = '';
                _this.master['matmed'] = '';
                _this.master['matacb'] = '';
                _this.master['matare'] = '';
                // _this.master['unidad'] = '';
                _this.master['weight'] = '';
                // _this.master['tipo'] = '';
                _this.master['edit'] = false;
                _this.blocknew = false;
            }
            else {
                Materialize.toast("Error: " + response['data']['raise'], 4000);
            }
        });
    };
    ControllerMasterItem.prototype.singleDelete = function (obj) {
        var _this = this;
        swal({
            title: 'Desea eliminar el item?',
            text: obj['fields']['matnom'] + " " + obj['fields']['matmed'] + " " + obj['fields']['unidad'] + " " + obj['fields']['tipo'],
            type: 'warning',
            showCancelButton: true,
            cancelButtonText: 'No',
            confirmButtonText: 'Si!, eliminar',
            confirmButtonColor: '#d64848',
            closeOnCancel: true,
            closeOnConfirm: true
        }, function (isConfirm) {
            if (isConfirm) {
                Materialize.toast('Procesando, espere!', parseInt('undefined'), 'toast-remove');
                var params = {
                    delsignle: true,
                    materials: obj['pk']
                };
                _this.proxy.post('', params).then(function (response) {
                    angular.element('.toast-remove').remove();
                    if (response['data']['status']) {
                        Materialize.toast('Se ha eliminado correctamente', 3000);
                        _this.listMaster({ 'desc': obj['fields']['matnom'] });
                    }
                    else {
                        Materialize.toast("Error: " + response['data']['raise'], 8000);
                    }
                });
            }
        });
    };
    ControllerMasterItem.prototype.selectedDelete = function () {
        var _this = this;
        swal({
            title: 'Desea eliminar los items seleccionados?',
            text: '',
            type: 'warning',
            showCancelButton: true,
            cancelButtonText: 'No',
            confirmButtonText: 'Si!, eliminar',
            confirmButtonColor: '#d64848',
            closeOnCancel: true,
            closeOnConfirm: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (isConfirm) {
                    Materialize.toast('Procesando, espere!', parseInt('undefined'), 'toast-remove');
                    var params = {
                        delselected: true,
                        materials: JSON.stringify(_this.delselected)
                    };
                    _this.proxy.post('', params).then(function (response) {
                        angular.element('.toast-remove').remove();
                        if (response['data']['status']) {
                            Materialize.toast('Se han eliminado correctamente', 3000);
                            _this.initialize('all');
                        }
                        else {
                            Materialize.toast("Error: " + response['data']['raise'] + " " + response['data']['nodel'], 8000);
                        }
                    });
                }
            }
        });
    };

    ControllerMasterItem.prototype.filtercategory = function () {
        var category = this.master['cbofilttipo']
        if (category==null) {
            category = "all"
        };
        console.log(category)
        this.initialize(category);
    };

    ControllerMasterItem.prototype.selectcategory = function () {
        console.log(this.master['tipo'])
        angular.element('#tipo').trigger('chosen:updated')
    };

    ControllerMasterItem.prototype.selectunit = function () {
        console.log(this.master['unidad'])
        angular.element('#unidad').trigger('chosen:updated')
    };

    ControllerMasterItem.$inject = ['sproxy'];
    return ControllerMasterItem;
}());
var app = angular.module('app', ['ngCookies']);
app.service('sproxy', MProxy);
app.controller('ControllerMasterItem', ControllerMasterItem);
// app.directive('smaterials', Directivies.ComponentSearchMaterials.instance);
// app.directive('esdesc', Directivies.EventDescription.instance);
// app.directive('esmc', Directivies.EventKeyCode.instance);
// app.directive('esmmeasure', Directivies.EventMeasure.instance);
var httpConfig = function ($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
};
app.config(httpConfig);
