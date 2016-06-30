import {ItemView as MItemView,
	LayoutView as MLayoutView,
	Object as MObject,
	Renderer,
	CompositeView as MCompositeView} from 'mn';

export const ItemView = MItemView.extend({
	afterRenderTemplate(html){
		// noop
	},
	beforeRenderTemplate(rs, rj){
		rs();
	},
	constructor(...args){
		this._renderTemplate = ItemView.prototype._renderTemplate.bind(this);
		['before', 'after'].forEach(_s=> {
			let s = `${_s}RenderTemplate`;
			if (!_.isFunction(this[s])) this[s] = ItemView.prototype[s].bind(this);
		});
		MItemView.apply(this, args);
	},
	_renderTemplate(){
		let template = this.getTemplate();
		if (template === false) {
			return;
		}
		if (!template) {
			throw new Marionette.Error({
				name:    'UndefinedTemplateError',
				message: 'Cannot render the template since it is null or undefined.'
			});
		}
		return new Promise((rs, rj)=> {
			(new Promise(this.beforeRenderTemplate.bind(this))).then(()=> {
				try {
					let data = this.mixinTemplateHelpers(this.serializeData());
					let html = Renderer.render(template, data, this);
					this.triggerMethod('after:render:template', html);
					this.attachElContent(html);
					rs();
				} catch (e) {
					rj(e);
				}
			}).catch(rj);
		});
	},
	render(){
		this._ensureViewIsIntact();
		this.triggerMethod('before:render', this);
		this._renderTemplate().then(()=> {
			this.isRendered = true;
			this.bindUIElements();
			this.triggerMethod('render', this);
		});
		return this;
	}
});
export const LayoutView = MLayoutView.extend({
	constructor(options){
		options = options || {};
		this._firstRender = true;
		this._initializeRegions(options);
		ItemView.call(this, options);
	},
	render(){
		this._ensureViewIsIntact();
		if (this._firstRender) {
			this._firstRender = false;
		} else {
			this._reInitializeRegions();
		}
		return ItemView.prototype.render.apply(this, arguments);
	}
});
export const CompositeView = MCompositeView.extend({
	render(){
		this._ensureViewIsIntact();
		this._isRendering = true;
		this.resetChildViewContainer();

		this.triggerMethod('before:render', this);

		this._renderTemplate().then(()=> {
			this._renderChildren();

			this._isRendering = false;
			this.isRendered = true;
			this.triggerMethod('render', this);
		});
		return this;
	},
	beforeRenderTemplate(rs, rj){
		rs();
	},
	_renderTemplate() {
		return new Promise((rs, rj)=> {
			(new Promise(this.beforeRenderTemplate.bind(this))).then(()=> {
				try {
					let data = {};
					data = this.serializeData();
					data = this.mixinTemplateHelpers(data);

					this.triggerMethod('before:render:template');

					let template = this.getTemplate();
					let html = Marionette.Renderer.render(template, data, this);
					this.attachElContent(html);

					// the ui bindings is done here and not at the end of render since they
					// will not be available until after the model is rendered, but should be
					// available before the collection is rendered.
					this.bindUIElements();
					this.triggerMethod('render:template');
					rs();
				} catch (e) {
					rj(e);
				}
			}).catch(rj);
		});
	}
});