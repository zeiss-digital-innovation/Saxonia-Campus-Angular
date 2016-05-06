import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {OAuth2Service} from '../../services/oauth2.service';
import {JwtHelper} from 'angular2-jwt';

@Component({
    selector: 'navbar',
    templateUrl: 'app/components/navbar/navbar.component.html'
})
export class NavbarComponent {

    private username = '';
    private jwtHelper: JwtHelper = new JwtHelper();

    constructor(private _router: Router,
                private _oauth2Service: OAuth2Service) {
        this._oauth2Service.onAuthenticate.subscribe(token => {
            let decodedToken = this.jwtHelper.decodeToken(token);
            this.username = decodedToken.sub;
        })
    }

    isAuthenticated() : boolean {
        return this._oauth2Service.isAuthenticated();
    }

    logout() {
        this._oauth2Service.removeTokens();
        this.username = '';
        this._router.navigate(['Login']);
    }
}

