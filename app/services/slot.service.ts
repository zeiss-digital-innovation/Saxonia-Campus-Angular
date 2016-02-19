import {Injectable} from 'angular2/core'
import {Http, Response, Headers} from 'angular2/http'
import {Observable} from 'rxjs/Observable'
import {RestService} from './rest.service'
import {Slot} from '../model/slot'

@Injectable()
export class SlotService {
    constructor (private http: Http) {}

    // this is so un-hypermedia :(
    private _slotsUrl = 'http://localhost:8180/rest/slots'

    getSlots() {
        return this.http.get(this._slotsUrl, {
                headers: RestService.getHeaders()
            })
            .map(res => <Slot[]> res.json()._embedded.slots)
            .do(data => console.log(data)) // eyeball results in the console
            .catch(SlotService.handleError)
    }

    private static handleError (error: Response) {
        console.error(error)
        return Observable.throw(error.json().error || 'Server error')
    }
}
