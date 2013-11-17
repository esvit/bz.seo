define(['angular', 'angular-mocks', 'bz.seo/factories/route'], function (angular) {

    describe('bz.seo.factories.route', function () {
        var httpBackend, scope;
        beforeEach(module('bz.seo'));
        beforeEach(inject(function($httpBackend, $rootScope){
            httpBackend = $httpBackend;
            $httpBackend.whenGET('/api/v1/seo/routes').respond({
                data: []
            });
            scope = $rootScope.$new();
        }));
        afterEach(function() {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should be defined', inject(['bz.pages.factories.page', function (PageResource) {
            var pagesData = PageResource.get();
            httpBackend.expectGET('/api/v1/pages');
            scope.$apply();
            httpBackend.flush();
            expect(pagesData.data).toEqual([]);
        }]));
    });

});