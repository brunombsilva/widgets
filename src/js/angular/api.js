(function(window, angular) {
	'use strict';

	var module = angular.module('Youzz.Api', ['ngResource']);

	module.factory('Api', ['$resource', 'endpoint', 'clientId', function($resource, endpoint, clientId) {
        var clean = function(obj) {
            angular.forEach(obj, function(value, key) {
                if (value === null || angular.isUndefined(value)) {
                    delete obj[key];
                }
            });

            return obj;
        };

		return function(path, paramDefaults, actions, options) {
			options = angular.extend({clientId: clientId}, clean(options));
            actions = angular.extend({}, actions);

			angular.forEach(actions, function(value, key) {
				if (angular.isDefined(value.url)) {
					value.url = endpoint + value.url;
				}
				value.cache = true;
				value.headers = angular.extend({},
					value.headers, {
						'ClientId': options.clientId
							//'Authorization': 'Bearer ' + token
					}
				);
				if (value.isArray) {
					value.interceptor = {
					    response: function (response) {
					        if (angular.isDefined(response.headers().pagination)) {
					            response.resource.pagination = response.headers().pagination;
					        }
							return response.resource;
						}
					};

					value.transformResponse = function (data, headers) {
					    if (data === null) {
					        return data;
					    }
					    var obj = angular.fromJson(data);
					    if (angular.isArray(obj)) {
					        return obj;
					    }
						headers().pagination = obj.pagination;
						return obj.items || obj;
					};
				}
			});

			return $resource(
				endpoint + path,
                paramDefaults,
                actions,
                {
					cancellable: true
				}
			);
		};
	}]);
}( window, angular));
