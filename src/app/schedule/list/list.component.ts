import { Component, OnInit } from '@angular/core';
import { SlotService } from '../services/slot.service';
import { Slot } from '../model/slot';
import { UserService } from '../services/user.service';
import { MdSlideToggleChange } from '@angular/material';

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  public slots: Array<Slot>;
  public usersPreferredSlotIds: number[] = [];
  public maxSlots: number = 10;

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

  isMarkedAsInteresting(slot: Slot): boolean {
    return this.usersPreferredSlotIds.indexOf(slot.id) > -1;
  }

  processSliderChange(event: MdSlideToggleChange, slot: Slot): void {
    if (event.checked === true) {
      this.markAsPreferred(slot);
    } else {
      this.unmarkAsPreferred(slot);
    }
  }

  processClick(event: MouseEvent, slot: Slot): void {
    event.preventDefault();
    if (!this.isMarkedAsInteresting(slot)) {
      this.markAsPreferred(slot);
    } else {
      this.unmarkAsPreferred(slot);
    }
  }

  private markAsPreferred(slot: Slot) {
    this.slotService.markAsPreferred(slot)
      .flatMap(response => this.userService.getUsersPreferredSlots())
      .subscribe(
        slots => this.usersPreferredSlotIds = slots.map(slot => slot.id),
        error => console.log(error)
      );
  }

  private unmarkAsPreferred(slot: Slot) {
    this.slotService.unmarkAsPreferred(slot)
      .flatMap(response => this.userService.getUsersPreferredSlots())
      .subscribe(
        slots => this.usersPreferredSlotIds = slots.map(slot => slot.id),
        error => console.log(error)
      );
  }
}
