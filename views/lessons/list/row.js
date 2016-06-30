import {ItemView} from 'mn';
import tpl from 'tpl:memberships/list/row';

export default ItemView.extend({
	template:    tpl,
	tagName:     'tr',
	behaviors:   {
		waction: {}
	},
	ui:          {
		action: '[data-action]'
	},
	events:      {
		'click @ui.action': 'onAction'
	},
	modelEvents: {
		sync: 'render'
	},
	onActionEdit(){
		this.triggerMethod('row:edit', this.model);
	},
	onActionRemove(){
		if (confirm('Подтвердите удаление')) {
			this.model.destroy();
		}
	}
});