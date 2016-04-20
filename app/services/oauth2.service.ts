import {Injectable, Output, EventEmitter} from 'angular2/core';
import {Location} from 'angular2/router';
import {Http, Headers} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {JwtHelper} from 'angular2-jwt';

@Injectable()
export class OAuth2Service {
    private clientId: string = 'campusapp';
    private resource: string = 'https://nb299.saxsys.de:8443/adfs-saml';
    private redirectUri: string = 'https://nb299.saxsys.de:8443/campus';
    @Output()
    onAuthenticate: EventEmitter<boolean> = new EventEmitter<boolean>(false);
    private jwtHelper: JwtHelper = new JwtHelper();

    constructor(private _http: Http) {}

    public doImplicitFlow(code: string) {
        let id_token = localStorage.getItem('id_token');
        let refresh_token = localStorage.getItem('refresh_token');

        // everything is valid and user is authenticated
        if (id_token != null && !this.jwtHelper.isTokenExpired(id_token)) {
            console.log('all authenticated');
            this.onAuthenticate.emit(id_token);
            return Observable.range(1, 1);
        // access token expired or not available and refresh token available -> get new access token with refresh token
        } else if (refresh_token != null) {
            console.log('using refresh token to get new auth token');
            let payload: string = `client_id=${this.clientId}&refresh_token=${localStorage.getItem('refresh_token')}&grant_type=refresh_token`;
            return this.getToken(payload);
        }
        // process callback via redirect URI with authorization code -> get access token and refresh token with code
        else if (code != null) {
            console.log('using authorization code to get new auth and refresh tokens');
            let payload: string = `client_id=${this.clientId}&code=${code}&redirect_uri=${encodeURIComponent(this.redirectUri)}&grant_type=authorization_code`;
            return this.getToken(payload);
        }
        // completely unauthenticated -> initiate OAuth2 flow by redirecting to ADFS
        else {
            console.log('redirecting to ADFS');
            window.location.href = `https://adfs.saxsys.de/adfs/oauth2/authorize?response_type=code&client_id=${this.clientId}&resource=${this.resource}&redirect_uri=${this.redirectUri}`;
        }
    }

    private getToken(payload: string) {
        let observable = this._http.post('https://nb299.saxsys.de:8443/rest/tokenHandler', payload)
            .map(res => res.json());

        observable.subscribe(
                json => {
                    localStorage.setItem('id_token', json.access_token);
                    if (localStorage.getItem('refresh_token') == null) {
                        localStorage.setItem('refresh_token', json.refresh_token);
                    }
                    this.onAuthenticate.emit(json.access_token);
                },
                () => this.removeToken()
            );

        return observable;
    }

    public isAuthenticated(): boolean {
        return localStorage.getItem('id_token') != null;
    }

    public removeToken() {
        localStorage.removeItem('id_token');
        localStorage.removeItem('refresh_token');
    }
}
