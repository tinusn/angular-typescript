/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../../typings/app.d.ts" />

module typescriptApp {
    'use strict';

    @Controller
    export class Page2Controller {
		testProperty: string;

        /* @ngInject */
        constructor(public $log: angular.ILogService, $scope: angular.IScope, $timeout: angular.ITimeoutService) {
			this.testProperty = 'before timeout';
			let timer = $timeout(() => {
				this.testProperty = 'after timeout';
			}, 3000);

			let destroyWatch = $scope.$on('$destroy', function() {
				$timeout.cancel(timer);
				destroyWatch();
			});
		}

		exampleFunction(data: string): void {
			this.$log.debug('exampleFunction called with "' + data + '"');
		}

    }
}
