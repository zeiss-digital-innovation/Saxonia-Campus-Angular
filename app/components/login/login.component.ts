import {Component} from 'angular2/core';
import {Router} from 'angular2/router';

@Component({
    templateUrl: 'app/components/login/login.component.html'
})
export class LoginComponent {

    username: string;
    password: string;

    constructor(private _router: Router) {}

    login() {
        sessionStorage.token = btoa(this.username + ':' + this.password);
        this._router.navigate(['Home']);
    }
}

