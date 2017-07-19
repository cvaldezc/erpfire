class MProxy {

	static $inject = ['$http', '$cookies'];

	constructor(private $http: ng.IHttpService, private $cookies: ng.cookies.ICookieStoreService) {
		this.$http.defaults.headers.post['X-CSRFToken'] = $cookies['csrftoken'];
		this.$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
	}

	get(uri: string, options: object) {
		return this.$http.get(uri, {params: options});
	}

	post(uri: string, options: object) {
		return this.$http.post(uri, this.transformData(options), {transformRequest: angular.identity, headers: {'Content-Type': undefined}})
	}

	private transformData(data: object): FormData {
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

interface IMaterialsController {
	permissionarea: string;
	blocknew: boolean;
	categories: object;
	masters: object;
	master: object;
	delselected: object;
	selected: boolean;
	search: object;
	initialize(): void;
	listMaster(params: object): void;
	listCategories(): void;
	showEditing(obj: object): void;
	singleDelete(obj: object): void;
	selectedDelete(): void;
	changeSelected(): void;
	searchMaster(event: any, search: string): void;
	saveMaster(): void;
}

class ControllerMasterItem implements IMaterialsController {

	static $inject = ['sproxy'];
	categories = [];
	masters = [];
	master = {};
	delselected = {};
	search = {};
	blocknew = false;
	permissionarea = '';
	selected: boolean = false;

	constructor(private proxy: MProxy) {
		console.log("ready!!!");
		this.initialize();
	}

	initialize(): void {
		setTimeout(function() {
			angular.element('.select-chosen').chosen({width: '100%'});
		}, 800);
		this.listCategories();
		this.listMaster({'startlist': true});
	}

	listMaster(params: object = {}): void {
		Materialize.toast('Procesando, espere!', parseInt('undefined'), 'toast-remove');
		this.masters = [];
		this.delselected = {};
		this.proxy.get('', params).then(
			(response: object) => {
				angular.element('.toast-remove').remove();
				if (response['data']['status']) {
					this.masters = response['data']['masters'];
				}else{
					Materialize.toast(`Error: ${response['data']['raise']}`, 4000);
				}
			}
		);
	}

	listCategories(): void {
		this.proxy.get('', {'catergories': true}).then(
			(response: object) => {
				if (response['data']['status']) {
					this.categories = response['data']['mastertypes'];
					setTimeout(function() {
						angular.element('#tipo').chosen({width: '100%'});
					}, 800);
				}else{
					Materialize.toast(`Error: ${response['data']['raise']}`, 4000);
				}
			}
		);
	}

	changeSelected(): void {
		for (var x in this.delselected) {
			this.delselected[x]['status'] = this.selected;
		}
	}

	searchMaster(event, value): void {
		if (event.keyCode == 13) {
			let params = {}
			params[value] = this.search[value];
			this.listMaster(params);
		}
	}

	showEditing(obj: object): void {
		this.master['materiales_id'] = obj['pk'];
		this.master['matnom'] = obj['fields']['matnom'];
		this.master['matmed'] = obj['fields']['matmed'];
		this.master['matacb'] = obj['fields']['matacb'];
		this.master['matare'] = obj['fields']['matare'];
		this.master['unidad'] = obj['fields']['unidad'];
		this.master['weight'] = obj['fields']['weight'];
		this.master['tipo'] = obj['fields']['tipo'];
		this.master['edit'] = true;
		setTimeout(function() {
			angular.element('.select-chosen').trigger('chosen:updated');
		}, 400);
		this.blocknew = true;
	}

	saveMaster(): void {
		Materialize.toast('Procesando, espere!', parseInt('undefined'), 'toast-remove');
		let params = this.master;
		params['saveMaterial'] = true;
		this.proxy.post('', params).then(
			(response: object) => {
				angular.element('.toast-remove').remove();
				if (response['data']['status']) {
					this.listMaster({'desc': params['matnom']});
					this.master['materiales_id'] = '';
					this.master['matnom'] = '';
					this.master['matmed'] = '';
					this.master['matacb'] = '';
					this.master['matare'] = '';
					this.master['unidad'] = '';
					this.master['weight'] = '';
					this.master['tipo'] = '';
					this.master['edit'] = false;
					this.blocknew = false;
				}else{
					Materialize.toast(`Error: ${response['data']['raise']}`, 4000);
				}
			}
		);
	}

	singleDelete(obj: object): void {
		swal({
			title: 'Desea eliminar el item?',
			text: `${obj['fields']['matnom']} ${obj['fields']['matmed']} ${obj['fields']['unidad']} ${obj['fields']['tipo']}`,
			type: 'warning',
			showCancelButton: true,
			cancelButtonText: 'No',
			confirmButtonText: 'Si!, eliminar',
			confirmButtonColor: '#d64848',
			closeOnCancel: true,
			closeOnConfirm: true
		}, (isConfirm) => {
			if (isConfirm) {
				Materialize.toast('Procesando, espere!', parseInt('undefined'), 'toast-remove');
				let params = {
					delsignle: true,
					materials: obj['pk']
				}
				this.proxy.post('', params).then(
					(response: object) => {
						angular.element('.toast-remove').remove();
						if (response['data']['status']) {
							Materialize.toast('Se ha eliminado correctamente', 3000);
							this.listMaster({'desc': obj['fields']['matnom']});
						}
						else
						{
							Materialize.toast(`Error: ${response['data']['raise']}`, 8000);
						}
					}
				)
			}
		});
	}

	selectedDelete(): void {
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
		}, (isConfirm) => {
			if (isConfirm) {
				if (isConfirm) {
					Materialize.toast('Procesando, espere!', parseInt('undefined'), 'toast-remove');
					let params = {
						delselected: true,
						materials: JSON.stringify(this.delselected)
					}
					this.proxy.post('', params).then(
						(response: object) => {
							angular.element('.toast-remove').remove();
							if (response['data']['status']) {
								Materialize.toast('Se han eliminado correctamente', 3000);
								this.initialize();
							}
							else
							{
								Materialize.toast(`Error: ${response['data']['raise']}`, 8000);
							}
						}
					);
				}
			}
		});
	}
}

let app = angular.module('app', ['ngCookies']);
app.service('sproxy', MProxy);
app.controller('ControllerMasterItem', ControllerMasterItem);
// app.directive('smaterials', Directivies.ComponentSearchMaterials.instance);
// app.directive('esdesc', Directivies.EventDescription.instance);
// app.directive('esmc', Directivies.EventKeyCode.instance);
// app.directive('esmmeasure', Directivies.EventMeasure.instance);
let httpConfig = ($httpProvider: ng.IHttpProvider) => {
	$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
	$httpProvider.defaults.xsrfCookieName = 'csrftoken';
	$httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
};
app.config(httpConfig);