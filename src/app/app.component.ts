import { Component, OnInit } from '@angular/core';
import { OAuth2Service } from './shared/auth/oauth2.service';
import { JwtHelper } from 'angular2-jwt';
import { Router } from '@angular/router';

@Component({
  selector: 'campus-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private jwtHelper: JwtHelper = new JwtHelper();

  constructor(private router: Router, private oauth2Service: OAuth2Service) {
  }

  ngOnInit() {
    const search = {};
    window.location.search.substr(1).split('&').forEach(function (item) {
      search[item.split('=')[0]] = item.split('=')[1];
    });
    this.oauth2Service.doImplicitFlow(search['code'])
      .subscribe(
        () => {
          const id_token = localStorage.getItem('id_token');
          const role = this.jwtHelper.decodeToken(id_token).role;
          const roles = [].concat(role);
          const isUser = roles.some(entry => {
            if (entry == 'user' || entry == 'admin') {
              return true;
            }
          });
          if (isUser) {
            this.router.navigate(['/list']);
          } else {
            this.router.navigate(['/loginFailed', {reason: 'unauthorized'}]);
          }
        },
        () => this.router.navigate(['/loginFailed', {reason: 'unauthenticated'}])
      );
  }

}
