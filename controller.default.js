import ra from 'ra';
import Index from 'views/index.js';
import CourseList from 'views/courses/list.js';
import PlaceList from 'views/places/list.js';
import DonList from 'views/dons/list.js';
import StudentList from 'views/students/list.js';
import Settings from 'views/companies/settings.js';
import MembershipList from 'views/memberships/list.js';
import LessonList from 'views/lessons/list.js';
import LessonItem from 'views/lessons/form.js';

function load(view) {
	ra.trigger('layout', 'center', view);
}

export default {
	appRoutes:  {
		'':          'index',
		courses:     'courses',
		places:      'places',
		dons:        'dons',
		students:    'students',
		settings:    'settings',
		memberships: 'memberships',
		lessons:     'lessons'
	},
	controller: {
		index(){
			load(new Index());
		},
		courses(){
			load(new CourseList());
		},
		dons(){
			load(new DonList());
		},
		places(){
			load(new PlaceList());
		},
		students(){
			load(new StudentList());
		},
		settings(){
			load(new Settings());
		},
		memberships(){
			load(new MembershipList());
		},
		lessons(){
			load(new LessonList());
		}
	}
};