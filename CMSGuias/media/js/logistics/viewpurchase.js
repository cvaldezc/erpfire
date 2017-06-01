var Controller;
(function (Controller) {
    var MarvelController = (function () {
        function MarvelController($scope) {
            var _this = this;
            this.$scope = $scope;
            this._heroes = ['Spiderman', 'Hulk', 'Ironman', 'Capitan América'];
            this.$scope.heroes = this._heroes;
            this.$scope.mostrarImagen = false;
            this.$scope.anadirHeroe = function (heroe) { return _this._añadirHeroe(heroe); };
        }
        MarvelController.prototype._añadirHeroe = function (heroe) {
            this.$scope.heroes.push(heroe);
            this.$scope.mostrarImagen = heroe === 'Spiderman';
        };
        return MarvelController;
    }());
    MarvelController.$inject = ['$scope'];
    Controller.MarvelController = MarvelController;
})(Controller || (Controller = {}));
angular
    .module('app', [])
    .controller('MarvelController', Controller.MarvelController);
