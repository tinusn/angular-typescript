/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../../typings/app.d.ts" />

module typescriptApp {
    'use strict';

    export class ExampleController {
		oneWay: any;
		twoWay: any;
		outerFunction: Function;

        /* @ngInject */
        constructor(public $log: angular.ILogService, $scope: angular.IScope) {
			this.outerFunction({ data: 'example data' });
			/*
			let destroyWatch = $scope.$on('$destroy', function() {
				// cleanup any timeouts etc
				destroyWatch();
			});
			*/
		}

    }

	angular.module('typescriptApp')
        .controller('ExampleController', ExampleController);
}
