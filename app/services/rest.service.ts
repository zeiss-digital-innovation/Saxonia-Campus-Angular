import {Injectable} from 'angular2/core';
import {Http, Response, Headers} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {HypermediaResource} from '../model/hypermedia-resource';

@Injectable()
export class RestService {
    constructor (private http: Http) {}

    private _restUrl = 'http://localhost:8080/rest';

    public getRest() {
        return this.http.get(this._restUrl, {
                headers: RestService.getHeaders()
            })
            .map(res => <HypermediaResource> res.json())
            .catch(RestService.handleError);
    }

    public static getHeaders(): Headers {
        var headers: Headers = new Headers();
        headers.append('Cache-Control', 'no-cache');
        headers.append('Pragma', 'no-cache');
        if (sessionStorage.getItem('token')) {
            headers.append('Authorization', 'Basic ' + sessionStorage.getItem('token'));
        }
        return headers;
    }

    private static handleError (error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
