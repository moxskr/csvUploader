import { LightningElement } from 'lwc';

export default class TestFileUpload extends LightningElement {
    fileFormats = ["text/csv"]

    handleFileUpload(event) {
        console.log(event.detail.file.name)
        console.log(event.detail.file.size)
        console.log(event.detail.file.type)
    }
}