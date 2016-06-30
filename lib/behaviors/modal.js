import {Behavior} from 'mn';
import select2 from 'select2';
import ra from 'ra';

export default Behavior.extend({
	defaults: {
		show: false
	},
	ui:       {
		modal: '.modal'
	},
	triggers: {
		'hidden.bs.modal': 'modal:hidden',
		'shown.bs.modal':  'modal:shown'
	},
	onRender(){
		this.ui.modal.modal();
	},
	onModalShow(){
		this.ui.modal.modal('show');
	},
	onModalHidden(){
		this.options.show = false;
		this.view.options.show = false;
		ra.trigger('modal', 'hide', this.view);
	},
	onModalShown(){
		this.options.show = false;
		this.view.options.show = false;
		this.$('.s2').each((i, s)=>$(s).select2({placeholder: s.dataset.placeholder}));
		this.$('input:first').focus();
	},
	onModalHide(keep){
		if (keep === true) this.view.options.keepModal = true;
		this.ui.modal.modal('hide');
	}
});