import * as angular from 'angular'

import { ServiceFactory, httpConfigs } from '../../serviceFactory'
import { GeneralExpensesController } from './expenses.controller'

const app = angular.module('gexpensesApp', ['ngCookies'])

app.service('serviceFactory', ServiceFactory)
app.controller('gexpensesCtrl', GeneralExpensesController)
app.config(httpConfigs)