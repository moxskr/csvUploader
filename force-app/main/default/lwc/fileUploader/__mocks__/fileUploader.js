import { LightningElement, api } from "lwc";

export default class FileUploader extends LightningElement {
    @api
    formats;

    @api
    maxSize;

    @api
    allowMultiple;
}