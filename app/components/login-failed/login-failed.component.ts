import {Component, ViewChild, OnInit, AfterViewInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {OAuth2Service} from '../../services/oauth2.service';
import {ConfigService} from '../../services/config.service';
import {MODAL_DIRECTIVES, ModalComponent} from '../modal/modal';

@Component({
    templateUrl: 'app/components/login-failed/login-failed.component.html',
    directives: MODAL_DIRECTIVES
})
export class LoginFailedComponent implements OnInit, AfterViewInit {

    @ViewChild('loginModal')
    modal: ModalComponent;
    redirectUrl: string;
    reason: string;

    constructor(private oauth2Service: OAuth2Service,
                private configService: ConfigService,
                private route: ActivatedRoute) {
        this.configService.getConfig().subscribe(config => this.redirectUrl = config['redirect.url']);
    }

    ngOnInit() {
        this.reason = this.route.snapshot.params['reason'];
    }

    ngAfterViewInit() {
        this.modal.open('lg');
    }

    retry() {
        console.log("If you see this, something went wrong with single-sign-on.");
        this.oauth2Service.removeTokens();
        window.location.href = this.redirectUrl;
    }
}

