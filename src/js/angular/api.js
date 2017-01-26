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

	    // accumulates a set of interceptor objects to be appended to each action
	    // @link https://docs.angularjs.org/api/ngResource/service/$resource
        var interceptorPipeline = function(interceptors) {
            var decorate = function (response, func) {
                for (var i in interceptors) {
                    if (typeof interceptors[i][func] === 'function') {
                        response = interceptors[i][func](response);
                    }
                }

                return response;
            };

            return {
                response: function (response) {
                    return decorate(response, 'response');
                },
                responseError: function (response) {
                    return decorate(response, 'responseError');
                }
            }
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
					}
				);

				var originalInterceptor = value.interceptor || {};
				if (value.isArray) {
				    var newInterceptor = function (response) {
				        if (angular.isDefined(response.headers().pagination)) {
				            response.resource.pagination = response.headers().pagination;
				        }
				        return response.resource;
				    };

				    value.interceptor = interceptorPipeline([originalInterceptor, { response: newInterceptor }]);
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
