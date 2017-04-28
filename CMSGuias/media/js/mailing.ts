'use strict'
namespace mailing{

    interface IMail{
        injector: any;
        $http: any;
        servermail: string;
        geturls(): any;
        send(): any;
    }
    /**
     * Mailing
     */
    export class Mailing implements IMail {

        injector: any;
        $http: any;
        servermail = '';
        constructor() {
            this.injector = angular.injector(['ng']);
            this.$http = this.injector.get('$http');
        }

        geturls = function (){
            let params: object = {'servermail': true};
            return this.$http.get("/json/settings/", {'params': params});
        }

        send = function (options: object={}) {
            return this.geturls().success(function (response: object) {
                if (response['status']){
                    let data: object;
                    this.servermail = response['servermail'];
                    data['mail'] = JSON.stringify(options);
                    data['callback'] = "JSON_CALLBACK";
                    return this.$http.jsonp(this.servermail, data);
                }
            });
        };

        test = function(){
            return $.get("/json/restful/");
        }

    }
}