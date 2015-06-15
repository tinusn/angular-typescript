/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/app.d.ts" />

module typescriptApp {
    'use strict';

    @Service
    export class serviceName {

        /* @ngInject */
        constructor(public $log: angular.ILogService) {

        }

    }

}
