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
	blockmaterials: boolean;
}

class ControllerMaterials implements IMaterialsController {

	static $inject = ['sproxy'];

	blockmaterials = false;

	constructor(private proxy: MProxy) {
		console.log("ready!!!");
	}
}

let app = angular.module('app', ['ngCookies']);
app.service('sproxy', MProxy);
app.controller('ControllerMaterials', ControllerMaterials);
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