import {CompositeView} from 'u:mn';
import {Lessons} from '../../models/lesson.js';
import tpl from 'tpl:lessons/list';
import RowView from './list/row.js';
import Form from './form.js';
import ra from 'ra';

export default CompositeView.extend({
	template:           tpl,
	behaviors:          {
		waction: {}
	},
	childView:          RowView,
	childViewContainer: 'tbody',
	collectionEvents:   {
		sync: 'render'
	},
	_modal(v){
		ra.trigger('modal', 'show', new Form({model: v}));
	},
	onChildviewRowEdit(view, model){
		this._modal(model);
	},
	onActionCreate(){
		let m = new (this.collection.model)();
		this.listenTo(m, 'sync', ()=> this.collection.fetch());
		this._modal(m);
	},
	beforeRenderTemplate(rs, rj){
		Lessons.list().then((c)=> {
			this.collection = c;
			rs();
		});
	}
});