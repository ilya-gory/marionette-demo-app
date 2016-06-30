import {ItemView} from 'u:mn';
import tpl from 'tpl:lessons/form';
import ra from 'ra';
import {Courses} from '../../models/course.js';

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
	//клик "по расписанию"
	onActionTypeDuty(){
		
	},
	//клик "дополниетльное"
	onActionTypeWildcat(){
	},
	onFormSerialized(){
		let sf = this.getOption('serializedForm');
		this.model.set(sf);
		this.model.save();
	},
	serializeData(){
		let d = ItemView.prototype.serializeData.call(this);
		d.isNew = this.model.isNew();
		d.footer = true;
		return d;
	},
	beforeRenderTemplate(rs){
		if (this.model.isNew()) {
			rs();
		} else {
			this.model.fetch({
				success: ()=> rs()
			});
		}
	}
});