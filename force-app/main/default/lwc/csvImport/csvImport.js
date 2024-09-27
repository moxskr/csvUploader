import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getSObjectList from '@salesforce/apex/CsvImportController.getSObjectList';

const MODES = Object.freeze({
    SELECT_OBJECT: 'selectObject',
    UPLOAD_FILE: 'uploadFile',
    FILE_INFO: 'fileInfo',
    MAPPING: 'mapping'
});

const FILE_FORMATS = ['text/csv'];

export default class CsvImport extends LightningElement {
	sObjectListOptions;

    selectedObject;

    mode = MODES.SELECT_OBJECT;

    fileUploadFormats = FILE_FORMATS;

    uploadedFile;

    get isSelectorObjectDisabled() {
        return !this.sObjectListOptions;
    }

    get displaySelectObjectForm() {
        return this.mode === MODES.SELECT_OBJECT;
    }

    get displayFileUploadZone() {
        return this.mode === MODES.UPLOAD_FILE;
    }

    get displayFileInfo() {
        return this.mode === MODES.FILE_INFO;
    }

    get displayMapping() {
        return this.mode === MODES.MAPPING;
    }

	@wire(getSObjectList)
	getSobjectList({ data, error }) {
		if (data) {
			this.sObjectListOptions = data.map((item) => {
				return { label: item, value: item };
			});
		} else if (error) {
			const toastEvent = new ShowToastEvent({
				title: 'Error',
				message: error.message,
				variant: 'error'
			});

			this.dispatchEvent(toastEvent);
		}
	}

    handleObjectChange(event) {
        const {value} = event.detail;

        this.selectedObject = value;
    }
    
    handleSelectObjectButtonClick() {
        if(this.selectedObject) {
            this.mode = MODES.UPLOAD_FILE;
        } else {
            const toastEvent = new ShowToastEvent({
                title: 'Error',
                message: 'Select an object',
                variant: 'error'
            });

            this.dispatchEvent(toastEvent);
        }
    }

    handleFileUpload(event) {
        this.uploadedFile = event.detail.file;
        this.mode = MODES.FILE_INFO;
    }

    handleFileInfoNextButton() {
        this.mode = MODES.MAPPING;
    }
}
