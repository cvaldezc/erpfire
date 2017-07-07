"use strict";
exports.__esModule = true;
var moduleServices_1 = require("../moduleServices");
var angular = require("angular");
var app = angular.module('app', ['ngCookies']);
app.service('sproxy', moduleServices_1.Service.SProxy);
