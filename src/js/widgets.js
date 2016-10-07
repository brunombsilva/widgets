(function($, window, angular) {
	'use strict';

	$(function() {
		var container = document.querySelectorAll('[data-youzz-widgets]');
		//Limitation: only 1 locale and client per page
		var locale = container[0].dataset.youzzWidgetsLocale || 'pt';

		var module = angular.module('Youzz.Widgets', ['Youzz.Widgets.Reviews', 'pascalprecht.translate', 'Youzz.i18n']);
		angular.module('Youzz.Api')
			.value('clientId', container[0].dataset.youzzWidgets)
			.value('endpoint', 'http://192.168.99.1:5001/dev/');

		module.config(['$translateProvider', 'Locales', function($translateProvider, Locales) {
			$translateProvider.useSanitizeValueStrategy('escape');

			angular.forEach(Locales, function(value, key) {
				$translateProvider.translations(key, value);
			});

			$translateProvider.preferredLanguage(locale);
		}]);

		angular.forEach(container, function(c) {
			angular.bootstrap(c, ['Youzz.Widgets']);
		});
	});
}(jQuery, window, angular));
