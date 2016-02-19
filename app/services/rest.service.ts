import {Injectable} from 'angular2/core';
import {Http, Response, Headers} from 'angular2/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class RestService {
    constructor (private http: Http) {}

    private _restUrl = 'http://localhost:8180/rest';

    getRest() {
        return this.http.get(this._restUrl, {
                headers: RestService.getHeaders()
            })
            .do(data => console.log(data)) // eyeball results in the console
            .catch(this.handleError);
    }

    static getHeaders() {
        var headers = new Headers();
        if (sessionStorage.token) {
            headers.append('Authorization', 'Basic ' + sessionStorage.token);
        }
        return headers;
    }

    private handleError (error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
