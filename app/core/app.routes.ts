/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/app.d.ts" />

((): void => {
    angular
        .module('typescriptApp')
        .config(configureMainRoutes);

    /* @ngInject */
    function configureMainRoutes($stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider): void {
        // When nothing is specified, go to the login url
        $urlRouterProvider.when('', '/');
        // When trying to go to a route that does not exists show a 404
        $urlRouterProvider.otherwise('/404');

        // Public routes
        $stateProvider
            .state('app', {
                url: '/',
                templateUrl: 'components/main/main.html',
                controller: 'MainController',
                controllerAs: 'main',
                resolve: {}
            })
            .state('app.404', {
                url: '404',
                templateUrl: 'components/404/404.html'
            })
            .state('app.page1', {
                url: 'page1',
                templateUrl: 'components/page1/page1.html',
                controller: 'Page1Controller',
                controllerAs: 'Page1'
            })
            .state('app.page2', {
                url: 'page2',
                templateUrl: 'components/page2/page2.html',
                controller: 'Page2Controller',
                controllerAs: 'Page2'
            });

    }
})();
