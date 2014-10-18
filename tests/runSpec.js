define(['angular', 'bz.seo/run'], function(angular, app) {

    describe('bz.seo app run', function () {
        var head, httpBackend, scope;
        beforeEach(module('bz.seo', ['$injector', function($injector){
            var provider = $injector.get('$routeSegmentProvider');
            provider
                .when('/test', 'test')
                .segment('test', {
                    template: 'Test'
                })
        }]));
        beforeEach(inject(function($httpBackend, $rootScope){
            httpBackend = $httpBackend;
            $httpBackend.whenGET('/api/v1/seo/routes?route=test&url=%2Ftest').respond({
                title: 'Test page',
                keywords: 'test, case',
                description: 'This is just test'
            });
            scope = $rootScope.$new();
        }));
        afterEach(function() {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it("create elements", inject(['$rootScope', '$document', function($rootScope, $document) {

            var head = $document.find('head'),
                title = angular.element(head.find('title')[0]),
                meta = head.find('meta'),
                metaKeywords = null,
                metaDesc = null;

            angular.forEach(head.find('meta'), function(meta){
                var el = angular.element(meta);
                if (el.attr('name') == 'keywords') {
                    metaKeywords = el;
                }
                if (el.attr('name') == 'description') {
                    metaDesc = el;
                }
            });

            //$rootScope.$apply();
            expect(title.length).toEqual(1);
            expect(metaKeywords.length).toEqual(1);
            expect(metaDesc.length).toEqual(1);
            //expect(window.prerenderReady).toEqual(false);
        }]));

        it("change meta data on route changed", inject(['$rootScope', '$document', '$location',
            function($rootScope, $document, $location) {

            var head = $document.find('head'),
                title = angular.element(head.find('title')[0]),
                meta = head.find('meta'),
                metaKeywords = null,
                metaDesc = null;

            angular.forEach(head.find('meta'), function(meta){
                var el = angular.element(meta);
                if (el.attr('name') == 'keywords') {
                    metaKeywords = el;
                }
                if (el.attr('name') == 'description') {
                    metaDesc = el;
                }
            });

            //expect(window.prerenderReady).toEqual(false);
            //httpBackend.expectGET('/api/v1/seo/routes?route=test&url=%2Ftest');
            //$location.path('/test');
            //$rootScope.$digest();
            //expect(window.prerenderReady).toEqual(true);
            //httpBackend.flush();

            //$rootScope.$apply();
            //expect(title.text()).toEqual('Test page');
            //expect(metaKeywords.attr('content')).toEqual('test, case');
            //expect(metaDesc.attr('content')).toEqual('This is just test');
            //expect(window.prerenderReady).toEqual(true);
        }]));


        it("test notFound", inject(['$rootScope', '$document', 'bzSeoMeta', function($rootScope, $document, bzSeoMeta) {

            bzSeoMeta.notFound();

            var head = $document.find('head'),
                meta = head.find('meta'),
                statusCode = null;

            angular.forEach(head.find('meta'), function(meta){
                var el = angular.element(meta);
                if (el.attr('name') == 'prerender-status-code') {
                    statusCode = el;
                }
            });

            expect(statusCode.length).toEqual(1);
            expect(statusCode.attr('content')).toEqual('404');
            expect(window.prerenderReady).toEqual(true);
        }]));


        it("test redirectTo", inject(['$rootScope', '$document', 'bzSeoMeta', function($rootScope, $document, bzSeoMeta) {

            bzSeoMeta.redirectTo('http://google.com/');

            var head = $document.find('head'),
                meta = head.find('meta'),
                statusCode = null,
                header = null;

            angular.forEach(head.find('meta'), function(meta){
                var el = angular.element(meta);
                if (el.attr('name') == 'prerender-status-code') {
                    statusCode = el;
                }
                if (el.attr('name') == 'prerender-header') {
                    header = el;
                }
            });

            expect(statusCode.length).toEqual(1);
            expect(statusCode.attr('content')).toEqual('302');
            expect(header.length).toEqual(1);
            expect(header.attr('content')).toEqual('Location: http://google.com/');
            expect(window.prerenderReady).toEqual(true);
        }]));
    });


});