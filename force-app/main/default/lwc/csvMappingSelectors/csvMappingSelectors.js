import { api, LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getFieldsList from '@salesforce/apex/CsvImportController.getFieldsList';

export default class CsvMappingSelectors extends LightningElement {
	@api
	objectName;

	@api
	mappingFields = [];

	fieldsOptions = [];

	mapping = {};

	get areSelectorsDisabled() {
		return !this.fieldsOptions.length;
	}

	@wire(getFieldsList, { sObjectName: '$objectName' })
	getFieldsOptions({ data, error }) {
		if (data) {
			this.fieldsOptions = data.map((item) => ({
				label: item,
				value: item
			}));
		} else if (error) {
			this.dispatchEvent(
				new ShowToastEvent({
					title: 'Error',
					message: error.message,
					variant: 'error'
				})
			);
		}
	}

	handleSelectorChange(event) {
		const { field } = event.target.dataset;

		this.mapping[field] = event.detail.value;
	}

	handleSubmit() {
		const isValid = this.validateMapping();

		if (isValid) {
			const submitEvent = new CustomEvent('submitmapping', {
				composed: true,
				bubbles: true,
				detail: {
					mapping: this.mapping
				}
			});

			this.dispatchEvent(submitEvent);
		} else {
			this.dispatchEvent(
				new ShowToastEvent({
					title: 'Error',
					message: 'Please select object field for each file header fields',
					variant: 'error'
				})
			);
		}
	}

	validateMapping() {
		return Object.keys(this.mapping).length === this.mappingFields.length;
	}
}
