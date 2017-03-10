import { Component } from '@angular/core';
import { OAuth2Service } from './shared/auth/oauth2.service';
import { JwtHelper } from 'angular2-jwt';
import { Router } from '@angular/router';

@Component({
  selector: 'campus-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private jwtHelper: JwtHelper = new JwtHelper();

  constructor(private router: Router, private oauth2Service: OAuth2Service) {
  }

  ngOnInit() {
    let search = {};
    window.location.search.substr(1).split("&").forEach(function (item) {
      search[item.split("=")[0]] = item.split("=")[1]
    });
    this.oauth2Service.doImplicitFlow(search['code'])
      .subscribe(
        () => {
          let id_token = localStorage.getItem('id_token');
          let role = this.jwtHelper.decodeToken(id_token).role;
          let roles = [].concat(role);
          let isUser = roles.some(entry => {
            if (entry == 'user' || entry == 'admin') return true;
          });
          if (isUser) {
            this.router.navigate(['/overview'])
          } else {
            this.router.navigate(['/loginFailed', {reason: 'unauthorized'}])
          }
        },
        () => this.router.navigate(['/loginFailed', {reason: 'unauthenticated'}])
      );
  }

}
