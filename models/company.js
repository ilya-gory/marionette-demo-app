import {Model,Collection} from 'u:bb';
import {Collection as BCollection,Model as BModel} from 'bb';

export const Company = Model.extend({
	urlRoot: '/api/companies',
	initialize(){
		this.set('lessonTypeList', new BCollection([], {comparator: 'duration'}));
		this.set('membershipPriceList', new BCollection([], {
			comparator: (i, ipo)=> i.get('duration') == ipo.get('duration') && i.get('amount') > ipo.get('amount')
		}));
	},
	parse(raw){
		this.get('lessonTypeList').reset(raw.lessonTypeList);
		delete raw.lessonTypeList;
		this.get('membershipPriceList').reset(raw.membershipPriceList);
		delete raw.membershipPriceList;
	}
});
export const Companies = Collection.extend({
	model: Company,
	url:   '/api/companies'
});