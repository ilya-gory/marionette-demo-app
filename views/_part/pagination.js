import {ItemView} from 'mn';
import tpl from 'tpl:_part/pagination';

export default ItemView.extend({
	template:   tpl,
	tagName:    'ul',
	attributes: {
		'class': 'pagination'
	},
	ui:         {
		p: 'a[data-page]'
	},
	events:     {
		'click @ui.p': 'onPageClick'
	},
	onPageClick(e){
		e.preventDefault();
		let t = e.currentTarget;
		this.$('li').removeClass('active');
		$(t).closest('li').addClass('active');
		this.triggerMethod('page:set', t.dataset.page);
	},
	serializeData(){
		return {pages: this.getOption('pages') || [], active: this.getOption('active') || 1};
	}
});