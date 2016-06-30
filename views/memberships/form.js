import {ItemView} from 'u:mn';
import tpl from 'tpl:memberships/form';
import {Students,Student} from '../../models/student.js';
import StudentModal from '../students/form.js';
import ra from 'ra';

export default ItemView.extend({
	template:  tpl,
	tagName:   'form',
	behaviors: {
		form:    {},
		modal:   {},
		waction: {}
	},
	onActionModalOk(){
		this.$el.trigger('submit');
	},
	onActionStudentAdd(){
		ra.trigger('modal', 'show', new StudentModal({model: new Student()}));
	},
	onFormSerialized(){
		let sf = this.getOption('serializedForm');
		this.model.set(sf);
		this.model.save();
	},
	serializeData(){
		let d = ItemView.prototype.serializeData.call(this);
		d.isNew = this.model.isNew();
		d.students = this.getOption('studentList').toJSON();
		d.footer = true;
		return d;
	},
	beforeRenderTemplate(rs){
		Promise.all([
			new Promise(rs=> {
				if (this.model.isNew()) {
					rs();
				} else {
					this.model.fetch({
						success: ()=> rs()
					});
				}
			}),
			new Promise(rs=> {
				Students.list().then(c=> {
					this.options.studentList = c;
					rs();
				})
			})
		]).then(rs);

	}
});