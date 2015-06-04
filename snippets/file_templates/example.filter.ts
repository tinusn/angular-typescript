/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/app.d.ts" />

((): void => {
    angular
        .module('typescriptApp')
        .filter('filterName', filterName);

    /* @ngInject */
    function filterName($log: angular.ILogService) {
        return function(input) {
            if (!input) {
                return input;
            } else {
                return input;
            }
        };
    }

})();
