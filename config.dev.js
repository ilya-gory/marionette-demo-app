System.config({
	baseURL: '/static/app',
	paths:   {
		'tpl:*':               'templates/*.js',
		backbone:              'bower_components/backbone/backbone.js',
		lodash:                'bower_components/lodash/lodash.js',
		'backbone.marionette': 'bower_components/backbone.marionette/lib/backbone.marionette.js',
		'backbone.radio':      'bower_components/backbone.radio/build/backbone.radio.js',
		traceur:               'bower_components/traceur/traceur.js',
		jquery:                'bower_components/jquery/dist/jquery.js',
		blockui:               'bower_components/blockUI/jquery.blockUI.js',
		safe:                  'bower_components/safe/safe.js',
		'u:bb':                'lib/utils/backbone.js',
		'u:mn':                'lib/utils/marionette.js',
		twbs:                  'bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
		select2:               'bower_components/select2/dist/js/select2.full.js'
	},
	map:     {
		bb:         'backbone',
		mn:         'backbone.marionette',
		$:          'jquery',
		ra:         'backbone.radio',
		_:          'lodash',
		underscore: 'lodash'
	},
	meta:    {
		twbs:    {
			format: 'global'
		},
		lodash:  {
			format: 'global'
		},
		blockui: {
			format: 'global'
		}
	}
});
System.import('main.js');