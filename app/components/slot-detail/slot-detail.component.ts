import {Component, ViewChild, AfterViewInit} from 'angular2/core';
import {SlotService} from '../../services/slot.service';
import {Slot} from '../../model/slot';
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

    constructor(private _slotService: SlotService) {}

    showSlot(slot: Slot, userInSlot: boolean) {
        this.slot = slot;
        this.userInSlot = userInSlot;
        this.modal.open('lg');
    }

    register() {
        this._slotService.register(this.slot.id).subscribe();
        this.modal.close();
    }

    unregister() {
        this._slotService.unregister(this.slot.id).subscribe();
        this.modal.close();
    }
}

