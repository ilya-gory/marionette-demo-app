import ra from 'ra';
import {Company} from '../../models/company.js';
import {ItemView,LayoutView} from 'u:mn';
import {Model,Collection} from 'bb';
import {CollectionView,ItemView as MItemView} from 'mn';
import tpl from 'tpl:companies/settings';
import lessonTypeTpl from 'tpl:companies/settings/lessonType/form';
import membershipPriceTpl from 'tpl:companies/settings/membershipPrice/form';
import LessonTypeListView from './settings/lessonType.js';
import MembershipPriceListView from './settings/membershipPrice.js';

const EmbedModal = ItemView.extend({
	tagName:     'form',
	behaviors:   {
		modal: {},
		form:  {}
	},
	modelEvents: {
		added:  'onAdded',
		change: 'onChanged'
	},
	onChanged(){
		let m = this.model;
		let c = m.collection;
		if (c.includes(m)) {
			c.remove(m);
		}
		c.add(m);
		m.trigger('added');
	},
	onAdded(){
		this.triggerMethod('modal:hide');
	},
	onFormSerialized(obj){
		this.model.set(obj);
	},
	serializeData(){
		let l = this.getOption('lessonTypeList') || [];
		return {model: this.model.toJSON(), footer: true, lessonTypeList: l};
	}
});

export default LayoutView.extend({
	template:    tpl,
	ui:          {
		addLessonType:      '[data-ui="add-lesson-type"]',
		addMembershipPrice: '[data-ui="add-membership-price"]'
	},
	triggers:    {
		'click @ui.addLessonType':      'add:lessontype',
		'click @ui.addMembershipPrice': 'add:membershipprice'
	},
	regions:     {
		modal:                     '.form-modal-holder',
		lessonTypeListRegion:      '.lesson-type-list',
		membershipPriceListRegion: '.membership-price-list'
	},
	modelEvents: {
		sync: 'onUpdate'
	},
	onUpdate(){
		this._toggleDisableOnAddMembershipPrice();
	},
	onChildviewActionEdit(child){
		let m = child.model;
		this._embedModal(m, Object.is(m.collection, m.get('lessonTypeList')) ? lessonTypeTpl : membershipPriceTpl);
	},
	onChildviewActionRemove(child){
		let m = child.model;
		m.collection.remove(m);
	},
	onAddLessontype(){
		let c = this.model.get('lessonTypeList');
		let m = new (c.model)();
		m.collection = c;
		this._embedModal(m, lessonTypeTpl);
	},
	onAddMembershipprice(){
		let c = this.model.get('membershipPriceList');
		let m = new (c.model)();
		m.collection = c;
		this._embedModal(m, membershipPriceTpl);
	},
	_embedModal(model, tpl){
		let m = {model: model};
		if (Object.is(tpl, membershipPriceTpl)) {
			m.lessonTypeList = this.model.get('lessonTypeList').toJSON();
		}
		this.showChildView('modal', new (EmbedModal.extend({template: tpl}))(m));
	},
	onRender(){
		let m = this.model;
		this.showChildView('lessonTypeListRegion', new LessonTypeListView({collection: m.get('lessonTypeList')}));
		this.showChildView('membershipPriceListRegion', new MembershipPriceListView({collection: m.get('membershipPriceList')}));
		this._toggleDisableOnAddMembershipPrice();
	},
	serializeData(){
		let d = ItemView.prototype.serializeData.call(this);
		d.isNew = this.model.isNew();
		return d;
	},
	_toggleDisableOnAddMembershipPrice(){
		this.ui.addMembershipPrice.prop('disabled', !(this.model.get('lessonTypeList').length > 0));
	},
	beforeRenderTemplate(rs){
		Company.item({id: ra.channel('config').request('companyId')}).then(m=> {
			this.model = m;
			this.delegateEvents();
			this.listenTo(m.get('lessonTypeList'), 'update', ()=>m.save());
			this.listenTo(m.get('membershipPriceList'), 'update', ()=>m.save());
			rs();
		});
	}
});