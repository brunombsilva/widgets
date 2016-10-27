(function($, window, angular) {
    'use strict';

    var module = angular.module('Youzz.Widgets.Reviews', ['ngResource', 'ui.bootstrap', 'Youzz.Widgets.Templates', 'Youzz.Api']);

    module.factory('Product', ['Api', function(Api) {
        return Api(
            'products/:productId', {
                productId: '@productId'
            }, {
                get: {},
                reviews: {
                    isArray: true,
                    url: 'products/:productId/reviews',
                }
            }
        );
    }]);

    module.directive('reviewsDistribution', ['Product', function(Product) {
        return {
            restrict: "A",
            scope: {
                productId: '@'
            },
            link: function($scope) {
                $scope.product = Product.get({
                    productId: $scope.productId
                });
            },
            templateUrl: 'reviews/distribution.html'
        };
    }]);

    module.directive('reviewsProduct', ['Product', function(Product) {
        return {
            restrict: "A",
            scope: {
                productId: '@'
            },
            link: function($scope) {
                $scope.product = Product.get({
                    productId: $scope.productId
                });
            },
            templateUrl: 'reviews/summary.html'
        };
    }]);

    module.directive('reviewsList', ['Product', function(Product) {
        return {
            restrict: "A",
            scope: {
                productId: '@',
                pageSize: '@'
            },
            link: function($scope) {
                $scope.sortField = 'DateCreated';
                $scope.currentPage = 1;
                if (angular.isUndefined($scope.pageSize)) {
                    $scope.pageSize = 25;
                }
                $scope.$watchGroup(['sortField', 'currentPage'], function() {
                    var params = {
                        productId: $scope.productId,
                        offset: ($scope.currentPage - 1) * $scope.pageSize,
                        limit: $scope.pageSize,
                        sortField: $scope.sortField
                    };

                    $scope.reviews = Product.reviews(params);
                });
            },
            templateUrl: 'reviews/list.html'
        };
    }]);


    module.directive('youzzWidgetReviews', function() {
        return {
            restrict: 'A',
            templateUrl: function() {
                return 'reviews/widget.html';
            },
            scope: {
                productId: '@',
                clientId: '@'
            },
            link: function(scope, element, attrs) {
                scope.features = angular.isUndefined(attrs.features) ? null : attrs.features.split('|');
                scope.featureEnabled = function(feature) {
                    return !scope.features || scope.features.indexOf(feature) !== -1;
                }
            }
        };
    });
}(jQuery, window, angular));
