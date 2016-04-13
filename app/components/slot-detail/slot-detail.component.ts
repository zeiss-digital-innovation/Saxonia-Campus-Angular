import {Component, ViewChild, AfterViewInit} from 'angular2/core';
import {CanActivate} from 'angular2/router';
import {Slot} from '../../model/slot';
import {SlotService} from '../../services/slot.service';
import {RestService} from '../../services/rest.service';
import {MODAL_DIRECTIVES, ModalComponent} from '../modal/modal';

@Component({
    selector: 'slot-detail',
    templateUrl: 'app/components/slot-detail/slot-detail.component.html',
    directives: MODAL_DIRECTIVES
})
export class SlotDetailComponent {

    @ViewChild('slotModal')
    modal: ModalComponent;
    slot: Slot;
    userInSlot: boolean;
    errorMessage: string;

    constructor(private _slotService: SlotService) {}

    showSlot(slot: Slot, userInSlot: boolean) {
        this.slot = slot;
        this.userInSlot = userInSlot;
        this.modal.open('lg');
    }

    isRegisterable(): boolean {
        if (this.slot == null) {
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
                    this.errorMessage = `Buchung fehlgeschlagen!`;
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

