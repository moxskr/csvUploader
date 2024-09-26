import { createElement } from '@lwc/engine-dom';
import CsvImport from 'c/csvImport';
import getSObjectList from '@salesforce/apex/CsvImportController.getSObjectList';

jest.mock(
	'@salesforce/apex/CsvImportController.getSObjectList',
	() => {
		const { createApexTestWireAdapter } = require('@salesforce/sfdx-lwc-jest');

		return {
			default: createApexTestWireAdapter()
		};
	},
	{ virtual: true }
);

const testSObjectList = ['Account', 'Case', 'Contact'];

jest.mock('c/fileUploadZone');

describe('c-csv-import', () => {
	afterEach(() => {
		while (document.body.firstChild) {
			document.body.removeChild(document.body.firstChild);
		}
		jest.clearAllMocks();
	});

	it('test csv import component', async () => {
		const element = createElement('c-csv-import', {
			is: CsvImport
		});

		document.body.appendChild(element);

		getSObjectList.emit(testSObjectList);

		await flushPromises();

		const objectSelector = element.shadowRoot.querySelector(
			'lightning-combobox[data-id=selectObject]'
		);
		const selectObjectButton = element.shadowRoot.querySelector(
			'lightning-button[data-id=selectObjectButton]'
		);

		expect(objectSelector.options.length).toBe(testSObjectList.length);
		expect(selectObjectButton).not.toBeNull();

		const handler = jest.fn();

		element.addEventListener('lightning__showtoast', handler);

		selectObjectButton.click();

		expect(handler).toHaveBeenCalledTimes(1);

		const objectSelectEvent = new CustomEvent('change', {
			detail: {
				value: 'Account'
			}
		});

		objectSelector.dispatchEvent(objectSelectEvent);

		selectObjectButton.click();

		await flushPromises();

		const fileUploadZone = element.shadowRoot.querySelector(
			'c-file-upload-zone'
		);

		expect(fileUploadZone).not.toBeNull();

		const testFile = createTestFile();
		
		const testUploadFileEvent = new CustomEvent('fileupload', {
			detail: {
				file: testFile
			}
		});

		fileUploadZone.dispatchEvent(testUploadFileEvent);

		await flushPromises();

		const fileInfo = element.shadowRoot.querySelector('c-file-info');

		expect(fileInfo).not.toBeNull();
	});
});

function flushPromises() {
	return Promise.resolve(process.nextTick);
}

function createTestFile(content = 'test', format = 'text/csv') {
	const file = new File([content], 'test.csv', { type: format });

	return file;
}

