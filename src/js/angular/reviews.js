(function(window, angular) {
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
                clientId: '@'
            },
            link: function($scope) {
                $scope.reviews = null;
                $scope.list = {
                    sortField: 'DateCreated',
                    currentPage: 1,
                    pageSize: 25,
                    maxSize: 10
                };

                $scope.$watchGroup(['list.sortField', 'list.currentPage'], function() {
                    var params = {
                        productId: $scope.productId,
                        offset: ($scope.list.currentPage - 1) * $scope.list.pageSize,
                        limit: $scope.list.pageSize,
                        sortField: $scope.list.sortField
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


    module.directive('youzzWidgetReviewsFull', function() {
        return {
            restrict: 'A',
            templateUrl: function() {
                return 'reviews/full.html';
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
}(window, angular));
