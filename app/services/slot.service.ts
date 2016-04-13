import {Injectable} from 'angular2/core';
import {Http, Response, Headers} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {RestService} from './rest.service';
import {Slot} from '../model/slot';
import {HypermediaResource} from '../model/hypermedia-resource';

@Injectable()
export class SlotService {
    constructor (private http: Http, private _restService: RestService) {}

    getSlots() {
        return this._restService.getRest()
            .flatMap(hypermediaResource => {
                let link: string = 'slots';
                return this.http.get(hypermediaResource._links[link].href, {
                        headers: RestService.getHeaders()
                    })
                    .flatMap(res => Observable.fromArray(<Slot[]> res.json()._embedded.slots))
            })
            .catch(SlotService.handleError);
    }

    getSlot(slot: Slot) {
        let link: string = 'self';
        return this.http.get(slot._links[link].href, {
                headers: RestService.getHeaders()
            })
            .map(res => <Slot> res.json())
            .catch(SlotService.handleError);
    }

    register(slot: Slot) {
        let link: string = 'register';
        return this.http.put(slot._links[link].href, '', {
                headers: RestService.getHeaders()
            })
            .catch(SlotService.handleError);
    }

    unregister(slot: Slot) {
        let link: string = 'unregister';
        return this.http.delete(slot._links[link].href, {
                headers: RestService.getHeaders()
            })
            .catch(SlotService.handleError);
    }

    private static handleError (error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
