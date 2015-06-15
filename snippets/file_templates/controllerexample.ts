/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../../typings/app.d.ts" />

module typescriptApp {
    'use strict';

    export class NameController {

        /* @ngInject */
        constructor(public $log: angular.ILogService, $scope: angular.IScope) {
			
			/*
			let destroyWatch = $scope.$on('$destroy', function() {
				// cleanup any timeouts etc
				destroyWatch();
			});
			*/
		}
		
    }
	
	angular.module('typescriptApp')
        .controller('NameController', NameController);
}
