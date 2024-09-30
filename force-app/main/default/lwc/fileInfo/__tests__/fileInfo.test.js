import { createElement } from '@lwc/engine-dom';
import FileInfo from 'c/fileInfo';

describe('c-file-info', () => {
	afterEach(() => {
		while (document.body.firstChild) {
			document.body.removeChild(document.body.firstChild);
		}
	});

	it('test file info display', () => {
		const element = createElement('c-file-info', {
			is: FileInfo
		});

		const testFile = createTestFile();

		element.file = testFile;

		document.body.appendChild(element);

		const name = element.shadowRoot.querySelector('p[data-id=name]');
		const size = element.shadowRoot.querySelector('p[data-id=size]');
		const type = element.shadowRoot.querySelector('p[data-id=type]');

		expect(name.textContent).toBe(`File name: ${testFile.name}`);
		expect(size.textContent).toBe(`Size: ${testFile.size} bytes`);
		expect(type.textContent).toBe(`Type: ${testFile.type}`);
	});
});

function createTestFile(content = 'test', format = 'text/csv') {
	const file = new File([content], 'test.csv', { type: format });

	return file;
}
