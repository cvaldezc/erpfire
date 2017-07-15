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
	spent: number;
	getItemizer(): void;
	saveItemizer(): void;
	calcAmounts(): void;
	showEdit(item: object): void;
	delItem(item: object): void;
}

class ControllerServiceProject implements IController {
	itemizer: object;
	itemizers: object;
	assignament: number = 0;
	spent: number = 0;

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
					this.itemizers = response['data']['itemizers'];
					angular.element('.toast-remove').remove();
					this.assignament = 0;
					this.spent = 0;
					this.calcAmounts();
				}else{
					angular.element('.toast-remove').remove();
					Materialize.toast(`Error: ${response['data']['raise']}`, 2600);
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
					Materialize.toast(`${response['data']['raise']}`, 6600);
				}
			}
		)
	}

	calcAmounts(): void {
		// import itemizers
		for (var key in this.itemizers) {
			if (this.itemizers.hasOwnProperty(key)) {
				var element = this.itemizers[key];
				let sum = 0;
				for (var dt in element['services']) {
					if (element['services'].hasOwnProperty(dt)) {
						var services = element['services'][dt];
						let dsct: number = (this.itemizers[key]['services'][dt].amounts * (this.itemizers[key]['services'][dt].fields.dsct/100))
						dsct = (this.itemizers[key]['services'][dt].amounts - dsct);
						let igv: number = ((this.itemizers[key]['services'][dt].fields.sigv ? this.itemizers[key]['services'][dt].configure.fields.igv : 0)/100);
						igv = (igv > 0) ? (dsct * (igv)) : 0;
						let total: number = ((dsct) + (igv));
						total = ((this.itemizers[key]['services'][dt].fields.currency.pk == this.itemizers[key]['services'][dt].configure.fields.moneda.pk) ? total : (total / this.itemizers[key]['services'][dt]['exchange']));
						this.itemizers[key]['services'][dt]['total'] = total
						sum += (total);
					}
				}
				this.itemizers[key]['sum'] = sum;
				this.spent += sum;
			}
		}
	}

	showEdit(item: object): void {
		this.itemizer = {
			name: item['fields']['name'],
			purchase: parseFloat(item['fields']['purchase']),
			sales: parseFloat(item['fields']['sales']),
			itemizer: item['pk']
		}
		angular.element('#mitemizer').modal('open');
	}

	delItem(item: object): void {
		swal({
			title: `Realmente desea eliminar el item ${item['fields']['name']}?`,
			text: 'Nota: El item no se eliminara si tiene ordenes asociadas.',
			showCancelButton: true,
			confirmButtonText: 'Si! eliminar',
			cancelButtonText: 'No',
			confirmButtonColor: '#fe6969',
			closeOnConfirm: true,
			closeOnCancel: true
		}, (isConfirm) => {
			if (isConfirm) {
				let params = {
					delitemizer: true,
					itemizer: item['pk']
				}
				this.proxy.post('', params).then( (response:object) => {
					if (response['data']['status']) {
						this.getItemizer();
						Materialize.toast('Eliminado!', 2600);
					}else{
						Materialize.toast(`Error: ${response['data']['raise']}`, 10600);
					}
				});
			}
		});
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