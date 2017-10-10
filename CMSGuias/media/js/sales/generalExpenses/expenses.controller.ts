import * as angular from 'angular'

import { ServiceFactory } from '../../serviceFactory'

interface IGeneralExpenses {
    currencies: Array<object>
    itemizers: Array<object>
    gexpenses: any
}


export class GeneralExpensesController implements IGeneralExpenses {

    itemizers: Array<object> = []
    currencies: Array<object> = []
    gexpenses: any

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

}