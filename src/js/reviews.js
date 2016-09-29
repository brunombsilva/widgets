(function($, window, angular) {
    'use strict';

    var module = angular.module('Youzz.Widgets.Reviews', ['ngResource', 'ui.bootstrap', 'Youzz.Widgets.Templates', 'Youzz.Api']);

    module.factory('Product', ['Api', function(Api) {
        return Api(
            'products/:productId', {
                productId: '@productId'
            }, {
                get: {
                    url: 'products/:productId',
                    method: 'GET',
                },
                reviews: {
                    url: 'products/:productId/reviews',
                    method: 'GET',
                }
            }
        );
    }]);

    module.directive('distribution', ['Product', '$templateCache', function(Product, $templateCache) {
        return {
            restrict: "A",
            scope: {
                productId: '='
            },
            controller: ['$scope', '$element', function($scope, $element) {
                $scope.product = undefined;
                Product.get({
                    productId: $scope.productId
                }).$promise.then(function(product) {
                    $scope.product = product;
                });
            }],
            template: $templateCache.get('reviews/distribution.html')
        };
    }]);

    module.directive('summary', ['Product', '$templateCache', function(Product, $templateCache) {
        return {
            restrict: "A",
            scope: {
                productId: '='
            },
            controller: ['$scope', '$element', function($scope, $element) {
                $scope.product = undefined;
                Product.get({
                    productId: $scope.productId
                }).$promise.then(function(product) {
                    $scope.product = product;
                });
            }],
            template: $templateCache.get('reviews/summary.html')
        };
    }]);

    module.directive('list', ['Product', '$templateCache', function(Product, $templateCache) {
        return {
            restrict: "A",
            scope: {
                productId: '=',
                pageSize: '='
            },
            controller: ['$scope', '$element', function($scope, $element) {
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

                    Product.reviews(params).$promise.then(function(response) {
                        $scope.reviews = response.items;
                        $scope.totalItems = response.pagination.totalRecords;
                    });
                });
            }],
            template: $templateCache.get('reviews/list.html')
        };
    }]);
}(jQuery, window, angular));
