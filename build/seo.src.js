(function () {define('opengraph/module',[
    'angular', 'bz', 'angular-route'
], function(angular) {
    'use strict';

    return angular.module('bz.seo.opengraph', ['bz', 'ngRoute']);
});
define('opengraph/services/bzOpenGraph',[
    'opengraph/module'
], function(module) {
    'use strict';

    module.service('bzOpenGraph', ['bzSeoMeta', function(bzSeoMeta) {
        var head = bzSeoMeta.getHead();
        var service = {
            tags: {},
            init: function(tags) {
                service.tags = tags;
            },
            set: function(tag, value) {
                var tagElement = null;
                angular.forEach(head.find('meta'), function(meta){
                    var el = angular.element(meta);
                    if (el.attr('property') == 'og:' + tag) {
                        tagElement = el;
                    }
                });
                if (!tagElement) {
                    tagElement = angular.element(document.createElement('meta'))
                        .attr('property', 'og:' + tag);
                    head.append(tagElement);
                }
                service.tags[tag] = value;
                tagElement.attr('content', value);
                return service;
            }
        };
        return service;
    }]);

});
define('opengraph/config',[
    'opengraph/module',
    'opengraph/services/bzOpenGraph'
], function(module) {
    'use strict';

    module.config([function() {

    }]);
});
define('bz.seo/app',[
    'angular', 'bz', 'angular-route',
    'opengraph/config'
], function(angular) {
    'use strict';

    return angular.module('bz.seo', ['bz', 'ngRoute', 'bz.seo.opengraph']);
});
define('bz.seo/services/bzSeoMeta',[
    'opengraph/module'
], function(module) {
    'use strict';

    module.service('bzSeoMeta', ['$document', function($document) {
        var head = $document.find('head');
        if (!head.length) {
            head = angular.element(document.createElement('head'));
            $document.append(head);
        }

        var title = angular.element(head.find('title')[0]),
            metaImage = null,
            metaFragment = null,
            metaKeywords = null,
            metaDesc = null;

        var service = {
            tags: {},
            getHead: function() {
                return head;
            },
            init: function() {
                angular.forEach(head.find('meta'), function(meta){
                    var el = angular.element(meta);
                    if (el.attr('name') == 'fragment') {
                        metaFragment = el;
                    }
                    if (el.attr('name') == 'keywords') {
                        metaKeywords = el;
                    }
                    if (el.attr('name') == 'description') {
                        metaDesc = el;
                    }
                });
                angular.forEach(head.find('link'), function(meta){
                    var el = angular.element(meta);
                    if (el.attr('rel') == 'image_src') {
                        metaImage = el;
                    }
                });

                if (!metaImage) {
                    metaImage = angular.element(document.createElement('link'))
                        .attr('rel', 'image_src')
                        .attr('href', '');
                    head.append(metaImage);
                }
                if (!metaFragment) {
                    metaFragment = angular.element(document.createElement('meta'))
                        .attr('name', 'fragment')
                        .attr('content', '!');
                    head.append(metaFragment);
                }
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
            },
            title: function(value) {
                title.html(value);
                service.tags['title'] = value;
                return service;
            },
            keywords: function(value) {
                metaKeywords.attr('content', value);
                service.tags['keywords'] = value;
                return service;
            },
            description: function(value) {
                metaDesc.attr('content', value);
                service.tags['description'] = value;
                return service;
            },
            image_src: function(value) {
                metaImage.attr('href', value);
                service.tags['image_src'] = value;
                return service;
            },
            notFound: function() {
                var statusCode = angular.element(document.createElement('meta'))
                    .attr('name', 'prerender-status-code')
                    .attr('content', '404');
                head.append(statusCode);
                window.prerenderReady = true;
            },
            redirectTo: function(link) {
                var statusCode = angular.element(document.createElement('meta'))
                    .attr('name', 'prerender-status-code')
                    .attr('content', '302');
                head.append(statusCode);
                var header = angular.element(document.createElement('meta'))
                    .attr('name', 'prerender-header')
                    .attr('content', 'Location: ' + link);
                head.append(header);
                window.prerenderReady = true;
            }
        };
        return service;
    }]);

});
define('bz.seo/factories/route',[
    'bz.seo/app'
], function(app) {
    'use strict';

    app.factory('bz.seo.factories.route', ['$resource', 'bzConfig', function ($resource, config) {
        var service = $resource(config.resource('/seo/routes/'), {}, {
        });

        return service;
    }]);

});
define('bz.seo',[
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
}());