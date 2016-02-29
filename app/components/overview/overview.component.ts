import {Component, OnInit} from 'angular2/core'
import {Router} from 'angular2/router'
import {Slot} from '../../model/slot'
import {EmbeddedRoom} from '../../model/embedded-room'
import {Room} from '../../model/room'
import {SlotService} from '../../services/slot.service'

@Component({
    templateUrl: 'app/components/overview/overview.component.html'
})
export class OverviewComponent implements OnInit {

    rooms: Room[] = []
    slots: Slot[] = []
    map: any = {}

    constructor(private _router: Router, private _slotService: SlotService) {}

    ngOnInit() {
        this.getSlots()
    }

    getSlots() {
        this._slotService.getSlots()
            .subscribe(
                slots => {
                    for (var slot of slots) {
                        this.slots.push(slot)
                        var room = slot._embedded.room
                        if (this.rooms.indexOf(room) < 0) {
                            this.rooms.push(room)
                        }
                        if (!this.map.hasOwnProperty(room)) {
                            this.map[room] = []
                        }
                        this.map[room].push(slot)
                    }
                },
                error => {console.log(error); this._router.navigate(['Login'])})
    }
}

