/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../../typings/app.d.ts" />

module typescriptApp {
    'use strict';

    @Controller
    export class Page1Controller {

        /* @ngInject */
        constructor(public $log: angular.ILogService, $scope: angular.IScope, ExampleUtil: typescriptApp.ExampleUtil) {
			$log.debug('ExampleUtil.testProperty', ExampleUtil.testProperty);

			/*
			let destroyWatch = $scope.$on('$destroy', function() {
				// cleanup any timeouts etc
				destroyWatch();
			});
			*/
		}

    }
}
