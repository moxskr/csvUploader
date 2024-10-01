public with sharing class CsvImportController {
	private static CsvImportService service = new CsvImportService();

	@AuraEnabled(cacheable=true)
	public static List<String> getSObjectList() {
		try {
			List<SObjectType> sObejctTypes = Schema.getGlobalDescribe().values();

			List<String> sObjectApiNames = new List<String>();

			for (SObjectType sObjectType : sObejctTypes) {
				sObjectApiNames.add(sObjectType.getDescribe().getName());
			}

			return sObjectApiNames;
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}

	@AuraEnabled(cacheable=true)
	public static List<String> getFieldsList(String sObjectName) {
		try {
			List<SObjectField> fields = Schema.getGlobalDescribe()
				.get(sObjectName)
				.getDescribe()
				.fields.getMap()
				.values();

			List<String> fieldsApiNames = new List<String>();

			for (SObjectField field : fields) {
				fieldsApiNames.add(field.getDescribe().getName());
			}

			return fieldsApiNames;
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}

	@AuraEnabled
	public static void importRecords(Map<String, String> mapping, String encodedCsv, String objectName){
		try {
			String decodedCsv = EncodingUtil.base64Decode(encodedCsv).toString();

			service.importRecords(mapping, decodedCsv, objectName);
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}
}
