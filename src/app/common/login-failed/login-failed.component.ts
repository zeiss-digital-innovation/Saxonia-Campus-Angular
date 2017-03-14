import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OAuth2Service } from '../../shared/auth/oauth2.service';
import { ConfigService } from '../../shared/config/config.service';
import { ModalComponent } from '../modal/components/modal';

@Component({
  templateUrl: './login-failed.component.html'
})
export class LoginFailedComponent implements OnInit, AfterViewInit {

  @ViewChild('loginModal')
  modal: ModalComponent;
  redirectUrl: string;
  reason: string;

  constructor(private oauth2Service: OAuth2Service, private configService: ConfigService, private route: ActivatedRoute) {
    const config = this.configService.getConfig();
    this.redirectUrl = config['redirect.url'];
  }

  ngOnInit() {
    this.reason = this.route.snapshot.params['reason'];
  }

  ngAfterViewInit() {
    this.modal.open('lg');
  }

  retry() {
    console.log('If you see this, something went wrong with single-sign-on.');
    this.oauth2Service.removeTokens();
    window.location.href = this.redirectUrl;
  }
}

