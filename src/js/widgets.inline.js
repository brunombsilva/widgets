(function() {
    'use strict';
	var scripts = document.getElementsByTagName('script');
	var index = scripts.length - 1;
	var myScript = scripts[index];
    //TODO: generic approach to prevent being locked to parameters order
	var parameters = /clientId=(.*)&locale=(.*)&widget=(.*)&productId=(.*)/.exec(myScript.src);
	var clientId = parameters[1];
	var locale = parameters[2];
	var widget = parameters[3];
    //generic support for parameters for different widgets (eg, some widgets require productId, other a potatoId, etc)
	var productId = parameters[4];
    var head  = document.getElementsByTagName('head')[0];

        if (!document.getElementById('youzzWidgetsCss')) {
            //append only once
            var link  = document.createElement('link');
            link.id = 'youzzWidgetsCss';
            link.rel  = 'stylesheet';
            link.type = 'text/css';
            //TODO: assets url from gulp recipe
            link.href = '/dist/css/widgets.min.css';
            link.media = 'all';
            head.appendChild(link);
        }
        document.write('<section data-youzz-widgets="'+clientId+'" data-youzz-widgets-locale="'+locale+'"  class="youzz-widgets">');
        document.write('<div class="row"><div data-'+widget+' data-product-id="'+productId+'"></div></div>');
        document.write('</section>');
        //defer js loading to load only once
        if (!document.getElementById('youzzWidgetsJs')) {
            //TODO: assets url from gulp recipe
            document.write('<script id="youzzWidgetsJs" src="/dist/js/widgets.js" async></script>');
        }
}());
