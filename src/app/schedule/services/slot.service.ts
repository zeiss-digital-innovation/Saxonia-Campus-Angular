import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Slot } from '../model/slot';
import { OAuth2Service } from '../../shared/auth/oauth2.service';
import { HypermediaResource } from '../../shared/rest/hypermedia-resource';
import { RestService } from '../../shared/rest/rest.service';

@Injectable()
export class SlotService {

  private static handleError(error: Response) {
    console.error(error);
    return Observable.throw(error || 'Server error');
  }

  constructor(private http: Http,
              private restService: RestService,
              private oauth2Service: OAuth2Service) {
  }

  getSlots() {
    return Observable.defer(() => this.restService.getRest())
      .flatMap((hypermediaResource: HypermediaResource) => {
        const link = 'slots';
        return Observable.defer(() => this.http.get(hypermediaResource._links[link].href, {headers: RestService.getAuthHeader()}))
          .retryWhen(errors => errors.zip(Observable.range(1, 1), error => error)
            .flatMap(error => {
              if (error.status != 401) {
                return Observable.throw('no automatic retry possible' + error.status);
              }
              // this will essentially automatically retry the request if it can
              console.log('automatic slots retry');
              return this.oauth2Service.doImplicitFlow(null);
            }).delay(250)
          )
          .flatMap(res => Observable.from(<Slot[]> res.json()._embedded.slots));
      })
      .catch(SlotService.handleError);
  }

  getSlot(slot: Slot) {
    const link = 'self';
    return Observable.defer(() => this.http.get(slot._links[link].href, {headers: RestService.getAuthHeader()}))
      .retryWhen(errors => errors.zip(Observable.range(1, 2), error => error)
        .flatMap(error => {
          if (error.status != 401) {
            return Observable.throw('no automatic retry possible' + error.status);
          }
          // this will essentially automatically retry the request if it can
          console.log('automatic slot retry');
          return this.oauth2Service.doImplicitFlow(null);
        }).delay(250)
      )
      .map(res => <Slot> res.json())
      .catch(SlotService.handleError);
  }

  register(slot: Slot) {
    const link = 'register';
    return Observable.defer(() => this.http.put(slot._links[link].href, '', {headers: RestService.getAuthHeader()}))
      .retryWhen(errors => errors.zip(Observable.range(1, 2), error => error)
        .flatMap(error => {
          if (error.status != 401) {
            return Observable.throw('no automatic retry possible' + error.status);
          }
          // this will essentially automatically retry the request if it can
          console.log('automatic register retry');
          return this.oauth2Service.doImplicitFlow(null);
        }).delay(250)
      )
      .catch(SlotService.handleError);
  }

  unregister(slot: Slot) {
    const link = 'unregister';
    return Observable.defer(() => this.http.delete(slot._links[link].href, {headers: RestService.getAuthHeader()}))
      .retryWhen(errors => errors.zip(Observable.range(1, 2), error => error)
        .flatMap(error => {
          if (error.status != 401) {
            return Observable.throw('no automatic retry possible' + error.status);
          }
          // this will essentially automatically retry the request if it can
          console.log('automatic unregister retry');
          return this.oauth2Service.doImplicitFlow(null);
        }).delay(250)
      )
      .catch(SlotService.handleError);
  }
}
