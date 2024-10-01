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
	@isTest
	static void testImportRecords() {
		String csvData = 'name,desc\nTest,Qwerty';

		Blob encodedCsv = Blob.valueOf(csvData);
		String encodedBase64Csv = EncodingUtil.base64Encode(encodedCsv);

		Test.startTest();

		CsvImportController.importRecords(
			new Map<String, String>{ 'name' => 'Name', 'desc' => 'Description' },
			encodedBase64Csv,
			'Account'
		);

		Test.stopTest();

		Integer accountCount = [SELECT COUNT() FROM Account];

		System.assertEquals(1, accountCount, 'Account record should be imported');
	}
}
