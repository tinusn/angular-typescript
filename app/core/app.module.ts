/// <reference path="../../typings/tsd.d.ts" />

'use strict';

((): void => {

	const appModule = angular.module('typescriptApp', [
		'ngAnimate',
		'ngAria',
		'ngMessages',
		'ngSanitize',
		'ui.router',
		'restangular',
		'ngMaterial'
	]);

	angular.element(document).ready(function() {
		angular.bootstrap(document, [appModule.name], {
			strictDi: true
		});
	});

})();
