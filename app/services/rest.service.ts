import {Injectable} from 'angular2/core';
import {Response, Headers} from 'angular2/http';
import {AuthHttp} from 'angular2-jwt';
import {Observable} from 'rxjs/Observable';
import {HypermediaResource} from '../model/hypermedia-resource';

@Injectable()
export class RestService {
    constructor (private _authHttp: AuthHttp) {}

    private _restUrl = 'https://nb299.saxsys.de:8443/rest';

    public getRest() {
        return this._authHttp.get(this._restUrl, {
                headers: RestService.getHeaders()
            })
            .map(res => <HypermediaResource> res.json())
            .catch(RestService.handleError);
    }

    public static getHeaders(): Headers {
        var headers: Headers = new Headers();
        headers.append('Cache-Control', 'no-cache');
        headers.append('Pragma', 'no-cache');
        return headers;
    }

    private static handleError (error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
