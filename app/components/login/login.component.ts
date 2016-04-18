import {Component, ViewChild, AfterViewInit} from 'angular2/core';
import {Router} from 'angular2/router';
import {OAuth2Service} from '../../services/oauth2.service';
import {RestService} from '../../services/rest.service';
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
    errorMessage: string;

    constructor(private _router: Router, private _restService: RestService) {
    }

    ngAfterViewInit() {
        this.modal.open();
    }

    clearForm() {
        this.username = null;
        this.password = null;
        this.errorMessage = null;
    }

    login() {
        console.log("If you see this, something went wrong with single-sign-on.")
    }
}

