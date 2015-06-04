/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/app.d.ts" />

module typescriptApp {
    'use strict';

    export class serviceName {

        /* @ngInject */
        constructor(public $log: angular.ILogService) {

        }

    }

	angular.module('typescriptApp')
        .service('serviceName', serviceName);

}
