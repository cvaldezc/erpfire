import { app } from "../viewpurchase";
import { Proxy } from "../services/Proxy";

export default class PuchaseController {

    static $inject = ['Proxy']

    constructor(private proxy: Proxy) {}

    name = "Christian Valdez"

    model: Object = {};

    initialize(){
        console.log("Hello world from controller.");

    }

}

app.controller('puchaseController', PuchaseController);