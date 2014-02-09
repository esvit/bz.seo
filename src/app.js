define([
    'angular', 'bz', 'angular-route',
    'opengraph/config'
], function(angular) {
    'use strict';

    return angular.module('bz.seo', ['bz', 'ngRoute', 'bz.seo.opengraph']);
});