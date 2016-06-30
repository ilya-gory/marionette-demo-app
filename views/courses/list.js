import {CompositeView} from 'u:mn';
import {Courses} from '../../models/course.js';
import RowView from './list/row.js';
import tpl from 'tpl:courses/list';
import Form from './form.js';
import ra from 'ra';

export default CompositeView.extend({
	template:           tpl,
	childView:          RowView,
	childViewContainer: 'tbody',
	behaviors:          {
		waction: {}
	},
	onActionEdit(dataset){
		this._modal(this.collection.get(dataset.id));
	},
	onActionCreate(){
		this._modal(new this.collection.model());
	},
	_modal(m){
		ra.trigger('modal', 'show', new Form({model: m}));
	},
	beforeRenderTemplate(rs){
		Courses.list().then((c)=> {
			this.collection = c;
			rs();
		});
	}
});