'use strict';
var mailing;
(function (mailing) {
    /**
     * Mailing
     */
    var Mailing = (function () {
        function Mailing() {
            this.geturls = function () {
                var injector = angular.injector(['ng']);
                var $http = injector.get('$http');
                return {
                    'get': function (options) {
                        if (options === void 0) { options = {}; }
                        var data;
                        data['mail'] = JSON.stringify(options);
                        data['callback'] = "JSON_CALLBACK";
                        return $http.jsonp(this.servermail, data);
                    }
                };
            };
            this.test = function () {
                return $.get("/json/restful/");
            };
        }
        return Mailing;
    }());
    mailing.Mailing = Mailing;
})(mailing || (mailing = {}));
