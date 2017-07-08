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
	getItemizer(): void;

}

class ControllerServiceProject implements IController {
	itemizer: object;
	static $inject = ['sproxy']

	constructor(private proxy: SProxy) {
		console.log("hi! hello world!!!");
		angular.element('.modal').modal();
		this.getItemizer();
	}

	getItemizer(): void {
		console.log('get itemizer')
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