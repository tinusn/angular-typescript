/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../../typings/app.d.ts" />

((): void => {
    angular
        .module('typescriptApp')
        .directive('directiveName', directiveName);

    /* @ngInject */
    function directiveName() {
        return {
            restrict: 'E',
            templateUrl: 'components/template.html',
            scope: {
                oneWay: '@',
                twoWay: '=',
                outerFunction: '&'
            },
            controller: 'NameController',
            controllerAs: 'Name',
            bindToController: true
        };
    }
})();
