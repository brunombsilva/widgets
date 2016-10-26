(function(angular) {
    'use strict';
    
    var module = angular.module('Youzz.Widgets', ['Youzz.Widgets.Reviews', 'pascalprecht.translate', 'Youzz.i18n']);

    module.directive('youzzWidget', function() {
        return {
            restrict: 'A',
            templateUrl: function(elem, attr) {
                return attr.youzzWidget + '/builder.html';
            },
            scope: {
                productId: '@',
                features: '@'
            },
            link: function(scope) {
                scope.featureEnabled = function(feature) {
                    return true;
                }
            }
        };
    });

}(angular));
