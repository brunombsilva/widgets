(function($, window, document, angular) {
	'use strict';

    var yw, YouzzWidgets;
    yw = YouzzWidgets = {
        _selectors: {
            container: '[data-yw-widget]'
        },
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
                containers = $(this._selectors.container),
                locale = loader.locale || 'pt',
                clientId = loader.clientId || containers.eq(0).attr('data-yw-clientId');

            this.modules.api = angular.module('Youzz.Api');
            this.modules.widgets = angular.module('Youzz.Widgets', ['Youzz.Widgets.Reviews', 'pascalprecht.translate', 'Youzz.i18n']);

            this.modules.api
                .value('clientId', clientId)
                .value('endpoint', config.api);

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

    document.YouzzWidgets.Instance = document.yw = yw;

    // if no loader is present assume that no inline script was included and initialize all the widgets
    if (!yw.loader()) {
        yw.initialize();
    }
}(jQuery, window, document, angular));
