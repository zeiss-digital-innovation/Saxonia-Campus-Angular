import {Injectable} from 'angular2/core';
import {Http, Response, Headers} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {OAuth2Service} from './oauth2.service';
import {HypermediaResource} from '../model/hypermedia-resource';

@Injectable()
export class RestService {
    constructor (private _http: Http, private _oauth2Service: OAuth2Service) {}

    private _restUrl = 'https://nb299.saxsys.de:8443/rest';

    public getRest() {
        return Observable.defer(() => {
                return this._http.get(this._restUrl, {headers: RestService.getAuthHeader()})
            })
            .retryWhen(errors => errors.flatMap(error => {
                    // this will essentially automatically retry the request if it can
                    console.log('automatic rest retry');
                    return this._oauth2Service.doImplicitFlow(null);
                }).delay(250)
            )
            .map(res => <HypermediaResource> res.json())
            .catch(RestService.handleError)
    }

    public static getAuthHeader(): Headers {
        let headers: Headers = new Headers();
        let token = localStorage.getItem('id_token');
        if (token != null) {
            headers.append('Authorization', 'Bearer ' + token);
        }
        return headers;
    }

    private static handleError (error: Response) {
        console.error(error);
        return Observable.throw(error || 'Server error');
    }
}
