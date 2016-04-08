import {EmbeddedSlots} from './embedded-slots';

export interface User {
    username: string;
    firstname: string;
    lastname: string;
    _embedded: EmbeddedSlots;
}