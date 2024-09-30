import { api, LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getSObjectList from '@salesforce/apex/CsvImportController.getSObjectList';

export default class CsvMapping extends LightningElement {
	@api
	mappingFields = [];

	selectedSObject;

	sObjectOptions = [];

	get isSObjectSelectorDisabled() {
		return !this.sObjectOptions.length;
	}

	@wire(getSObjectList)
	getSObjectList({ data, error }) {
		if (data) {
			this.sObjectOptions = data.map((item) => ({
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

	handleObjectSelectorChange(event) {
		this.selectedSObject = event.detail.value;
	}
}
