(function($, window, angular) {
    'use strict';

    var module = angular.module('Youzz.Api', ['ngResource']);
    //module.value('token', undefined);
    //module.value('endpoint', undefined);

    module.factory('Api', ['$resource', 'endpoint', 'token', function($resource, endpoint, token) {
        return function(path, paramDefaults, actions, options) {
            var actions = angular.extend({}, actions);

            angular.forEach(actions, function(value, key) {
                value.url = endpoint + value.url;
                value.cache = true;
                value.headers = angular.extend(
                    {},
                    value.headers, 
                    {
                        'Authorization': 'Bearer ' + token
                    }
                );
            });
            return $resource(
                endpoint + path, paramDefaults, actions, {
                    cancellable: true
                }
            );
        };
    }]);
}(jQuery, window, angular));
