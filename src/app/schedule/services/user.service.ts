import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../model/user';
import { EmbeddedSlots } from '../model/embedded-slots';
import { Slot } from '../model/slot';
import { HypermediaResource } from '../../shared/rest/hypermedia-resource';
import { OAuth2Service } from '../../shared/auth/oauth2.service';
import { RestService } from '../../shared/rest/rest.service';

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

  getUser() {
    return this.restService.getRest()
      .flatMap((hypermediaResource: HypermediaResource) => {
        const link = 'currentUser';
        return Observable.defer(() => this.http.get(hypermediaResource._links[link].href, {headers: RestService.getAuthHeader()}))
          .retryWhen(errors => errors.zip(Observable.range(1, 1), error => error)
            .flatMap(error => {
              if (error.status != 401) {
                return Observable.throw('no automatic retry possible' + error.status);
              }
              // this will essentially automatically retry the request if it can
              console.log('automatic currentUser retry');
              return this.oauth2Service.doImplicitFlow(null);
            }).delay(250)
          )
          .map(res => {
            const user: User = <User> res.json();
            if (res.json()._embedded == null) {
              user._embedded = new EmbeddedSlots();
              user._embedded.slots = [];
            } else if (res.json()._embedded.slots.constructor != Array) {
              user._embedded.slots = [<Slot> res.json()._embedded.slots];
            }
            return user;
          });
      })
      .catch(UserService.handleError);
  }
}
