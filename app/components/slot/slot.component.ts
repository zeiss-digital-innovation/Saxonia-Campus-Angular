import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {Slot} from '../../model/slot';
import {SlotService} from '../../services/slot.service';
import {RestService} from '../../services/rest.service';

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
    onSlotClick: EventEmitter<Slot> = new EventEmitter<Slot>(false);

    constructor(private _slotService: SlotService) {}

    showSlotDetail() {
        if (this.slot == null) {
            return;
        }
        this._slotService.getSlot(this.slot)
            .subscribe(slot => this.onSlotClick.emit(slot));
    }
}

