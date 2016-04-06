export class Room {
    id: number
    capacity: number
    roomnumber: string

    constructor (private id: number, private capacity: number, private roomnumber: string) {
        this.id = id;
        this.capacity = capacity;
        this.roomnumber = roomnumber;
    }
}