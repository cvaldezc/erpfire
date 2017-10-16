import * as angular from 'angular'

import { ServiceFactory } from '../../serviceFactory'


interface IGeneralExpenses {
    modify: number|any
    pshow: boolean
    currencies: Array<object>
    itemizers: Array<object>
    gexpenses: any
    pexpenses: Array<any>
}


export class GeneralExpensesController implements IGeneralExpenses {

    modify = ''
    pshow = false
    itemizers: Array<object> = []
    currencies: Array<object> = []
    gexpenses: {[key: string]: string|number} = {
        'currency': '',
        'itemizer': '',
        'description': '',
        'amount': 0
    }
    pexpenses: Array<any> = []

    static $inject = ['ServiceFactory']

    constructor(private http: ServiceFactory) {
        console.log('Hi World!')
        // angular.element('select').material_select()
        this.onInit()
    }

    onInit(): void {
        this.getItemizerByProject()
        this.getCurrency()
        this.getExpensesProject()
    }

    getItemizerByProject(): void {
        this.http.get('', { 'getitemizer': true })
            .then((response: any) => {
                this.itemizers = response['data']['itemizer']
                setTimeout(function() {
                    angular.element('#itemizer').material_select()
                }, 800)
            })
            .catch( (err: any) => {
                console.log(err)
            })
    }

    getCurrency(): void {
        this.http.get('/keep/currency/', {})
            .then((response: any) => {
                this.currencies = response['data']['list']
                setTimeout(function() {
                    angular.element("#currency").material_select()
                }, 800);
            })
    }

    getExpensesProject(): void {
        this.http.get('', { 'pexpenses': true })
            .then((response: any) => {
                console.log(response['data'])
                this.pexpenses = response['data']
            })
    }

    openEdit(expenses: object|any): void {
        this.modify = expenses['pk']
        this.gexpenses['currency'] = expenses['fields']['currency']['pk']
        this.gexpenses['itemizer'] = expenses['fields']['itemizer']['pk']
        this.gexpenses['description'] = expenses['fields']['description']
        this.gexpenses['amount'] = parseFloat(expenses['fields']['amount'])
        this.pshow = true
        // console.log(this.gexpenses, expenses);
        setTimeout(function() {
            angular.element('select').material_select()
        }, 200);

    }

    saveExpenses(): void {
        let params: any = this.gexpenses
        // console.log(params)
        if (typeof this.modify === 'number') {
            params['update'] = true
            params['pk'] = this.modify
        } else {
            params['create'] = true
        }
        this.http.post('', params)
            .then( (response: any) => {
                if (!response['data'].hasOwnProperty('raise')) {
                    Materialize.toast('Transacción correctamente!', 3200)
                    this.getExpensesProject()
                    this.cancelExpenses()
                } else {
                    Materialize.toast(`Error ${response['data']['raise']}`, 3200)
                }
            })
            .catch((err :any) => {
                console.log(err)
            })
    }

    deleteExpenses(expenses: string | any): void {
        swal({
            title: 'Realmente desea Eliminar?',
            text: `${expenses['fields']['itemizer']['fields']['name']} monto ${expenses['fields']['amount']}`,
            type: 'warning',
            closeOnConfirm: true,
            closeOnCancel: true,
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Si!, eliminar'
        }, (result: boolean) => {
            if (result) {
                let params: { [key: string]: any} = { delete: false }
                params['pkexpenses'] = expenses['pk']
                this.http.post('', params)
                    .then((response: any) => {
                        if (!response['data'].hasOwnProperty('raise')) {
                            Materialize.toast('Eliminado correctomente!', 2600)
                            this.getExpensesProject()
                        } else {
                            Materialize.toast(`Error ${response['data']['raise']}`, 3200)
                        }
                    })
            }
        })
    }

    cancelExpenses(): void {
        this.gexpenses = {
            'currency': '',
            'itemizer': '',
            'description': '',
            'amount': 0
        }
        this.pshow = false
        if (typeof this.modify === 'number') {
            this.modify = ''
        }
    }

}