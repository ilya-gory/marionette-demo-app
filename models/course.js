import {Model,Collection} from 'u:bb';
import {Model as BModel,Collection as BCollection} from 'bb';

export const Course = Model.extend({
	defaults: {
		don: {}
	},
	urlRoot:  '/api/courses',
	initialize(){
		this.set('timetable', new BCollection([]));
	},
	parse(raw){
		let tt = this.get('timetable') || new BCollection();
		tt.reset(raw.timetable || []);
		delete raw.timetable;
		return raw;
	},
	toJSON(){
		let j = Model.prototype.toJSON.call(this);
		j.timetable = j.timetable.toJSON();
		return j;
	}
});
export const Courses = Collection.extend({
	model: Course,
	url:   '/api/courses?date={{=date}}'
});