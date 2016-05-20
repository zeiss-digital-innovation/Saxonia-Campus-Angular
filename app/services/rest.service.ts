import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {ConfigService} from './config.service';
import {OAuth2Service} from './oauth2.service';
import {HypermediaResource} from '../model/hypermedia-resource';

@Injectable()
export class RestService {
    constructor (private _http: Http, private _configService: ConfigService, private _oauth2Service: OAuth2Service) {}

    public getRest() {
        return Observable.defer(() => this._configService.getConfig())
            .flatMap(config => this._http.get(config['backend.url'], {headers: RestService.getAuthHeader()}))
            .retryWhen(errors => errors.zip(Observable.range(1, 2), error => error)
                .flatMap(error => {
                    if (error.status != 401) {
                        return Observable.throw('no automatic retry possible' + error.status);
                    }
                    // this will essentially automatically retry the request if it can
                    console.log('automatic rest retry');
                    return this._oauth2Service.doImplicitFlow(null);
                }).delay(250)
            )
            .map((res: Response) => <HypermediaResource> res.json())
            .catch(RestService.handleError)
    }

    public static getAuthHeader(): Headers {
        let headers: Headers = new Headers();
        headers.append('Cache-Control', 'no-cache');
        headers.append('Pragma', 'no-cache');
        
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
