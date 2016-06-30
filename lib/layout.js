import {LayoutView,extend} from 'mn';
import ra from 'ra';

export default LayoutView.extend({
	template:    false,
	el:          'body',
	regions:     {
		center: '#center'
	},
	initTooltips(){
		let b = this.$('[title]');
		if (!b.length) return;
		b.tooltip();
	},
	onChildviewRender(){
		this.initTooltips();
	},
	_modalStack: [],
	initialize(){
		ra.channel('modal').on('show', view=> {
			if (this._modalStack.length) {
				let currentRegionId = this._modalStack[this._modalStack.length - 1];
				if (!!currentRegionId) {
					this.getRegion(currentRegionId).currentView.triggerMethod('modal:hide', true);
				}
			}
			let regId = `modal-${view.cid}`;
			this.$el.append(`<div id="${regId}"></div>`);
			this.addRegion(regId, `#${regId}`);
			this.getRegion(regId).show(view);
			this._modalStack.push(regId);
		});
		ra.channel('modal').on('hide', view=> {
			if (view.getOption('keepModal') === true) return;
			let regId = `modal-${view.cid}`;
			this.removeRegion(regId);
			this.$(`#${regId}`).remove();
			_.remove(this._modalStack, i=>i == regId);
			if (this._modalStack.length) {
				let v = this.getRegion(this._modalStack.pop()).currentView;
				delete v.options.keepModal;
				v.render();
			}
		});
		ra.channel('layout').on('all', (reg, view)=> {
			this.showChildView(reg, view);
		});
	}
});