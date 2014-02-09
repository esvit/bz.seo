define(['angular', 'angular-mocks', 'bz.seo/opengraph/config'], function (angular) {

    describe('bz.seo.opengraph', function () {
        var httpBackend, scope;
        beforeEach(module('bz.seo'));
        beforeEach(inject(function($httpBackend, $rootScope){
            httpBackend = $httpBackend;
            scope = $rootScope.$new();
        }));
        afterEach(function() {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should be defined', inject(['bzOpenGraph', function (bzOpenGraph) {
            expect(bzOpenGraph.tags).toEqual({});

            bzOpenGraph.set('title', 'test');

            expect(bzOpenGraph.tags).toEqual({ 'title': 'test' });
        }]));
    });

});