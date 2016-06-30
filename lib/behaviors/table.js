import {Behavior,CollectionView,ItemView,View} from 'mn';
import PaginationView from '../../views/_part/pagination.js';

function rowsViewInstance(collection, rowView) {
	return new (CollectionView.extend({
		tagName:   'tbody',
		childView: rowView
	}))({collection: collection});
}

export default Behavior.extend({
	defaults: {
		currentPage: 1
	},
	ui:       {
		th:             'th[data-sortable]',
		paginationLink: '.pagination>li>a',
		table:          'table'
	},
	events:   {
		'click @ui.paginationLink': 'onTablePaginationClick',
		'click @ui.th':             'onHeadClick'
	},
	onHeadClick(e) {
		// todo implement table sorting
	},
	onRender(){
		let rv = rowsViewInstance(this.view.collection, this.options.rowView);
		this.view.showChildView('tbody', rv);
		if (this._thead) {
			this.ui.table.append(this._thead);
		}
		this._renderPager();
	},
	onAfterRenderTemplate(html){
		this._thead = $('thead', html);
	},
	_renderPager() {
		let pages = this._pages();
		if (!_.isEmpty(pages)) {
			let pv = new PaginationView({pages: pages, active: this.options.currentPage});
			this.listenTo(pv, 'page:set', this._setPage.bind(this));
			this.view.showChildView('pagination', pv);
		}
	},
	_setPage(p){
		this.options.currentPage = parseInt(p);
		this._renderPager();
		this.view.collection.loadPage(p);
	},
	_pages(){
		let total = this.view.collection.total || 0;
		let max = this.view.collection.length;
		if (max < 2) {
			max = 10;
		}
		if (total <= max) return;

		let currentstep = this.options.currentPage;
		let writer = [];
		let maxsteps = 4;
		let firststep = 1;
		let laststep = Math.ceil(total / max);
		let beginstep = currentstep - Math.round(maxsteps / 2) + (maxsteps % 2);
		let endstep = currentstep + Math.round(maxsteps / 2) - 1;

		if (beginstep < firststep) {
			beginstep = firststep;
			endstep = maxsteps;
		}
		if (endstep > laststep) {
			beginstep = laststep - maxsteps + 1;
			if (beginstep < firststep) {
				beginstep = firststep
			}
			endstep = laststep
		}

		if (beginstep > firststep) {
			writer.push(firststep);
		}

		if (beginstep > firststep + 1) {
			writer.push('...');
		}

		let j = beginstep;
		while (j <= endstep) {
			writer.push(j);
			j++;
		}

		if (endstep + 1 < laststep) {
			writer.push('...');
		}

		if (endstep < laststep) {
			writer.push(laststep);
		}

		return writer;
	}
});