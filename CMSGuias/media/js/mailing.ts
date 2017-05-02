'use strict'
namespace mailing{

    interface IMail{
        injector: any;
        $http: any;
        geturls(): any;
        send(): any;
    }
    /**
     * Mailing
     */
    export class Mailing implements IMail {

        injector: any;
        $http: any;
        servermail: string = "";
        other: object = {};
        constructor() {
            this.injector = angular.injector(['ng']);
            this.$http = this.injector.get('$http');
            // this.geturls().success(other){
            //     if (response.status)
            //     {
            //         this.servermail = response.servermail
            //     }
            // }
        }

        geturls = function (){
            let params: object = {'servermail': true};
            return this.$http.get("/json/settings/", {'params': params});
        }

        mailer = function (): string{
            let server: string = "";
            this.geturls().success(function (response: object) {
                if (response['status']){
                    return response['servermail'];
                }
            });
            return server;
        }

        send = function (options: object={}) {
            let objparam: object = {};
            //let servermail = this.mailer();
            objparam['mail'] = JSON.stringify(options);
            objparam['callback'] = "JSON_CALLBACK";
            // objparam['jsonpCallbackParam'] = 'callback'
            console.log(objparam);
            let response = this.$http.jsonp(options['server']+ "/send", {params: objparam});
            console.info(response);
            return response;
            // let objparam: object = {};
            // objparam['mail'] = JSON.stringify(options);
            // objparam['callback'] = "JSON_CALLBACK";
            // console.log(objparam);
            // return this.$http.jsonp(this.servermail, objparam);
        };

        test = function(){
            return $.get("/json/restful/");
        }

    }
}