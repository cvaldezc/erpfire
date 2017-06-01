'use strict';
var mailing;
(function (mailing) {
    /**
     * Mailing
     */
    var Mailing = (function () {
        function Mailing() {
            this.servermail = "";
            this.other = {};
            this.geturls = function () {
                var params = { 'servermail': true };
                return this.$http.get("/json/settings/", { 'params': params });
            };
            this.mailer = function () {
                var server = "";
                this.geturls().success(function (response) {
                    if (response['status']) {
                        return response['servermail'];
                    }
                });
                return server;
            };
            this.send = function (options) {
                if (options === void 0) { options = {}; }
                var objparam = {};
                //let servermail = this.mailer();
                objparam['mail'] = JSON.stringify(options);
                objparam['callback'] = "JSON_CALLBACK";
                // objparam['jsonpCallbackParam'] = 'callback'
                console.log(objparam);
                var response = this.$http.jsonp(options['server'] + "/send", { params: objparam });
                console.info(response);
                return response;
                // let objparam: object = {};
                // objparam['mail'] = JSON.stringify(options);
                // objparam['callback'] = "JSON_CALLBACK";
                // console.log(objparam);
                // return this.$http.jsonp(this.servermail, objparam);
            };
            this.test = function () {
                return $.get("/json/restful/");
            };
            this.injector = angular.injector(['ng']);
            this.$http = this.injector.get('$http');
            // this.geturls().success(other){
            //     if (response.status)
            //     {
            //         this.servermail = response.servermail
            //     }
            // }
        }
        return Mailing;
    }());
    mailing.Mailing = Mailing;
})(mailing || (mailing = {}));
//# sourceMappingURL=mailing.js.map