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
                    error = function() { $scope.ajaxError = true; },
                    loading = function() { $scope.loading = false; };

                $scope.loading = true;
                Product(opts)
                    .get(params)
                    .$promise
                    .then(success, error)
                    .finally(loading);
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
                    error = function() { $scope.ajaxError = true; },
                    loading = function() { $scope.loading = false; };

                $scope.loading = true;
                Product(opts)
                    .get(params)
                    .$promise
                    .then(success, error)
                    .finally(loading);
            },
            templateUrl: 'reviews/product.html'
        };
    }]);

    module.directive('reviewsList', ['Product', '$location', '$anchorScroll', function(Product, $location, $anchorScroll) {
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
                    maxSize: 10,
                    loading: true
                };

                $scope.$watchGroup(['list.sortField', 'list.currentPage'], function() {
                    var params = {
                        productId: $scope.productId,
                        offset: ($scope.list.currentPage - 1) * $scope.list.pageSize,
                        limit: $scope.list.pageSize,
                        sortField: $scope.list.sortField
                    },
                    opts = {clientId: $scope.clientId},
                    error = function() { $scope.ajaxError = true; },
                    loading = function() { $scope.list.loading = false; },
                    success = function(r) { 
                        $scope.reviews = r;
                        $location.hash('reviews-product-' + $scope.productId);
                        $anchorScroll();
                    };

                    Product(opts)
                        .reviews(params)
                        .$promise
                        .then(success, error)
                        .finally(loading)
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
