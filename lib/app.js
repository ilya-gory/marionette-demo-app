import {Object,AppRouter,Behaviors} from 'mn';
import Backbone from 'bb';
import ra from 'ra';
import Layout from './layout.js';
import Router from '../controller.default.js';
import bLookUp from './behaviors.js';
export default Object.extend({
	_uiblocks: {},
	initialize(){
		ra.on('ui', 'all', (act, req)=> {
			let key = _.hashString(`${req.url}:${req.type}`);
			if (act == 'block') {
				if (!this._uiblocks[key]) {
					this._uiblocks[key] = true;
					$.blockUI();
				}
			}

			if (act == 'unblock') {
				delete this._uiblocks[key];
				if (_.isEmpty(this._uiblocks)) {
					$.unblockUI();
				}
			}
		});
		let config = JSON.parse($('#config').text());
		Behaviors.behaviorsLookup = ()=> bLookUp;
		$.ajaxSetup({
			beforeSend(){
				// default company
				let d;
				try {
					d = JSON.parse(this.data);
				} catch (err) {
					// noop
				}
				if (_.isPlainObject(d) && !d.company) {
					d.company = config.companyId;
					this.data = JSON.stringify(d);
				}

				ra.trigger('ui', 'block', this);
			},
			complete(xhr){
				if (xhr.status == 401) {
					window.location.replace('/login/auth');
				}
				ra.trigger('ui', 'unblock', this);
			}
		});
		this.layout = new Layout();
		this.router = new (AppRouter.extend(Router))();
		ra.on('route', 'default', this.triggerRoute);
		ra.channel('config').reply('default', path=>_.get(config, path));
		this.layout.render();
		Backbone.history.start();
	},
	triggerRoute(fragment){
		let c = this.router.appRoutes[fragment];
		this.router.navigate(fragment);
		this.router.controller[c]();
	},
	blockHandler(op, key){
		let operations = [
			'block',
			'unblock',
			'unblock:force'
		];
		if (operations.indexOf(op) === -1) return;
		if (op == operations[2]) {
			this._uiblocks = {};
			$.unblockUI();
			return;
		}
		if (op == operations[1]) {
			delete this._uiblocks[key];
			if (Object.keys(this._uiblocks).length) return;
			$.unblockUI();
			return;
		}
		if (Object.keys.indexOf(key) > -1) return;
		this._uiblocks[key] = true;
		$.blockUI();
	}
}, {
	run(){
		new this();
	}
}); 