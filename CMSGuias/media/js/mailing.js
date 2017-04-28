'use strict';
var mailing;
(function (mailing) {
    /**
     * Mailing
     */
    var Mailing = (function () {
        function Mailing() {
            this.servermail = '';
            this.geturls = function () {
                var params = { 'servermail': true };
                return this.$http.get("/json/settings/", { 'params': params });
            };
            this.send = function (options) {
                if (options === void 0) { options = {}; }
                return this.geturls().success(function (response) {
                    if (response['status']) {
                        var data = void 0;
                        this.servermail = response['servermail'];
                        data['mail'] = JSON.stringify(options);
                        data['callback'] = "JSON_CALLBACK";
                        return this.$http.jsonp(this.servermail, data);
                    }
                });
            };
            this.test = function () {
                return $.get("/json/restful/");
            };
            this.injector = angular.injector(['ng']);
            this.$http = this.injector.get('$http');
        }
        return Mailing;
    }());
    mailing.Mailing = Mailing;
})(mailing || (mailing = {}));
