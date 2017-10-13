import * as angular from 'angular'

import { ServiceFactory, httpConfigs } from '../../serviceFactory'
import { GeneralExpensesController } from './expenses.controller'

/**
 * This is required in webpack entry for compile
 * path.join(__dirname, 'CMSGuias', 'media', 'js', 'serviceFactory.ts'),
 * path.join(__dirname, 'CMSGuias', 'media', 'js', 'sales', 'generalExpenses', 'expenses.controller'),
 * path.join(__dirname, 'CMSGuias', 'media', 'js', 'sales', 'generalExpenses', 'gexpenses')
 *
 * output filename
 * filename: 'gexpenses.bundle.js'
 */

const app = angular.module('gexpensesApp', ['ngCookies'])

app.service('ServiceFactory', ServiceFactory)
app.controller('gexpensesCtrl', GeneralExpensesController)
app.config(httpConfigs)