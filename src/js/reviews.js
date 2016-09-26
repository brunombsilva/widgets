(function($, window, angular) {
    'use strict';

    var module = angular.module('Youzz.Widgets.ProductReviews', ['ngResource', 'ui.bootstrap']);

    module.factory('ProductReviews', ['$resource', function($resource) {
        return $resource(
            "http://192.168.99.1:5001/api/dev/products/:productId/reviews", {
                productId: '@productId'
            }, {
				get: {
					method: 'GET',
					headers: {
						'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IlJKUEVLR01aR0RfTkRLUFNXVjVLX0RJVU1YNkxENExNT0dDVjAtNlEiLCJ0eXAiOiJKV1QifQ.eyJBc3BOZXQuSWRlbnRpdHkuU2VjdXJpdHlTdGFtcCI6IjJkNDIxYWZjLTZmMjMtNDM1OC05YmUxLTUzZTA0ZjM2ZjZkMCIsImp0aSI6IjdlZGU1MmI5LTQ2MWUtNDY1MS05MjIzLWM4YjA3MGNiNjAzNyIsInVzYWdlIjoiYWNjZXNzX3Rva2VuIiwiY29uZmlkZW50aWFsIjp0cnVlLCJzY29wZSI6Im9wZW5pZCxwcm9maWxlLGVtYWlsLHJvbGVzLG9mZmxpbmVfYWNjZXNzIiwic3ViIjoiNjA3ZTA1NTYtYzFlNS00ODljLTg5ZjItNGIzMGFhYmIzYTllIiwiYXpwIjoiWW91enouV2ViQXBpLlN3YWdnZXIiLCJuYmYiOjE0NzQ4NzY2MTksImV4cCI6MTQ3NDg3ODQxOSwiaWF0IjoxNDc0ODc2NjE5LCJpc3MiOiJodHRwOi8vMTkyLjE2OC45OS4xOjUwMDAvIn0.S_GNaAHeGoncvbTgDLXzcIDcG3waYLb6rifSORg1tSbACs0dZqarmWUvGnxO6SoZhtaeZGevgMh21CmYG-_WL0BqHkZQMMlfWlrqBKkYraPRmncN6QZp8vwLyxDF3J_S5cGvXRlhikoZ_bDIHLhQScgiFeFy_JdvKYr2rlvWomGPR5XFh7nvVl5seh0sgIjTOen-UmS2P8V7ubEbnz966sfZEW271r0bybyUzZE8sLt0y1W_EAktJkkwN0wtwaefZf9voq-ju-fxG8H-V0QRPKbacnd8piperiUHWFxKTM2c6YLpmYza11A-8DUKDEZtgN1hLNTDhnnUZRJB2NuLgw'
					}
				}
			}, {
                cancellable: true
            }
        );
    }]);

    module.controller('ReviewListController', ['$scope', '$location', 'ProductReviews', function($scope, $location, ProductReviews) {
        var search = $location.search();

        $scope.init = function(productId) {
            $scope.filters = {
                productId: 14 //productId
            };
            $scope.sortField = search.sort || 'DateCreated';
            $scope.$watch('sortField', function() {
                $scope.loadPage();
            });
            $scope.loadPage(search.page || 1);
        };

        $scope.loadPage = function(page) {
            var page = page || $scope.currentPage,
                params = $.extend({}, $scope.filters, {
                    page: page,
                    sortField: $scope.sortField
                });

            // TODO - Add some loading visual tooltip to the frontend
            ProductReviews.get(params).$promise.then(function(response) {
                $scope.reviews = response.items;
                $scope.totalItems = response.pagination.totalRecords;
                $scope.currentPage = params.page;
            });
        };
    }]);
angular.bootstrap(document.getElementById('ReviewsWidget'), ['Youzz.Widgets.ProductReviews']);
}(jQuery, window, angular));
