public without sharing class CsvImportBatch implements Database.Batchable<String>, Database.Stateful {
	private List<String> headers;
	private List<String> rows;

	private String objectName;

	public CsvImportBatch(List<String> headers, List<String> rows, String objectName) {
		this.headers = headers;
		this.rows = rows;
		this.objectName = objectName;
	}

	public Iterable<String> start(Database.BatchableContext BC) {
		return new RowsIterable(this.rows);
	}

	public void execute(Database.BatchableContext BC, List<String> rows) {
		Schema.SObjectType sObjectType = Schema.getGlobalDescribe().get(this.objectName);

        List<SObject> records = new List<SObject> ();

        if(sObjectType != null) {
            for(String row : rows) {
                SObject record = sObjectType.newSObject();

                List<String> values = row.split(',');
                
                for(Integer i = 0; i < values.size(); i++) {
                    String value = values[i];
                    String header = this.headers[i];
                    record.put(header, value);
                }

                records.add(record);
            }
        }
        
        insert records;
	}

	public void finish(Database.BatchableContext BC) {
	}

	private class RowsIterable implements Iterable<String> {
		private List<String> rows;

		public RowsIterable(List<String> rows) {
			this.rows = rows;
		}

		public Iterator<String> iterator() {
			return new RowsIterator(this.rows);
		}
	}

	private class RowsIterator implements Iterator<String> {
		private List<String> rows;
		private Integer currentIndex;

		public RowsIterator(List<String> rows) {
			this.rows = rows;
			this.currentIndex = 0;
		}

		public Boolean hasNext() {
			return this.currentIndex < this.rows.size();
		}

		public String next() {
			if (hasNext()) {
				return this.rows[this.currentIndex++];
			} else {
				throw new NoSuchElementException('Iterator has no more elements.');
			}
		}
	}
}
