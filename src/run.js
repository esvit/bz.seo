define([
    'bz.seo/app',

    'bz.seo/services/bzSeoMeta',
    'bz.seo/factories/route'
], function (app) {

    app.run(['$rootScope', '$location', '$route', 'bz.seo.factories.route', 'bzSeoMeta', '$log',
        function ($rootScope, $location, $route, RouteFactory, bzSeoMeta, $log) {
            bzSeoMeta.init();

            var currentRoute = null;
            $rootScope.$on('$routeChangeSuccess', function (e) {
                var route = { 'url': $location.path(), 'route': $route.current.$$route.segment };
                if (!angular.equals(route, currentRoute)) { // disable double request
                    currentRoute = route;
                    /*RouteFactory.get(route, function (res) {

                        $log.debug('bz.seo: Changes meta information', res);
                        $rootScope.$meta = res;

                        bzSeoMeta.title(res.title || '');
                        bzSeoMeta.keywords(res.keywords || '');
                        bzSeoMeta.description(res.description || '');
                    });*/
                }
            });

        }]);

    return app;
});