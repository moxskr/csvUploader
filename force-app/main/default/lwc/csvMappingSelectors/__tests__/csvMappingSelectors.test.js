import { createElement } from '@lwc/engine-dom';
import CsvMappingSelectors from 'c/csvMappingSelectors';

import getFieldsList from '@salesforce/apex/CsvImportController.getFieldsList';

const MAPPING_FIELDS = ['id', 'name', 'desc'];
const OBJECT_FIELDS = ['Id', 'Name', 'Description'];

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

describe('c-csv-mapping-selectors', () => {
	afterEach(() => {
		while (document.body.firstChild) {
			document.body.removeChild(document.body.firstChild);
		}
	});

	it('test csv mapping selector', async () => {
		const element = createElement('c-csv-mapping-selectors', {
			is: CsvMappingSelectors
		});

		element.mappingFields = MAPPING_FIELDS;
		element.objectName = 'Account';

		document.body.appendChild(element);

		getFieldsList.emit(OBJECT_FIELDS);

		await flushPromises();

		const mappingSelectors = element.shadowRoot.querySelectorAll('lightning-combobox');

		expect(mappingSelectors.length).toBe(3);

		for (let i = 0; i < 3; i++) {
			let mappingSelector = mappingSelectors[i];

			mappingSelector.dispatchEvent(
				new CustomEvent('change', {
					detail: {
						value: OBJECT_FIELDS[i]
					}
				})
			);
		}

		const submitButton = element.shadowRoot.querySelector(
			'lightning-button[data-id=submitButton]'
		);

		element.addEventListener('submitmapping', (event) => {
			let { mapping } = event.detail;

			let expectedObject = {};

			for (let i = 0; i < MAPPING_FIELDS.length; i++) {
				expectedObject[MAPPING_FIELDS[i]] = OBJECT_FIELDS[i];
			}

			for (let mappingField of Object.keys(mapping)) {
				expect(mapping[mappingField]).toBe(expectedObject[mappingField]);
			}
		});

		submitButton.click();
	});
});

function flushPromises() {
	return new Promise(process.nextTick);
}
