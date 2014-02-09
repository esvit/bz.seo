define([
    'opengraph/module'
], function(module) {
    'use strict';

    module.run(['bzOpenGraph', '$document',
        function (bzOpenGraph, $document) {
            var head = $document.find('head');
            if (!head.length) {
                head = angular.element(document.createElement('head'));
                $document.append(head);
            }
            var ogTags = {};

            angular.forEach(head.find('meta'), function(meta){
                var el = angular.element(meta),
                    property = el.attr('property');
                if (property.substring(0, 3) == 'og:') {
                    ogTags[property.substring(3)] = el.attr('content');
                }
            });

            bzOpenGraph.init(ogTags);
        }]);
});