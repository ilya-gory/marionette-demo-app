import App from 'lib/app.js';
import m from 'lib/utils/_mixins.js';
import bui from 'blockui';
_.templateSettings = {
	evaluate:    /\{\{(.+?)\}\}/g,
	interpolate: /\{\{=(.+?)\}\}/g,
	escape:      /\{\{-(.+?)\}\}/g
};
$(() => {
	_.merge($.blockUI.defaults, {
		message:         '<h2>Загрузка…</h2>',
		ignoreIfBlocked: true,
		baseZ:           2000
	});
	App.run();
});