import * as angular from 'angular'


import { ServiceFactory } from '../../serviceFactory'

interface IGeneralExpenses {
    modify: string|any
    pshow: boolean
    currencies: Array<object>
    itemizers: Array<object>
    gexpenses: any
}


export class GeneralExpensesController implements IGeneralExpenses {

    modify = ''
    pshow = false
    itemizers: Array<object> = []
    currencies: Array<object> = []
    gexpenses: {[key: string]: string|number} = {
        'currency': '',
        'itermizer': '',
        'amount': 0
    }

    static $inject = ['ServiceFactory']

    constructor(private http: ServiceFactory) {
        console.log('Hi World!')
        // angular.element('select').material_select()
        this.onInit()
    }

    onInit(): void {
        this.getItemizerByProject()
        this.getCurrency()
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
        this.http.get('/home/expenses/', {})
            .then((response: any) => {
                console.log(response['data'])
            })
    }

    openEdit(expenses: object|any): void {
        this.modify = expenses['pk']
        this.gexpenses = expenses
        this.pshow = true
    }

    saveExpenses(): void {
        let params: any = this.gexpenses
        // console.log(params)
        if (this.modify.length > 0) {
            params['update'] = true
            params['pk'] = this.modify
        } else {
            params['create'] = true
        }
        this.http.post('', params)
            .then( (response: any) => {
                if (this.modify.length > 0) {
                    this.modify = ''
                }
                if (!response['data'].hasOwnProperty('raise')) {
                    Materialize.toast('Transacción correctamente!', 3200)
                } else {
                    Materialize.toast(`Error ${response['data']['raise']}`, 3200)
                }
            })
            .catch((err :any) => {
                console.log(err)
            })
    }

    deleteExpenses(expenses: string | any): void {
        let params: { [key: string]: any} = { delete: true }
        params['pkexpenses'] = expenses
    }

}