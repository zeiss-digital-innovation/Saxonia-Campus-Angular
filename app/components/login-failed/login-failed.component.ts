import {Component, ViewChild, AfterViewInit} from '@angular/core';
import {RouteSegment, OnActivate} from '@angular/router';
import {OAuth2Service} from '../../services/oauth2.service';
import {ConfigService} from '../../services/config.service';
import {MODAL_DIRECTIVES, ModalComponent} from '../modal/modal';

@Component({
    templateUrl: 'app/components/login-failed/login-failed.component.html',
    directives: MODAL_DIRECTIVES
})
export class LoginFailedComponent implements AfterViewInit, OnActivate {

    @ViewChild('loginModal')
    modal: ModalComponent;
    redirectUrl: string;
    reason: string;

    constructor(private _oauth2Service: OAuth2Service, private _configService: ConfigService) {
        this._configService.getConfig().subscribe(config => this.redirectUrl = config['redirect.url']);
    }

    routerOnActivate(curr: RouteSegment) {
        this.reason = curr.getParam('reason');
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

