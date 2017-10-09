import * as angular from 'angular'

import { ServiceFactory } from '../../serviceFactory'


export class GeneralExpensesController {

    static $inject = ['ServiceFactory']

    constructor(private http: ServiceFactory) {
        console.log('Hi World!')
        angular.element('select').material_select()
        this.onInit()
    }

    onInit(): void {

    }

    getItemizerByProject(): void {
        this.http.get('', { 'getitemizer': true })
            .then((response: any) => {

            })
    }


}