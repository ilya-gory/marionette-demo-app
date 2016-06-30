import {Behavior} from 'mn';

export default Behavior.extend({
	triggers:    {
		'submit': 'form:submit'
	},
	modelEvents: {
		error: 'onModelError'
	},
	onModelError(model, xhr){
		if (xhr.status == 422) {
			let resp = xhr.responseJSON;
			let errors = [];
			if (resp._embedded) {
				errors = resp._embedded.errors;
			} else {
				errors.push(resp);
			}
			if (errors.length) {
				this._hideValidationErrors();
				this.showValidationErrors(errors);
			}
		}
	},
	showValidationErrors(errors){
		_.each(errors, e=> {
			let g = this.$(`[name="${e.field}"]`).closest('.form-group');
			g.append(`<p class="help-block error-message">${e.message}</p>`);
			g.addClass('has-error');
		});
	},
	_hideValidationErrors(){
		_.each(this.$('.error-message'), m=> {
			let _m = $(m);
			_m.closest('.form-group').removeClass('has-error');
			_m.remove();
		});
	},
	onFormSubmit(){
		let s = this.$el.serializeArray().reduce((m, v)=> {
			m[v.name] = v.value;
			return m;
		}, {});
		this.view.options.serializedForm = s;
		this.view.triggerMethod('form:serialized', s);
	}
});