import { Component, OnInit } from '@angular/core';
import { SlotService } from '../services/slot.service';
import { Slot } from '../model/slot';
import { UserService } from '../services/user.service';
import { mergeMap } from 'rxjs/operators';

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  public slots: Slot[];
  public usersPreferredSlotIds: number[] = [];
  public maxSlots: number = 10;

  constructor(private slotService: SlotService, private userService: UserService) {
  }

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
    return slot._links.hasOwnProperty('mark_as_preferred');
  }

  isUnmarkable(slot: Slot): boolean {
    return slot._links.hasOwnProperty('unmark_as_preferred');
  }

  isMaximumNumberOfSlotsMarked() {
    return this.usersPreferredSlotIds.length >= this.maxSlots;
  }

  isMarkedAsInteresting(slot: Slot): boolean {
    return this.usersPreferredSlotIds.indexOf(slot.id) > -1;
  }

  processClick(event: MouseEvent, slot: Slot): void {
    if (!this.isMarkable(slot) && !this.isUnmarkable(slot)) {
      return;
    }
    if (!this.isMaximumNumberOfSlotsMarked() && !this.isMarkedAsInteresting(slot)) {
      this.markAsPreferred(slot);
    } else if (this.isMarkedAsInteresting(slot)) {
      this.unmarkAsPreferred(slot);
    }
  }

  private markAsPreferred(slot: Slot) {
    this.slotService.markAsPreferred(slot)
      .pipe(
        mergeMap(response => this.userService.getUsersPreferredSlots())
      ).subscribe(
      slots => this.usersPreferredSlotIds = slots.map(slot => slot.id),
      error => console.log(error)
    );
  }

  private unmarkAsPreferred(slot: Slot) {
    this.slotService.unmarkAsPreferred(slot)
      .pipe(
        mergeMap(response => this.userService.getUsersPreferredSlots())
      ).subscribe(
      slots => this.usersPreferredSlotIds = slots.map(slot => slot.id),
      error => console.log(error)
    );
  }
}
