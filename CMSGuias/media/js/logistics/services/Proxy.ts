import { app } from "../viewpurchase";


export class Proxy {

    static $inject = ['$http'];
    constructor(private $http: ng.IHttpService) {

    }

    get(params: Object) {
        return this.$http.get('/json/', params);
    }
}

app.service('proxy', Proxy);