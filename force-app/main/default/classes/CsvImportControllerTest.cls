@isTest
private class CsvImportControllerTest {
	@isTest
	static void testGetSObjectList() {
		System.runAs(new User(Id = UserInfo.getUserId())) {
			Test.startTest();

			List<String> sObjectList = CsvImportController.getSObjectList();

			Test.stopTest();

			Assert.areNotEqual(0, sObjectList.size(), 'SObject list should not be empty');
		}
	}

	@isTest
	static void testGetFieldsList() {
		System.runAs(new User(Id = UserInfo.getUserId())) {
			Set<String> fields = Account.SObjectType.getDescribe().fields.getMap().keySet();

			Test.startTest();
			
			List<String> resultFields = CsvImportController.getFieldsList('Account');

			Test.stopTest();

			Assert.areEqual(fields.size(), resultFields.size());
		}
	}
}
