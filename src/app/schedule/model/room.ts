export class Room {
    id: number;
    capacity: number;
    roomnumber: string;

    constructor (private theId: number, private theCapacity: number, private theRoomnumber: string) {
        this.id = theId;
        this.capacity = theCapacity;
        this.roomnumber = theRoomnumber;
    }
}