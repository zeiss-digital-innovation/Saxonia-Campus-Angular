import {Component, ViewChild} from 'angular2/core';
import {Slot} from '../../model/slot';
import {MODAL_DIRECTIVES, ModalComponent} from '../modal/modal';

@Component({
    selector: 'slot',
    templateUrl: 'app/components/slot/slot.component.html',
    directives: MODAL_DIRECTIVES
})
export class SlotComponent {

    @ViewChild('slotModal')
    modal: ModalComponent;
    slot: Slot;

    showSlot(slot: Slot) {
        this.slot = slot;
        this.modal.open('lg');
    }

    register() {
        this.modal.close();
    }
}

