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
}
