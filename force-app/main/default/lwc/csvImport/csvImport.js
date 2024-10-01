import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import importRecords from '@salesforce/apex/CsvImportController.importRecords';

const MODES = Object.freeze({
	UPLOAD_FILE: 'uploadFile',
	MAPPING: 'mapping'
});

const FILE_FORMATS = ['text/csv'];

export default class CsvImport extends LightningElement {
	mode = MODES.UPLOAD_FILE;

	maxSize = 10 * 1024;
	fileUploadFormats = FILE_FORMATS;

	uploadedFile;

	mappingFields = [];

	get displayFileUpload() {
		return this.mode === MODES.UPLOAD_FILE;
	}

	get displayMapping() {
		return this.mode === MODES.MAPPING;
	}

	async handleFilesUpload(event) {
		const [file] = event.detail.files;

		await this.setMappingFields(file);

		this.uploadedFile = file;
		this.mode = MODES.MAPPING;
	}

	async setMappingFields(file) {
		const reader = file.stream().getReader();
		const decoder = new TextDecoder('utf-8');

		const { value } = await reader.read();

		const decodedValue = decoder.decode(value);

		this.mappingFields = decodedValue.split('\n').shift().split(',');
	}

	async handleSubmitMapping(event) {
		event.stopPropagation();

		const { objectName, mapping } = event.detail;

		const encodedCsv = await this.encodeFile(this.uploadedFile);

		try {
			await importRecords({
				encodedCsv,
				objectName,
				mapping
			});

			this.dispatchEvent(
				new ShowToastEvent({
					title: 'Success',
					message: 'Records imported successfully',
					variant: 'success'
				})
			);

			this.resetState();
		} catch (error) {
			console.error(error);
		}
	}

	async encodeFile(file) {
		const reader = file.stream().getReader();

		const { value } = await reader.read();

		let binaryString = '';

		for (let i = 0; i < value.length; i++) {
			binaryString += String.fromCharCode(value[i]);
		}

		return btoa(binaryString);
	}

	resetState() {
		this.mode = MODES.uploadedFile;
		this.uploadedFile = undefined;
	}
}
