import {Behavior} from 'mn';

export default Behavior.extend({
	ui:     {
		action: '[data-action]'
	},
	events: {
		'click @ui.action': 'onAction'
	},
	onAction(e){
		let ds = e.currentTarget.dataset || {};
		this.view.triggerMethod(`action:${ds.action}`, _.omit(ds, 'action'));
	}
});