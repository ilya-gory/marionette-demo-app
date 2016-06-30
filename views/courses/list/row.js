import {ItemView} from 'mn';
import tpl from 'tpl:courses/list/row';
import ra from 'ra';

export default ItemView.extend({
	template:    tpl,
	tagName:     'tr',
	behaviors:   {
		waction: {}
	},
	modelEvents: {
		sync: 'render'
	},
	onActionRemove(){
		if (confirm('Подтвердите удаление')) {
			this.model.destroy();
		}
	}
});