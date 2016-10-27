(function($, window, angular) {
    'use strict';

    var module = angular.module('Youzz.Widgets.Reviews', ['ngResource', 'ui.bootstrap', 'Youzz.Widgets.Templates', 'Youzz.Api']);

    module.factory('Product', ['Api', function(Api) {
        return function (options) {
            return Api(
                "products/:productId",
                {productId: '@productId'},
                {
                    get: {},
                    reviews: {
                        isArray: true,
                        url: 'products/:productId/reviews',
                    }
                },
                options
            );
        };
    }]);

    module.directive('reviewsDistribution', ['Product', function(Product) {
        return {
            restrict: "A",
            scope: {
                productId: '@',
                clientId: '@'
            },
            link: function($scope) {
                var params = {productId: $scope.productId},
                    opts = {clientId: $scope.clientId},
                    success = function (p) { $scope.product = p; },
                    error = function() { $scope.ajaxError = true; };

                Product(opts).get(params, success, error);
            },
            templateUrl: 'reviews/distribution.html'
        };
    }]);

    module.directive('reviewsProduct', ['Product', function(Product) {
        return {
            restrict: "A",
            scope: {
                productId: '@',
                clientId: '@'
            },
            link: function($scope) {
                var params = {productId: $scope.productId},
                    opts = {clientId: $scope.clientId},
                    success = function (p) { $scope.product = p; },
                    error = function() { $scope.ajaxError = true; };

                Product(opts).get(params, success, error);
            },
            templateUrl: 'reviews/product.html'
        };
    }]);

    module.directive('reviewsList', ['Product', function(Product) {
        return {
            restrict: "A",
            scope: {
                productId: '@',
                pageSize: '@',
                clientId: '@'
            },
            link: function($scope) {
                $scope.sortField = 'DateCreated';
                $scope.currentPage = 1;
                $scope.reviews = null;

                if (angular.isUndefined($scope.pageSize)) {
                    $scope.pageSize = 25;
                }

                $scope.$watchGroup(['sortField', 'currentPage'], function() {
                    var params = {
                        productId: $scope.productId,
                        offset: ($scope.currentPage - 1) * $scope.pageSize,
                        limit: $scope.pageSize,
                        sortField: $scope.sortField
                    },
                    opts = {clientId: $scope.clientId},
                    success = function(r) { $scope.reviews = r; },
                    error = function() { $scope.ajaxError = true; };

                    Product(opts).reviews(params, success, error);
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
