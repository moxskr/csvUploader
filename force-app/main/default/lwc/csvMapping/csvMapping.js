import { api, LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getFieldsList from '@salesforce/apex/CsvImportController.getFieldsList';

export default class CsvMapping extends LightningElement {
	@api
	uploadedFile;
	@api
	objectName = '';

	fieldsOptions = [];

	headers = [];

    selectedFields = {};

	get isFieldsSelectorsDisabled() {
		return !this.fieldsOptions.length;
	}

	@wire(getFieldsList, { sObjectName: '$objectName' })
	getFieldsList({ data, error }) {
		if (data) {
			this.fieldsOptions = data.map((field) => ({ label: field, value: field }));
		} else if (error) {
			console.error(error)
			const toastEvent = new ShowToastEvent({
				title: 'Error',
				message: error.message,
				variant: 'error'
			});

			this.dispatchEvent(toastEvent);
		}
	}

    @api
    getMapping() {
        if(Object.keys(this.selectedFields) < this.headers.length) {
            const toastEvent = new ShowToastEvent({
				title: 'Error',
				message: 'Not all fields are selected!',
				variant: 'error'
			});

			this.dispatchEvent(toastEvent);

            return null;
        }

        return this.headers.map(header => this.selectedFields[header]);    
    }

    handleSelectedField(event) {
        let { header } = event.currentTarget.dataset;

        this.selectedFields[header] = event.detail.value;
    }

	async connectedCallback() {
		if (this.uploadedFile) {
			await this.setHeaders(this.uploadedFile);
		}
	}

	async setHeaders(file) {
		const reader = file.stream().getReader();
		const decoder = new TextDecoder('utf-8');

		const encodedValue = await reader.read();

		const decodedValue = decoder.decode(encodedValue.value);

		this.headers = decodedValue.split('\n').shift().split(',');
	}
}
