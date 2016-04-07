import {EmbeddedRoom} from './embedded-room';

export interface Slot {
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
