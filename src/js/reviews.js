(function($, window, angular) {
	'use strict';

	var module = angular.module('Youzz.Widgets.Reviews', ['ngResource', 'ui.bootstrap', 'Youzz.Widgets.Templates']);

	module.factory('Product', ['$resource', function($resource) {
		var token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ik5VUVQzSV9QQ0taTkhISUJCLUlTV1pDREFGRlZSUENWU1hUNUJTR0wiLCJ0eXAiOiJKV1QifQ.eyJBc3BOZXQuSWRlbnRpdHkuU2VjdXJpdHlTdGFtcCI6ImRmOTcwNGIzLTRiYzktNGExYy05YmU5LTBhMDMzZmFkZTQxMyIsImp0aSI6Ijk1NzMzOTU5LTliNDctNDNlMy04NDBkLWE2NjI1ZjhmZDYyYiIsInVzYWdlIjoiYWNjZXNzX3Rva2VuIiwiY29uZmlkZW50aWFsIjp0cnVlLCJzY29wZSI6Im9wZW5pZCxwcm9maWxlLGVtYWlsLHJvbGVzLG9mZmxpbmVfYWNjZXNzIiwic3ViIjoiODI0OWI4OGQtM2E3MS00MTU0LWFiMDgtYmI4YWMxZDhhNDlhIiwiYXpwIjoiWW91enouV2ViQXBpLlN3YWdnZXIiLCJuYmYiOjE0NzUxNDY3NTIsImV4cCI6MTQ3NTE0ODU1MiwiaWF0IjoxNDc1MTQ2NzUyLCJpc3MiOiJodHRwOi8vMTkyLjE2OC45OS4xOjUwMDAvIn0.Q4WyEi4z4pUFHcG1NxVeJasN7728q-5k15RI2VpocMrEP_HEJWCR5Wg2l6kvB-_xZo0HLulCRW_z92UJ_4H3a3WTzhCOfPTFPaaXCIr1i01Ip5LWrrPjvLySvjGR5a9Zaf1uwil1voE2q37UOZ1_E_Aw8EgqBlpJtlHuuc_lLGwWdmKNvsQrvZ9ZHSCP783NtjqxR6C45KLfG1fbZMqXgvma5K6wIDdkEG3GOULo435GpRKmkN4Cz65y6HhCNGZUry1mloKp7gU_mQwbaX5r2Na-ShHVM1tgtlSBYEsKgW9jX8V30GMTnU2jNmK4G0mQogJujlfLkI3QDyzz_R0wDA';
		return $resource(
			"http://192.168.99.1:5001/api/dev/products/:productId", {
				productId: '@productId'
			}, {
				get: {
					url: 'http://192.168.99.1:5001/api/dev/products/:productId',
					method: 'GET',
					headers: {
						'Authorization': 'Bearer ' + token
					}
				},
				reviews: {
					url: 'http://192.168.99.1:5001/api/dev/products/:productId/reviews',
					method: 'GET',
					headers: {
						'Authorization': 'Bearer ' + token
					}
				}
			}, {
				cancellable: true
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
						$scope.currentPage = params.page;
					});
				});
			}],
			template: $templateCache.get('reviews/list.html')
		};
	}]);
}(jQuery, window, angular));
