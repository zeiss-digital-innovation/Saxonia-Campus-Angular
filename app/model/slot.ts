import {HypermediaResource} from './hypermedia-resource';
import {EmbeddedRoom} from './embedded-room';

export interface Slot extends HypermediaResource {
    id: number;
    title: string;
    speaker: string;
    description: string;
    starttime: string;
    endtime: string;
    capacity: number;
    participants: number;
    _embedded: EmbeddedRoom;
}
