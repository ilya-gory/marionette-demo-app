import {ItemView} from 'u:mn';
import tpl from 'tpl:courses/form/timetable';

export default ItemView.extend({
	template:  tpl,
	behaviors: {
		waction: {}
	},
	ui:        {
		input: '[name]'
	},
	events:    {
		'input @ui.input': 'onInput'
	},
	onInput(e){
		let i = e.currentTarget;
		this.model.set(i.name, i.value);
	},
	serializeData(){
		let d = ItemView.prototype.serializeData.call(this);
		d.daysOfWeek = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
		d.placeList = this.getOption('placeList').toJSON();
		d.cid = this.cid;
		return d;
	},
	onActionTimetableDow(data){
		let a = this.$('.dow-btn.active');
		if (a.length && data.day == a[0].dataset.day) return;
		a.removeClass('active');
		this.$(`.dow-btn[data-day="${data.day}"]`).addClass('active');
		this.model.set('dayOfWeek', data.day);
	},
	onActionTimetableRemove(){
		this.model.collection.remove(this.model);
	}
});