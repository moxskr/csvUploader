public with sharing class CsvImportController {
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
}
