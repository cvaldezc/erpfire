"use strict";
exports.__esModule = true;
var viewpurchase_1 = require("../viewpurchase");
var PuchaseController = (function () {
    function PuchaseController(proxy) {
        this.proxy = proxy;
        this.name = "Christian Valdez";
        this.model = {};
    }
    PuchaseController.prototype.initialize = function () {
        console.log("Hello world from controller.");
    };
    return PuchaseController;
}());
PuchaseController.$inject = ['Proxy'];
exports["default"] = PuchaseController;
viewpurchase_1.app.controller('puchaseController', PuchaseController);
