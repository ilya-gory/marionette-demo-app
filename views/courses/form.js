import {LayoutView} from 'u:mn';
import {CollectionView} from 'mn';
import {Dons} from '../../models/don.js';
import {Places} from '../../models/place.js';
import {Company} from '../../models/company.js';
import tpl from 'tpl:courses/form';
import TimetableItemView from './form/timetable.js';
import ra from 'ra';

const TimetableView = CollectionView.extend({
	childView: TimetableItemView
});

export default LayoutView.extend({
	template:  tpl,
	tagName:   'form',
	triggers:  {},
	behaviors: {
		form:    {},
		modal:   {},
		waction: {}
	},
	regions:   {
		timetable: '.timetable'
	},
	onActionTimetableAdd(){
		let c = this.model.get('timetable');
		c.add(new c.model());
	},
	onRender(){
		this.showChildView('timetable', new TimetableView({
			collection:       this.model.get('timetable'),
			childViewOptions: {
				placeList: this.getOption('placeList')
			}
		}));
	},
	onFormSerialized(){
		let sf = _.omit(this.getOption('serializedForm'), 'time', 'place');
		this.model.save(sf, {wait: true});
	},
	onActionModalOk(){
		this.$el.trigger('submit');
	},
	serializeData(){
		return {
			model:        LayoutView.prototype.serializeData.call(this),
			isNew:        this.model.isNew(),
			donList:      this.getOption('donList').toJSON(),
			footer:       true,
			large:        true,
			durationList: this.getOption('company').get('lessonTypeList').toJSON()
		};
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
				Dons.list().then(c=> {
					this.options.donList = c;
					rs();
				})
			}),
			new Promise(rs=> {
				Places.list().then(c=> {
					this.options.placeList = c;
					rs();
				})
			}),
			new Promise(rs=> {
				Company.item({id: ra.channel('config').request('companyId')}).then(m=> {
					this.options.company = m;
					rs();
				})
			})
		]).then(rs)
	}
});