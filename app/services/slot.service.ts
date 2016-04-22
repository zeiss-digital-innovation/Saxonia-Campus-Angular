import {Injectable} from 'angular2/core';
import {Http, Response, Headers} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {RestService} from './rest.service';
import {OAuth2Service} from './oauth2.service';
import {Slot} from '../model/slot';
import {HypermediaResource} from '../model/hypermedia-resource';

@Injectable()
export class SlotService {
    constructor (private _http: Http,
                 private _restService: RestService,
                 private _oauth2Service: OAuth2Service) {}

    getSlots() {
        return Observable.defer(() => this._restService.getRest())
            .flatMap(hypermediaResource => {
                let link: string = 'slots';
                return Observable.defer(() => this._http.get(hypermediaResource._links[link].href, {headers: RestService.getAuthHeader()}))
                    .retryWhen(errors => errors.zip(Observable.range(1, 1), error => error).flatMap(error => {
                            if (error.status != 401) {
                                return Observable.throw('no automatic retry possible');
                            }
                            // this will essentially automatically retry the request if it can
                            console.log('automatic slots retry');
                            return this._oauth2Service.doImplicitFlow(null);
                        }).delay(250)
                    )
                    .flatMap(res => Observable.fromArray(<Slot[]> res.json()._embedded.slots))
            })
            .catch(SlotService.handleError)
    }

    getSlot(slot: Slot) {
        let link: string = 'self';
        return Observable.defer(() => this._http.get(slot._links[link].href, {headers: RestService.getAuthHeader()}))
            .retryWhen(errors => errors.zip(Observable.range(1, 2), error => error).flatMap(error => {
                    if (error.status != 401) {
                        return Observable.throw('no automatic retry possible');
                    }
                    // this will essentially automatically retry the request if it can
                    console.log('automatic slot retry');
                    return this._oauth2Service.doImplicitFlow(null);
                }).delay(250)
            )
            .map(res => <Slot> res.json())
            .catch(SlotService.handleError)
    }

    register(slot: Slot) {
        let link: string = 'register';
        return Observable.defer(() => this._http.put(slot._links[link].href, '', {headers: RestService.getAuthHeader()}))
            .retryWhen(errors => errors.zip(Observable.range(1, 2), error => error).flatMap(error => {
                    if (error.status != 401) {
                        return Observable.throw('no automatic retry possible');
                    }
                    // this will essentially automatically retry the request if it can
                    console.log('automatic register retry');
                    return this._oauth2Service.doImplicitFlow(null);
                }).delay(250)
            )
            .catch(SlotService.handleError)
    }

    unregister(slot: Slot) {
        let link: string = 'unregister';
        return Observable.defer(() => this._http.delete(slot._links[link].href, {headers: RestService.getAuthHeader()}))
            .retryWhen(errors => errors.zip(Observable.range(1, 2), error => error).flatMap(error => {
                    if (error.status != 401) {
                        return Observable.throw('no automatic retry possible');
                    }
                    // this will essentially automatically retry the request if it can
                    console.log('automatic unregister retry');
                    return this._oauth2Service.doImplicitFlow(null);
                }).delay(250)
            )
            .catch(SlotService.handleError)
    }

    private static handleError (error: Response) {
        console.error(error);
        return Observable.throw(error || 'Server error');
    }
}
