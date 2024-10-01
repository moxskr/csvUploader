String csv = 'name,desc\ntest account 2,test description 2';

String encodedCsv = EncodingUtil.base64Encode(Blob.valueOf(csv));

CsvImportController.importRecords(new Map<String, String> {'name' => 'Name', 'desc' => 'Description'}, encodedCsv, 'Account');