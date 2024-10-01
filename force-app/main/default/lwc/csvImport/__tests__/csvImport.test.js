import { createElement } from '@lwc/engine-dom';
import CsvImport from 'c/csvImport';

import importRecords from '@salesforce/apex/CsvImportController.importRecords';

const TEST_FILE_CONTENT = 'id,name,desc\n1,test,qwerty';

global.TextDecoder = jest.fn(() => ({
	decode: jest.fn((buffer) => String.fromCharCode.apply(null, buffer))
}));

global.File.prototype.stream = jest.fn(() => ({
	getReader: jest.fn(() => ({
		read: jest.fn(() =>
			Promise.resolve({
				done: false,
				value: Uint8Array.from(
					Array.from(TEST_FILE_CONTENT).map((letter) => letter.charCodeAt(0))
				)
			})
		)
	}))
}));

jest.mock(
	'@salesforce/apex/CsvImportController.importRecords',
	() => ({
		default: jest.fn()
	}),
	{ virtual: true }
);

jest.mock('c/fileUploader');
jest.mock('c/csvMapping');

describe('c-csv-import', () => {
	afterEach(() => {
		while (document.body.firstChild) {
			document.body.removeChild(document.body.firstChild);
		}
	});

	it('test csv import component', async () => {
		importRecords.mockResolvedValue();

		const element = createElement('c-csv-import', {
			is: CsvImport
		});

		document.body.appendChild(element);

		await flushPromises();

		const fileUploader = element.shadowRoot.querySelector('c-file-uploader');

		expect(fileUploader).not.toBeNull();

		const testFile = createTestFile(TEST_FILE_CONTENT);

		fileUploader.dispatchEvent(
			new CustomEvent('filesupload', {
				detail: {
					files: [testFile]
				}
			})
		);

		//TODO: investigate problem
		await flushPromises();

		const csvMapping = element.shadowRoot.querySelector('c-csv-mapping');

		expect(csvMapping).not.toBeNull();

		csvMapping.dispatchEvent(
			new CustomEvent('submitmapping', {
				detail: {
					mapping: {
						id: 'Id',
						name: 'Name',
						desc: 'Description'
					}
				}
			})
		);

		await flushPromises();

		expect(importRecords).toHaveBeenCalled();
	});
});

function flushPromises() {
	return new Promise(process.nextTick);
}

function createTestFile(content = 'test', format = 'text/csv') {
	const file = new File([content], 'test.csv', { type: format });

	return file;
}
