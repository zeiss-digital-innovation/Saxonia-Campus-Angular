import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {RestService} from './rest.service';
import {OAuth2Service} from './oauth2.service';
import {Slot} from '../model/slot';
import {HypermediaResource} from "../model/hypermedia-resource";

@Injectable()
export class SlotService {
    constructor (private http: Http,
                 private restService: RestService,
                 private oauth2Service: OAuth2Service) {}

    getSlots() {
        return Observable.defer(() => this.restService.getRest())
            .flatMap((hypermediaResource: HypermediaResource) => {
                let link: string = 'slots';
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
                    .flatMap((res: Response) => Observable.from(<Slot[]> res.json()._embedded.slots))
            })
            .catch(SlotService.handleError)
    }

    getSlot(slot: Slot) {
        let link: string = 'self';
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
            .map((res: Response) => <Slot> res.json())
            .catch(SlotService.handleError)
    }

    register(slot: Slot) {
        let link: string = 'register';
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
            .catch(SlotService.handleError)
    }

    unregister(slot: Slot) {
        let link: string = 'unregister';
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
            .catch(SlotService.handleError)
    }

    private static handleError (error: Response) {
        console.error(error);
        return Observable.throw(error || 'Server error');
    }
}
