import { Service } from '../moduleServices';
import * as angular from "angular";

let app = angular.module('app', ['ngCookies']);

app.service('sproxy', Service.SProxy);
