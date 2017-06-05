module Service {
    export interface IProxy {
        get: (uri: string, options: object) => ng.IHttpPromise<any>;
    }

    export class Proxy implements IProxy {

        static $inject = ['$http', '$cookies'];
        constructor(private $http: ng.IHttpService, private $cookies: ng.cookies.ICookiesService) {
            this.$http.defaults.headers.post['X-CSRFToken'] = $cookies['csrftoken'];
            this.$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        }

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
        private name: string;
        private docpayment: object;
        private methodpayment: object;
        private currency: object;

        constructor(private $log: angular.ILogService, private proxy: Service.Proxy, public purchase: string) {
            this.$log.info("controller ready!");
            this.name = 'Christian';
            this.getDocumentPayment();
            this.getMethodPayment();
            this.getCurrency();
            angular.element("select").chosen({width: "100%"});
        }

        getDocumentPayment() {
            this.proxy.get("/keep/document/payment/", {'list': true}).then((response: object) => {
                if (response['data']['status']){
                    this.docpayment = response['data']['list'];
                    angular.element(".documentpayment").trigger("chosen:updated");
                }
            });
        }

        getMethodPayment() {
            this.proxy.get("/keep/method/payment/", {'list': true}).then(
                (response: object) => {
                    if (response['data']['status']) {
                        this.methodpayment = response['data']['list'];
                        angular.element(".methodpyment").trigger("chosen:updated");
                    }
                });
        }

        getCurrency() {
            this.proxy.get("/keep/currency/", {'list': true}).then(
                (response: object) => {
                    if (response['data']['status']) {
                        this.currency = response['data']['list'];
                        angular.element(".currency").trigger("chosen:updated");
                    }
                });
        }

    }

}

let app = angular.module('app', ['ngCookies']);
app.service('sproxy', Service.Proxy);
app.controller('ctrlpurchase', Controller.PurchaseController);
let httpConfig = ($httpProvider: ng.IHttpProvider) => {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
};
app.config(httpConfig);