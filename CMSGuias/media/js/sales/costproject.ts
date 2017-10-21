import * as angular from 'angular'

import { ServiceFactory, httpConfigs } from '../serviceFactory'


/**
 * This is required for make bundle
 * path.join(__dirname, 'CMSGuias', 'media', 'js', 'serviceFactory.ts'),
 * path.join(__dirname, 'CMSGuias', 'media', 'js', 'sales', 'costproject')
 *
 * name output bundle
 * filename: 'costproject.bundle.js',
 * path: path.resolve(__dirname, 'CMSGuias', 'media', 'js', 'sales')
 */

// interface IProxy {
// 	get: (uri: string, options: object) => ng.IHttpPromise<any>;

// 	post: (url: string, options: object) => ng.IHttpPromise<any>;
// }

// class SProxy implements IProxy {

// 	static $inject = ['$http', '$cookies'];

// 	constructor(private $http: ng.IHttpService, private $cookies: ng.cookies.ICookieStoreService) {
// 		this.$http.defaults.headers.post['X-CSRFToken'] = $cookies['csrftoken'];
// 		this.$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// 	}

// 	get(uri: string, options: object) {
// 		return this.$http.get(uri, {params: options});
// 	}

// 	post(uri: string, options: object) {
// 		return this.$http.post(uri, this.transformData(options), {transformRequest: angular.identity, headers: {'Content-Type': undefined}})
// 	}

// 	private transformData(data: object): FormData {
// 		let form = new FormData();
// 		for (let key in data) {
// 			if (data.hasOwnProperty(key)) {
// 				let element = data[key];
// 				form.append(key, element);
// 			}
// 		}
// 		return form;
// 	}
// // }
// interface IProxy {
// 	get: (uri: string, options: object) => ng.IHttpPromise<any>;

// 	post: (url: string, options: object) => ng.IHttpPromise<any>;
// }

// class SProxy implements IProxy {

// 	static $inject = ['$http', '$cookies'];

// 	constructor(private $http: ng.IHttpService, private $cookies: ng.cookies.ICookieStoreService) {
// 		this.$http.defaults.headers.post['X-CSRFToken'] = $cookies['csrftoken'];
// 		this.$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// 	}

// 	get(uri: string, options: object) {
// 		return this.$http.get(uri, {params: options});
// 	}

// 	post(uri: string, options: object) {
// 		return this.$http.post(uri, this.transformData(options), {transformRequest: angular.identity, headers: {'Content-Type': undefined}})
// 	}

// 	private transformData(data: object): FormData {
// 		let form = new FormData();
// 		for (let key in data) {
// 			if (data.hasOwnProperty(key)) {
// 				let element = data[key];
// 				form.append(key, element);
// 			}
// 		}
// 		return form;
// 	}
// }

interface IController {
	getItemizer(): void;
	saveItemizer(): void;
	calcAmounts(): void;
	showEdit(item: object): void;
	delItem(item: object): void;
}

class ControllerServiceProject implements IController {

	itemizer: any
	itemizers: { [key: string]: any } = {}
	assignament: number = 0
	spent: number = 0
	prcurrency: { [key: string]: any } = {
		'pk': null,
		'symbol': null
	}
	sbworkforce: boolean = false
	tworkforce: number = 0
	project: { [key: string]: any } = { pk: '', symbol: '' }
	accbudget: number = 0
	accoperations: number = 0
	accguides: number = 0

	static $inject = ['ServiceFactory']

	constructor(private proxy: ServiceFactory) {
		console.log("hi! hello world!!!")
		angular.element('.modal').modal()
		this.getItemizer()
		this.workforceData()
		setTimeout(() => {
			this.costBudget()
		}, 800)
	}

	getItemizer(): void {
		Materialize.toast('<i class="fa fa-cog"></i> Procesando...!', parseInt('undefined'), 'toast-remove');
		this.proxy.get('', { itemizer: true }).then(
			(response: any) => {
				if (response['data']['status']) {
					this.itemizers = response['data']['itemizers'];
					angular.element('.toast-remove').remove();
					this.assignament = 0;
					this.spent = 0;
					this.calcAmounts();
				} else {
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
		Materialize.toast('<i class="fa fa-cog"></i> Procesando...!', parseInt('undefined'), 'toast-remove');
		let params: any = this.itemizer;
		params['saveitemizer'] = true;
		this.proxy.post('', params).then(
			(response: any) => {
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
				} else {
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
						let dsct: number = (this.itemizers[key]['services'][dt].amounts * (this.itemizers[key]['services'][dt].fields.dsct / 100))
						dsct = (this.itemizers[key]['services'][dt].amounts - dsct);
						// let igv: number = ((this.itemizers[key]['services'][dt].fields.sigv ? this.itemizers[key]['services'][dt].configure.fields.igv : 0)/100)
						let total: number = dsct
						// igv = (igv > 0) ? (dsct * (igv)) : 0;
						// let total: number = ((dsct) + (igv));
						// total = ((this.itemizers[key]['services'][dt].fields.currency.pk == this.itemizers[key]['services'][dt].configure.fields.moneda.pk) ? total : (total / this.itemizers[key]['services'][dt]['exchange']));
						if (this.prcurrency.pk !== this.itemizers[key]['services'][dt].fields.currency.pk) {
							if (this.itemizers[key]['services'][dt].exchange > 1) {
								total = (total / this.itemizers[key]['services'][dt].exchange)
							} else {
								total = (total * this.itemizers[key]['services'][dt].exchange)
							}
						}
						this.itemizers[key]['services'][dt]['total'] = total
						sum += (total);
					}
					// here change amount
				}
				this.itemizers[key]['sum'] = sum;
				this.spent += sum;
			}
		}
	}

	showEdit(item: { [key: string]: any }): void {
		this.itemizer = {
			name: item['fields']['name'],
			purchase: parseFloat(item['fields']['purchase']),
			sales: parseFloat(item['fields']['sales']),
			itemizer: item['pk']
		}
		angular.element('#mitemizer').modal('open');
	}

	delItem(item: { [key: string]: any }): void {
		swal({
			title: `Realmente desea eliminar el item ${item['fields']['name']}?`,
			text: 'Nota: El item no se eliminara si tiene ordenes asociadas.',
			showCancelButton: true,
			confirmButtonText: 'Si! eliminar',
			cancelButtonText: 'No',
			confirmButtonColor: '#d33',
			closeOnConfirm: true,
			closeOnCancel: true
		}, (isConfirm: boolean) => {
			if (isConfirm) {
				let params = {
					delitemizer: true,
					itemizer: item['pk']
				}
				this.proxy.post('', params)
					.then((response: any) => {
						if (response['data']['status']) {
							this.getItemizer();
							Materialize.toast('Eliminado!', 2600);
						} else {
							Materialize.toast(`Error: ${response['data']['raise']}`, 10600);
						}
					});
			}
		});
	}

	/**
	 * block workforce
	 */

	workforce(): void {
		let gworkforce: HTMLHeadingElement = <HTMLHeadingElement>document.getElementById("workforce")
		let gworkforceUsed: HTMLHeadingElement = <HTMLHeadingElement>document.getElementById("workforceused")
		let wdiv: HTMLDivElement = document.createElement('div'),
			winput: HTMLInputElement = document.createElement('input')
		let	wudiv: HTMLDivElement = document.createElement('div'),
			wuinput: HTMLInputElement = document.createElement('input'),
			wf: number = 0,
			wfu: number = 0

		// set data if content
		wf = parseFloat(gworkforce.innerText.trim()) || 0
		wfu = parseFloat(gworkforceUsed.innerText.trim()) || 0
		// clean content before insert controls
		gworkforce.innerHTML = ''
		gworkforceUsed.innerHTML = ''

		wdiv.setAttribute('class', 'input-field')
		winput.type = 'number'
		winput.step = '0.10'
		winput.id = 'iworkforce'
		winput.setAttribute('class', 'right-align')
		winput.value = `${wf}`
		wdiv.appendChild(winput)
		gworkforce.appendChild(wdiv)
		winput.focus()

		wudiv.setAttribute('class', 'input-field')
		wuinput.type = 'number'
		wuinput.step = '0.10'
		wuinput.id = 'iworkforceused'
		wuinput.setAttribute('class', 'right-align')
		wuinput.value = `${wfu}`
		wudiv.appendChild(wuinput)
		gworkforceUsed.appendChild(wudiv)
		this.sbworkforce = true
	}

	saveWorkforce(): void {
		let iwf: HTMLInputElement = <HTMLInputElement>document.getElementById('iworkforce'),
			iwfu: HTMLInputElement = <HTMLInputElement>document.getElementById('iworkforceused')
		if (iwf != undefined && iwfu != undefined)
		{
			let params: { [key: string]: any} = {
				workforce: iwf.value,
				workforceused: iwfu.value,
			}
			this.proxy.post('', params)
				.then((response: any) => {
					if (!response['data'].hasOwnProperty('raise') && response['data']) {
						let cwf: HTMLHeadingElement = <HTMLHeadingElement>document.getElementById('workforce'),
							cwfu: HTMLHeadingElement = <HTMLHeadingElement>document.getElementById("workforceused")
						cwf.innerText = params.workforce
						cwfu.innerText = params.workforceused
						this.tworkforce = (params.workforce - params.workforceused)
						this.sbworkforce = false
					} else {
						Materialize.toast(`Error ${response['data']['raise']}`, 3600)
					}
				})
		}
	}

	workforceData(): void {
		this.proxy.get('', { 'listworkforce': true })
			.then((response: any) => {
				if (!response['data'].hasOwnProperty('raise')) {
					let cwf: HTMLHeadingElement = <HTMLHeadingElement>document.getElementById('workforce'),
						cwfu: HTMLHeadingElement = <HTMLHeadingElement>document.getElementById("workforceused")
					cwf.innerText = response['data'].workforce
					cwfu.innerText = response['data'].workforceused
					this.tworkforce = (response['data'].workforce - response['data'].workforceused)
				} else {
					Materialize.toast(`Error ${response['data']['raise']}`, 3600)
				}
			})
	}

	/* enblock */
	/**
	 * block cost
	 */
	costBudget(): void {
		this.proxy.get(`/sales/projects/manager/${this.project.pk}/`, { 'budget': true, 'cost': true })
			.then( (response: any) => {
				if (!response.data.hasOwnProperty('raise')) {
					this.accbudget = response['data']['purchase']
				} else {
					Materialize.toast(`Error ${response['data']['raise']}`, 3600)
				}
			})
	}
	/** endblock */

}

let apps = angular.module('app', ['ngCookies']);
apps.service('ServiceFactory', ServiceFactory);
apps.controller('controller', ControllerServiceProject)
apps.config(httpConfigs);
