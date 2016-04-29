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
import {RestService} from '../../services/rest.service';
import {Observable} from 'rxjs/Observable';

@Component({
    templateUrl: 'app/components/overview/overview.component.html',
    directives: [SlotComponent, SlotDetailComponent]
})
export class OverviewComponent implements OnInit, AfterViewInit {

    @ViewChild('slotDetail')
    slotDetailComponent: SlotDetailComponent;
    rooms: Room[] = [];
    dates: string[] = [];
    times: any = {};
    slotMatrix: any = {};
    userSlots: number[] = [];
    selectedDate: string = null;
    errorMessage: string;

    constructor(private _router: Router,
                private _slotService: SlotService,
                private _userService: UserService) {}

    ngOnInit() {
        this.getSlots();
        this.getCurrentUser();
    }

    ngAfterViewInit() {
        this.slotDetailComponent.modal.onClose.subscribe(() => this.ngOnInit());
        this.slotDetailComponent.modal.onDismiss.subscribe(() => this.ngOnInit());
    }

    isContinuation(date: string, time: string, roomId: string): boolean {
        let index = this.times[date].indexOf(time);
        if (index == 0) {
            return false;
        }

        for (var i = index-1; i >= 0; i--) {
            let slot = this.slotMatrix[date][this.times[date][i]][roomId];
            if (slot != null && (this.getTimeDiff(this.getTime(new Date(Date.parse(slot.endtime))), time) > 0)) {
                return true;
            }
        }

        return false;
    }

    isFuture(date: string): boolean {
        return this.getDateDiff(this.selectedDate, date) < 0;
    }

    isPast(date: string): boolean {
        return this.getDateDiff(this.selectedDate, date) > 0;
    }

    userInSlot(slot: Slot): boolean {
        if (slot == null) {
            return false;
        }
        return this.userSlots.indexOf(slot.id) > -1
    }

    private getSlots() {
        this._slotService.getSlots()
            .groupBy((slot: Slot) => {
                if (slot._embedded) {
                    return slot._embedded.room.id;
                } else {
                    return -1;
                }
            }, slot => slot)
            .subscribe(
                roomSlots => {
                    roomSlots.first().subscribe((slot: Slot) => {
                        for (let room of this.rooms) {
                            if (room.id == slot._embedded.room.id) {
                                return;
                            }
                        }
                        this.rooms.push(slot._embedded.room);
                    });

                    roomSlots.subscribe(
                        (slot: Slot) => {
                            let room: Room = slot._embedded.room;
                            let startDateTime: Date = new Date(Date.parse(slot.starttime));
                            let startDate: string = this.getDate(startDateTime);
                            let startTime: string = this.getTime(startDateTime);

                            if (this.dates.indexOf(startDate) < 0) {
                                this.dates.push(startDate);
                                this.times[startDate] = [];
                                this.slotMatrix[startDate] = {};
                            }

                            var found = Object.getOwnPropertyNames(this.slotMatrix[startDate]).some(time => {
                                if (this.getTimeDiff(startTime, time) < 20 * 60 * 1000) {
                                    this.slotMatrix[startDate][time][room.id] = slot;
                                    return true;
                                }
                            });

                            if (!found) {
                                this.times[startDate].push(startTime);
                                this.slotMatrix[startDate][startTime] = {};
                                this.slotMatrix[startDate][startTime][room.id] = slot;
                            }
                        },
                        () => {},
                        () => {
                            this.dates.sort((a: string, b : string) => a.localeCompare(b));
                            this.dates.forEach(date => {
                                this.times[date].sort((a: string, b : string) => a.localeCompare(b));
                            });
                            if (this.dates.length > 0 && this.selectedDate == null) {
                                this.selectedDate = this.dates[0];
                            }
                        }
                    )
                },
                error => this.errorMessage = 'Konnte Slot-Daten nicht vom Backend laden.'
            );
    }

    private getDate(date: Date): string {
        return ('0'+date.getDate()).slice(-2) + '.' + ('0'+(date.getMonth()+1)).slice(-2) + '.' + date.getFullYear();
    }

    private getTime(date: Date): string {
        return ('0'+date.getHours()).slice(-2) + ':' + ('0'+date.getMinutes()).slice(-2);
    }

    private getCurrentUser() {
        this.userSlots = [];
        this._userService.getUser()
            .subscribe(
                (user:User) => {
                    for (let slot of user._embedded.slots) {
                        this.userSlots.push(slot.id);
                    }
                },
                error => this.errorMessage = 'Konnte Benutzer-Buchungs-Daten nicht vom Backend laden.'
            );
    }

    private getDateDiff(a: string, b: string) {
        let aSplit: string[] = a.split('.');
        let bSplit: string[] = b.split('.');

        let aDate = new Date(+aSplit[2], (+aSplit[1])-1, +aSplit[0], 0, 0, 0, 0).getTime();
        let bDate = new Date(+bSplit[2], (+bSplit[1])-1, +bSplit[0], 0, 0, 0, 0).getTime();

        return aDate - bDate;
    }

    private getTimeDiff(a: string, b: string) {
        let aSplit: string[] = a.split(':');
        let bSplit: string[] = b.split(':');

        let aDate = new Date(2015, 0, 1, +aSplit[0], +aSplit[1], 0, 0).getTime();
        let bDate = new Date(2015, 0, 1, +bSplit[0], +bSplit[1], 0, 0).getTime();

        return aDate - bDate;
    }
}

