import {Model,Collection} from 'u:bb';

export const Membership = Model.extend({
	defaults: {
		student: {}
	},
	urlRoot:  '/api/memberships'
});
export const Memberships = Collection.extend({
	model: Membership,
	url:   '/api/memberships'
});