import {Component} from 'angular2/core';
import {Router} from 'angular2/router';
import {OAuth2Service} from '../../services/oauth2.service';
import {UserService} from '../../services/user.service';
import {User} from '../../model/user';

@Component({
    selector: 'navbar',
    templateUrl: 'app/components/navbar/navbar.component.html'
})
export class NavbarComponent {

    private username = '';

    constructor(private _router: Router,
                private _oauth2Service: OAuth2Service,
                private _userService: UserService) {
        this._oauth2Service.onAuthenticate.subscribe(() => this.getUsername())
    }

    private getUsername() {
        this._userService.getUser()
            .subscribe((user: User) => {
                this.username = user.username;
            });
    }

    isAuthenticated() : boolean {
        return this._oauth2Service.isAuthenticated();
    }

    logout() {
        this._oauth2Service.removeToken();
        this.username = '';
        this._router.navigate(['Login']);
    }
}

