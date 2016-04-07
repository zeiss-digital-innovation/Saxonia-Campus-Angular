import {Component, OnInit, ViewChild} from 'angular2/core';
import {Router} from 'angular2/router';
import {SlotComponent} from '../slot/slot.component';
import {Slot} from '../../model/slot';
import {EmbeddedRoom} from '../../model/embedded-room';
import {Room} from '../../model/room';
import {SlotService} from '../../services/slot.service';
import {Observable} from 'rxjs/Observable';

@Component({
    templateUrl: 'app/components/overview/overview.component.html',
    directives: [SlotComponent]
})
export class OverviewComponent implements OnInit {

    @ViewChild('slotDetail')
    slotComponent: SlotComponent;
    rooms: Room[] = [];
    timeIndices: String[] = [];
    slotMatrix: any = {};

    constructor(private _router: Router, private _slotService: SlotService) {}

    ngOnInit() {
        this.getSlots();
    }

    getSlotCount(i: number, slot: Slot) {
        var timeIndex;
        var slotCount = 0;

        do {
            if (i + slotCount > this.timeIndices.length) {
                break;
            }
            timeIndex = this.timeIndices[i + slotCount];
            slotCount++
        } while (this.getTimeDiff(timeIndex, slot.endtime) > 0);

        return slotCount;
    }

    showDetail(slot: Slot) {
        this.slotComponent.showSlot(slot);
    }

    getSlots() {
        this._slotService.getSlots()
            .groupBy(slot => {
                if (slot._embedded) {
                    return slot._embedded.room.id
                } else {
                    return -1
                }
            }, slot => slot)
            .subscribe(roomSlots => {
                roomSlots.first().subscribe(slot => {
                    this.rooms.push(slot._embedded.room)
                });

                roomSlots.subscribe(
                    slot => {
                        const room = slot._embedded.room;

                        var found = Object.getOwnPropertyNames(this.slotMatrix).some(timeIndex => {
                            if (Math.abs(this.getTimeDiff(slot.starttime, timeIndex)) < 20 * 60 * 1000) {
                                this.slotMatrix[timeIndex][room.id] = slot;
                                return true
                            }
                        });

                        if (!found) {
                            this.slotMatrix[slot.starttime] = {};
                            this.slotMatrix[slot.starttime][room.id] = slot
                        }
                    },
                    () => {},
                    () => {
                        this.timeIndices = Object.getOwnPropertyNames(this.slotMatrix);
                        this.timeIndices.sort((a, b) => a.localeCompare(b))
                    }
                )
            });
    }

    private getTimeDiff(a, b) {
        var aSplit = a.split(':');
        var bSplit = b.split(':');

        var aDate = new Date(2015, 0, 1, aSplit[0], aSplit[1], aSplit[2], 0).getTime();
        var bDate = new Date(2015, 0, 1, bSplit[0], bSplit[1], bSplit[2], 0).getTime();

        return aDate - bDate;
    }
}

