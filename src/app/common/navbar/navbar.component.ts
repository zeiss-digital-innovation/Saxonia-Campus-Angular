import { Component } from '@angular/core';
import { OAuth2Service } from '../../shared/auth/oauth2.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'campus-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  private username = '';

  constructor(private oauth2Service: OAuth2Service, private jwtHelper: JwtHelperService) {
    this.oauth2Service.onAuthenticate.subscribe(token => {
      const decodedToken = this.jwtHelper.decodeToken(token);
      this.username = decodedToken.sub;
    });
  }

  isAuthenticated(): boolean {
    return this.oauth2Service.isAuthenticated();
  }

  logout() {
    this.username = '';
    this.oauth2Service.logout();
  }
}
