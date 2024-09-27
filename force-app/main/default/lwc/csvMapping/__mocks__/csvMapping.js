import { LightningElement, api } from 'lwc';

export default class CsvMapping extends LightningElement {
    @api
    uploadedFile;
    @api
    sObjectName;

    @api
    getMapping() {}
}
