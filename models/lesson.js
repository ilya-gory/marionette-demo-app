import {Model,Collection} from 'u:bb';

export const Lesson = Model.extend({
	defaults: {
		date: new Date()
	},
	urlRoot:  '/api/lessons'
});
export const Lessons = Collection.extend({
	model: Lesson,
	url:   '/api/lessons'
});