import * as angular from 'angular'

interface IProxy {
	get: (uri: string, options: object) => ng.IHttpPromise<any>

	post: (url: string, options: object) => ng.IHttpPromise<any>
}

export class ServiceFactory implements IProxy {

	static $inject = ['$http', '$cookies']

	constructor(private $http: any, private $cookies: any) {
		// this.$http.defaults.headers['post'][''] = ''
		$http.defaults.headers.post['X-CSRFToken'] = $cookies.get('csrftoken')
		$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
	}

	get(uri: string, options: object) {
		return this.$http.get(uri, { params: options })
	}

	post(uri: string, options: object) {
		return this.$http.post(uri, this.transformData(options), { transformRequest: angular.identity, headers: { 'Content-Type': undefined } })
	}

	private transformData(data: any): FormData {
		let form = new FormData()
		for (let key in data) {
			if (data.hasOwnProperty(key)) {
				let element = data[key]
				form.append(key, element)
			}
		}
		return form
	}
}

export const httpConfigs = ($httpProvider: any) => {
	$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
	$httpProvider.defaults.xsrfCookieName = 'csrftoken'
	$httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken'
}