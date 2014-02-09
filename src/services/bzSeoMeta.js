define([
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
            }
        };
        return service;
    }]);

});