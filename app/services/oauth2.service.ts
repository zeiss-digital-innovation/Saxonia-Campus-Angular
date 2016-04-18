import {Injectable, Output, EventEmitter} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';
import {Http, Headers} from 'angular2/http';
import {JwtHelper} from 'angular2-jwt';

@Injectable()
export class OAuth2Service {
    private clientId: string = 'campusapp';
    private resource: string = 'https://nb299.saxsys.de:8443/adfs-saml';
    private redirectUri: string = 'https://nb299.saxsys.de:8443/campus';
    @Output()
    onAuthenticate: EventEmitter<boolean> = new EventEmitter<boolean>(false);
    private jwtHelper: JwtHelper = new JwtHelper();

    constructor(private _router: Router, private _http: Http) {}

    public doImplicitFlow(code: string) {
        let id_token = localStorage.getItem('id_token');
        let refresh_token = localStorage.getItem('refresh_token');

        if (id_token != null) {
            // everything is valid and user is authenticated
            if (!this.jwtHelper.isTokenExpired(id_token)) {
                this.onAuthenticate.emit(true);
                this._router.navigate(['Overview']);
            // access token expired and refresh token available -> get new access token with refresh token
            } else if (refresh_token != null) {
                let payload: string = `client_id=${this.clientId}&refresh_token=${localStorage.getItem('refresh_token')}&grant_type=refresh_token`;
                this.getToken(payload);
            }
        }
        // process callback via redirect URI with authorization code -> get access token and refresh token with code
        else if (code != null) {
            let payload: string = `client_id=${this.clientId}&code=${code}&redirect_uri=${encodeURIComponent(this.redirectUri)}&grant_type=authorization_code`;
            this.getToken(payload);
        }
        // completely unauthenticated -> initiate OAuth2 flow by redirecting to ADFS
        else {
            window.location.href = `https://adfs.saxsys.de/adfs/oauth2/authorize?response_type=code&client_id=${this.clientId}&resource=${this.resource}&redirect_uri=${this.redirectUri}`;
        }
    }

    private getToken(payload: string) {
        this._http.post('https://nb299.saxsys.de:8443/rest/tokenHandler', payload)
            .map(res => res.json())
            .subscribe(
                json => {
                    localStorage.setItem('id_token', json.access_token);
                    if (localStorage.getItem('refresh_token') == null) {
                        localStorage.setItem('refresh_token', json.refresh_token);
                    }
                    this.onAuthenticate.emit(true);
                    this._router.navigate(['Overview']);
                },
                () => {
                    this.removeToken();
                    this._router.navigate(['Login']);
                }
            );
    }

    public isAuthenticated(): boolean {
        return localStorage.getItem('id_token') != null;
    }

    public removeToken() {
        localStorage.removeItem('id_token');
        localStorage.removeItem('refresh_token');
    }
}
