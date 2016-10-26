(function(d, w) {
    'use strict';
    
    var config = d.YouzzWidgets.Config,
        defaults = {
            initialized: false,
            clientId: null,
            locale: 'pt'
        };

    function loadStylesheet(href) {
        var el = d.createElement('link');
        el.rel = 'stylesheet';
        el.type = 'text/css';
        el.href = href;
        el.media = 'all';
        d.getElementsByTagName('head')[0].appendChild(el);
    }

    function loadScript(src, callback) {
        var el = document.createElement('script');
        el.type = 'application/javascript';
        el.src = src;
        el.async = true;
        el.onload = el.onreadystatechange = callback;
        d.getElementsByTagName('head')[0].appendChild(el);
    }

    function findLastInlineScript() {
        var scripts = d.querySelectorAll('script');
        return scripts[scripts.length - 1];
    }

    function parseUrlQueryString(url) {
        var str = url.split('?').length > 1 ? url.split('?')[1] : '',
            query = str.split('#')[0],
            keyVal = query.split('&'),
            parsed = {};

        keyVal = keyVal.map(function(s) {
            var parts = s.split('='),
                key = parts[0],
                val = parts.length > 1 ? decodeURIComponent(parts[1].replace(/\+/g, ' ')) : null;

            return [key, val];
        });

        for (var k in keyVal) {
            parsed[keyVal[k][0]] = keyVal[k][1];
        }

        return parsed;
    }

    function renderTemplate(params, sibling) {
        var el = d.createElement('div'),
            k;

        for (k in params) {
            el.setAttribute('data-yw-' + k, params[k]);
        }

        sibling.parentNode.insertBefore(el, sibling.nextSibling);
    }


    var loader = d.YouzzWidgets && d.YouzzWidgets.Loader ? d.YouzzWidgets.Loader : {},
        callback = function() {
            loader.loadedDependencies++;

            if (loader.loadedDependencies === config.scripts.length) {
                d.yw.initialize();
            }
        },
        script, params, idx;

    // render the widget template for the current widget instance
    loader.loadedInline = loader.loadedInline === undefined ? 0 : loader.loadedInline + 1;
    script = d.querySelectorAll('script[data-yw-script]')[loader.loadedInline];
    params = parseUrlQueryString(script.src);
    params.widget = params.widget || 'reviews';
    renderTemplate(params, script);

    // only load the CSS/JS dependencies on the first inline script inclusion
    if (!loader.initialized) {
        loader.clientId = params.clientId || defaults.clientId;
        loader.locale = params.locale || defaults.locale;
        loader.initialized = true;
        loader.loadedDependencies = 0;

        for (idx in config.stylesheets) {
            loadStylesheet(config.stylesheets[idx]);
        }

        for (idx in config.scripts) {
            loadScript(config.scripts[idx], callback);
        }

        // store the loader information on a global variable so that further inline script inclusions don't
        // re-run the dependency loading logic
        d.YouzzWidgets = d.YouzzWidgets || {};
        d.YouzzWidgets.Loader = loader;
    }
}(document, window));
