(function(angular) {
    'use strict';
    
    var module = angular.module('Youzz.Widgets', ['Youzz.Widgets.Reviews', 'pascalprecht.translate', 'Youzz.i18n']);

    module.config(['$translateProvider', 'Locales', 'defaultLocale', function($translateProvider, Locales, defaultLocale) {
        $translateProvider.useSanitizeValueStrategy('escape');

        angular.forEach(Locales, function(value, key) {
            $translateProvider.translations(key, value);
        });

        $translateProvider.preferredLanguage(defaultLocale);
    }]);

}(angular));
