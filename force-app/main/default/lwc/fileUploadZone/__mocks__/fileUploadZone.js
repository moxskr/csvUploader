import { api, LightningElement } from 'lwc';

export default class FileUploadZone extends LightningElement {
    @api
    formats;

    @api
    maxSize;
}
