define([
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