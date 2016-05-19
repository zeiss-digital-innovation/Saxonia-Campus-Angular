import {Component, ViewChild, AfterViewInit} from '@angular/core';
import {OAuth2Service} from '../../services/oauth2.service';
import {ConfigService} from '../../services/config.service';
import {MODAL_DIRECTIVES, ModalComponent} from '../modal/modal';

@Component({
    templateUrl: 'app/components/login-failed/login-failed.component.html',
    directives: MODAL_DIRECTIVES
})
export class LoginFailedComponent implements AfterViewInit {

    @ViewChild('loginModal')
    modal: ModalComponent;
    redirectUrl: string;

    constructor(private _oauth2Service: OAuth2Service, private _configService: ConfigService) {
        this._configService.getConfig().subscribe(config => this.redirectUrl = config['redirect.url']);
    }

    ngAfterViewInit() {
        this.modal.open('lg');
    }

    retry() {
        console.log("If you see this, something went wrong with single-sign-on.");
        this._oauth2Service.removeTokens();
        window.location.href = this.redirectUrl;
    }
}

