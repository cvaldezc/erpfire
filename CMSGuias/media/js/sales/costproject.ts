// import * as angular from "angular";

interface IProxy {
	get: (uri: string, options: object) => ng.IHttpPromise<any>;

	post: (url: string, options: object) => ng.IHttpPromise<any>;
}

class SProxy implements IProxy {

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

interface IController {
	itemizer: object;
	itemizers: object;
	assignament: number;
	getItemizer(): void;
	saveItemizer(): void;
}

class ControllerServiceProject implements IController {
	itemizer: object;
	itemizers: object;
	assignament: number = 0;

	static $inject = ['sproxy']

	constructor(private proxy: SProxy) {
		console.log("hi! hello world!!!");
		angular.element('.modal').modal();
		this.getItemizer();
	}

	getItemizer(): void {
		Materialize.toast('<i class="fa fa-cog"></i> Procesando...!', parseInt(undefined), 'toast-remove');
		this.proxy.get('', {itemizer: true}).then(
			(response: object) => {
				if (response['data']['status']) {
					this.itemizers = response['data']['itemizers']
					angular.element('.toast-remove').remove()
				}else{
					angular.element('.toast-remove').remove()
					Materialize.toast(`Error: ${response['data']['raise']}`, 2600)
				}
			}
		)
	}

	setItemizerSalesAmount(): void {
		// console.log(this.itemizer['purchase'] * 1.10);
		this.itemizer['sales'] = (Math.round(this.itemizer['purchase'] * 1.10) * 100) / 100;
		// console.log(this.itemizer);
	}

	saveItemizer(): void {
		Materialize.toast('<i class="fa fa-cog"></i> Procesando...!', parseInt(undefined), 'toast-remove');
		let params: object = this.itemizer;
		params['saveitemizer'] = true;
		this.proxy.post('', params).then(
			(response) => {
				if (response['data']['status']) {
					angular.element('.toast-remove').remove();
					this.getItemizer();
					Materialize.toast('Guardado!', 2600);
					this.itemizer = {
						name: '',
						purchase: 0,
						sales: 0
					}
					angular.element('#mitemizer').modal('close');
				}else{
					Materialize.toast('${response["raise"]}', 6600);
				}
			}
		)
	}
}

let apps = angular.module('app', ['ngCookies']);
apps.service('sproxy', SProxy);
apps.controller('controller', ControllerServiceProject)
let httpConfigs = ($httpProvider: ng.IHttpProvider) => {
	$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
	$httpProvider.defaults.xsrfCookieName = 'csrftoken';
	$httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
};
apps.config(httpConfigs);
// Materialize.toast('hi!', 6000);