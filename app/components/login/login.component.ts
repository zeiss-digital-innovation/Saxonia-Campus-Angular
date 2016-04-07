import {Component, ViewChild, AfterViewInit} from 'angular2/core';
import {Router} from 'angular2/router';
import {AuthService} from '../../services/auth.service';
import {MODAL_DIRECTIVES, ModalComponent} from '../modal/modal';

@Component({
    templateUrl: 'app/components/login/login.component.html',
    directives: MODAL_DIRECTIVES
})
export class LoginComponent implements AfterViewInit {

    @ViewChild('loginModal')
    modal: ModalComponent;
    username: string;
    password: string;

    constructor(private _router: Router) {
    }

    ngAfterViewInit() {
        this.modal.open();
    }

    clearForm() {
        this.username = null;
        this.password = null;
    }

    login() {
        AuthService.setCredentials(this.username, this.password);
        this.modal.close();
        this._router.navigate(['Home']);
    }
}

