import { createElement } from '@lwc/engine-dom';
import CsvMapping from 'c/csvMapping';
import getSObjectList from '@salesforce/apex/CsvImportController.getSObjectList';

jest.mock('c/csvMappingSelectors');

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

const TEST_OBJECTS = ['Account', 'Contact', 'Case'];
const MAPPING_FIELDS = ['id', 'name', 'desc'];

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

		element.mappingFields = MAPPING_FIELDS;

		document.body.appendChild(element);

		getSObjectList.emit(TEST_OBJECTS);

		const sObjectSelector = element.shadowRoot.querySelector(
			'lightning-combobox[data-id=objectSelector]'
		);

		sObjectSelector.dispatchEvent(
			new CustomEvent('change', {
				detail: {
					value: 'Account'
				}
			})
		);

		await flushPromises();

		const csvMappingSelectors = element.shadowRoot.querySelector('c-csv-mapping-selectors');

		expect(csvMappingSelectors).not.toBeNull();

		const handler = jest.fn();

		element.addEventListener('submitmapping', handler);

		csvMappingSelectors.dispatchEvent(
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
	});
});

function flushPromises() {
	return new Promise(process.nextTick);
}
