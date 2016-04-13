import {Injectable} from 'angular2/core';
import {Http, Response, Headers} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {RestService} from './rest.service';
import {User} from '../model/user';
import {EmbeddedSlots} from '../model/embedded-slots';
import {Slot} from '../model/slot';
import {HypermediaResource} from '../model/hypermedia-resource';

@Injectable()
export class UserService {
    constructor (private http: Http, private _restService: RestService) {}

    getUser() {
        return this._restService.getRest()
            .flatMap((hypermediaResource: HypermediaResource) => {
                let link: string = 'currentUser';
                return this.http.get(hypermediaResource._links[link].href, {
                        headers: RestService.getHeaders()
                    })
                    .map(res => {
                        let user:User = <User> res.json();
                        if (res.json()._embedded == null) {
                            user._embedded = new EmbeddedSlots();
                            user._embedded.slots = [];
                        } else if (res.json()._embedded.slots.constructor != Array) {
                            user._embedded.slots = [<Slot> res.json()._embedded.slots];
                        }
                        return user;
                    })
            })
            .catch(UserService.handleError);
    }

    private static handleError (error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
