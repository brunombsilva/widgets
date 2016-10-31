(function(window, document, angular) {
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
            var loader = this.loader() || null,
                config = this.config(),
                containers = document.querySelectorAll('[data-youzz-widget]'),
                container = containers.length ? containers[0] : null,
                locale = 'pt',
                clientId;

            if (loader) {
                locale = loader.locale || locale;
                clientId = loader.clientId;
            } else if (container) {
                locale = container.getAttribute('data-locale') || locale;
                clientId = container.getAttribute('data-client-id');
            }

            this.modules.api = angular
                .module('Youzz.Api')
                .constant('clientId', clientId)
                .constant('endpoint', config.apiUrl);

            this.modules.widgets = angular
                .module('Youzz.Widgets')
                .constant('defaultLocale', locale);

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
}(window, document, angular));
