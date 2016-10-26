(function($, window, document, angular) {
	'use strict';

    var YouzzWidgets = {
        modules: {
            api: null,
            widgets: null
        },
        loader: function() {
            return document.YouzzWidgets.Loader || null;
        },
        config: function() {
            return document.YouzzWidgets.Config;
        },
        initialize: function() {
            var loader = this.loader() || {},
                config = this.config(),
                containers = $('[data-youzz-widget]'),
                locale = loader.locale || 'pt',
                clientId = loader.clientId || containers.eq(0).attr('data-client-id');

            this.modules.api = angular.module('Youzz.Api');
            this.modules.widgets = angular.module('Youzz.Widgets');

            this.modules.api.value({clientId, clientId, endpoint: config.apiUrl});
            this.modules.widgets.value('locale', locale);

            this.modules.widgets.config(['$translateProvider', 'Locales', function($translateProvider, Locales) {
                $translateProvider.useSanitizeValueStrategy('escape');

                angular.forEach(Locales, function(value, key) {
                    $translateProvider.translations(key, value);
                });

                $translateProvider.preferredLanguage(locale);
            }]);

            angular.forEach(containers, function(c) {
                angular.bootstrap(c, ['Youzz.Widgets']);
            });
        }
    };

    document.YouzzWidgets.Instance = document.yw = YouzzWidgets;

    // if no loader is present assume that no inline script was included and initialize all the widgets
    if (!YouzzWidgets.loader()) {
        YouzzWidgets.initialize();
    }
}(jQuery, window, document, angular));
