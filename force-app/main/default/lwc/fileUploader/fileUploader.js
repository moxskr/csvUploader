import { LightningElement, api } from 'lwc';

export default class FileUploader extends LightningElement {
	@api
	formats = ['text/plain'];

	@api
	maxSize = 3 * 1024 * 1024;

	@api
	allowMultiple = false;

	files = [];

	get showSubmitFile() {
		return !!this.files.length;
	}

	handleFileUpload(event) {
		const { file } = event.detail;

		this.files = this.allowMultiple ? [...this.files, file] : [file];
	}

    handleSubmit() {
        const submitEvent = new CustomEvent('filesupload', {
            detail: {
                files: this.files
            }
        });

        this.dispatchEvent(submitEvent);
    }
}
