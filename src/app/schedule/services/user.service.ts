import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../model/user';
import { HypermediaResource } from '../../shared/rest/hypermedia-resource';
import { OAuth2Service } from '../../shared/auth/oauth2.service';
import { RestService } from '../../shared/rest/rest.service';
import { Slot } from '../model/slot';

@Injectable()
export class UserService {

  private static handleError(error: Response) {
    console.error(error);
    return Observable.throw(error || 'Server error');
  }

  constructor(private http: Http,
              private restService: RestService,
              private oauth2Service: OAuth2Service) {
  }

  getUsersRegisteredSlots(): Observable<Slot[]> {
    const link = 'registeredSlots';
    return this.getUser()
      .flatMap((user: User) => {
        return Observable.defer(() => this.http.get(user._links[link].href, {headers: RestService.getAuthHeader()}))
          .retryWhen(this.retryHandler(link))
          .map(this.mapper)
      })
      .catch(UserService.handleError);
  }

  getUsersPreferredSlots(): Observable<Slot[]> {
    const link = 'preferredSlots';
    return this.getUser()
      .flatMap((user: User) => {
        return Observable.defer(() => this.http.get(user._links[link].href, {headers: RestService.getAuthHeader()}))
          .retryWhen(this.retryHandler(link))
          .map(this.mapper)
      })
      .catch(UserService.handleError);
  }

  private mapper(res): Slot[] {
    const embedded = res.json()._embedded;
    if (!embedded || !embedded.slots) {
      return [];
    }
    if (embedded.slots.constructor != Array) {
      return [embedded.slots];
    }
    return embedded.slots;
  }

  private getUser(): Observable<User> {
    return this.restService.getRest()
      .flatMap((hypermediaResource: HypermediaResource) => {
        const link = 'currentUser';
        return Observable.defer(() => this.http.get(hypermediaResource._links[link].href, {headers: RestService.getAuthHeader()}))
          .retryWhen(this.retryHandler(link))
          .map(res => <User> res.json());
      })
  }

  private retryHandler(link: string) {
    return errors => errors.zip(Observable.range(1, 1), error => error)
      .flatMap(error => {
        if (error.status != 401) {
          return Observable.throw('no automatic retry possible' + error.status);
        }
        // this will essentially automatically retry the request if it can
        console.log(`automatic ${link} retry`);
        return this.oauth2Service.doImplicitFlow(null);
      }).delay(250);
  }


}
