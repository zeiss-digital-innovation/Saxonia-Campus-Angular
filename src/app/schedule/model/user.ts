import {HypermediaResource} from '../../shared/rest/hypermedia-resource';

export interface User extends HypermediaResource {
    username: string;
    firstname: string;
    lastname: string;
}
