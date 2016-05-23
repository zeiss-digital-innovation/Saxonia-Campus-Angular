import {HypermediaResource} from './hypermedia-resource';
import {EmbeddedSlots} from './embedded-slots';

export interface User extends HypermediaResource {
    username: string;
    firstname: string;
    lastname: string;
    _embedded: EmbeddedSlots;
}