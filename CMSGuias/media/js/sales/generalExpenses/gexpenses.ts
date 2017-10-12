import * as angular from 'angular'

import { ServiceFactory, httpConfigs } from '../../serviceFactory'
import { GeneralExpensesController } from './expenses.controller'

/**
 * This is required in webpack entry for compile
 * './CMSGuias/media/js/serviceFactory.ts',
 * './CMSGuias/media/js/sales/generalExpenses/expenses.controller.ts',
 * './CMSGuias/media/js/sales/generalExpenses/gexpenses.ts'
 *
 */

const app = angular.module('gexpensesApp', ['ngCookies'])

app.service('ServiceFactory', ServiceFactory)
app.controller('gexpensesCtrl', GeneralExpensesController)
app.config(httpConfigs)