(function($, window, angular) {
	'use strict';
    
	var module = angular.module('Youzz.Widgets', ['Youzz.Widgets.Reviews']);
    angular.module('Youzz.Api')
        .value('token', YouzzToken)
        .value('endpoint', 'http://192.168.99.1:5001/api/dev/');

	angular.bootstrap(document.querySelector('[data-youzz-widgets]'), ['Youzz.Widgets']);
}(jQuery, window, angular));
