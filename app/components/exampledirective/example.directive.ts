/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../../typings/app.d.ts" />

((): void => {
    angular
        .module('typescriptApp')
        .directive('example', example);

    /* @ngInject */
    function example() {
        return {
            restrict: 'EAC',
            templateUrl: 'components/exampledirective/example.html',
            scope: {
                oneWay: '@',
                twoWay: '=',
                outerFunction: '&'
            },
            controller: 'ExampleController',
            controllerAs: 'Example',
            bindToController: true
        };
    }
})();
