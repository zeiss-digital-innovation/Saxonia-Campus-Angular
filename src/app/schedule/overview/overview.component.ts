import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { SlotService } from '../services/slot.service';
import { Slot } from '../model/slot';
import { Room } from '../model/room';
import { User } from '../model/user';
import { UserService } from '../services/user.service';
import { SlotDetailComponent } from '../slot-detail/slot-detail.component';
import { first, groupBy } from 'rxjs/operators';

@Component({
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, AfterViewInit {

  @ViewChild('slotDetail', {static: false})
  slotDetailComponent: SlotDetailComponent;
  rooms: Room[] = [];
  dates: string[] = [];
  times: any = {};
  slotMatrix: any = {};
  public usersRegisteredSlotIds: number[] = [];
  selectedDate: string = null;
  errorMessage: string;
  enableAnimation = false;

  constructor(private slotService: SlotService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.getSlots();
    this.getCurrentUsersRegisteredSlots();
  }

  ngAfterViewInit() {
    this.slotDetailComponent.modal.onClose.subscribe(() => this.ngOnInit());
    this.slotDetailComponent.modal.onDismiss.subscribe(() => this.ngOnInit());
  }

  isContinuation(date: string, time: string, roomId: string): boolean {
    const index = this.times[date].indexOf(time);
    if (index == 0) {
      return false;
    }

    for (let i = index - 1; i >= 0; i--) {
      const slot = this.slotMatrix[date][this.times[date][i]][roomId];
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
    return this.usersRegisteredSlotIds.indexOf(slot.id) > -1;
  }

  private getSlots() {
    this.slotService.getIndividualSlots()
      .pipe(
      groupBy((slot: Slot) => {
        if (slot._embedded) {
          return slot._embedded.room.id;
        } else {
          return -1;
        }
      }, slot => slot)
      ).subscribe(
        roomSlots => {
          roomSlots.pipe(first()).subscribe((slot: Slot) => {
            for (const room of this.rooms) {
              if (room.id == slot._embedded.room.id) {
                return;
              }
            }
            this.rooms.push(slot._embedded.room);
          });

          roomSlots.subscribe(
            (slot: Slot) => {
              const room: Room = slot._embedded.room;
              const startDateTime: Date = new Date(Date.parse(slot.starttime));
              const startDate: string = this.getDate(startDateTime);
              const startTime: string = this.getTime(startDateTime);

              if (this.dates.indexOf(startDate) < 0) {
                this.dates.push(startDate);
                this.times[startDate] = [];
                this.slotMatrix[startDate] = {};
              }

              const found = Object.getOwnPropertyNames(this.slotMatrix[startDate]).some(time => {
                if (Math.abs(this.getTimeDiff(startTime, time)) < 20 * 60 * 1000) {
                  this.slotMatrix[startDate][time][room.id] = slot;
                  return true;
                }
              });

              if (!found) {
                this.times[startDate].push(startTime);
                this.slotMatrix[startDate][startTime] = {};
                this.slotMatrix[startDate][startTime][room.id] = slot;
              }
            }
          );
        },
        error => this.errorMessage = 'Konnte Slot-Daten nicht vom Backend laden.',
        () => {
          this.dates.sort((a: string, b: string) => a.localeCompare(b));
          this.dates.forEach(date => {
            this.times[date].sort((a: string, b: string) => a.localeCompare(b));
          });
          if (this.dates.length > 0 && this.selectedDate == null) {
            this.selectedDate = this.dates[0];
          }
          this.rooms.sort((a: Room, b: Room) => a.id - b.id);
          // this will make sure animations are enabled AFTER initial digest cycle, fixes IE animation issue
          setTimeout(() => this.enableAnimation = true, 1);
        }
      );
  }

  private getDate(date: Date): string {
    return ('0' + date.getDate()).slice(-2) + '.' + ('0' + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear();
  }

  private getTime(date: Date): string {
    return ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
  }

  public getCurrentUsersRegisteredSlots() {
    this.userService.getUsersRegisteredSlots()
      .subscribe(
        (slots: Slot[]) => this.usersRegisteredSlotIds = slots.map(slot => slot.id),
        error => this.errorMessage = 'Konnte Benutzer-Buchungs-Daten nicht vom Backend laden.'
      );
  }

  private getDateDiff(a: string, b: string) {
    const aSplit: string[] = a.split('.');
    const bSplit: string[] = b.split('.');

    const aDate = new Date(+aSplit[2], (+aSplit[1]) - 1, +aSplit[0], 0, 0, 0, 0).getTime();
    const bDate = new Date(+bSplit[2], (+bSplit[1]) - 1, +bSplit[0], 0, 0, 0, 0).getTime();

    return aDate - bDate;
  }

  private getTimeDiff(a: string, b: string) {
    const aSplit: string[] = a.split(':');
    const bSplit: string[] = b.split(':');

    const aDate = new Date(2015, 0, 1, +aSplit[0], +aSplit[1], 0, 0).getTime();
    const bDate = new Date(2015, 0, 1, +bSplit[0], +bSplit[1], 0, 0).getTime();

    return aDate - bDate;
  }
}

