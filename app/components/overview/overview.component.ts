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
    timeIndices: String[] = []
    slotMatrix: any = {}

    constructor(private _router: Router, private _slotService: SlotService) {}

    ngOnInit() {
        this.getSlots()
    }

    getSlots() {
        this._slotService.getSlots()
            .subscribe(
                slots => {
                    for (var slot of slots) {
                        const room = slot._embedded.room
                        if (!this.rooms.some(item => item.id == room.id)) {
                            this.rooms.push(room)
                        }

                        var found = Object.getOwnPropertyNames(this.slotMatrix).some(timeIndex => {
                            if (Math.abs(this.getTimeDiff(slot.starttime, timeIndex)) < 20 * 60 * 1000) {
                                this.slotMatrix[timeIndex][room.id] = slot
                                return true
                            }
                        })

                        if (!found) {
                            this.slotMatrix[slot.starttime] = {}
                            this.slotMatrix[slot.starttime][room.id] = slot
                        }
                    }
                },
                error => {console.log(error); this._router.navigate(['Login'])},
                () => {
                    this.timeIndices = Object.getOwnPropertyNames(this.slotMatrix)
                    this.timeIndices.sort((a, b) => a.localeCompare(b))
                }
            )
    }

    private getTimeDiff(a, b) {
        var aSplit = a.split(':')
        var bSplit = b.split(':')

        var aDate = new Date(2015, 0, 1, aSplit[0], aSplit[1], aSplit[2], 0).getTime()
        var bDate = new Date(2015, 0, 1, bSplit[0], bSplit[1], bSplit[2], 0).getTime()

        return aDate - bDate
    }
}

