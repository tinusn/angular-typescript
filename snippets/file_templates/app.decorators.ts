/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/app.d.ts" />

module typescriptApp {
    'use strict';

	const appModule = angular.module('typescriptApp');

	export function Controller(target: any) {
		appModule.controller(target.name, target);
	}

	export function Service(target: any) {
		appModule.service(target.name, target);
	}

}
