import { createElement } from '@lwc/engine-dom';
import FileUploadZone from 'c/fileUploadZone';

describe('c-file-upload-zone', () => {
	afterEach(() => {
		while (document.body.firstChild) {
			document.body.removeChild(document.body.firstChild);
			jest.clearAllMocks();
		}
	});

	it('test drag and drop', async () => {
		const element = createElement('c-file-upload-zone', {
			is: FileUploadZone
		});

		element.maxSize = 1000;
		element.formats = ['text/csv'];

		document.body.appendChild(element);

		const handler = jest.fn();

		element.addEventListener('fileupload', handler);

		const dragZone = element.shadowRoot.querySelector('div[data-id=dragZone');

		const testFile = createTestFile();

		const dropEvent = new CustomEvent('drop');

		dropEvent.dataTransfer = {
			files: [testFile]
		};

		dragZone.dispatchEvent(dropEvent);

		await flushPromises();

		expect(handler).toHaveBeenCalledWith(
			expect.objectContaining({
				detail: expect.objectContaining({
					file: expect.objectContaining({
						name: testFile.name,
						type: testFile.type,
						size: testFile.size
					})
				})
			})
		);
	});

	it('test adding file using input', async () => {
		const element = createElement('c-file-upload-zone', {
			is: FileUploadZone
		});

		element.maxSize = 1000;
		element.formats = ['text/csv'];

		document.body.appendChild(element);

		const handler = jest.fn();

		element.addEventListener('fileupload', handler);

		const input = element.shadowRoot.querySelector('lightning-input');

		const testFile = createTestFile();

		const inputEvent = new CustomEvent('change');

		Object.defineProperty(inputEvent, 'target', {
			value: {
				files: [testFile]
			}
		});

		input.dispatchEvent(inputEvent);

		await flushPromises();

		expect(handler).toHaveBeenCalledWith(
			expect.objectContaining({
				detail: expect.objectContaining({
					file: expect.objectContaining({
						name: testFile.name,
						type: testFile.type,
						size: testFile.size
					})
				})
			})
		);
	});

	it('test validation', async () => {
		const element = createElement('c-file-upload-zone', {
			is: FileUploadZone
		});

		const largePlainFile = createTestFile('test123123qweqweqwe', 'text/plain');
		const smallCsvFile = createTestFile('test', 'text/csv');

		element.maxSize = 10;
		element.formats = ['text/plain'];

		document.body.appendChild(element);

		const fileUploadHandler = jest.fn();
		const showToastHandler = jest.fn();

		element.addEventListener('fileupload', fileUploadHandler);
		element.addEventListener('lightning__showtoast', showToastHandler);

		const dragZone = element.shadowRoot.querySelector('div[data-id=dragZone');

		const dropEventLarge = new CustomEvent('drop');

		dropEventLarge.dataTransfer = {
			files: [largePlainFile]
		};

		dragZone.dispatchEvent(dropEventLarge);

		await flushPromises();

		expect(fileUploadHandler).not.toHaveBeenCalled();
		expect(showToastHandler).toHaveBeenCalledTimes(1);

		const dropEventSmall = new CustomEvent('drop');

		dropEventSmall.dataTransfer = {
			files: [smallCsvFile]
		};

		dragZone.dispatchEvent(dropEventSmall);

		await flushPromises();

		expect(fileUploadHandler).not.toHaveBeenCalled();
		expect(showToastHandler).toHaveBeenCalledTimes(2);
	});
});

function flushPromises() {
	return Promise.resolve(process.nextTick);
}

function createTestFile(content = 'test', format = 'text/csv') {
	const file = new File([content], 'test.csv', { type: format });

	return file;
}
