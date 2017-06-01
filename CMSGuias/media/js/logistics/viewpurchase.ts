module Controller {
    export interface IMarvelScope extends ng.IScope {
        heroes: Array<string>;
        mostrarImagen: boolean;
        anadirHeroe: (heroe: string) => void;
    }

    export class MarvelController {
        static $inject = ['$scope'];
        private _heroes: Array<string> = ['Spiderman', 'Hulk', 'Ironman', 'Capitan América'];

        constructor(private $scope: IMarvelScope) {
            this.$scope.heroes = this._heroes;
            this.$scope.mostrarImagen = false;
            this.$scope.anadirHeroe = (heroe) => this._añadirHeroe(heroe);
        }

        private _añadirHeroe (heroe: string) {
            this.$scope.heroes.push(heroe);
            this.$scope.mostrarImagen = heroe === 'Spiderman';
        }
    }
}

angular
    .module('app', [])
    .controller('MarvelController', Controller.MarvelController);