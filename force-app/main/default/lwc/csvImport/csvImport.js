import { LightningElement } from 'lwc';

const MODES = Object.freeze({
	UPLOAD_FILE: 'uploadFile',
	MAPPING: 'mapping'
});

const FILE_FORMATS = ['text/csv'];

export default class CsvImport extends LightningElement {
	mode = MODES.UPLOAD_FILE;

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

	handleSubmitMapping(event) {
		event.stopPropagation();
		console.log(event.detail.mapping);
		console.log(this.uploadedFile);
	}
}
