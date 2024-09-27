import { createElement } from '@lwc/engine-dom';
import CsvMapping from 'c/csvMapping';
import getFieldsList from '@salesforce/apex/CsvImportController.getFieldsList';

const TEST_FILE_CONTENT = 'id,name,desc\n1,test,qwerty';

global.TextDecoder = jest.fn(() => ({
    decode: jest.fn((buffer) => String.fromCharCode.apply(null, buffer)),
}));

global.File.prototype.stream = jest.fn(() => ({
    getReader: jest.fn(() => ({
        read: jest.fn(() => Promise.resolve({ done: false, value: Uint8Array.from(Array.from(TEST_FILE_CONTENT).map(letter => letter.charCodeAt(0)))})), // "test"
        releaseLock: jest.fn(),
    })),
}));

jest.mock(
	'@salesforce/apex/CsvImportController.getFieldsList',
	() => {
		const { createApexTestWireAdapter } = require('@salesforce/sfdx-lwc-jest');

		return {
			default: createApexTestWireAdapter()
		};
	},
	{ virtual: true }
);

const TEST_FIELDS = ['Id', 'Name', 'Description'];

describe('c-csv-mapping', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('test csv mapping component', async () => {
        const element = createElement('c-csv-mapping', {
            is: CsvMapping
        });

        const testFile = createTestFile(TEST_FILE_CONTENT);

        element.objectName = 'Account';
        element.uploadedFile = testFile;

        document.body.appendChild(element);

        getFieldsList.emit(TEST_FIELDS);

        await flushPromises();

        const mappingSelectors = element.shadowRoot.querySelectorAll('lightning-combobox');

        expect(mappingSelectors.length).toBe(3);
        expect(mappingSelectors[0].options.length).toBe(TEST_FIELDS.length)

        const handler = jest.fn();

        element.addEventListener('lightning__showtoast', handler);

        let mapping = element.getMapping();

        await flushPromises();

        expect(mapping).toBeNull();
        expect(handler).toHaveBeenCalled();

        for (let i = 0; i < 3; i++) {
            const mappingSelectorEvent = new CustomEvent('change', {
                detail: {
                    value: TEST_FIELDS[i]
                }
            });

            mappingSelectors[i].dispatchEvent(mappingSelectorEvent);
        }

        await flushPromises();

        mapping = element.getMapping();

        expect(mapping.length).toBe(3);
    });
});

function flushPromises() {
    return new Promise(process.nextTick);
}

function createTestFile(content = 'test', format = 'text/csv') {
	const file = new File([content], 'test.csv', { type: format });

	return file;
}
