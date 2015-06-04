/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/app.d.ts" />

((): void => {
    angular
        .module('typescriptApp')
        .run(runBlock);

    /* @ngInject */
    function runBlock($log: angular.ILogService, $rootScope: any, $window: any, $location: angular.ILocationService, $state: angular.ui.IStateService): void {

        $rootScope.goBack = goBack;

        function goBack() {
            $window.history.back();
        }

        // Ensure that the user is logged in when entering one of the private urls
        $rootScope.$on('$stateChangeStart', stateChangeStart);

        function stateChangeStart(event: any, toState: angular.ui.IState, toParams: any, from: angular.ui.IState, fromParams: any) {
            $log.debug('$stateChangeStart', toState, toParams, from, fromParams);
        }

        $rootScope.$on('$stateChangeSuccess', stateChangeSuccess);

        function stateChangeSuccess(event: any, toState: angular.ui.IState, toParams: any, from: angular.ui.IState, fromParams: any) {
            $log.debug('$stateChangeSuccess', toState, toParams, from, fromParams);
            /*
            This is a good place to add google analytics
            if ($window.ga) {
                $window.ga('send', 'pageview', {
                    page: $location.url(),
                    title: toState.name
                });
            }
            */
        }

        // If an error occurs during state change, log it here
        $rootScope.$on('$stateChangeError', stateChangeError);

        function stateChangeError(event: any, toState: angular.ui.IState, toParams: any, fromState: angular.ui.IState, fromParams: any, error: any) {
            event.preventDefault();
            if (error && error.config && error.config.url) {
                $log.error('$stateChangeError [' + toState.name + '] - status [' + error.status + '] problem url [' + error.config.url + ']', error);
            } else {
                $log.error('$stateChangeError [' + toState.name + ']', error);
            }
        }

        // If navigating to a state that was not found, log it here
        $rootScope.$on('$stateNotFound', stateNotFound);

        function stateNotFound(event: any, unfoundState: any, fromState: angular.ui.IState) {
            event.preventDefault();
            $log.error('$stateNotFound [' + unfoundState.to + '] comming from state [' + fromState.name + ']');
        }
    }

})();
