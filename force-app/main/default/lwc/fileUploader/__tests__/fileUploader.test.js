import { createElement } from '@lwc/engine-dom';
import FileUploader from 'c/fileUploader';

jest.mock('c/fileUploadZone');

describe('c-file-uploader', () => {
	afterEach(() => {
		while (document.body.firstChild) {
			document.body.removeChild(document.body.firstChild);
		}
	});

	it('test file uploader single mode', async () => {
		const element = createElement('c-file-uploader', {
			is: FileUploader
		});

		element.maxSize = 3 * 1024 * 1024;
		element.formats = ['text/csv'];

		document.body.appendChild(element);

		const fileUploadZone = element.shadowRoot.querySelector('c-file-upload-zone');

		const testFile = createTestFile();

		fileUploadZone.dispatchEvent(new CustomEvent('fileupload', { detail: { file: testFile } }));

		await flushPromises();

		let fileInfos = element.shadowRoot.querySelectorAll('c-file-info');

		expect(fileInfos.length).toBe(1);

		const testFile2 = createTestFile('test2');

		fileUploadZone.dispatchEvent(
			new CustomEvent('fileupload', { detail: { file: testFile2 } })
		);

		await flushPromises();

		fileInfos = element.shadowRoot.querySelectorAll('c-file-info');

		expect(fileInfos.length).toBe(1);

		const submitButton = element.shadowRoot.querySelector(
			'lightning-button[data-id=submitButton]'
		);

		element.addEventListener('filesupload', (event) => {
			const { files } = event.detail;

			expect(files.length).toBe(1);
			expect(files[0].name).toBe(testFile2.name);
			expect(files[0].size).toBe(testFile2.size);
			expect(files[0].type).toBe(testFile2.type);
		});

		submitButton.click();
	});

	it('test file uploader multiple mode', async () => {
		const element = createElement('c-file-uploader', {
			is: FileUploader
		});

		element.maxSize = 3 * 1024 * 1024;
		element.formats = ['text/csv'];
		element.allowMultiple = true;

		document.body.appendChild(element);

		const fileUploadZone = element.shadowRoot.querySelector('c-file-upload-zone');

		const testFile = createTestFile();

		fileUploadZone.dispatchEvent(new CustomEvent('fileupload', { detail: { file: testFile } }));

		await flushPromises();

		let fileInfos = element.shadowRoot.querySelectorAll('c-file-info');

		expect(fileInfos.length).toBe(1);

		const testFile2 = createTestFile('test2');

		fileUploadZone.dispatchEvent(
			new CustomEvent('fileupload', { detail: { file: testFile2 } })
		);

		await flushPromises();

		fileInfos = element.shadowRoot.querySelectorAll('c-file-info');

		expect(fileInfos.length).toBe(2);

		const submitButton = element.shadowRoot.querySelector(
			'lightning-button[data-id=submitButton]'
		);

		element.addEventListener('filesupload', (event) => {
			const { files } = event.detail;

			expect(files.length).toBe(2);

			expect(files[0].name).toBe(testFile.name);
			expect(files[0].size).toBe(testFile.size);
			expect(files[0].type).toBe(testFile.type);

			expect(files[1].name).toBe(testFile2.name);
			expect(files[1].size).toBe(testFile2.size);
			expect(files[1].type).toBe(testFile2.type);
		});

		submitButton.click();
	});
});

function flushPromises() {
	return Promise.resolve(process.nextTick);
}

function createTestFile(name, content = 'test', format = 'text/csv') {
	const file = new File([content], name, { type: format });

	return file;
}
