requirejs.config({
    packages: [{
        name: 'bz.seo',
        location: '.',
        main: 'run'
    }],
    paths: {
        'bz': '../bower_components/bazalt/build/bz',

        // angular
        'angular': '../bower_components/angular/angular',
        'angular-route': '../bower_components/angular-route/angular-route',

        // tests
        'jasmine': '../bower_components/jasmine/lib/jasmine-core'
    },
    shim: {
        'angular': { exports: 'angular' },
        'bz': { deps: ['angular'] },
        'angular-route': { deps: ['angular'] }
    },
    priority: [
        'angular'
    ],
    urlArgs: 'v=1.1'
});