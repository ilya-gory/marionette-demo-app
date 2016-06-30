import {CompositeView,ItemView} from 'mn';
import tpl from 'tpl:companies/settings/membershipPrice/table';
import rowTpl from 'tpl:companies/settings/membershipPrice/row';

const Row = ItemView.extend({
	tagName:   'tr',
	template:  rowTpl,
	behaviors: {
		waction: {}
	}
});

const List = CompositeView.extend({
	tagName:            'table',
	attributes:         {
		'class': 'table'
	},
	template:           tpl,
	childView:          Row,
	childViewContainer: 'tbody'
});

export default List;