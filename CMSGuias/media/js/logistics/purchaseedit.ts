module Service {
    export interface IProxy {
        get: (uri: string, options: object) => ng.IHttpPromise<any>;
    }

    export class Proxy implements IProxy {

        static $inject = ['$http'];

        constructor(private $http: ng.IHttpService){}

        get(uri: string, options: object) {
            return this.$http.get(uri, {params: options});
        }

    }
}

module Controller {
    interface IPurchase {
        purchase: string;
    }
    export class PurchaseController implements IPurchase {
        static $inject = ['$log', 'sproxy'];
        // public purchaseid: string;
        // public getBedside: (id: string) => void;
        private name: string;

        constructor(private $log: angular.ILogService, private proxy: Service.Proxy, public purchase: string) {
            // this.$scope.purchaseid = this._purchaseid;
            // this.purchase = "OC1700000";
            this.$log.info("controller ready!");
            this.name = 'Christian';
        }

        getBedside(id: string) {
            this.$log.log("This click here!");
            this.$log.info(this.purchase);
            this.setrequest();
        }

        setrequest() {
            this.proxy.get("", {}).then(
                (response: any) => {
                    this.$log.info("Response if api ", response);
                }
            )
        }
    }

}

let app = angular.module('app', ['ngCookies']);
app.service('sproxy', Service.Proxy);
app.controller('ctrlpurchase', Controller.PurchaseController);