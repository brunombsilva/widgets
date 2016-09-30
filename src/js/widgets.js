(function($, window, angular) {
    'use strict';

    var module = angular.module('Youzz.Widgets', ['Youzz.Widgets.Reviews', 'pascalprecht.translate']);
    angular.module('Youzz.Api')
        .value('token', YouzzToken)
        .value('endpoint', 'http://192.168.99.1:5001/api/dev/');

    module.config(['$translateProvider', function($translateProvider) {
        $translateProvider.useSanitizeValueStrategy('escape');

        $translateProvider.translations('en', {
            'TITLE': 'Hello',
            'FOO': 'This is a paragraph'
        });

        $translateProvider.translations('pt', {
            'Average rating': 'Avaliação média',
            'from': 'de',
            'reviews': 'avaliações',
            'Distribution': 'Distribuição',
            'Product Reviews': 'Avaliações do Produto',
            'Date': 'Data',
            'Rating': 'Avaliação',
            'First': 'Primeira',
            'Last': 'Última',
            'Previous': 'Anterior',
            'Next': 'Seguinte',
        });

        $translateProvider.preferredLanguage('pt');
    }]);

    angular.bootstrap(document.querySelector('[data-youzz-widgets]'), ['Youzz.Widgets']);
}(jQuery, window, angular));
