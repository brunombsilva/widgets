(function($, window, angular) {
	'use strict';

	var module = angular.module('Youzz.Api', ['ngResource']);
	//module.value('token', undefined);
	//module.value('endpoint', undefined);

	module.factory('Api', ['$resource', 'endpoint', 'clientId', function($resource, endpoint, clientId) {
		return function(path, paramDefaults, actions, options) {
			var actions = angular.extend({}, actions);

			angular.forEach(actions, function(value, key) {
				if (angular.isDefined(value.url)) {
					value.url = endpoint + value.url;
				}
				value.cache = true;
				value.headers = angular.extend({},
					value.headers, {
						'ClientId': clientId
							//'Authorization': 'Bearer ' + token
					}
				);
				if (value.isArray) {
					value.interceptor = {
						response: function(response) {
							response.resource.pagination = response.headers().pagination;
							return response.resource;
						}
					};

					value.transformResponse = function(data, headers) {
						var obj = angular.fromJson(data);
						headers().pagination = obj.pagination;
						return obj.items;
					}
				}
			});
			return $resource(
				endpoint + path, paramDefaults, actions, {
					cancellable: true
				}
			);
		};
	}]);
}(jQuery, window, angular));
