(function($, window, angular) {
	'use strict';

	var module = angular.module('Youzz.Widgets', ['Youzz.Widgets.Reviews']);

	angular.bootstrap(document.querySelector('[data-youzz-widgets]'), ['Youzz.Widgets']);
}(jQuery, window, angular));
