public with sharing class CsvImportService {
	public void importRecords(Map<String, String> mapping, String csv, String objectName) {
		List<String> csvRows = this.splitCsvRows(csv);

		List<String> csvHeaders = this.getHeadersFromCsv(csvRows.remove(0));

		List<String> mappingHeaders = this.getMappingHeaders(csvHeaders, mapping);

		this.startBatch(mappingHeaders, csvRows, objectName);
	}

	public List<String> splitCsvRows(String csv) {
		return csv.split('\n');
	}

	public List<String> getHeadersFromCsv(String csvRow) {
		return csvRow.split(',');
	}

	public List<String> getMappingHeaders(List<String> csvHeaders, Map<String, String> mapping) {
		List<String> resultHeaders = new List<String>();

		for (String csvHeader : csvHeaders) {
			resultHeaders.add(mapping.get(csvHeader));
		}

		return resultHeaders;
	}

	public void startBatch(List<String> headers, List<String> rows, String objectName) {
		Database.executeBatch(new CsvImportBatch(headers, rows, objectName), 200);
	}
}
