import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class FileUploadZone extends LightningElement {
	@api
	formats = ['text/plain'];

	@api
	maxSize = 3 * 1024 * 1024;

	handleFileInputChange(event) {
		const [file] = event.target.files;

		if (file) {
			const isValid = this.validateFile(file);

			if (isValid) {
				this.fireFileUploadEvent(file);
			}
		}
	}

	handleFileDrag(event) {
		event.preventDefault();
	}

	handleFileDrop(event) {
		event.preventDefault();

		const { dataTransfer } = event;

		if (dataTransfer) {
			const [file] = dataTransfer.files;

			const isValid = this.validateFile(file);

			if (isValid) {
				this.fireFileUploadEvent(file);
			}
		}
	}

	validateFile(file) {
		return this.validateSize(file) && this.validateFormat(file);
	}

	validateSize(file) {
		const isValid = file.size <= this.maxSize;

		if (!isValid) {
			const toastEvent = new ShowToastEvent({
				title: 'File too large',
				message: `File size must be less than ${this.maxSize} bytes`,
				variant: 'error'
			});

			this.dispatchEvent(toastEvent);
		}

		return isValid;
	}

	validateFormat(file) {
		const isValid = this.formats.includes(file.type);

		if (!isValid) {
			const toastEvent = new ShowToastEvent({
				title: 'File has wrong format type',
				message: `Only ${this.formats.join(',')} are allowed`,
				variant: 'error'
			});

			this.dispatchEvent(toastEvent);
		}

		return isValid;
	}

	fireFileUploadEvent(file) {
		const event = new CustomEvent('fileupload', {
			detail: {
				file
			}
		});

		this.dispatchEvent(event);
	}
}
