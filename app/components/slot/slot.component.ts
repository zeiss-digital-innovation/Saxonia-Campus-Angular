import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {Slot} from '../../model/slot';

@Component({
    selector: 'slot',
    templateUrl: 'app/components/slot/slot.component.html'
})
export class SlotComponent {

    @Input()
    slot: Slot;
    @Input()
    userInSlot: boolean;
    @Input()
    isContinuation: boolean;
    @Output()
    onSlotClick: EventEmitter<Slot> = new EventEmitter(false);

    showSlotDetail() {
        if (this.slot == null) {
            return;
        }
        this.onSlotClick.emit(this.slot);
    }
}

