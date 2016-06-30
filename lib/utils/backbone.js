import {Model as BModel,Collection as BCollection} from 'bb';
import {getOption} from 'mn';

function parseurl(_options) {
	let prop;
	let opts = _.get(_options || {}, 'urlopts', {});
	if (_.isEmpty(opts)) {
		opts = getOption(this, 'urlopts') || {};
	}
	let options = _.clone(opts);
	if (this instanceof BModel) {
		prop = 'urlRoot';
	}
	if (this instanceof BCollection) {
		prop = 'url';
		this.model.prototype.urlopts = opts;
	}
	if (!prop) {
		throw new Error('Function must be applied to Model or Collection');
	}
	let pick = [];
	let url = _.result(this, prop);
	let tpl = _.pstemplate(url, pick);
	if (_.isFunction(tpl)) {
		let _pick = pick.reduce((memo, k)=> {
			memo[k] = options[k] || null;
			return memo;
		}, {});
		this[prop] = tpl(_pick);
	}
	_.each(pick, (x)=>delete options[x]);
}

export const Model = BModel.extend({
	constructor(attrs, options){
		parseurl.call(this, options);
		BModel.apply(this, arguments);
	}
}, {
	item(attrs, options){
		return new Promise((rs, rj)=> {
			(new this(attrs, options)).fetch({success: rs, error: rj})
		});
	}
});
export const Collection = BCollection.extend({
	constructor(models, options){
		parseurl.call(this, options);
		BCollection.apply(this, arguments);
	},
	isPagedCollection(){
		return !_.isUndefined(this.total);
	},
	parse(raw, options){
		let type = options.xhr.getResponseHeader('X-Parse');
		if (type == 'Collection') {
			this.total = _.get(raw, 'total', 0);
			return _.get(raw, 'data', []);
		}
		return raw;
	},
	loadPage(p){
		if (!this._origUrl) {
			this._origUrl = this.url;
		}
		let urlo = _.parseURL(this.url);
		let perpage = this.length;
		if (p > 1) {
			urlo.params.offset = (p - 1) * perpage;
		} else {
			delete urlo.params.offset;
		}
		this.url = _.stringifyURL(urlo);
		this.fetch();
	}
}, {
	list(models, options){
		return new Promise((rs, rj)=> (new this(models, options)).fetch({success: rs, error: rj}));
	}
});