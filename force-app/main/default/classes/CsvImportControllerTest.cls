@isTest
private class CsvImportControllerTest {
	@isTest
	static void testGetSObjectList() {
		System.runAs(new User(Id = UserInfo.getUserId())) {
            Test.startTest();

			List<String> sObjectList = CsvImportController.getSObjectList();

            Test.stopTest();

			System.assertNotEquals(0, sObjectList.size(), 'SObject list should not be empty');
		}
	}
}
