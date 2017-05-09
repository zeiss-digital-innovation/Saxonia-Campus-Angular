import { Component, OnInit } from '@angular/core';
import { SlotService } from '../services/slot.service';
import { Slot } from '../model/slot';
import { UserService } from '../services/user.service';

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  private slots: Array<Slot>;
  private usersPreferredSlotIds: number[] = [];

  constructor(private slotService: SlotService, private userService: UserService) { }

  ngOnInit() {
    this.slotService.getSlots().subscribe(
      slots => this.slots = slots,
      error => console.log(error)
    );
    this.userService.getUsersPreferredSlots().subscribe(
      slots => this.usersPreferredSlotIds = slots.map(slot => slot.id),
      error => console.log(error)
    );
  }

  isMarkable(slot: Slot): boolean {
    return slot._links.hasOwnProperty('mark_as_preferred') && this.usersPreferredSlotIds.indexOf(slot.id) <= -1 && this.usersPreferredSlotIds.length < 10;
  }

  isUnmarkable(slot: Slot): boolean {
    return slot._links.hasOwnProperty('unmark_as_preferred') && this.usersPreferredSlotIds.indexOf(slot.id) > -1;
  }

  isBooked(slot: Slot): boolean {
    return this.usersPreferredSlotIds.indexOf(slot.id) > -1;
  }

  markAsPreferred(slot: Slot) {
    this.slotService.markAsPreferred(slot)
      .flatMap(response => this.userService.getUsersPreferredSlots())
      .subscribe(
        slots => this.usersPreferredSlotIds = slots.map(slot => slot.id),
        error => console.log(error)
      );
  }

  unmarkAsPreferred(slot: Slot) {
    this.slotService.unmarkAsPreferred(slot)
      .flatMap(response => this.userService.getUsersPreferredSlots())
      .subscribe(
        slots => this.usersPreferredSlotIds = slots.map(slot => slot.id),
        error => console.log(error)
      );
  }
}
