import { api, LightningElement } from "lwc";

export default class CsvMappingSelectors extends LightningElement {
    @api
    mappingFields;
    @api
    objectName;
}