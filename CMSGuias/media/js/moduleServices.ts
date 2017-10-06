import * as angular from 'angular'
// import { form-data } from 'core-js/es5'

interface IProxy {
	get: (uri: string, options: object) => ng.IHttpPromise<any>;

	post: (url: string, options: object) => ng.IHttpPromise<any>;
}

export class SProxy implements IProxy {

	static $inject = ['$http', '$cookies'];

	constructor(private $http: ng.IHttpService, private $cookies: ng.cookies.ICookieStoreService) {
		this.$http.defaults.headers.post['X-CSRFToken'] = $cookies.get('csrftoken')
		this.$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
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
