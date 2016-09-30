(function($, window, angular) {
    'use strict';

    var module = angular.module('Youzz.Widgets', ['Youzz.Widgets.Reviews', 'pascalprecht.translate', 'Youzz.i18n']);
    angular.module('Youzz.Api')
        .value('token', YouzzToken)
        .value('endpoint', 'http://192.168.99.1:5001/api/dev/');

    module.config(['$translateProvider','Locales', function($translateProvider, Locales) {
        $translateProvider.useSanitizeValueStrategy('escape');

        angular.forEach(Locales, function(value, key) {
            $translateProvider.translations(key, value);
        });

        $translateProvider.preferredLanguage('pt');
    }]);

    angular.bootstrap(document.querySelector('[data-youzz-widgets]'), ['Youzz.Widgets']);
}(jQuery, window, angular));
