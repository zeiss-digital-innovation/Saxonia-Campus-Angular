import {Component, OnInit, AfterViewInit, ViewChild} from 'angular2/core';
import {Router} from 'angular2/router';
import {SlotComponent} from '../slot/slot.component';
import {SlotDetailComponent} from '../slot-detail/slot-detail.component';
import {Slot} from '../../model/slot';
import {EmbeddedRoom} from '../../model/embedded-room';
import {Room} from '../../model/room';
import {User} from '../../model/user';
import {SlotService} from '../../services/slot.service';
import {UserService} from '../../services/user.service';
import {Observable} from 'rxjs/Observable';

@Component({
    templateUrl: 'app/components/overview/overview.component.html',
    directives: [SlotComponent, SlotDetailComponent]
})
export class OverviewComponent implements OnInit, AfterViewInit {

    @ViewChild('slotDetail')
    slotDetailComponent: SlotDetailComponent;
    rooms: Room[] = [];
    timeIndices: String[] = [];
    slotMatrix: any = {};
    userSlots: number[] = [];

    constructor(private _slotService: SlotService,
                private _userService: UserService) {}

    ngOnInit() {
        this.getSlots();
        this.getCurrentUser();
    }

    ngAfterViewInit() {
        this.slotDetailComponent.modal.onClose.subscribe(() => this.ngOnInit());
    }

    isContinuation(timeIndex: string, roomId: string): boolean {

        let index = this.timeIndices.indexOf(timeIndex);
        if (index == 0) {
            return false;
        }

        for (var i = index-1; i >= 0; i--) {
            let slot = this.slotMatrix[this.timeIndices[i]][roomId]
            if (slot != null && this.getTimeDiff(slot.endtime, timeIndex) > 0) {
                return true;
            }
        }

        return false;
    }

    userInSlot(slot: Slot): boolean {
        if (slot == null) {
            return false;
        }
        return this.userSlots.indexOf(slot.id) > -1
    }

    getSlots() {
        this._slotService.getSlots()
            .groupBy(slot => {
                if (slot._embedded) {
                    return slot._embedded.room.id;
                } else {
                    return -1;
                }
            }, slot => slot)
            .subscribe(roomSlots => {
                roomSlots.first().subscribe(slot => {
                    for (let room: Room of this.rooms) {
                        if (room.id == slot._embedded.room.id) {
                            return;
                        }
                    }
                    this.rooms.push(slot._embedded.room);
                });

                roomSlots.subscribe(
                    slot => {
                        const room = slot._embedded.room;

                        var found = Object.getOwnPropertyNames(this.slotMatrix).some(timeIndex => {
                            if (Math.abs(this.getTimeDiff(slot.starttime, timeIndex)) < 20 * 60 * 1000) {
                                this.slotMatrix[timeIndex][room.id] = slot;
                                return true;
                            }
                        });

                        if (!found) {
                            this.slotMatrix[slot.starttime] = {};
                            this.slotMatrix[slot.starttime][room.id] = slot;
                        }
                    },
                    () => {},
                    () => {
                        this.timeIndices = Object.getOwnPropertyNames(this.slotMatrix);
                        this.timeIndices.sort((a, b) => a.localeCompare(b));
                    }
                )
            });
    }

    getCurrentUser() {
        this.userSlots = [];
        this._userService.getUser()
            .subscribe(user => {
                for (let slot: Slot of user._embedded.slots) {
                    this.userSlots.push(slot.id);
                }
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

