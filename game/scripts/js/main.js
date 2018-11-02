requirejs.config({
    paths: {
        'jquery': 'plugins/jquery/jquery-3.3.1.min',
		'core': 'core',
    },
	urlArgs: 'bust=' + (new Date()).getTime(),
	shim: {
		'core': {
			deps: ['jquery'],
			exports: 'core'
		}
	}
});

requirejs(['core'], function() {
	$(document).ready(function() {
		// Document is ready, initialize MG
		mg.initialize();
	});
});