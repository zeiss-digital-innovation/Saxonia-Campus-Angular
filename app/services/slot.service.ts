import {Injectable} from 'angular2/core';
import {Response, Headers} from 'angular2/http';
import {AuthHttp} from 'angular2-jwt';
import {Observable} from 'rxjs/Observable';
import {RestService} from './rest.service';
import {Slot} from '../model/slot';
import {HypermediaResource} from '../model/hypermedia-resource';

@Injectable()
export class SlotService {
    constructor (private _authHttp: AuthHttp, private _restService: RestService) {}

    getSlots() {
        return this._restService.getRest()
            .flatMap(hypermediaResource => {
                let link: string = 'slots';
                return this._authHttp.get(hypermediaResource._links[link].href, {
                        headers: RestService.getHeaders()
                    })
                    .flatMap(res => Observable.fromArray(<Slot[]> res.json()._embedded.slots))
            })
            .catch(SlotService.handleError);
    }

    getSlot(slot: Slot) {
        let link: string = 'self';
        return this._authHttp.get(slot._links[link].href, {
                headers: RestService.getHeaders()
            })
            .map(res => <Slot> res.json())
            .catch(SlotService.handleError);
    }

    register(slot: Slot) {
        let link: string = 'register';
        return this._authHttp.put(slot._links[link].href, '', {
                headers: RestService.getHeaders()
            })
            .catch(SlotService.handleError);
    }

    unregister(slot: Slot) {
        let link: string = 'unregister';
        return this._authHttp.delete(slot._links[link].href, {
                headers: RestService.getHeaders()
            })
            .catch(SlotService.handleError);
    }

    private static handleError (error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
