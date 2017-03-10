import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OAuth2Service } from '../../shared/auth/oauth2.service';
import { ConfigService } from '../../shared/config/config.service';
import { ModalComponent } from '../modal/components/modal';

@Component({
  templateUrl: './login-failed.component.html'
})
export class LoginFailedComponent implements AfterViewInit {

  @ViewChild('loginModal')
  modal: ModalComponent;
  redirectUrl: string;
  reason: string;

  constructor(private _oauth2Service: OAuth2Service, private _configService: ConfigService, private _route: ActivatedRoute) {
    const config = this._configService.getConfig();
    this.redirectUrl = config['redirect.url'];
    this.reason = _route.params['reason'];
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

