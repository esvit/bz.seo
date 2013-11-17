var allTestFiles = ['angular-mocks', 'bz'];
var TEST_REGEXP = /^\/base\/tests(.*)Spec\.js$/;

Object.keys(window.__karma__.files).forEach(function(file) {
    if (TEST_REGEXP.test(file)) {
        allTestFiles.push(file);
    }
});

require.config({
    urlArgs: '' + Math.random(),

    // Karma serves files under /base, which is the basePath from your config file
    baseUrl: '/base/src',

    packages: [{
        name: 'bz.seo',
        location: '../src',
        main: 'config'
    }],

    paths: {
        'angular': '../bower_components/angular/angular',
        'angular-mocks': '../bower_components/angular-mocks/angular-mocks',
        'angular-route': '../bower_components/angular-route/angular-route',

        'bz': '../bower_components/bazalt/build/bz'
    },

    shim: {
        'angular': { exports: 'angular' },
        'angular-mocks': { deps: ['angular'], exports: 'mocks' },
        'angular-route': { deps: ['angular'] },

        'bz': { deps: ['angular'] }
    },

    // dynamically load all test files
    deps: allTestFiles,

    // we have to kickoff jasmine, as it is asynchronous
    callback: window.__karma__.start
});