import { Injectable } from '@angular/core';
import { OAuth2Service } from './oauth2.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private oauthService: OAuth2Service) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    let search = {};
    location.search.substr(1).split("&").forEach(function (item) {
      search[item.split("=")[0]] = item.split("=")[1]
    });

    return this.oauthService
      .doImplicitFlow(search['code'] || null)
      .map(val => Boolean(val))
      .catch(err => Observable.from([false]));
  }
}
