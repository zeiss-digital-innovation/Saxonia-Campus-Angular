import {Component} from 'angular2/core';
import {Router} from 'angular2/router';
import {AuthService} from '../../services/auth.service';

@Component({
    selector: 'navbar',
    templateUrl: 'app/components/navbar/navbar.component.html'
})
export class NavbarComponent {

    constructor(private _router: Router) {}

    getUsername() : string {
        return AuthService.getUsername();
    }

    isAuthenticated() : boolean {
        return AuthService.isAuthenticated();
    }

    logout() {
        AuthService.removeCredentials();
        this._router.navigate(['Home']);
    }
}

