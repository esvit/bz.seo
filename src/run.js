define([
    'bz.seo/app',

    'bz.seo/factories/route'
], function (app) {

    app.config([function() {
        // http://prerender.io/
        window.prerenderReady = false;
    }]);

    app.run(['$rootScope', '$location', '$route', 'bz.seo.factories.route', '$document', '$log',
        function ($rootScope, $location, $route, RouteFactory, $document, $log) {
            var head = $document.find('head');
            if (!head.length) {
                head = angular.element(document.createElement('head'));
                $document.append(head);
            }
            var title = angular.element(head.find('title')[0]),
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

            // create description meta tag if it not exists
            if (!metaDesc) {
                metaDesc = angular.element(document.createElement('meta'))
                    .attr('name', 'description')
                    .attr('content', '');
                head.append(metaDesc);
            }
            // create keyword meta tag if it not exists
            if (!metaKeywords) {
                metaKeywords = angular.element(document.createElement('meta'))
                    .attr('name', 'keywords')
                    .attr('content', '');
                head.append(metaKeywords);
            }

            // create title tag if it not exists
            if (!title.length) {
                title = angular.element(document.createElement('title'));
                head.append(title);
            }

            var currentRoute = null;
            $rootScope.$on('$routeChangeSuccess', function (e) {
                var route = { 'url': $location.path(), 'route': $route.current.$$route.segment };
                if (!angular.equals(route, currentRoute)) { // disable double request
                    currentRoute = route;
                    RouteFactory.get(route, function (res) {
                        window.prerenderReady = true;

                        $log.debug('bz.seo: Changes meta information', res);
                        $rootScope.$meta = res;
                        title.html(res.title || '');
                        metaKeywords.attr('content', res.keywords || '');
                        metaDesc.attr('content', res.description || '');
                    });
                } else {
                    window.prerenderReady = true;
                }
            });


        }]);

    return app;
});