'use strict'
namespace mailing{

    interface IMail{
        servermail: string;
        geturls(): object;
    }
    /**
     * Mailing
     */
    export class Mailing implements IMail {

        geturls = function () {
            let injector = angular.injector(['ng']);
            let $http = injector.get('$http');
            return {
                'get': function (options?: object={}) {
                    let data: object;
                    data['mail'] = JSON.stringify(options)
                    data['callback'] = "JSON_CALLBACK"
                    return $http.jsonp(this.servermail, data)
                }
            }
        };

        test = function(){
            return $.get("/json/restful/");
        }

    }
}