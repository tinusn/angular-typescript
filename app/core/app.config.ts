/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/app.d.ts" />

((): void => {
    angular
        .module('typescriptApp')
        .config(configure);

    /* @ngInject */
    function configure($locationProvider: angular.ILocationProvider, RestangularProvider: restangular.IProvider, $compileProvider: angular.ICompileProvider, $logProvider: angular.ILogProvider, $provide: angular.auto.IProvideService, appConfig: any, $httpProvider: angular.IHttpProvider, $mdThemingProvider: angular.material.MDThemingProvider): void {
        // Intercept http calls to add auth info
        $httpProvider.interceptors.push(httpInterceptor);

        // https://code.angularjs.org/1.4.0/docs/api/ng/provider/$httpProvider
        $httpProvider.useApplyAsync(true);

        // Catch all exceptions and handle them in a function
        $provide.decorator('$exceptionHandler', extendExceptionHandler);

        // Catch all log calls and handle them in the client.
        $provide.decorator('$log', logHandler);

        // Change to disable #-urls
        $locationProvider.html5Mode(false);

        // The baseUrl for the backend API
        RestangularProvider.setBaseUrl(appConfig.baseUrl + '/api/' + appConfig.apiVersion);

        // Turn on / off extra debug information (disable in production)
        $compileProvider.debugInfoEnabled(appConfig.debug);
        // Turn on / off debug console logging (disable in production)
        $logProvider.debugEnabled(appConfig.debug);

        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('orange')
            .warnPalette('red');
    }

    /* @ngInject */
    function extendExceptionHandler($delegate: any, $window: any, appConfig: any): Function {
        return function(exception: {}, cause: string): any {
            // Add any exception tracking here - for example https://trackjs.com/
            /*
            if ($window.trackJs) {
                $window.trackJs.track(exception);
            } else if (appConfig.debug) {
                $delegate(exception, cause);
            }
            */
            if (appConfig.debug) {
                $delegate(exception, cause);
            }
        };
    }

    /* @ngInject */
    function httpInterceptor($q: angular.IQService, $injector: angular.auto.IInjectorService): any {
        var service: any = {
            request: request,
            responseError: responseError
        };
        return service;

        function request(config: any): any {
            /*
            add any headers needed here, for example:
            config.headers['x-auth-token'] = 'token';
            */
            return config;
        }

        function responseError(rejection: any): any {
            /*
            handle rejections (ie. 401) and perform logouts, loggin etc.
            if (rejection.status === 401) {
                if (rejection.config.url.indexOf('login') !== -1) {
                    return $q.reject(rejection);
                } else {
                    ...perform logout
                }
            } else {
                return $q.reject(rejection);
            }
            */
            return $q.reject(rejection);
        }
    }

    /* @ngInject */
    function logHandler($delegate: any, $injector: angular.auto.IInjectorService, $window: any): any {
        let errorFn: Function = $delegate.error;

        $delegate.error = function(): void {
            let args: any = [].slice.call(arguments);
			/*
            // Handle $log.error by notifying the user of the error.
            let toastr: any = $injector.get('toastr');
            toastr.error('System error, please contact the author');
            // log the error to trackJs
            if ($window.trackJs) {
                $window.trackJs.console.error(arguments);
            }
			*/
            errorFn.apply(null, args);
        };

        return $delegate;
    }

})();
