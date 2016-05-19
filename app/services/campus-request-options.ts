import {BaseRequestOptions} from '@angular/http';

export class CampusRequestOptions extends BaseRequestOptions {
    constructor() {
        super();

        this.headers.append('Cache-Control', 'no-cache');
        this.headers.append('Pragma', 'no-cache');
    }
}