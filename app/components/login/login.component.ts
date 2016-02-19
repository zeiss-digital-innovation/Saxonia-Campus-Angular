import {Component} from 'angular2/core'
import {Router} from 'angular2/router'
import {AuthService} from '../../services/auth.service'

@Component({
    templateUrl: 'app/components/login/login.component.html'
})
export class LoginComponent {

    username: string
    password: string

    constructor(private _router: Router) {}

    login() {
        AuthService.setCredentials(this.username, this.password)
        this._router.navigate(['Home'])
    }
}

