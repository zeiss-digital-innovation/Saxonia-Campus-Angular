import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { SlotService } from '../services/slot.service';
import { ModalComponent } from '../../common/modal/components/modal';
import { Slot } from '../model/slot';

@Component({
  selector: 'slot-detail',
  templateUrl: './slot-detail.component.html'
})
export class SlotDetailComponent implements AfterViewInit {

  @ViewChild('slotModal')
  modal: ModalComponent;
  slot: Slot;
  userInSlot: boolean;
  errorMessage: string;

  constructor(private _slotService: SlotService) {
  }

  ngAfterViewInit() {
    this.modal.onClose.subscribe(() => this.errorMessage = undefined);
    this.modal.onDismiss.subscribe(() => this.errorMessage = undefined);
  }

  showSlot(slot: Slot, userInSlot: boolean) {
    this.slot = slot;
    this.userInSlot = userInSlot;
    this.modal.open('lg');
  }

  isRegisterable(): boolean {
    if (this.slot == null) {
      return false;
    }
    if (this.slot.participants >= this.slot.capacity) {
      return false;
    }
    return this.slot._links.hasOwnProperty('register');
  }

  isUnregisterable(): boolean {
    if (this.slot == null) {
      return false;
    }
    return this.slot._links.hasOwnProperty('unregister');
  }

  register() {
    this._slotService.register(this.slot)
      .subscribe(
        () => {
          this.errorMessage = null;
          this.modal.close();
        },
        () => {
          this.errorMessage = `Buchung fehlgeschlagen! Zu dieser Zeit ist schon etwas gebucht!`;
        }
      );
  }

  unregister() {
    this._slotService.unregister(this.slot)
      .subscribe(
        () => {
          this.errorMessage = null;
          this.modal.close();
        },
        () => {
          this.errorMessage = `Entfernen der Buchung fehlgeschlagen!`;
        }
      );
  }
}
