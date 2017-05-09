import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Slot } from '../model/slot';
import { SlotService } from '../services/slot.service';

@Component({
  selector: 'campus-slot',
  templateUrl: './slot.component.html',
  styleUrls: ['./slot.component.scss']
})
export class SlotComponent {

  @Input()
  slot: Slot;
  @Input()
  userInSlot: boolean;
  @Input()
  isContinuation: boolean;
  @Output()
  onSlotClick: EventEmitter<any> = new EventEmitter(false);

  constructor(private slotService: SlotService) {
  }

  showSlotDetail() {
    if (this.slot == null) {
      return;
    }
    this.slotService.getSlot(this.slot)
      .subscribe(slot => {
          this.onSlotClick.emit(slot);
        },
        error => console.log(error)
      );
  }
}

